
import type { Maybe } from '../types/maybe.js';
import type { Application } from './application.js';


export async function startApplication(
  application: Application

): Promise<void> {

  const logger = application.logger;

  process.on('SIGINT', stopApplication);
  process.on('SIGTERM', stopApplication);

  // Ensuring cleanup when process is ready
  // to exit on its own.
  process.on('beforeExit', stopApplication);

  // Exiting process when application stops
  application.events.on('stop',
    ({ exitCode }) => process.exit(exitCode)
  );

  try {

    await application.init();

    await application.start();

  } catch (error: unknown) {

    logger.error(error, `Failed to start the application`);

    await stopApplication(1);

  }


  async function stopApplication(exitCode?: Maybe<number>) {

    try {
      await application.tryStop(exitCode);

    } catch (error: unknown) {

      logger.error(
        error,
        `Failed to gracefully stop the application`
      );

      process.exit(1);

    }

  }

}
