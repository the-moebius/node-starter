
import { Service } from 'typedi';


@Service()
export class HealthCheckHandler {

  async getStatus() {

    await new Promise(resolve => setTimeout(resolve, 500));

    return 'OK';

  }

}
