import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLoaderData } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

import { api } from '../api/client'
import ProductGrid from '../components/ProductGrid'
import { useAuth } from '../contexts/AuthContext'
import type { Product } from '../types/api'

type HomeLoaderData = { products: Product[] }

const Home = (): JSX.Element => {
  const initial = useLoaderData({ from: 'home' }) as HomeLoaderData | undefined
  const { t } = useTranslation()
  const queryClient = useQueryClient()
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
    if (!isAuthenticated) return
    addMutation.mutate({ productId: product.id })
  }

  return (
    <div>
      <Helmet>
        <title>E-Shop | {t('home.title')}</title>
        <meta name="description" content={t('home.subtitle')} />
      </Helmet>
      <section className="hero">
        <p className="badge">SSR</p>
        <h1>{t('home.title')}</h1>
        <p>{t('home.subtitle')}</p>
      </section>
      <h2>{t('home.featured')}</h2>
      <ProductGrid products={productsQuery.data ?? []} onAdd={isAuthenticated ? handleAdd : undefined} />
    </div>
  )
}

export default Home
