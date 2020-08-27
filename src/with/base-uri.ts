import { Mixin } from '../types.js'

export interface RelativeURL {
  relativeURL(url: string): string
}

export default function baseURI(
  value: string
): Mixin<CustomElementConstructor, RelativeURL> {
  return superclass =>
    class extends superclass {
      attachShadow(init: ShadowRootInit) {
        const root = super.attachShadow(init)
        Object.defineProperty(root, 'baseURI', {
          value,
          enumerable: true,
          configurable: true,
        })
        return root
      }

      relativeURL(url: string) {
        return new URL(url, value).href
      }
    }
}
