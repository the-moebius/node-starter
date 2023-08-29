
import { Type } from '@sinclair/typebox';

import { StringEnum } from '../../framework/typebox/string-enum.js';

import { KittenColors } from './kitten.js';


export namespace KittenSchema {

  export const id = Type.String({
    format: 'uuid',
  });

  export const name = Type.String();

  export const color = StringEnum(
    Object.values(KittenColors)
  );

}
