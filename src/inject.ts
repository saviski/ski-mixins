import { Mixin } from './types'

/**
 * Modifies obect prototype chain and inserts a mixin on any
 * existing class definition.
 * ```
 * class AnyClass extends OtherClass
 * 
 * inject(AnyClass.prototype, mixin)
 * 
 * // is equivalent to
 * 
 * class Mixin extends OtherClass
 * class AnyClass extends Mixins
 * ```
 * @param prototype Function.prototype
 * @param mixin Mixin function
 */
export function inject(prototype: any, mixin: Mixin<any>): void {
  const constructor = prototype.constructor
  const superclass = Object.getPrototypeOf(constructor)
  const middleclass = mixin(superclass)
  Object.setPrototypeOf(prototype, middleclass.prototype)
  Object.setPrototypeOf(constructor, middleclass)
}
