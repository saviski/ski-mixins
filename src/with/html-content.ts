import { content } from './content.js'

export function htmlContent(innerHTML: string) {
  const htmltemplate = document.createElement('template')
  htmltemplate.innerHTML = innerHTML
  return content(htmltemplate.content)
}
