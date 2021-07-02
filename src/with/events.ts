import { mixinEvents, InlineEventName, InlineEventListener } from '../in/events.js'

export function events<T extends Record<InlineEventName, Event>>(events: T) {
  let mixin = (elementClass: CustomElementConstructor) => {
    let eventsClass = mixinEvents(elementClass)

    for (let name of Object.keys(events)) eventsClass.defineEvent(name)

    return eventsClass as typeof eventsClass & (new (...args: any) => Record<keyof T, InlineEventListener>)
  }
  return mixin
}
