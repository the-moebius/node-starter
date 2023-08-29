
import { EventEmitter as NodeEventEmitter } from 'node:events';


export type EventMap = Record<string, any>;

export type EventKey<T extends EventMap> = string & keyof T;
export type EventReceiver<T> = (params: T) => void;

export interface EventEmitter<MapType extends EventMap> {

  on<EventName extends EventKey<MapType>>(
    eventName: EventName,
    handler: EventReceiver<MapType[EventName]>

  ): void;

  off<EventName extends EventKey<MapType>>(
    eventName: EventName,
    handler: EventReceiver<MapType[EventName]>

  ): void;

  emit<EventName extends EventKey<MapType>>(
    eventName: EventName,
    params: MapType[EventName]

  ): void;

}


export function createEventEmitter<
  MapType extends EventMap

>(): EventEmitter<MapType> {

  return new NodeEventEmitter();

}
