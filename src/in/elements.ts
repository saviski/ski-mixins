export type ElementsMixin = ReturnType<typeof mixinElements>

export function mixinElements<T extends CustomElementConstructor>(superclass: T): typeof elementsMixin & T {
  const elementsMixin = class extends superclass {
    //
    static defineElement(name: string, selector: string) {
      Object.defineProperty(this.prototype, name, {
        get(this: Element) {
          return this.shadowRoot?.querySelector(selector)
        },

        enumerable: true,
        configurable: true,
      })
    }

    attachShadow(init: ShadowRootInit) {
      let root = super.attachShadow(init)

      return root
    }
  }

  return elementsMixin
}
