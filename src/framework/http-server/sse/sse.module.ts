
import type { Maybe } from '../../types/maybe.js';

import { ApplicationModule } from '../../application/application-module.js';
import { SseConnectionManager } from './sse-connection-manager.js';

export interface SseModuleOptions {
}


export class SseModule extends ApplicationModule {

  readonly name = 'sse';

  readonly #options: SseModuleOptions;


  constructor(options?: Maybe<SseModuleOptions>) {

    super();

    this.#options = (options ?? {});

  }


  override async init(): Promise<void> {

    const { container } = this.context;

    (container
      .bind(SseConnectionManager)
      .toSelf()
      .inSingletonScope()
    );

  }

}
