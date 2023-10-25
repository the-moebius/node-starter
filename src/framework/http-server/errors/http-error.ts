
import type { Maybe } from '../../types/maybe.js';


export interface HttpErrorConstruct {
  name?: Maybe<string>;
  message?: Maybe<string>;
  statusCode?: Maybe<number>;
}


export class HttpError extends Error {

  override name = this.constructor.name;

  readonly statusCode: number;


  constructor(construct?: HttpErrorConstruct) {

    super();

    if (construct?.name) {
      this.name = construct.name;
    }

    if (construct?.message) {
      this.message = construct.message;
    }

    this.statusCode = (construct?.statusCode ?? 500);

  }

}
