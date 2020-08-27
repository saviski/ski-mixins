import { Mixin } from '../types.js'
import { mixinAttributes } from '../in/attributes.js'

export interface ElementWithAttributes {
  observedAttributes: string[]
  defineAttribute(
    name: string,
    descriptor?: PropertyDescriptor
  ): PropertyDescriptor | void
}

export type ElementAttributes<T> = { [K in keyof T]?: string | boolean }

export default function attributes<T>(
  properties: ElementAttributes<T>
): Mixin<CustomElementConstructor, T, ElementWithAttributes> {
  return (superclass: typeof Element) => {
    const attributesClass: ElementWithAttributes =
      'defineAttribute' in superclass ? <any>superclass : mixinAttributes(superclass)

    for (const [name, value] of Object.entries(properties))
      attributesClass.defineAttribute(name, { value })

    return <any>attributesClass
  }
}
