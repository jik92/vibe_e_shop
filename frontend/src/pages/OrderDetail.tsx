import { useLoaderData, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { api } from '../api/client'
import { useAuth } from '../contexts/AuthContext'
import type { Order } from '../types/api'

const currency = (value: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(value))

type OrderLoaderData = { order: Order | null }

const OrderDetail = (): JSX.Element => {
  const loader = useLoaderData({}) as OrderLoaderData | undefined
  const params = useParams({})
  const { isAuthenticated } = useAuth()
  const { t } = useTranslation()

  const { data } = useQuery<Order>({
    ...api.orderQuery(params.orderId),
    enabled: isAuthenticated,
    initialData: loader?.order ?? undefined
  })

  if (!isAuthenticated) {
    return <p>{t('orders.empty')}</p>
  }

  if (!data) {
    return <p>Order not found.</p>
  }

  return (
    <div>
      <h2>
        Order #{data.id} - {data.status}
      </h2>
      <p>
        {t('orders.total')}: {currency(data.total_price)}
      </p>
      <div>
        {data.items.map((item) => (
          <div key={item.id} style={{ background: '#fff', padding: '1rem', borderRadius: '10px', marginBottom: '0.75rem' }}>
            <strong>{item.product?.name}</strong>
            <p>
              {item.quantity} x {currency(item.unit_price)} = {currency(item.subtotal_price)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrderDetail
