import Ski from '@ski/template'
import { Mixin } from '../types'

export const rootSkiData = Symbol('rootSkiData')

const SKIMAP = new WeakMap<object, Ski>()

declare global {
  interface HTMLElement {
    connectedCallback?(): void
    disconnectedCallback?(): void
    adoptedCallback?(): void
    attributeChangedCallback?(attribute: string, old: any, value?: any): void
  }
}

export default function skitemplate(): Mixin<CustomElementConstructor> {
  return <T extends CustomElementConstructor>(superclass: T): T =>
    class extends superclass {
      [rootSkiData]?: any

      connectedCallback() {
        super.connectedCallback && super.connectedCallback()
        if (!SKIMAP.has(this))
          SKIMAP.set(this, new Ski(this.shadowRoot!, this[rootSkiData] ?? this))
        SKIMAP.get(this)!.init()
      }

      disconnectedCallback() {
        super.disconnectedCallback && super.disconnectedCallback()
        SKIMAP.get(this)?.disconnect()
      }
    }
}
