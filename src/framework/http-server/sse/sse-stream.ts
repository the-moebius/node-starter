
import { Subject } from 'rxjs';

import type { SseEvent } from './sse-event.js';


export type SseStream = Subject<SseEvent>;


export function createSseStream(): SseStream {

  return new Subject<SseEvent>();

}
