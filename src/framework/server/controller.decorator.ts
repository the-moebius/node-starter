
import { Container } from 'typedi';

import { ControllerOptions, ControllersRegistry } from './controllers-registry.js';


export function Controller(options: ControllerOptions) {

  return function ControllerDecorator(target: any) {

    ControllersRegistry.registerController({
      options,
      target,
    });

    // Registering service with the DIC
    Container.set({
      id: target,
      type: target,
    });

  };

}
