
import { HttpError } from './http-error.js';


export class NotFoundError extends HttpError {

  override status = 404;

}
