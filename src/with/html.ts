import rootContent from './content.js'

export default function html(innerHTML: string) {
  const htmltemplate = document.createElement('template')
  htmltemplate.innerHTML = innerHTML
  return rootContent(htmltemplate.content)
}
