import { inject } from './inject.js'
import { Mix, Mixin, MixinConstructor, MixinWith } from './types.js'
import { ElementWithAttributes } from './with/attributes.js'
import attributes from './with/attributes.js'
import baseURI from './with/base-uri.js'
import content from './with/content.js'
import cssProperties, { CSSObservers } from './with/css-properties.js'
import elements from './with/elements.js'
import html from './with/html.js'

type C = MixinConstructor

export function mixwith<T extends C, U>(superclass: T, mixin: Mixin<T, U>): Mix<T, U>
export function mixwith<T extends C, U, V>(
  superclass: T,
  a: Mixin<T, U>,
  b: Mixin<T, V>
): Mix<Mix<T, U>, V>
export function mixwith<T extends C, U, V, W>(
  superclass: T,
  a: Mixin<T, U>,
  b: Mixin<T, V>,
  c: Mixin<T, W>
): Mix<Mix<Mix<T, U>, V>, W>
export function mixwith<T extends C, U, V, W, X>(
  superclass: T,
  a: Mixin<T, U>,
  b: Mixin<T, V>,
  c: Mixin<T, W>,
  d: Mixin<T, X>
): Mix<Mix<Mix<Mix<T, U>, V>, W>, X>
export function mixwith<T extends C, U, V, W, X, Y>(
  superclass: T,
  a: Mixin<T, U>,
  b: Mixin<T, V>,
  c: Mixin<T, W>,
  d: Mixin<T, X>,
  e: Mixin<T, Y>
): Mix<Mix<Mix<Mix<Mix<T, U>, V>, W>, X>, Y>
export function mixwith<T extends C, U>(
  superclass: T,
  ...mixins: Mixin<T, Partial<U>>[]
): Mix<T, U>

export function mixwith(superclass: typeof Object, ...mixins: Mixin<any>[]) {
  return mixins.reduce<any>((c, mixin) => mixin(c), superclass)
}

export function mix<T extends C>(superclass: T): MixinWith<T> {
  return {
    with: (...mixins: any[]) => mixwith(superclass, ...mixins),
  }
}

export {
  attributes,
  baseURI,
  cssProperties,
  CSSObservers,
  elements,
  html,
  content,
  inject,
  ElementWithAttributes,
  MixinConstructor,
  MixinWith,
  Mixin,
}
