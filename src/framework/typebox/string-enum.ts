
import { Type } from '@sinclair/typebox';


export const StringEnum = <T extends string[]>(
  values: [...T]
) => Type.Unsafe<T[number]>({
  type: 'string',
  enum: values,
});
