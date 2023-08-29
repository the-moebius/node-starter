
import type { Mongoose } from 'mongoose';

import { connect, ConnectOptions } from 'mongoose';

import { IS_DEV } from '../common/environment.js';
import { Maybe } from '../types/maybe.js';


export interface MongooseConnectionOptions {
  url: string;
  connectOptions?: Maybe<ConnectOptions>;
}


export class MongooseConnection {

  #mongoose$: (Promise<Mongoose> | undefined);

  constructor(
    private readonly options: MongooseConnectionOptions,
  ) {
  }


  getMongoose(): Promise<Mongoose> {

    if (!this.#mongoose$) {

      this.#mongoose$ = connect(
        this.options.url, {
          autoIndex: IS_DEV,
          bufferCommands: false,
          ...(this.options.connectOptions ?? {}),
        }
      );

    }

    return this.#mongoose$;

  }

  async connect(): Promise<void> {

    // This will trigger the connection
    await this.getMongoose();

  }

  async disconnect(): Promise<void> {

    if (!this.#mongoose$) {
      return;
    }

    const mongoose = await this.getMongoose();

    await mongoose.disconnect();

  }

}
