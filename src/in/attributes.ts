const dashCase = (name: string) => name.replace(/([A-Z])/g, '-$1').toLowerCase()

type AttributeSetter = ((v: string | null) => void) | undefined

export type AttributesMixin = ReturnType<typeof mixinAttributes>

export function mixinAttributes<T extends CustomElementConstructor>(superclass: T): typeof attributesMixin & T {
  const superclassAttributes = <Partial<AttributesMixin>>superclass

  const attributesMixin = class extends superclass {
    //
    static get observedAttributes(): ReadonlyArray<string> {
      return [...this.attributeChanged.keys()]
    }

    static attributeChanged: Map<string, AttributeSetter> = new Map(superclassAttributes.attributeChanged!)

    static defineAttribute(attribute: string, { get, set, value }: PropertyDescriptor = {}) {
      let dashedName = dashCase(attribute)

      this.attributeChanged.set(dashedName, set)

      let defaultvalue = get?.call(this) ?? value

      function getter(this: Element) {
        return this.getAttribute(dashedName) ?? (this.hasAttribute(dashedName) ? true : defaultvalue)
      }

      function setter(this: Element, value: any) {
        // elementAttributes.isDefined!(this) ?
        typeof value == 'string'
          ? this.setAttribute(dashedName, value)
          : value === true
          ? this.setAttribute(dashedName, '')
          : this.removeAttribute(dashedName)
        // : (defaultvalue = value)
      }

      Object.defineProperty(this.prototype, attribute, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true,
      })
    }

    static isDefined?(element: Element) {
      const result = element.matches(':defined')
      result && delete this.isDefined && (this.isDefined = () => true)
      return result
    }

    attributeChangedCallback(name: string, old: string | null, value: string | null) {
      if (old != value) attributesMixin.attributeChanged.get(name)?.call(this, value)
    }
  }

  return attributesMixin
}
