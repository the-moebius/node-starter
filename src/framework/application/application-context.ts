
import { Logger } from 'pino';

import { Application, ApplicationConfig } from './application.js';
import { Maybe } from '../types/maybe.js';
import { Container } from '../di/container.js';


export interface ApplicationContextConstruct {
  application: Application;
  config: ApplicationConfig;
  logger: Logger;
}


export class ApplicationContext {

  readonly application: Application;
  readonly config: ApplicationConfig;
  readonly logger: Logger;

  readonly container: Container;

  readonly applicationName: Maybe<string>;


  constructor(construct: ApplicationContextConstruct) {

    this.application = construct.application;
    this.config = construct.config;
    this.logger = construct.logger;

    this.container = new Container();

    this.applicationName = construct.config.name;

  }

}
