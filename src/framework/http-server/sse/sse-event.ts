
import type { Maybe } from '../../types/maybe.js';


export interface SseEvent {
  id?: Maybe<string>;
  event?: Maybe<string>;
  data: string;
}
