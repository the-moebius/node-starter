
import { Service } from 'typedi';


@Service()
export class HealthCheckHandler {

  public async getStatus() {

    await new Promise(resolve => setTimeout(resolve, 500));

    return 'OK';

  }

}
