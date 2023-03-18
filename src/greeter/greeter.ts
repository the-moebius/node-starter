
import { Service } from 'typedi';


@Service()
export class Greeter {

  public greet(name = 'Anonymous'): string {

    return `Hello ${name}!`;

  }

}
