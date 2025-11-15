import { useQuery, type DefaultError, type QueryKey, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query'

import { api } from '../api/client'
import { useAuth } from '../contexts/AuthContext'
import type { Cart } from '../types/api'

type CartQueryOptions = Omit<UseQueryOptions<Cart, DefaultError, Cart, QueryKey>, 'queryKey' | 'queryFn'>

export const useCartQuery = (options?: CartQueryOptions): UseQueryResult<Cart, DefaultError> => {
  const { token } = useAuth()

  return useQuery<Cart>({
    ...api.cartQuery(),
    enabled: Boolean(token),
    ...options
  })
}
