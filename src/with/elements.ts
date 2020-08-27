import { Mixin, MixinConstructor, Mix } from '../types.js'

export type Elements<T> = {
  readonly [A in keyof T]: Element
}

export type ElementsQuery<T> = {
  readonly [K in keyof T]: string
}

const withElements = <T>(
  superclass: CustomElementConstructor,
  selectors: ElementsQuery<T>
) =>
  class extends superclass {
    constructor(...args: any[]) {
      super(...args)
      for (const [name, selector] of Object.entries<string>(selectors))
        Object.defineProperty(this, name, {
          get(this: Element) {
            return this.shadowRoot?.querySelector(selector)
          },
          enumerable: true,
        })
    }
  } as Mix<typeof superclass, MixinConstructor<Elements<T>>>

export default function elements<T>(
  selectors: ElementsQuery<T>
): Mixin<CustomElementConstructor, Elements<T>> {
  return superclass => withElements(superclass, selectors)
}
