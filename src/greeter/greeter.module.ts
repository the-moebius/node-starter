
import { ApplicationModule } from '../framework/application/application-module.js';
import { registerHandler } from '../framework/http-server/register-handler.js';

import { GreeterHandler } from './greeter.handler.js';
import { Greeter } from './greeter.js';


export class GreeterModule extends ApplicationModule {

  readonly name = 'greeter';


  override async init(): Promise<void> {

    const { container } = this.context;


    //==========//
    // SERVICES //
    //==========//

    container.bind(Greeter).toSelf();


    //==========//
    // HANDLERS //
    //==========//

    registerHandler(container, GreeterHandler);

  }

}
