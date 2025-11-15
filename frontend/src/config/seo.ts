export const SITE_NAME = 'PulseCart'
export const DEFAULT_DESCRIPTION =
  'PulseCart is a multilingual AI-ready e-commerce experience powered by FastAPI and React with instant checkout.'

export const SITE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env.VITE_SITE_URL) || 'http://localhost:3000'

export const absoluteUrl = (path = '/') => {
  try {
    return new URL(path, SITE_URL).toString()
  } catch (error) {
    console.warn('Unable to resolve absolute URL', error)
    return path
  }
}
