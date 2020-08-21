const dashCase = (name: string) => name.replace(/([A-Z])/g, '-$1').toLowerCase()

const cssvar = (property: string) => '--' + dashCase(property)

const hiddenStyle = `position:absolute;width:0px;height:0px;overflow:hidden;pointer-events:none`

export function mixinCssProperties(superclass: CustomElementConstructor) {
  const extendedClass = class extends superclass {
    // prototype property
    cssPropertyChanged!: Record<string, (v: string) => void>
    cssObserverHost: HTMLElement
    cssPropertyChangedCallback?(name: string, old?: string, value?: string): void

    constructor(...args: any[]) {
      super(...args)
      this.cssObserverHost = this.createCssObserverHost()
      for (const property of new.target.observedCSSProperties)
        this.observeCssProperty(property)
    }

    observeCssProperty(property: string, _syntax = '<number>') {
      const el = document.createElement('css-observer')
      el.style['width'] = `calc(var(${property},0)*1px)`
      el.style['color'] = `var(${property},transparent)`
      el.style.transition = `width 0.001s, color 0.001s`
      el.dataset.property = property
      el.dataset.value = getComputedStyle(this).getPropertyValue(property)
      el.dataset.value && this.notifyCssPropertyChange(property, el.dataset.value, '')
      this.cssObserverHost.append(el)
    }

    createCssObserverHost() {
      const hostElement = document.createElement('css-observer')
      hostElement.setAttribute('style', hiddenStyle)
      hostElement.setAttribute('aria-hidden', 'true')
      this.shadowRoot!.append(hostElement)

      hostElement.addEventListener('transitionrun', event => {
        let target = <HTMLElement>event.composedPath()[0]
        let property = target.dataset.property!
        let oldvalue = target.dataset.value
        let value = getComputedStyle(this).getPropertyValue(property)
        event.stopPropagation()
        this.notifyCssPropertyChange(property, value, oldvalue)
      })

      return hostElement
    }

    notifyCssPropertyChange(property: string, value: string, oldvalue?: string) {
      this.cssPropertyChanged[property]?.call(this, value)
      this.cssPropertyChangedCallback?.(property, oldvalue, value)
    }

    static observedCSSProperties: string[] = []

    static defineCSSProperty(
      property: string,
      descriptor?: PropertyDescriptor,
      _syntax = '*'
    ) {
      const name = cssvar(property)
      this.observedCSSProperties.push(name)

      descriptor &&
        descriptor.set &&
        (this.prototype.cssPropertyChanged[name] = descriptor.set)

      const newDescriptor = <ThisType<HTMLElement>>{
        get() {
          return getComputedStyle(this).getPropertyValue(name)
        },
        set(value: string) {
          this.style.setProperty(name, value)
        },

        enumerable: descriptor?.enumerable ?? true,
      }

      Object.defineProperty(this.prototype, property, newDescriptor)
      return newDescriptor
    }
  }

  extendedClass.prototype.cssPropertyChanged = {}
  return extendedClass
}
