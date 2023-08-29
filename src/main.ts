
import './framework/init.js';

import { Application } from './framework/application/application.js';
import { startApplication } from './framework/application/start-application.js';
import { ValidationModule } from './framework/validation/validation.module.js';

import { GreeterModule } from './greeter/greeter.module.js';
import { KittensModule } from './kittens/kittens.module.js';
import { mongoModule } from './config/mongo.js';
import { httpServerModule } from './config/http-server.js';


await startApplication(
  new Application({
    name: 'node-starter',
    modules: [

      new ValidationModule(),

      mongoModule,
      httpServerModule,

      new GreeterModule(),

      new KittensModule(),

    ],
  })
);
