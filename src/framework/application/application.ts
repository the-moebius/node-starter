
import assert from 'node:assert/strict';

import { Logger, LoggerOptions } from 'pino';
import chalk from 'chalk';

import { ApplicationContext } from './application-context.js';
import { Values } from '../types/values.js';
import { ApplicationModule } from './application-module.js';
import { Maybe } from '../types/maybe.js';
import { createLogger } from '../logger.js';
import { createEventEmitter } from '../common/event-emitter.js';


export interface ApplicationConfig {
  name?: Maybe<string>;
  modules?: Maybe<ApplicationModule[]>;
}

export const InitStates = {
  NotInitialized: 'not-initialized',
  Initializing: 'initializing',
  Initialized: 'initialized',

} as const;

export type InitState = (
  Values<typeof InitStates>
);

export const RunStates = {
  Starting: 'starting',
  Started: 'started',
  Stopping: 'stopping',
  Stopped: 'stopped',

} as const;

export type RunState = (
  Values<typeof RunStates>
);

export interface ApplicationEventMap {
  init: undefined;
  start: undefined;
  stop: StopEvent;
}

export interface StopEvent {
  exitCode: number;
}


export class Application {

  readonly #logger: Logger;
  readonly #config: ApplicationConfig;
  readonly #context: ApplicationContext;

  #initState: InitState = (
    InitStates.NotInitialized
  );

  #runState: RunState = (
    RunStates.Stopped
  );

  get runState(): RunState {

    return this.#runState;

  }

  get logger(): Logger {

    return this.#logger;

  }

  events = createEventEmitter<ApplicationEventMap>();


  constructor(config: ApplicationConfig) {

    this.#config = config;

    this.#logger = this.#createLogger();

    this.#context = new ApplicationContext({
      application: this,
      config,
      logger: this.#logger,
    });

  }


  async init(): Promise<void> {

    const logger = this.#logger;
    const config = this.#config;
    const modules = (config.modules ?? []);

    assert(this.#initState === InitStates.NotInitialized);

    this.#initState = InitStates.Initializing;

    logger.info(
      `Initializing the application` +
      (config.name ? `: ${config.name}` : '') +
      `…`
    );

    for (const module of modules) {
      module.configure(this.#context);
      await module.init();
    }

    this.#initState = InitStates.Initialized;

    logger.info(`Application initialized`);

    this.events.emit('init', undefined);

  }

  async start(): Promise<void> {

    const logger = this.#logger;
    const config = this.#config;
    const modules = (config.modules ?? []);

    assert(this.#initState === InitStates.Initialized);
    assert(this.#runState === RunStates.Stopped);

    this.#runState = RunStates.Starting;

    logger.info(
      `Starting the application` +
      (config.name ? `: ${config.name}` : '') +
      `…`
    );

    for (const module of modules) {
      await module.start();
    }

    this.#runState = RunStates.Started;

    logger.info(
      chalk.greenBright(`Application started`)
    );

    this.events.emit('start', undefined);

  }

  async stop(exitCode = 0): Promise<void> {

    const logger = this.#logger;
    const config = this.#config;
    const modules = (config.modules ?? []);

    assert(this.#runState === RunStates.Started);

    this.#runState = RunStates.Stopping;

    logger.info(
      `Stopping the application` +
      (config.name ? `: ${config.name}` : '') +
      `…`
    );

    for (const module of modules) {
      await module.stop();
    }

    this.#runState = RunStates.Stopped;

    logger.info(`Application stopped`);

    this.events.emit('stop', { exitCode });

  }

  async tryStop(exitCode = 0): Promise<void> {

    if (this.#runState !== RunStates.Started) {
      return;
    }

    await this.stop(exitCode);

  }


  #createLogger(): Logger {

    const config = this.#config;

    const loggerOptions: LoggerOptions = {};

    if (config.name) {
      loggerOptions.name = config.name;
    }

    return createLogger(loggerOptions);

  }

}
