export function baseURI(value: string) {
  return <T extends CustomElementConstructor>(superclass: T) =>
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
