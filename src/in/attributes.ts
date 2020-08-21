const dashCase = (name: string) => name.replace(/([A-Z])/g, '-$1').toLowerCase()

export function mixinAttributes(superclass: typeof Element) {
  const extendedClass = class extends superclass {
    static observedAttributes: string[] = []

    attributeChanged!: Record<string, (v: string | null) => void>

    static defineAttribute(name: string, descriptor?: PropertyDescriptor) {
      const dashedName = dashCase(name)
      this.observedAttributes.push(dashedName)

      descriptor &&
        descriptor.set &&
        (this.prototype.attributeChanged[name] = descriptor.set)

      const newDescriptor = <
        ThisType<InstanceType<typeof extendedClass>> & PropertyDescriptor
      >{
        get() {
          return (
            this.getAttribute(dashedName) ??
            descriptor?.get?.call(this) ??
            descriptor?.value
          )
        },

        set(value: string) {
          extendedClass.defined(this)
            ? value !== null && value !== undefined
              ? this.setAttribute(dashedName, value)
              : this.removeAttribute(dashedName)
            : (descriptor = { value })
        },

        enumerable: descriptor?.enumerable ?? true,
      }
      Object.defineProperty(this.prototype, name, newDescriptor)
      return newDescriptor
    }

    static defined(element: Element) {
      const result = element.matches(':defined')
      result &&
        Object.defineProperty(extendedClass, 'defined', {
          value: () => true,
        })
      return result
    }

    attributeChangedCallback(name: string, old: string | null, value: string | null) {
      if (old != value) this.attributeChanged[name]?.call(this, value)
    }
  }

  extendedClass.prototype.attributeChanged = {}
  return extendedClass
}
