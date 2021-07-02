import { mixinAttributes } from '../in/attributes.js'

export function attributes<T extends Record<string, string | boolean>>(properties: T) {
  return <E extends CustomElementConstructor>(elementClass: E) => {
    let attributesClass = mixinAttributes(elementClass)
    for (const [name, value] of Object.entries(properties)) attributesClass.defineAttribute(name, { value })
    return attributesClass as typeof attributesClass & (new (...args: any) => T)
  }
}
