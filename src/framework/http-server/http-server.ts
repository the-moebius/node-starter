
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import assert from 'node:assert/strict';

import { Logger } from 'pino';
import Fastify from 'fastify';
import FastifyHelmet from '@fastify/helmet';
import Ajv from 'ajv';
import addAjvFormats from 'ajv-formats'

import type { RequestHandler } from './request-handler.js';

import { RequestId, requestIdPlugin } from './request-id.js';
import { Values } from '../types/values.js';
import { HttpError } from './errors/http-error.js';
import { DocumentNotFoundError } from '../mongo/errors/document-not-found.error.js';
import { isFastifyError } from './utils/is-fastify-error.js';
import { Maybe } from '../types/maybe.js';
import { ValidationError } from '../validation/errors/validation-error.js';


export const InitStates = {
  NotInitialized: 'not-initialized',
  Initializing: 'initializing',
  Initialized: 'initialized',

} as const;

export type InitState = (
  Values<typeof InitStates>
);

export const RunStates = {
  Starting: 'starting',
  Started: 'started',
  Stopping: 'stopping',
  Stopped: 'stopped',

} as const;

export type RunState = (
  Values<typeof RunStates>
);

export interface HttpServerOptions {
  host?: Maybe<string>;
  port?: Maybe<number>;
}

export interface HttpServerResolvedOptions {
  host: string;
  port: number;
}


export class HttpServer {

  #fastify: (FastifyInstance | undefined);

  #initState: InitState = InitStates.NotInitialized;

  #runState: RunState = RunStates.Stopped;

  readonly #logger: Logger;

  readonly #options: HttpServerResolvedOptions;

  // @todo make Ajv configurable
  readonly #ajv = addAjvFormats(
    new Ajv({
      removeAdditional: 'all',
    })
  );


  constructor(
    logger: Logger,
    options?: HttpServerOptions

  ) {

    this.#logger = logger;

    this.#options = {
      host: (options?.host ?? '0.0.0.0'),
      port: (options?.port ?? 80),
    };

  }


  registerHandler(
    handler: RequestHandler

  ): void {

    assert(this.#initState === InitStates.Initialized);
    assert(this.#fastify);

    this.#fastify.route({
      ...handler.route,
      handler: handler.handleRequest.bind(handler),
    });

  }

  async init(): Promise<void> {

    assert(this.#initState === InitStates.NotInitialized);

    this.#initState = InitStates.Initializing;

    this.#fastify = <any> Fastify({
      logger: this.#logger,
      genReqId: <any> RequestId.useGenerateRequestId({
        readFromRequest: true,
      }),

    }).withTypeProvider<TypeBoxTypeProvider>();

    assert(this.#fastify);

    this.#fastify.register(FastifyHelmet);
    this.#fastify.register(requestIdPlugin);

    this.#fastify.setNotFoundHandler(async (request, reply) => {
      reply.statusCode = 404;
      return {
        error: {
          name: 'RouteNotFound',
          message: 'Route not found',
        },
      };
    });

    this.#fastify.setErrorHandler(
      this.#handleError.bind(this)
    );

    // Using custom Ajv instance
    this.#fastify.setValidatorCompiler(
      routeSchema => this.#ajv.compile(
        routeSchema.schema
      )
    );

    this.#initState = InitStates.Initialized;

  }

  async start(): Promise<void> {

    assert(this.#initState === InitStates.Initialized);
    assert(this.#runState === RunStates.Stopped);
    assert(this.#fastify);

    this.#runState = RunStates.Starting;

    await this.#fastify.listen({
      host: this.#options.host,
      port: this.#options.port,
    });

    this.#runState = RunStates.Started;

  }

  async stop(): Promise<void> {

    assert(this.#runState === RunStates.Started);

    this.#logger.info(`Stopping the HTTP server…`);

    this.#runState = RunStates.Stopping;

    await this.#fastify?.close();

    this.#runState = RunStates.Stopped;

    this.#logger.info(`HTTP server stopped`);

  }


  #handleError(
    error: unknown,
    request: FastifyRequest,
    reply: FastifyReply
  ) {

    //==================//
    // VALIDATION ERROR //
    //==================//

    if (
      isFastifyError(error, 'FST_ERR_VALIDATION') ||
      (error instanceof ValidationError)
    ) {

      return errorResponse({
        statusCode: 400,
        name: 'ValidationError',
        message: `Failed to validate the request`,
        extra: {
          validation: (
            ('validation' in error) ? error.validation :
            ('errors' in error) ? error.errors :
            []
          ),
        },
      })

    }


    //=================//
    // NOT FOUND ERROR //
    //=================//

    // @todo this should be added as a custom error handler
    if (error instanceof DocumentNotFoundError) {
      return errorResponse({
        statusCode: 404,
        name: error.constructor.name,
        message: error.message,
      });
    }


    //====================//
    // HANDLED HTTP ERROR //
    //====================//

    if (
      (error instanceof HttpError)
    ) {
      return errorResponse({
        statusCode: error.status,
        name: error.constructor.name,
        message: error.message,
      });

    }


    //=================//
    // UNHANDLED ERROR //
    //=================//

    this.#logger.error(
      error,
      `Failed processing the HTTP request #${request.id}`
    );

    return errorResponse({
      statusCode: 500,
      name: 'InternalServerError',
      message: (
        'An unexpected error occurred ' +
        'while processing your request. ' +
        'Please try again, retry later or contact ' +
        'the support if the problem persists'
      ),
    });


    function errorResponse(args: {
      statusCode: number;
      name: string;
      message: string;
      extra?: any;

    }) {

      reply.statusCode = args.statusCode;

      return {
        error: {
          name: args.name,
          message: args.message,
          requestId: request.id,
          ...(args.extra ?? {})
        },
      };

    }

  }

}
