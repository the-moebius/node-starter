
import { MongoModule } from '../framework/mongo/mongo.module.js';


export const mongoModule = new MongoModule({
  url: (process.env['MONGO_CONNECTION_STRING'] ?? ''),
});
