
import { ApplicationModule } from '../framework/application/application-module.js';
import { registerHandler } from '../framework/http-server/register-handler.js';
import { HttpServer } from '../framework/http-server/http-server.js';

import { KittensStore } from './models/kittens.store.js';
import { GetKittenHandler } from './handlers/get-kitten.handler.js';
import { CreateKittenHandler } from './handlers/create-kitten.handler.js';
import { GetKittenApi } from './api/get-kitten.api.js';
import { CreateKittenApi } from './api/create-kitten.api.js';
import { UpdateKittenHandler } from './handlers/update-kitten.handler.js';
import { UpdateKittenApi } from './api/update-kitten.api.js';
import { GetKittensHandler } from './handlers/get-kittens.handler.js';
import { GetKittensApi } from './api/get-kittens.api.js';
import { DeleteKittenApi } from './api/delete-kitten.api.js';
import { DeleteKittenHandler } from './handlers/delete-kitten.handler.js';


export class KittensModule extends ApplicationModule {

  readonly name = 'kittens';


  override async init(): Promise<void> {

    const { container } = this.context;


    //==========//
    // SERVICES //
    //==========//

    container.bind(KittensStore).toSelf();

    container.bind(GetKittensApi.Executor).toSelf();
    container.bind(GetKittenApi.Executor).toSelf();
    container.bind(CreateKittenApi.Executor).toSelf();
    container.bind(UpdateKittenApi.Executor).toSelf();
    container.bind(DeleteKittenApi.Executor).toSelf();


    //==========//
    // HANDLERS //
    //==========//

    if (container.isBound(HttpServer)) {
      registerHandler(container, GetKittensHandler);
      registerHandler(container, GetKittenHandler);
      registerHandler(container, CreateKittenHandler);
      registerHandler(container, UpdateKittenHandler);
      registerHandler(container, DeleteKittenHandler);
    }

  }

}
