import { mixinAttributes } from './attributes.js'

export type EventsMixin = ReturnType<typeof mixinEvents>

export type InlineEventListener<T = any> =
  | ((this: GlobalEventHandlers, event: T extends Event ? T : CustomEvent<T>) => any)
  | null
  | undefined

export type InlineEventName<S extends string = string> = `on${S}`

export const $inlineEvents = Symbol('inlineEvents')

export function mixinEvents<T extends CustomElementConstructor>(superclass: T): typeof eventsMixin & T {
  if (superclass.hasOwnProperty('defineAttribute')) return <any>superclass

  const eventsMixin = class extends mixinAttributes(superclass) {
    //
    [$inlineEvents]: Map<string, InlineEventListener<Event>> = new Map(this[$inlineEvents])

    static defineEvent(name: InlineEventName) {
      let eventname = name.toLowerCase()
      if (!eventname.startsWith('on')) throw "inline event name must start with 'on' like 'onclick'"
      let type = eventname.slice(2)

      function getter(this: InstanceType<EventsMixin>) {
        return this[$inlineEvents].get(eventname) || null
      }

      function setter(this: InstanceType<EventsMixin>, value: any) {
        if (typeof value != 'function') value = null
        const inlineEvents = this[$inlineEvents]
        inlineEvents.has(name) && this.removeEventListener(type, inlineEvents.get(name)!)
        inlineEvents.set(eventname, value)
        value && this.addEventListener(type, value)
      }

      function attributeChanged(this: InstanceType<EventsMixin>, value: any) {
        setter.call(this, typeof value == 'string' ? new Function('event', value) : null)
      }

      this.attributeChanged.set(eventname, attributeChanged)

      Object.defineProperty(this.prototype, name, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true,
      })
    }
  }

  return eventsMixin
}
