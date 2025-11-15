export interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url?: string | null
  stock?: number
}

export interface CartItem {
  id: number
  quantity: number
  unit_price?: number
  subtotal_price?: number
  product: Product | null
}

export interface Cart {
  items: CartItem[]
  total_price: number
}

export interface OrderItem {
  id: number
  quantity: number
  unit_price: number
  subtotal_price: number
  product: Product | null
}

export interface Order {
  id: number
  status: string
  total_price: number
  items: OrderItem[]
}

export interface User {
  id: number
  email: string
}

export interface LoginPayload {
  email: string
  password: string
}

export type RegisterPayload = LoginPayload

export interface AuthResponse {
  access_token: string
}
