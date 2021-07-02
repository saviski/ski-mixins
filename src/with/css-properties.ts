import { mixinCssProperties } from '../in/css-properties.js'

export function cssProperties<T extends Record<string, string>>(properties: T) {
  return <E extends CustomElementConstructor>(elementClass: E) => {
    let cssPropsClass = mixinCssProperties(elementClass)

    for (const [name, syntax] of Object.entries<string>(properties))
      cssPropsClass.defineCSSProperty!(name, undefined, syntax)

    return cssPropsClass as typeof cssPropsClass & (new (...args: any) => T)
  }
}
