import { renderToString } from 'react-dom/server'

import StaticHome from './StaticHome'

export async function render(): Promise<{ html: string; head: { title: string; description: string } }> {
  const html = renderToString(<StaticHome />)
  return {
    html,
    head: {
      title: 'E-Shop | Shop curated electronics',
      description: 'Pre-rendered catalog with localized experience and instant checkout.'
    }
  }
}
