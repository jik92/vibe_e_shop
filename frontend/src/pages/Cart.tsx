import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLoaderData } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { api } from '../api/client'
import CartItemRow from '../components/CartItemRow'
import { useAuth } from '../contexts/AuthContext'
import { useCartQuery } from '../hooks/useCartQuery'
import type { Cart, Order } from '../types/api'

const currency = (value: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(value))

type CartLoaderData = { cart: Cart | null }

const CartPage = (): JSX.Element => {
  const { isAuthenticated } = useAuth()
  const { t } = useTranslation()
  const initial = useLoaderData({ from: 'cart' }) as CartLoaderData | undefined
  const queryClient = useQueryClient()
  const { data } = useCartQuery({ initialData: initial?.cart ?? undefined })

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) => api.updateCartItem({ id, quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.removeCartItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  })

  const orderMutation = useMutation<Order>({
    mutationFn: api.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })

  if (!isAuthenticated) {
    return <p>{t('cart.empty')}</p>
  }

  if (!data?.items?.length) {
    return <p>{t('cart.empty')}</p>
  }

  return (
    <div>
      <h2>{t('cart.title')}</h2>
      {data.items.map((item) => (
        <CartItemRow
          key={item.id}
          item={item}
          onUpdate={(id, quantity) => updateMutation.mutate({ id, quantity })}
          onRemove={(id) => deleteMutation.mutate(id)}
        />
      ))}
      <div style={{ textAlign: 'right', marginTop: '1rem' }}>
        <strong>
          {t('cart.total')}: {currency(data.total_price)}
        </strong>
      </div>
      <button onClick={() => orderMutation.mutate()} style={{ marginTop: '1rem' }}>
        {t('cart.checkout')}
      </button>
    </div>
  )
}

export default CartPage
