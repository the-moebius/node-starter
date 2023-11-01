
import { HttpServerModule } from '../framework/http-server/http-server.module.js';


export const httpServerModule = new HttpServerModule({
  httpServerOptions: {
    port: parseInt(process.env['HTTP_PORT'] ?? '80', 10),
    fastifyOptions: {
      ignoreTrailingSlash: true,
    },
  },
});
