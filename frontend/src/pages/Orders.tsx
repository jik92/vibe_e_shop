import { Link, useLoaderData } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Package } from 'lucide-react'

import { api } from '../api/client'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardHeader, CardTitle } from '../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { useAuth } from '../contexts/AuthContext'
import type { Order } from '../types/api'
import { formatCurrency } from '../lib/currency'

type OrdersLoaderData = { orders: Order[] }

const Orders = (): JSX.Element => {
  const initial = useLoaderData({}) as OrdersLoaderData | undefined
  const { isAuthenticated } = useAuth()
  const { t } = useTranslation()

  const { data } = useQuery<Order[]>({
    ...api.ordersQuery(),
    enabled: isAuthenticated,
    initialData: initial?.orders
  })

  if (!isAuthenticated) {
    return <EmptyOrders message={t('orders.empty')} />
  }

  if (!data?.length) {
    return <EmptyOrders message={t('orders.empty')} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">{t('orders.title')}</p>
          <h2 className="text-3xl font-semibold text-slate-900">{t('orders.title')}</h2>
        </div>
        <Badge variant="accent" className="bg-slate-900 text-white">
          {data.length} {t('orders.items')}
        </Badge>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/80">
            <TableHead>ID</TableHead>
            <TableHead>{t('orders.status')}</TableHead>
            <TableHead>{t('orders.total')}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-semibold text-slate-900">#{order.id}</TableCell>
              <TableCell>
                <Badge variant="accent" className="uppercase">
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{formatCurrency(order.total_price)}</TableCell>
              <TableCell className="text-right">
                <Link to="/orders/$orderId" params={{ orderId: order.id.toString() }} className="inline-flex">
                  <Button variant="ghost" size="sm">
                    {t('buttons.view')}
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

const EmptyOrders = ({ message }: { message: string }) => (
  <Card className="rounded-3xl border border-dashed border-slate-200 bg-white/80 text-center shadow-none">
    <CardHeader>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        <Package className="h-7 w-7 text-slate-900" />
      </div>
      <CardTitle className="text-2xl text-slate-900">{message}</CardTitle>
    </CardHeader>
  </Card>
)

export default Orders
