
import assert from 'node:assert/strict';

import { ConnectOptions as MongooseOptions } from 'mongoose';

import { ApplicationModule } from '../application/application-module.js';
import { MongooseConnection } from './mongoose-connection.js';
import { Maybe } from '../types/maybe.js';


export interface MongoModuleConfig {
  url: string;
  mongooseOptions?: Maybe<MongooseOptions>;
}


export class MongoModule extends ApplicationModule {

  readonly name = 'mongo';

  readonly #config: MongoModuleConfig;

  #mongooseConnection?: MongooseConnection;


  constructor(config: MongoModuleConfig) {

    super();

    this.#config = config;

  }


  override async init(): Promise<void> {

    const { container } = this.context;
    const { url, mongooseOptions } = this.#config;

    this.#mongooseConnection = new MongooseConnection({
      url,
      connectOptions: mongooseOptions,
    });

    container.set(
      MongooseConnection,
      this.#mongooseConnection
    );

  }

  override async start(): Promise<void> {

    assert(this.#mongooseConnection);

    const { logger } = this.context;

    logger.info(`Establishing Mongoose connection…`);

    await this.#mongooseConnection.connect();

    logger.info(`Mongoose connected`);

  }

  override async stop(): Promise<void> {

    assert(this.#mongooseConnection);

    const { logger } = this.context;

    logger.info(`Disconnecting Mongoose…`);

    await this.#mongooseConnection.disconnect();

    logger.info(`Mongoose disconnected`);

  }

}
