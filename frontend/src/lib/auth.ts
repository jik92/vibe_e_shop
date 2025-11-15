const TOKEN_KEY = 'eshop_token'

let inMemoryToken: string | null = null

const hasWindow = (): boolean => typeof window !== 'undefined'

export const getStoredToken = (): string | null => {
  if (hasWindow()) {
    return window.localStorage.getItem(TOKEN_KEY)
  }
  return inMemoryToken
}

export const persistToken = (token: string): void => {
  if (hasWindow()) {
    window.localStorage.setItem(TOKEN_KEY, token)
  } else {
    inMemoryToken = token
  }
}

export const clearStoredToken = (): void => {
  if (hasWindow()) {
    window.localStorage.removeItem(TOKEN_KEY)
  } else {
    inMemoryToken = null
  }
}
