
import { Logger } from 'pino';
import { Container } from 'inversify';

import type { Maybe } from '../types/maybe.js';

import { Application, ApplicationConfig } from './application.js';


export interface ApplicationContextConstruct {
  application: Application;
  config: ApplicationConfig;
  container: Container;
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
    this.container = construct.container;
    this.logger = construct.logger;

    this.applicationName = construct.config.name;

  }

}
