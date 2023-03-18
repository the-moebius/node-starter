
import type { RouteOptions } from '../server/controllers-registry.js';
import { logger } from '../logger.js';
import { RoutesRegistry } from './routes-registry.js';


export function Route(options: RouteOptions) {

  logger.info('@Route');

  return function RouteDecorator(target: any) {

    logger.info('@RouteDecorator');

    RoutesRegistry.registerRoute({
      options,
      target,
    });

  };

}
