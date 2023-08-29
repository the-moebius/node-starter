
import { ApplicationModule } from '../application/application-module.js';
import { Validator } from './validator.js';


export class ValidationModule extends ApplicationModule {

  readonly name = 'validation';


  override async init(): Promise<void> {

    const { container } = this.context;

    container.set(Validator);

  }

}
