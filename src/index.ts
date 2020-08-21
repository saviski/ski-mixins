import { Mixin, Mix, MixinWith, MixinConstructor } from './types'
import attributes from './with/attributes.js'
import baseURI from './with/base-uri'
import cssProperties from './with/css-properties'
import elements from './with/elements'
import html from './with/html'
import content from './with/content'
import skitemplate from './with/ski-template'
import watchClass from './with/watch-class'

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
  elements,
  html,
  content,
  skitemplate,
  watchClass,
}
