import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useLoaderData, useNavigate } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { PanelsTopLeft, Sparkles } from 'lucide-react'

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
    <div className="space-y-16">
      <Helmet>
        <title>E-Shop | {t('home.title')}</title>
        <meta name="description" content={t('home.subtitle')} />
      </Helmet>
      <section className="relative grid min-h-[90vh] w-full gap-12 bg-soft-gradient px-6 py-20 shadow-[0_60px_160px_rgba(122,111,245,0.18)] lg:grid-cols-[1.3fr_minmax(0,1fr)] lg:px-32">
        <div className="space-y-6">
          <Badge variant="secondary" className="w-fit gap-2 rounded-full bg-white/80 text-[#2A2A2A]">
            <Sparkles className="h-4 w-4 text-[#7B6FF5]" />
            {t('home.badge')}
          </Badge>
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold leading-tight text-[#2A2A2A] lg:text-6xl">{t('home.title')}</h1>
            <p className="text-lg text-[#4F4B45] lg:text-xl">{t('home.subtitle')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/onboarding" className="inline-flex">
              <Button className="rounded-full px-8 py-6 text-base">{t('home.cta_primary')}</Button>
            </Link>
            <Link to="/orders" className="inline-flex">
              <Button variant="ghost" className="rounded-full px-8 py-6 text-base text-[#2A2A2A]">
                {t('home.cta_secondary')}
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label={t('home.stat_products')} value="500+" />
            <StatCard label={t('home.stat_delivery')} value="40+" />
            <StatCard label={t('home.stat_support')} value="4.9/5" />
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[32px] bg-white/70 p-8 shadow-[0_30px_120px_rgba(122,111,245,0.18)]">
          <div className="absolute inset-y-6 left-6 w-1 bg-gradient-to-b from-[#7B6FF5] to-transparent" />
          <div className="relative flex h-full flex-col gap-4 pl-6">
            {slides.map((slide) => (
              <article
                key={slide.title}
                className="rounded-[26px] border border-[#E3DCCF] bg-[#FBFAF7] p-5 shadow-[0_20px_60px_rgba(122,111,245,0.08)]"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-[#7B6FF5]">{slide.tag}</p>
                <h3 className="mt-2 text-xl font-semibold text-[#2A2A2A]">{slide.title}</h3>
                <p className="mt-2 text-sm text-[#4F4B45]">{slide.body}</p>
                <p className="mt-4 text-sm font-semibold text-[#7B6FF5]">{slide.metric}</p>
              </article>
            ))}
          </div>
        </div>
      </section>


      <section className="space-y-6 px-6 lg:px-24">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-[#7B6FF5]">Slide experience</p>
            <h2 className="text-4xl font-semibold text-[#2A2A2A]">Design cinematic workflows.</h2>
          </div>
          <p className="max-w-2xl text-sm text-[#4F4B45]">
            Drag prospects through multilingual onboarding, preview AI-guided journeys, and replay each touchpoint from one widescreen timeline.
          </p>
        </div>
        <div className="overflow-x-auto pb-4">
          <div className="flex min-w-[600px] gap-4">
            {slides.map((slide) => (
              <div
                key={`track-${slide.title}`}
                className="min-w-[280px] flex-1 rounded-[28px] border border-[#E3DCCF] bg-white/80 p-5 transition hover:-translate-y-1 hover:border-[#7B6FF5]"
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#7B6FF5]">
                  <PanelsTopLeft className="h-4 w-4" />
                  {slide.tag}
                </div>
                <p className="mt-4 text-lg font-semibold text-[#2A2A2A]">{slide.title}</p>
                <p className="mt-2 text-sm text-[#4F4B45]">{slide.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4 px-6 lg:px-24">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-[#7B6FF5]">{t('home.featured')}</p>
            <h2 className="text-4xl font-semibold text-[#2A2A2A]">Featured catalog</h2>
          </div>
          <Badge variant="accent" className="rounded-full bg-[#7B6FF5] px-5 py-2 text-white">
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
  <div className="rounded-[28px] border border-white/60 bg-white/90 p-4 text-center text-[#2A2A2A] shadow-sm">
    <p className="text-3xl font-semibold">{value}</p>
    <p className="text-sm text-[#4F4B45]">{label}</p>
  </div>
)

const slides = [
  {
    tag: 'Flow',
    title: 'AI-assisted storefront',
    body: 'Blend catalog data with conversational prompts to auto-generate landing sections per persona.',
    metric: '↑ 34% engagement'
  },
  {
    tag: 'Timeline',
    title: 'Cart memory',
    body: 'Keep shopper context synced between devices with live TanStack Query streams.',
    metric: 'Sync in 120ms'
  },
  {
    tag: 'Channel',
    title: 'Localized onboarding',
    body: 'Deliver instant EN/中文 toggles using the shared translation core from backend to SSR shell.',
    metric: '2 languages live'
  }
] as const

export default Home
