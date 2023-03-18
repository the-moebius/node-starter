
import type FastifyRoute from 'fastify/types/route';


export interface ControllerDefinition {
  options: ControllerOptions;
  target: any;
}

export interface ControllerOptions {
  route: RouteOptions;
}

export type RouteOptions = Omit<
  FastifyRoute.RouteOptions,
  'handler'
>;


export class ControllersRegistry {

  public static definitions: ControllerDefinition[] = [];

  public static registerController(route: ControllerDefinition) {
    this.definitions.push(route);
  }

}
