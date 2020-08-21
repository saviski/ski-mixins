import { Mixin } from '../types'
import { observable, observers } from '@ski/observable'
import { rootSkiData } from './ski-template.js'

export default function watchClass(): Mixin {
  return superclass =>
    class extends superclass {
      constructor(...args: any[]) {
        super(...args)
        observable(this)
      }

      get [rootSkiData]() {
        return observers(this)
      }
    }
}
