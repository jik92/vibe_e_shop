import { useEffect } from 'react'
import { useLoaderData, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { api } from '../api/client'
import { useAuth } from '../contexts/AuthContext'
import { useCartQuery } from '../hooks/useCartQuery'
import type { Cart } from '../types/api'

const currency = (value: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(value))

type CheckoutLoaderData = { cart: Cart | null }

const Checkout = (): JSX.Element => {
  const loader = useLoaderData({}) as CheckoutLoaderData | undefined
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()
  const { t } = useTranslation()
  const { data } = useCartQuery({ initialData: loader?.cart ?? undefined })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, navigate])

  const orderMutation = useMutation({
    mutationFn: api.createOrder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cart'] })
      await queryClient.invalidateQueries({ queryKey: ['orders'] })
      setTimeout(() => {
        navigate({ to: '/orders' })
      }, 800)
    }
  })

  if (!data?.items?.length) {
    return <p>{t('checkout.empty')}</p>
  }

  return (
    <section className="card" style={{ maxWidth: '720px', margin: '0 auto' }}>
      <h2>{t('checkout.title')}</h2>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>{t('checkout.subtitle')}</p>
      <div>
        <h3>{t('checkout.summary')}</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {data.items.map((item) => (
            <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
              <span>
                {item.product?.name}
                <span style={{ color: '#6b7280', marginLeft: '0.4rem' }}>× {item.quantity}</span>
              </span>
              <strong>{currency(item.unit_price ?? item.product?.price ?? 0)}</strong>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <span>{t('cart.total')}</span>
        <strong>{currency(data.total_price)}</strong>
      </div>
      <button
        onClick={() => orderMutation.mutate()}
        disabled={orderMutation.isPending}
        style={{ marginTop: '1.5rem' }}
      >
        {orderMutation.isPending ? t('checkout.processing') : t('checkout.pay')}
      </button>
      {orderMutation.isSuccess && <p style={{ color: '#16a34a', marginTop: '1rem' }}>{t('checkout.success')}</p>}
      {orderMutation.isError && <p style={{ color: '#ef4444', marginTop: '1rem' }}>{(orderMutation.error as Error)?.message ?? t('checkout.error')}</p>}
    </section>
  )
}

export default Checkout
