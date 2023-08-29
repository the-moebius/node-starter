
import { hrtime } from 'node:process';

import { ApplicationModule } from '../application/application-module.js';
import { wait } from '../common/utils/wait.js';


export abstract class CommandModule extends ApplicationModule {

  #controller = new AbortController();

  #isRunning = false;

  abstract run(signal: AbortSignal): Promise<void>;

  override async init(): Promise<void> {
  }

  override async start(): Promise<void> {

    const { application } = this.context;

    // Running the command in the background to
    // prevent blocking other modules from
    // starting.

    setImmediate(async () => {

      const exitCode = await this.#runCommand();

      // Command has finished, telling the
      // application to stop.
      await application.tryStop(exitCode);

    });

  }

  override async stop(): Promise<void> {

    if (!this.#isRunning) {
      return;
    }

    this.logger.warn(`Stopping command execution`);

    this.#controller.abort();

    // Waiting for command to complete
    while (this.#isRunning) {
      await wait(50);
    }

  }


  async #runCommand(): Promise<number> {

    const startTime = hrtime.bigint();

    this.logger.info(`Starting command execution`);

    let exitCode = 0;

    try {

      this.#isRunning = true;

      await this.run(this.#controller.signal);

      this.logger.info(`Finished command execution`);

    } catch (error: any) {

      exitCode = 1;

      this.logger.error(`Command errored out`);
      this.logger.error(error);

    } finally {
      this.#isRunning = false;

    }

    // Time used
    const endTime = hrtime.bigint();
    const timeDiff = Number((endTime - startTime)) / 1e9;
    this.logger.info(`Command took ${timeDiff.toFixed(3)} seconds`);

    // RAM used
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    this.logger.info(
      `The script used ~ ${Math.round(used * 100) / 100} MB RAM`
    );

    return exitCode;

  }

}
