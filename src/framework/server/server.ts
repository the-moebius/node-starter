
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type { FastifyInstance } from 'fastify';
import type { RouteGenericInterface } from 'fastify/types/route';

import Fastify from 'fastify';
import { Container } from 'typedi';
import FastifyHelmet from '@fastify/helmet';
import assert from 'node:assert/strict';

import type { RequestHandler } from './request-handler.js';

import { HTTP_PORT } from '../common/env-vars.js';
import { logger } from '../logger.js';
import { ControllersRegistry } from './controllers-registry.js';
import { RequestId, requestIdPlugin } from './request-id.js';


export class Server {

  #fastify: (FastifyInstance | undefined);

  #isStarting = false;
  #isStopping = false;
  #isStarted = false;


  public async start(): Promise<void> {

    if (this.#isStarting || this.#isStarted) {
      throw new Error(`Server already started`);
    }

    this.#isStarting = true;

    this.#fastify = Fastify({
      logger,
      genReqId: RequestId.useGenerateRequestId({
        readFromRequest: true,
      }),

    }).withTypeProvider<TypeBoxTypeProvider>();

    assert(this.#fastify);

    this.#fastify.register(FastifyHelmet);
    this.#fastify.register(requestIdPlugin);

    this.setupRoutes();

    this.#fastify.setNotFoundHandler(async (request, reply) => {
      reply.statusCode = 404;
      return {
        error: {
          name: 'RouteNotFound',
          message: 'Route not found',
        },
      };
    });

    await this.#fastify.listen({
      host: '0.0.0.0',
      port: HTTP_PORT,
    });

    this.#isStarted = true;
    this.#isStarting = false;

    logger.info(`Server started on port: ${HTTP_PORT}`);

  }

  public stop() {
    // @todo
  }


  private setupRoutes() {

    assert(this.#fastify);

    if (ControllersRegistry.definitions.length <= 0) {
      logger.warn(`No routes found to register`);
      return;
    }

    logger.info(`Registering routes:`);

    for (const definition of ControllersRegistry.definitions) {

      const ControllerType = definition.target;

      const controller = Container.get<RequestHandler<RouteGenericInterface>>(
        ControllerType
      );

      this.#fastify.route({
        ...definition.options.route,
        handler: controller.handleRequest.bind(controller),
      });

      const { method, url } = definition.options.route;
      logger.info(`‣ ${method}: ${url}`);

    }

    // Printing an empty line
    logger.info('');

  }

}
