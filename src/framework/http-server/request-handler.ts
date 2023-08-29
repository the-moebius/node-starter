
import type {
  FastifyReply,
  FastifyRequest,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteGenericInterface,
  RouteOptions as FastifyRouteOptions,

} from 'fastify';

export type RouteOptions = Omit<
  FastifyRouteOptions,
  'handler'
>;

export type RequestHandlerConstructor = (
  new (...args: any) => RequestHandler
);

export interface RequestHandler <
  Schema extends RouteGenericInterface = {}
> {

  readonly route: RouteOptions;

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
