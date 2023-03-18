
import type { RouteOptions } from '../server/controllers-registry';


export interface RouteDefinition {
  options: RouteOptions;
  target: any;
}


export class RoutesRegistry {

  public static routes: RouteDefinition[] = [];

  public static registerRoute(route: RouteDefinition) {
    this.routes.push(route);
  }

}
