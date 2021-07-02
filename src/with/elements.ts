import { mixinElements } from '../in/elements.js'

export function elements<T extends Record<string, string>>(selectors: T) {
  return <E extends CustomElementConstructor>(elementClass: E) => {
    let elementsClass = mixinElements(elementClass)

    for (const [name, selector] of Object.entries<string>(selectors)) elementsClass.defineElement(name, selector)

    return elementsClass as typeof elementsClass & (new (...args: any) => Record<keyof T, HTMLElement>)
  }
}
