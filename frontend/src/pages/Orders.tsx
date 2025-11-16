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
      <Card className="rounded-[32px] border border-[#E3DCCF] bg-white/95 shadow-xl">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#111111]">{t('orders.title')}</p>
            <CardTitle className="text-3xl text-[#2A2A2A]">{t('orders.title')}</CardTitle>
          </div>
          <Badge variant="accent" className="rounded-full bg-[#111111] px-4 py-2 text-white">
            {data.length} {t('orders.items')}
          </Badge>
        </CardHeader>
        <CardHeader className="pt-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#FBFAF7] text-[#4F4B45]">
                <TableHead className="w-[120px]">ID</TableHead>
                <TableHead>{t('orders.items_column')}</TableHead>
                <TableHead>{t('orders.status')}</TableHead>
                <TableHead>{t('orders.purchased_at')}</TableHead>
                <TableHead>{t('orders.total')}</TableHead>
                <TableHead className="text-right">{t('orders.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-semibold text-[#2A2A2A]">#{order.id}</TableCell>
                  <TableCell className="text-sm text-[#4F4B45]">
                    {order.items?.map((item) => item.product?.name).filter(Boolean).join(', ') || '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="accent" className="rounded-full bg-[#F2F2F2] text-[#111111]">
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-[#4F4B45]">
                    {order.created_at ? new Date(order.created_at).toLocaleString() : '—'}
                  </TableCell>
                  <TableCell className="font-medium text-[#2A2A2A]">{formatCurrency(order.total_price)}</TableCell>
                  <TableCell className="text-right">
                    <Link to="/orders/$orderId" params={{ orderId: order.id.toString() }}>
                      <Button variant="ghost" size="sm" className="rounded-full text-[#111111] hover:bg-[#F2F2F2]">
                        {t('buttons.view')}
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardHeader>
      </Card>
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
