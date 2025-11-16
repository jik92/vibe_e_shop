import type {
  Cart,
  LoginPayload,
  Order,
  Product,
  RegisterPayload,
  User,
  AuthResponse
} from '../types/api'
import { getStoredToken } from '../lib/auth'

interface ApiFetchOptions {
  method?: string
  data?: unknown
  token?: string | null
}

const resolveApiBaseUrl = (): string => {
  const raw = (import.meta.env.VITE_API_BASE_URL ?? '').trim()
  if (raw.length > 0) {
    return raw
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return 'http://localhost:8000'
}

const API_BASE_URL = resolveApiBaseUrl()

const apiFetch = async <T>(
  path: string,
  { method = 'GET', data, token }: ApiFetchOptions = {}
): Promise<T> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const authToken = token ?? getStoredToken()
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Request failed')
  }

  if (response.status === 204) {
    return null as T
  }

  return (await response.json()) as T
}

export const api = {
  productsQuery: () => ({
    queryKey: ['products'] as const,
    queryFn: () => apiFetch<Product[]>('/api/products'),
    staleTime: 1000 * 30
  }),
  productQuery: (productId: string) => ({
    queryKey: ['product', productId] as const,
    queryFn: () => apiFetch<Product>(`/api/products/${productId}`)
  }),
  meQuery: () => ({
    queryKey: ['me'] as const,
    queryFn: () => apiFetch<User>('/api/auth/me')
  }),
  cartQuery: () => ({
    queryKey: ['cart'] as const,
    queryFn: () => apiFetch<Cart>('/api/cart')
  }),
  ordersQuery: () => ({
    queryKey: ['orders'] as const,
    queryFn: () => apiFetch<Order[]>('/api/orders')
  }),
  orderQuery: (orderId: string) => ({
    queryKey: ['order', orderId] as const,
    queryFn: () => apiFetch<Order>(`/api/orders/${orderId}`)
  }),
  login: (payload: LoginPayload) =>
    apiFetch<AuthResponse>('/api/auth/login', { method: 'POST', data: payload }),
  register: (payload: RegisterPayload) =>
    apiFetch<User>('/api/auth/register', { method: 'POST', data: payload }),
  addToCart: (payload: { product_id: number; quantity: number }) =>
    apiFetch<Cart>('/api/cart', { method: 'POST', data: payload }),
  updateCartItem: ({ id, quantity }: { id: number; quantity: number }) =>
    apiFetch<Cart>(`/api/cart/${id}`, { method: 'PUT', data: { quantity } }),
  removeCartItem: (id: number) => apiFetch<void>(`/api/cart/${id}`, { method: 'DELETE' }),
  createOrder: () => apiFetch<Order>('/api/orders', { method: 'POST' })
}

export { API_BASE_URL }
