import { Link, useLoaderData, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, PackageCheck } from 'lucide-react'

import { api } from '../api/client'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardTitle } from '../components/ui/card'
import { useAuth } from '../contexts/AuthContext'
import type { Order } from '../types/api'
import { formatCurrency } from '../lib/currency'

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
    <Card className="space-y-6 rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-2xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">#{data.id}</p>
          <CardTitle className="text-3xl text-slate-900">{t('orders.title')}</CardTitle>
        </div>
        <Badge variant="accent" className="bg-slate-900 text-white">
          {data.status}
        </Badge>
      </div>
      <CardContent className="space-y-6 p-0">
        <div className="flex flex-wrap items-center gap-3 text-lg font-semibold text-slate-900">
          <PackageCheck className="h-5 w-5" />
          <span>
            {t('orders.total')}: {formatCurrency(data.total_price)}
          </span>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/60">
          {data.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b border-slate-100 px-4 py-3 last:border-b-0">
              <div>
                <p className="font-semibold text-slate-900">{item.product?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} × {formatCurrency(item.unit_price)}
                </p>
              </div>
              <p className="font-semibold text-slate-900">{formatCurrency(item.subtotal_price)}</p>
            </div>
          ))}
        </div>
        <Link to="/orders" className="inline-flex">
          <Button variant="outline" className="gap-2 rounded-2xl border-2 border-slate-900/20">
            <ArrowLeft className="h-4 w-4" />
            {t('orders.back')}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export default OrderDetail
