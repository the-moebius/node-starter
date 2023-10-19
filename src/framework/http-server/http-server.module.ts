
import type { Maybe } from '../types/maybe.js';

import { ApplicationModule } from '../application/application-module.js';
import { HttpServer, HttpServerOptions } from './http-server.js';


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

    this.logger.debug(
      `Starting the HttpServerModule`
    );

    await this.httpServer.start();

  }

  override async stop(): Promise<void> {

    this.logger.debug(
      `Stopping the HttpServerModule`
    );

    await this.httpServer.stop();

  }

}
