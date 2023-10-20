
import { randomUUID } from 'node:crypto';
import { promisify } from 'node:util';

import { FastifyReply } from 'fastify';
import { inject, injectable } from 'inversify';
import { finalize } from 'rxjs';
import pLimit from 'p-limit';

import type { Maybe } from '../../types/maybe.js';

import { Logger, LoggerType } from '../../logger.js';
import { createSseStream, SseStream } from './sse-stream.js';
import { SseEvent } from './sse-event.js';
import { serializeSseEvent } from './serialize-sse-event.js';


export interface OpenConnectionOptions {
  reply: FastifyReply;
}

type ConnectionId = string;

interface Connection {
  id: ConnectionId;
  stream: SseStream;
  reply: FastifyReply;
  connectedAt: Date;
  isClosed: boolean;
  closingPromise?: Maybe<Promise<void>>;
  close: () => Promise<void>;
}


@injectable()
export class SseConnectionManager {

  #connections = new Map<ConnectionId, Connection>();


  constructor(
    @inject(Logger)
    private readonly logger: LoggerType,
  ) {
  }


  openConnection(
    options: OpenConnectionOptions

  ): Connection {

    const logger = this.logger;

    const { reply } = options;

    const stream = createSseStream();

    const connection: Connection = {
      id: randomUUID(),
      stream,
      reply,
      connectedAt: new Date(),
      isClosed: false,
      close,
    };

    this.#connections.set(connection.id, connection);

    logger.debug(`New SSE connection #${connection.id}`);

    reply.hijack();

    reply.raw.writeHead(200, {
      'Cache-Control': 'no-store, no-transform',
      'X-Accel-Buffering': 'no',
      'X-No-Compression': 'yes',
      'Content-Type': 'text/event-stream; charset=utf-8',
    });

    reply.raw.flushHeaders();

    const subscription = (stream
      .pipe(finalize(close))
      .subscribe(writeEvent)
    );

    reply.raw.on('close', () => {

      if (!connection.isClosed) {

        logger.debug(
          `Client has closed the SSE connection ` +
          `#${connection.id}`
        );

        void close();

      }

    });

    // Setting more precise date
    connection.connectedAt = new Date();

    return connection;


    function writeEvent(event: SseEvent): void {

      logger.debug(
        `Writing SSE event: ${JSON.stringify(event)} ` +
        `for connection #${connection.id}`
      );

      reply.raw.write(
        serializeSseEvent(event)
      );

    }

    async function close(): Promise<void> {

      if (!connection.isClosed) {

        logger.debug(
          `Closing SSE connection ` +
          `#${connection.id}`
        );

        connection.isClosed = true;

        subscription.unsubscribe();

        connection.closingPromise = terminateConnection();

      }

      return connection.closingPromise;

    }

    async function terminateConnection(): Promise<void> {

      await promisify(
        reply.raw.end.bind(reply.raw)
      )();

    }

  }

  async closeAllConnections(): Promise<void> {

    if (this.#connections.size <= 0) {
      return;
    }

    this.logger.debug(
      `Closing all (${this.#connections.size}) ` +
      `SSE connections `
    );

    await this.#withConnections(
      connection => connection.close()
    );

  }


  /**
   * Iterates all connections and runs the specified
   * handler function for each connection with the
   * specified concurrency.
   *
   * Returns promise that is resolved when all
   * handlers have resolved.
   */
  async #withConnections(
    handler: (connection: Connection) => Promise<void>,
    concurrency = 10

  ): Promise<void> {

    const limit = pLimit(concurrency);
    const queue = [];

    for (const [_, connection] of this.#connections) {
      queue.push(
        limit(() => handler(connection))
      );

    }

    await Promise.all(queue);

  }

}
