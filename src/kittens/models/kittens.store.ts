
import { HydratedDocument } from 'mongoose';
import { injectable } from 'inversify';

import type { Maybe } from '../../framework/types/maybe.js';

import { DocumentNotFoundError } from '../../framework/mongo/errors/document-not-found.error.js';

import { Kitten, KittenModel } from './kitten.js';


@injectable()
export class KittensStore {

  async getKittenById(
    id: string

  ): Promise<Maybe<
    HydratedDocument<Kitten>

  >> {

    const kitten = await KittenModel.findOne({
      _id: id,
    });

    return (kitten || undefined);

  }

  /**
   * @throws DocumentNotFoundError
   */
  async getKittenByIdOrThrow(
    id: string

  ): Promise<
    HydratedDocument<Kitten>

  > {

    const kitten = await this.getKittenById(id);

    if (!kitten) {
      throw new DocumentNotFoundError(
        `Kitten is not found by ID: ${id}`
      );
    }

    return kitten;

  }

  async getKittens(): Promise<
    HydratedDocument<Kitten>[]
  > {

    return KittenModel.find();

  }

}
