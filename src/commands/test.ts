
import '../framework/init.js';

import { wait } from '../framework/common/utils/wait.js';
import { runCommand } from '../framework/commands/run-command.js';

import { KittensModule } from '../kittens/kittens.module.js';
import { mongoModule } from '../config/mongo.js';


await runCommand({
  name: 'command:test',
  modules: [
    mongoModule,
    new KittensModule(),
  ],
  handler: async context => {

    const { signal, logger } = context;

    logger.warn(`I'm running now!`);

    for (let i = 1; i <= 5; i++) {

      if (signal.aborted) {
        logger.warn(`I'm aborted!`);
        return;
      }

      logger.warn(`Waiting: ${i}…`);

      await wait(1_000);

    }

    logger.warn(`I've stopped running!`);

  },
});
