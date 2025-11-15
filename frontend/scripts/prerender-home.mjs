import { readFile, writeFile } from 'fs/promises'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const distDir = resolve(rootDir, 'dist')
const templatePath = resolve(distDir, 'index.html')
const ssrEntryPath = resolve(rootDir, 'dist-ssr', 'home-entry.js')

const template = await readFile(templatePath, 'utf-8')
const { render } = await import(pathToFileURL(ssrEntryPath))
const { html, head } = await render()

let finalHtml = template.replace('<div id="root"></div>', `<div id="root">${html}</div>`)

if (head?.title) {
  finalHtml = finalHtml.replace(/<title>[\s\S]*?<\/title>/, `<title>${head.title}</title>`)
}

if (head?.description) {
  const metaRegex = /<meta name="description" content="[\s\S]*?" \/>/
  if (metaRegex.test(finalHtml)) {
    finalHtml = finalHtml.replace(metaRegex, `<meta name="description" content="${head.description}" />`)
  }
}

await writeFile(templatePath, finalHtml, 'utf-8')
console.log('✅ Static homepage generated at dist/index.html')
