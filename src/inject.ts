import { Class } from './mix.js'

class SetMap<T, U> {
  private map = new Map<T, Set<U>>()

  private get(index: T) {
    return (this.map.has(index) || this.map.set(index, new Set())) && this.map.get(index)!
  }

  has(index: T, value: U) {
    return this.get(index).has(value)
  }

  add(index: T, value: U) {
    return this.get(index).add(value)
  }
}

const injected = new SetMap<object, Function>()

/**
 * Modifies object prototype chain and inserts a mixin on any
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
export function inject<T extends Class, U extends Class>(constructor: T, mixin: (superclass: T) => U) {
  if (!injected.has(constructor, mixin)) {
    const superclass = Object.getPrototypeOf(constructor)
    const middleclass = mixin(superclass)
    Object.setPrototypeOf(constructor.prototype, middleclass.prototype)
    Object.setPrototypeOf(constructor, middleclass)
    injected.add(constructor, mixin)
  }
  return constructor as T & U
}

/**
 * If class B extends A or extends any class that extends A
 * and class M extends A
 * class M can be injected between B and A,
 * creating a new class M'
 * making B extends M' extends (...) extends A
 * B will inherit all M methods
 * @param constructor
 * @param otherClass
 */
export function injectClass<T extends Class, U extends Class>(constructor: T, otherClass: U): constructor is T & U {
  const commonClass = Object.getPrototypeOf(otherClass)
  const superClass = Object.getPrototypeOf(constructor)

  if (!commonClass.isPrototypeOf(constructor)) return false

  const middleclass = class extends superClass {}

  const { constructor: _c, ...methods } = Object.getOwnPropertyDescriptors(otherClass.prototype)
  const { prototype: _p, ...staticMethods } = Object.getOwnPropertyDescriptors(otherClass)
  Object.defineProperties(middleclass.prototype, methods)
  Object.defineProperties(middleclass, staticMethods)

  Object.setPrototypeOf(constructor.prototype, middleclass.prototype)
  Object.setPrototypeOf(constructor, middleclass)

  return true
}

export function hook<
  T extends object,
  K extends keyof T,
  F extends (...args: any) => any = T[K] extends (...args: any) => any ? T[K] : never
>(prototype: T, method: K, fn: (self: T, result: ReturnType<F>, ...args: Parameters<F>) => ReturnType<F>) {
  const original = <F>(<unknown>prototype[method])
  Object.defineProperty(prototype, method, {
    value(...args: any) {
      const result = original.call(this, ...args)
      return fn(this, result, ...args)
    },

    configurable: true,
  })
}

export function init<T extends new (...params: any) => any>(
  constructor: T,
  fn: (self: InstanceType<T>, ...args: ConstructorParameters<T>) => void
) {
  inject(
    constructor.prototype,
    superclass =>
      class extends superclass {
        constructor(...args: any[]) {
          super(...args)
          fn(<InstanceType<T>>this, ...(<any>args))
        }
      }
  )
}
