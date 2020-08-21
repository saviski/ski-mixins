export type MixinConstructor<T = any> = {
  new (...args: any[]): T
  prototype: T
}

export type Mix<T, U> = T &
  U &
  MixinConstructor<
    (T extends MixinConstructor ? InstanceType<T> : unknown) &
      (U extends MixinConstructor ? InstanceType<U> : unknown)
  >

export type Mixin<
  T extends MixinConstructor = MixinConstructor<any>,
  U = unknown,
  V = unknown
> = (superclass: T) => Mix<T, MixinConstructor<U> & V>

export interface MixinWith<T extends MixinConstructor> {
  with<U>(mixin: Mixin<T, U>): Mix<T, U>
  with<U, V>(a: Mixin<T, U>, b: Mixin<T, V>): Mix<Mix<T, U>, V>
  with<U, V, W>(a: Mixin<T, U>, b: Mixin<T, V>, c: Mixin<T, W>): Mix<Mix<Mix<T, U>, V>, W>
  with<U, V, W, X>(
    a: Mixin<T, U>,
    b: Mixin<T, V>,
    c: Mixin<T, W>,
    d: Mixin<T, X>
  ): Mix<Mix<Mix<Mix<T, U>, V>, W>, X>
  with<U>(...mixins: Mixin<T, Partial<U>>[]): Mix<T, U>
}
