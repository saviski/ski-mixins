Custom elements javascript class extensions

```javascript

import { mix, attributes, cssProperties, define } from '@ski/mixins'

const CustomElementMixin = mix(HTMLElement).with(

  attributes({
    attrA: 'initial value',
    attrB: ''
  }),

  cssProperties({
    boxColor: '<color>',
    size: '<number>',
    custom: '*'
  })
)

class CustomElement extends CustomElementMixin {

  // custom element implementation
  set attrB(value) {
    console.log('attr-b=', value)
  }

  set size(size) {
    console.log('css property', '--size', 
      'changed to', size)
  }

  example() {
    let message = this.attrA + this.attrB + 
      this.boxColor

    return message
  }

}

define('my-element')(CustomElement)
```

The `attrB` setter will be called when the attribute changes either by directly setting the property or using DOM functions like
```javascript 
myElement.attrB = 'new value'

myElement.setAttribute('attr-b', 'new value')

myElement.attrubutes['attr-b'].value = 'new value'

parent.innerHTML = html`<my-element attr-b="value"><my-element>`
```