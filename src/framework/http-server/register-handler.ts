
import { Container } from 'inversify';

import { HttpServer } from './http-server.js';
import { RequestHandler } from './request-handler.js';


export function registerHandler(
  container: Container,
  Handler: new (...args: any) => RequestHandler,

): void {

  const httpServer = container.get(HttpServer);

  container.bind(Handler).toSelf();

  httpServer.registerHandler(
    container.get(Handler)
  );

}
