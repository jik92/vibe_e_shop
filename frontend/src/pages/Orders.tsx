import { Link, useLoaderData } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { api } from '../api/client'
import { useAuth } from '../contexts/AuthContext'
import type { Order } from '../types/api'

const currency = (value: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(value))

type OrdersLoaderData = { orders: Order[] }

const Orders = (): JSX.Element => {
  const initial = useLoaderData({ from: 'orders' }) as OrdersLoaderData | undefined
  const { isAuthenticated } = useAuth()
  const { t } = useTranslation()

  const { data } = useQuery<Order[]>({
    ...api.ordersQuery(),
    enabled: isAuthenticated,
    initialData: initial?.orders
  })

  if (!isAuthenticated) {
    return <p>{t('orders.empty')}</p>
  }

  if (!data?.length) {
    return <p>{t('orders.empty')}</p>
  }

  return (
    <div>
      <h2>{t('orders.title')}</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>{t('orders.status')}</th>
            <th>{t('orders.total')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>
                <span className="badge">{order.status}</span>
              </td>
              <td>{currency(order.total_price)}</td>
              <td>
                <Link to="/orders/$orderId" params={{ orderId: order.id.toString() }}>
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Orders
