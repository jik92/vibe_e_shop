import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useLoaderData, useNavigate } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Sparkles } from 'lucide-react'

import { api } from '../api/client'
import ProductGrid from '../components/ProductGrid'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { useAuth } from '../contexts/AuthContext'
import type { Product } from '../types/api'

type HomeLoaderData = { products: Product[] }

const Home = (): JSX.Element => {
  const initial = useLoaderData({}) as HomeLoaderData | undefined
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const productsQuery = useQuery<Product[]>({
    ...api.productsQuery(),
    initialData: initial?.products
  })

  const addMutation = useMutation({
    mutationFn: ({ productId }: { productId: number }) => api.addToCart({ product_id: productId, quantity: 1 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  })

  const handleAdd = (product: Product) => {
    if (!isAuthenticated) {
      navigate({ to: '/login' })
      return
    }
    addMutation.mutate({ productId: product.id })
  }

  return (
    <div className="space-y-8">
      <Helmet>
        <title>E-Shop | {t('home.title')}</title>
        <meta name="description" content={t('home.subtitle')} />
      </Helmet>
      <section className="rounded-[32px] border border-slate-200 bg-soft-gradient px-6 py-10 shadow-xl md:px-12 md:py-16">
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="flex-1 space-y-6">
            <Badge variant="secondary" className="w-fit gap-2 rounded-full bg-white/80 text-slate-900">
              <Sparkles className="h-4 w-4" />
              {t('home.badge')}
            </Badge>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">{t('home.title')}</h1>
              <p className="text-lg text-muted-foreground md:text-xl">{t('home.subtitle')}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/onboarding" className="inline-flex">
                <Button className="rounded-2xl px-6 py-6 text-base">{t('home.cta_primary')}</Button>
              </Link>
              <Link to="/orders" className="inline-flex">
                <Button variant="outline" className="rounded-2xl border-2 border-slate-900/20 px-6 py-6 text-base">
                  {t('home.cta_secondary')}
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid flex-1 gap-4 sm:grid-cols-3">
            <StatCard label={t('home.stat_products')} value="500+" />
            <StatCard label={t('home.stat_delivery')} value="40+" />
            <StatCard label={t('home.stat_support')} value="4.9/5" />
          </div>
        </div>
      </section>
      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">{t('home.featured')}</p>
            <h2 className="text-3xl font-semibold text-slate-900">{t('home.featured')}</h2>
          </div>
          <Badge variant="accent" className="bg-slate-900 text-white">
            {productsQuery.data?.length ?? 0} {t('cart.items')}
          </Badge>
        </div>
        <ProductGrid products={productsQuery.data ?? []} onAdd={handleAdd} />
      </section>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
}

const StatCard = ({ label, value }: StatCardProps) => (
  <div className="rounded-3xl border border-white/40 bg-white/80 p-4 text-center text-slate-900 shadow-sm">
    <p className="text-3xl font-semibold">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
)

export default Home
