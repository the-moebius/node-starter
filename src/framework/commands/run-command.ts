
import { Logger } from 'pino';
import { Container } from 'inversify';

import { CommandModule } from './command.module.js';
import { startApplication } from '../application/start-application.js';
import { Application, ApplicationConfig } from '../application/application.js';
import { ApplicationModule } from '../application/application-module.js';


export interface RunCommandOptions {
  name: string;
  handler: RunCommandHandler;
  modules?: ApplicationModule[];
}

export type RunCommandHandler = (
  context: RunCommandContext

) => Promise<void>;

export interface RunCommandContext {
  readonly signal: AbortSignal;
  readonly logger: Logger;
  readonly container: Container;
  readonly config: ApplicationConfig;
}


export async function runCommand(
  options: RunCommandOptions

): Promise<void> {

  const {
    name,
    handler,
    modules = [],

  } = options;

  class AdHocCommand extends CommandModule {

    name = name;

    async run(signal: AbortSignal): Promise<void> {

      await handler({
        signal,
        logger: this.logger,
        container: this.context.container,
        config: this.context.config,
      });

    }

  }

  await startApplication(
    new Application({
      name,
      modules: [
        ...modules,
        new AdHocCommand(),
      ],
    })
  );

}
