
import { randomUUID } from 'node:crypto';
import { OutgoingHttpHeaders } from 'node:http';

import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'inversify';
import { finalize } from 'rxjs';
import pLimit from 'p-limit';

import type { Maybe } from '../../types/maybe.js';
import type { Values } from '../../types/values.js';

import { Logger, LoggerType } from '../../logger.js';
import { createSseStream, SseStream } from './sse-stream.js';
import { SseEvent } from './sse-event.js';
import { serializeSseEvent } from './serialize-sse-event.js';


export interface OpenConnectionOptions {
  request: FastifyRequest;
  reply: FastifyReply;
  headers?: Maybe<OutgoingHttpHeaders>;
}

type ConnectionId = string;

interface Connection {
  id: ConnectionId;
  stream: SseStream;
  request: FastifyRequest;
  reply: FastifyReply;
  connectedAt: Date;
  state: ConnectionState;
  close: () => Promise<void>;
  closingPromise?: Maybe<Promise<void>>;
}

const ConnectionStates = {
  Open: 'open',
  Closing: 'closing',
  Closed: 'closed',

} as const;

type ConnectionState = Values<typeof ConnectionStates>;


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
    const connections = this.#connections;

    const { request, reply } = options;

    const stream = createSseStream();

    const connection: Connection = {
      id: (request.id || randomUUID()),
      stream,
      request,
      reply,
      connectedAt: new Date(),
      state: ConnectionStates.Open,
      close,
    };

    connections.set(connection.id, connection);

    logger.debug(`New SSE connection #${connection.id}`);

    reply.hijack();

    reply.raw.writeHead(200, {
      'Cache-Control': 'no-store, no-transform',
      'X-Accel-Buffering': 'no',
      'X-No-Compression': 'yes',
      'Content-Type': 'text/event-stream; charset=utf-8',
      ...(options.headers ?? {}),
    });

    reply.raw.flushHeaders();

    const subscription = (stream
      .pipe(finalize(close))
      .subscribe(writeEvent)
    );

    reply.raw.on('close', () => {

      if (connection.state === ConnectionStates.Open) {

        logger.debug(
          `Client has closed the SSE connection ` +
          `#${connection.id}`
        );

        void close(true);

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

    async function close(
      isClientClosed = false

    ): Promise<void> {

      if (connection.state === ConnectionStates.Closed) {
        return;
      }

      if (connection.state === ConnectionStates.Closing) {
        return connection.closingPromise;
      }

      logger.debug(
        `Closing SSE connection ` +
        `#${connection.id}`
      );

      connection.state = ConnectionStates.Closing;

      connection.closingPromise = (async () => {

        if (!isClientClosed) {
          await terminateConnection();
        }

        connection.state = ConnectionStates.Closed;

        connections.delete(connection.id);

        logger.debug(
          `Connection #${connection.id} is closed`
        );

      })();

      subscription.unsubscribe();

      return connection.closingPromise;

    }

    async function terminateConnection(): Promise<void> {

      return new Promise(
        resolve => reply.raw.end(resolve)
      );

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
