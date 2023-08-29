
import '../../framework/init.js';

import { runCommand } from '../../framework/commands/run-command.js';

import { KittensStore } from '../models/kittens.store.js';
import { KittensModule } from '../kittens.module.js';
import { mongoModule } from '../../config/mongo.js';


await runCommand({
  name: 'command:print-kittens',
  modules: [
    mongoModule,
    new KittensModule(),
  ],
  handler: async context => {

    const { signal, logger, container } = context;

    const kittensStore = container.get(KittensStore);

    const kittens = await kittensStore.getKittens();

    logger.info(`${kittens.length} kitten(s) found`);

    for (const kitten of kittens) {

      if (signal.aborted) {
        logger.info('(aborted)')
        return;
      }

      logger.info(
        `\n[${kitten.id}]\n` +
        `Name: ${kitten.name}\n` +
        `Color: ${kitten.color}\n`
      );

    }

  },
});
