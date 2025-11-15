import { useEffect } from 'react'
import { useLoaderData, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ShieldCheck } from 'lucide-react'

import { api } from '../api/client'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useAuth } from '../contexts/AuthContext'
import { useCartQuery } from '../hooks/useCartQuery'
import type { Cart } from '../types/api'
import { formatCurrency } from '../lib/currency'

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
    return (
      <Card className="mx-auto max-w-2xl rounded-3xl border border-dashed border-slate-200 bg-white/80 text-center shadow-none">
        <CardHeader>
          <CardTitle>{t('checkout.empty')}</CardTitle>
          <CardDescription>{t('home.subtitle')}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-3xl rounded-3xl border border-slate-100 bg-white/95 shadow-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-3xl">{t('checkout.title')}</CardTitle>
            <CardDescription>{t('checkout.subtitle')}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-slate-900">{t('checkout.summary')}</p>
            <Badge variant="accent" className="rounded-full bg-slate-900 text-white">
              {data.items.length} {t('cart.items')}
            </Badge>
          </div>
          <ul className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50/60">
            {data.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-slate-900">{item.product?.name}</p>
                  <p className="text-xs text-muted-foreground">× {item.quantity}</p>
                </div>
                <p className="font-semibold text-slate-900">{formatCurrency(item.unit_price ?? item.product?.price ?? 0)}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-between text-xl font-semibold text-slate-900">
          <span>{t('cart.total')}</span>
          <span>{formatCurrency(data.total_price)}</span>
        </div>
        <Button
          className="w-full rounded-2xl bg-slate-900 text-white hover:bg-slate-800"
          disabled={orderMutation.isPending}
          onClick={() => orderMutation.mutate()}
        >
          {orderMutation.isPending ? t('checkout.processing') : t('checkout.pay')}
        </Button>
        {orderMutation.isSuccess && <p className="text-center text-sm text-emerald-600">{t('checkout.success')}</p>}
        {orderMutation.isError && <p className="text-center text-sm text-red-500">{(orderMutation.error as Error)?.message ?? t('checkout.error')}</p>}
      </CardContent>
    </Card>
  )
}

export default Checkout
