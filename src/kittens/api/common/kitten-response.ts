
import { Static, Type } from '@sinclair/typebox';

import { Kitten } from '../../models/kitten.js';
import { KittenSchema } from '../../models/kitten.schema.js';


export const KittenResponseSchema = Type.Object({
  id: KittenSchema.id,
  name: KittenSchema.name,
  color: KittenSchema.color,
});

export type KittenResponse = (
  Static<typeof KittenResponseSchema>
);


export function kittenResponse(
  kitten: Kitten

): KittenResponse {

  return {
    id: kitten.id,
    name: kitten.name,
    color: kitten.color,
  };

}
