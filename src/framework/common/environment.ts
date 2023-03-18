
import type { Values } from '../types/values.js';


export const Environments = {
  development: 'development',
  production: 'production',

} as const;

export type Environment = Values<typeof Environments>;

export const environment: Environment = <Environment> (
  process.env['NODE_ENV'] || 'development'
);

export const IS_DEV = (environment === Environments.development);
export const IS_PROD = (environment === Environments.production);
