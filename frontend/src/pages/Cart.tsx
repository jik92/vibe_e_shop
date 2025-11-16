import type { ReactNode } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useLoaderData, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ShoppingBag } from 'lucide-react'

import { api } from '../api/client'
import CartItemRow from '../components/CartItemRow'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useAuth } from '../contexts/AuthContext'
import { useCartQuery } from '../hooks/useCartQuery'
import type { Cart } from '../types/api'
import { formatCurrency } from '../lib/currency'

type CartLoaderData = { cart: Cart | null }

const CartPage = (): JSX.Element => {
  const { isAuthenticated } = useAuth()
  const { t } = useTranslation()
  const initial = useLoaderData({}) as CartLoaderData | undefined
  const navigate = useNavigate()
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

  if (!isAuthenticated) {
    return (
      <EmptyState
        title={t('cart.empty')}
        description={t('checkout.subtitle')}
        action={
          <Link to="/login" className="inline-flex">
            <Button variant="ghost">{t('forms.login')}</Button>
          </Link>
        }
      />
    )
  }

  if (!data?.items?.length) {
    return (
      <EmptyState
        title={t('cart.empty')}
        description={t('home.subtitle')}
        action={
          <Link to="/" className="inline-flex">
            <Button variant="ghost">{t('home.featured')}</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-6 px-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">{t('cart.title')}</h2>
        </div>
        <Badge variant="accent" className="bg-[#111111] text-white">
          {data.items.length} {t('cart.items')}
        </Badge>
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          {data.items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onUpdate={(id, quantity) => updateMutation.mutate({ id, quantity })}
              onRemove={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
        <Card className="rounded-3xl border border-slate-100 bg-slate-50/60 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl">{t('checkout.summary')}</CardTitle>
            <p className="text-sm text-muted-foreground">{t('checkout.subtitle')}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between text-lg font-semibold text-slate-900">
              <span>{t('cart.total')}</span>
              <span>{formatCurrency(data.total_price)}</span>
            </div>
            <Button className="w-full rounded-full" onClick={() => navigate({ to: '/checkout' })}>
              {t('cart.checkout')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface EmptyStateProps {
  title: string
  description: string
  action: ReactNode
}

const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <Card className="rounded-3xl border border-dashed border-slate-200 bg-white/80 text-center shadow-none">
    <CardHeader>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
        <ShoppingBag className="h-7 w-7" />
      </div>
      <CardTitle className="text-2xl">{title}</CardTitle>
      <p className="text-muted-foreground">{description}</p>
    </CardHeader>
    <CardContent className="flex justify-center">{action}</CardContent>
  </Card>
)

export default CartPage
