
export class HealthCheckService {

  async getStatus() {

    await new Promise(resolve => setTimeout(resolve, 500));

    return 'OK';

  }

}
