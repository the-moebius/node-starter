
import type { SseEvent } from './sse-event.ts';


export function serializeSseEvent(event: SseEvent): string {

  const parts: string[] = [];

  if (event.id) {
    parts.push(`id: ${event.id}`);
  }

  if (event.event) {
    parts.push(`event: ${event.event}`);
  }

  parts.push(`data: ${event.data}`);

  return parts.join(`\n`) + `\n\n`;

}
