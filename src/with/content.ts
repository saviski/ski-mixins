import { Mixin } from '../types.js'

export default function content(
  contentFragment: DocumentFragment
): Mixin<CustomElementConstructor> {
  return superclass =>
    class extends superclass {
      get shadowRoot() {
        return super.shadowRoot || this.attachShadowContent()
      }

      private attachShadowContent() {
        const root = this.attachShadow({ mode: 'open' })
        root.append(contentFragment.cloneNode(true))
        return root
      }
    }
}
