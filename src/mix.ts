export type Class<T = any> = {
  new (...args: any): T
  prototype: T
}

export type Mix<T extends Class[]> = T extends [infer C, ...infer R]
  ? R extends []
    ? unknown
    : C extends Class
    ? R extends Class[]
      ? C & Mix<R> & Class<InstanceType<C> & InstanceType<Mix<R>>>
      : never
    : never
  : never

export type Mixin<T extends Class, U extends Class> = (superclass: T) => Mix<[T, U]>

export class MixinWith<T extends Class> {
  //
  constructor(private superclass: T) {}

  with<A>(a: (superclass: T) => A): A
  with<A, B>(a: (superclass: T) => A, b: (superclass: A) => B): B
  with<A, B>(a: (superclass: T) => A, b: (superclass: A) => B): B
  with<A, B, C>(a: (superclass: T) => A, b: (superclass: A) => B, c: (superclass: B) => C): C
  with<A, B, C, D>(
    a: (superclass: T) => A,
    b: (superclass: A) => B,
    c: (superclass: B) => C,
    d: (superclass: C) => D
  ): D
  with<A, B, C, D, E>(
    a: (superclass: T) => A,
    b: (superclass: A) => B,
    c: (superclass: B) => C,
    d: (superclass: C) => D,
    e: (superclass: D) => E
  ): E

  with(...mixins: Array<(superclass: T) => any>) {
    return mixins.reduce((superclass, mixin) => mixin(superclass), this.superclass)
  }
}
