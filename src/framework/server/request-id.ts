
import type { FastifyRequest } from 'fastify/types/request';
import type { FastifyPluginAsync } from 'fastify/types/plugin';
import { randomUUID } from 'node:crypto';
import fastifyPlugin from 'fastify-plugin';


export namespace RequestId {

  export const headerName = 'X-Request-Id';

  export interface PluginOptions {
    readFromRequest: boolean;
  }

  export function useGenerateRequestId(options: PluginOptions) {

    return (request: FastifyRequest) => (
      (options.readFromRequest
        ? readRequestIdFromHeaders(request)
        : undefined
      )
      ?? randomUUID()
    );

  }

}

function readRequestIdFromHeaders(
  request: FastifyRequest

): (string | undefined) {

  const headerName = RequestId.headerName.toLowerCase();
  const header = request.headers[headerName];

  let headerValue = (
    (Array.isArray(header) ? header[0] : header)
  );

  return (
    (typeof headerValue === 'string'
      ? headerValue.trim()
      : undefined
    )
    || undefined
  );

}

const handler: FastifyPluginAsync<RequestId.PluginOptions> = (

  async function requestIdPlugin(fastify) {

    fastify.addHook('onSend', (request, reply, _payload, next) => {
      reply.header(RequestId.headerName, request.id)
      next()
    });

  }

);

export const requestIdPlugin = fastifyPlugin(handler);
