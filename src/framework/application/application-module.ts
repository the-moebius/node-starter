
import { Logger } from 'pino';

import { ApplicationContext } from './application-context.js';


export abstract class ApplicationModule {

  readonly abstract name: string;

  protected get context(): ApplicationContext {

    if (!this.#context) {
      throw new Error(`Missing application context`);
    }

    return this.#context;

  }

  protected get logger(): Logger {

    if (!this.#logger) {
      throw new Error(`Missing logger`);
    }

    return this.#logger;

  }

  #context?: ApplicationContext;

  #logger?: Logger;


  configure(context: ApplicationContext): void {

    this.#context = context;

    this.#logger = context.logger.child({
      name: this.name,
    });

  }


  async init(): Promise<void> {
  }

  async start(): Promise<void> {
  }

  async stop(): Promise<void> {
  }

}
