import { Mixin } from '../types.js'
import { mixinCssProperties } from '../in/css-properties.js'

export type CSSPropertiesDefinition<T> = { [K in keyof T]: string }

export type CSSProperties<T> = { [K in keyof T]: string } & {
  cssPropertyChangedCallback?(name: string, old?: string, value?: string): void
  cssPropertyChanged: Record<string, (v: any) => void>
}

export interface CSSObservers {
  observedCSSProperties: string[]
  defineCSSProperty: (
    property: string,
    descriptor?: PropertyDescriptor,
    syntax?: string
  ) => void
}

export default function cssProperties<T>(
  properties: CSSPropertiesDefinition<T>
): Mixin<CustomElementConstructor, CSSProperties<T>, CSSObservers> {
  return (superclass: typeof HTMLElement) => {
    const cssPropsClass: CSSObservers =
      'defineCSSProperty' in superclass ? superclass : mixinCssProperties(superclass)

    for (const [name, syntax] of Object.entries<string>(properties))
      cssPropsClass.defineCSSProperty(name, undefined, syntax)

    return cssPropsClass as any
  }
}
