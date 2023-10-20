
import type { Maybe } from '../types/maybe.js';

import { ApplicationModule } from '../application/application-module.js';
import { HttpServer, HttpServerOptions } from './http-server.js';
import { SseConnectionManager } from './sse/sse-connection-manager.js';


export interface HttpServerModuleOptions {
  httpServerOptions?: HttpServerOptions;
}


export class HttpServerModule extends ApplicationModule {

  readonly name = 'http-server';

  readonly #options: HttpServerModuleOptions;

  protected get httpServer(): HttpServer {

    if (!this.#httpServer) {
      throw new Error(`Missing HTTP server instance`);
    }

    return this.#httpServer;

  }

  #httpServer?: HttpServer;


  constructor(options?: Maybe<HttpServerModuleOptions>) {

    super();

    this.#options = (options ?? {});

  }


  override async init(): Promise<void> {

    const { container } = this.context;

    this.#httpServer = new HttpServer(
      this.logger,
      this.#options.httpServerOptions,
    );

    await this.httpServer.init();

    (container
      .bind(HttpServer)
      .toConstantValue(this.#httpServer)
    );

  }

  override async start(): Promise<void> {

    await this.httpServer.start();

  }

  override async stop(): Promise<void> {

    const { container } = this.context;

    // Closing all SSE connections first,
    // otherwise they will prevent server from
    // closing.
    if (container.isBound(SseConnectionManager)) {

      const sseConnectionManager = container.get(
        SseConnectionManager
      );

      await sseConnectionManager.closeAllConnections();

    }

    await this.httpServer.stop();

  }

}
