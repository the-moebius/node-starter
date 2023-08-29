
import { randomUUID } from 'node:crypto';

import { Schema, model } from 'mongoose';

import { Values } from '../../framework/types/values.js';


//==================//
// ENTITY INTERFACE //
//==================//

export const KittenColors = {
  Black: 'black',
  Brown: 'brown',
  Grey: 'grey',
  Orange: 'orange',
  White: 'white',

} as const;

export type KittenColor = Values<typeof KittenColors>;

export interface Kitten {
  id: string;
  name: string;
  color: KittenColor;
}


//=================//
// DATABASE SCHEMA //
//=================//

const schema = new Schema({
  _id: {
    type: String,
    default: randomUUID,
    alias: 'id',
  },
  name: {
    type: String,
    required: true,
    index: {
      name: 'name-unique',
      unique: true,
    },
  },
  color: {
    type: String,
    required: true,
    enum: Object.values(KittenColors),
  },
}, {
  collection: 'kittens',
});

export const KittenModel = model<Kitten>('Kitten', schema);
