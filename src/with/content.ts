export function content(contentFragment: DocumentFragment) {
  return <T extends CustomElementConstructor>(superclass: T) =>
    class extends superclass {
      constructor(...args: any[]) {
        super(...args)
        this.attachShadow({ mode: 'open' }).append(contentFragment.cloneNode(true))
      }
    }
}
