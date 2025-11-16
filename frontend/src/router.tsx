import { createRootRouteWithContext, createRoute, createRouter } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'

import { api } from './api/client'
import Layout from './components/Layout'
import { getStoredToken } from './lib/auth'
import Cart from './pages/Cart'
import Home from './pages/Home'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import OrderDetail from './pages/OrderDetail'
import Orders from './pages/Orders'
import ProductDetail from './pages/ProductDetail'
import Register from './pages/Register'
import Checkout from './pages/Checkout'
import Products from './pages/Products'

export const queryClient = new QueryClient()

export type RouterContext = {
  queryClient: QueryClient
  getToken: () => string | null
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: Layout
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  loader: async ({ context }) => {
    const products = await context.queryClient.ensureQueryData(api.productsQuery())
    return { products }
  },
  component: Home
})

const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login', component: Login })
const registerRoute = createRoute({ getParentRoute: () => rootRoute, path: '/register', component: Register })
const onboardingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/onboarding', component: Onboarding })

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$productId',
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(api.productQuery(params.productId))
    return { product }
  },
  component: ProductDetail
})

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  loader: async ({ context }) => {
    if (!context.getToken()) {
      return { cart: null }
    }
    const cart = await context.queryClient.ensureQueryData(api.cartQuery())
    return { cart }
  },
  component: Cart
})

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  loader: async ({ context }) => {
    if (!context.getToken()) {
      return { cart: null }
    }
    const cart = await context.queryClient.ensureQueryData(api.cartQuery())
    return { cart }
  },
  component: Checkout
})

const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders',
  loader: async ({ context }) => {
    if (!context.getToken()) {
      return { orders: [] }
    }
    const orders = await context.queryClient.ensureQueryData(api.ordersQuery())
    return { orders }
  },
  component: Orders
})

const orderDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders/$orderId',
  loader: async ({ context, params }) => {
    if (!context.getToken()) {
      return { order: null }
    }
    const order = await context.queryClient.ensureQueryData(api.orderQuery(params.orderId))
    return { order }
  },
  component: OrderDetail
})

const birthdayCardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/collections/birthday-card',
  loader: async ({ context }) => {
    const products = await context.queryClient.ensureQueryData(api.productsQuery())
    const product = products.find((item) => item.name === 'Birthday Bakery Blue Gold Card') ?? products[0]
    return { product }
  },
  component: ProductDetail
})

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  loader: async ({ context }) => {
    const products = await context.queryClient.ensureQueryData(api.productsQuery())
    return { products }
  },
  component: Products
})

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  registerRoute,
  onboardingRoute,
  productRoute,
  cartRoute,
  checkoutRoute,
  ordersRoute,
  orderDetailRoute,
  birthdayCardRoute,
  productsRoute
])

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
    getToken: getStoredToken
  }
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
