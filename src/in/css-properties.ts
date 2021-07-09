const dashCase = (name: string) => name.replace(/([A-Z])/g, '-$1').toLowerCase()
const cssvar = (property: string) => '--' + dashCase(property)

const hiddenStyle = `position:absolute;width:0px;height:0px;overflow:hidden;pointer-events:none`

type CssPropertySetter = ((v: string) => void) | undefined

export type CssPropertiesMixin = ReturnType<typeof mixinCssProperties>

export function mixinCssProperties<T extends CustomElementConstructor>(superclass: T): typeof cssPropertiesMixin & T {
  const superclassCssProperties = <Partial<CssPropertiesMixin>>superclass

  const cssPropertiesMixin = class extends superclass {
    //
    static cssPropertyChanged: Map<string, CssPropertySetter> = new Map(superclassCssProperties.cssPropertyChanged!)

    static defineCSSProperty(name: string, { set }: PropertyDescriptor = {}, _syntax = '*') {
      const dashedName = cssvar(name)

      this.cssPropertyChanged.set(dashedName, set)

      function getter(this: HTMLElement) {
        return getComputedStyle(this).getPropertyValue(dashedName)
      }

      function setter(this: HTMLElement, value: string) {
        this.style.setProperty(dashedName, value)
      }

      Object.defineProperty(this.prototype, name, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true,
      })
    }

    cssObserverHost: HTMLElement
    cssPropertyChangedCallback?(name: string, old?: string, value?: string): void

    constructor(...args: any[]) {
      super(...args)
      this.cssObserverHost = this.createCssObserverHost()
      for (const property of new.target.cssPropertyChanged.keys()) this.observeCssProperty(property)
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
      cssPropertiesMixin.cssPropertyChanged.get(property)?.call(this, value)
      this.cssPropertyChangedCallback?.(property, oldvalue, value)
    }
  }

  return cssPropertiesMixin
}
