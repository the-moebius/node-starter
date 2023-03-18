
import type { FastifyReply } from 'fastify/types/reply';
import type { FastifyRequest } from 'fastify/types/request';
import type { RouteGenericInterface } from 'fastify/types/route';

import type {
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,

} from 'fastify/types/utils';


export interface RequestHandler <
  Schema extends RouteGenericInterface
> {

  handleRequest(
    request: Request<Schema>,
    reply: Reply<Schema>

  ): (Result<Schema> | ResultAsync<Schema>);

}

export type Request<
  Schema extends RouteGenericInterface,

> = FastifyRequest<
  Schema,
  RawServerDefault,
  RawRequestDefaultExpression
>;

export type Reply<
  Schema extends RouteGenericInterface,

> = FastifyReply<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  Schema
>;

export type Result<
  Schema extends RouteGenericInterface,

> = Schema['Reply'] | void;

export type ResultAsync<
  Schema extends RouteGenericInterface,

> = Promise<Schema['Reply'] | void>;
