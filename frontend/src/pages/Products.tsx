import { useState, useMemo } from 'react'
import { useLoaderData, Link } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { api } from '../api/client'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import ProductGrid from '../components/ProductGrid'
import { useAuth } from '../contexts/AuthContext'
import type { Product } from '../types/api'
import { Badge } from '../components/ui/badge'
import { SITE_NAME, absoluteUrl } from '../config/seo'

type LoaderData = { products: Product[] }

const ProductsPage = (): JSX.Element => {
  const { products } = useLoaderData({}) as LoaderData
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: ({ productId }: { productId: number }) => api.addToCart({ product_id: productId, quantity: 1 }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  })

  const filtered = useMemo(() => {
    return products.filter((product) => product.name.toLowerCase().includes(query.trim().toLowerCase()))
  }, [products, query])

  const handleAdd = (product: Product) => {
    if (!isAuthenticated) return
    addMutation.mutate({ productId: product.id })
  }

  return (
    <div className="space-y-8 px-6 py-10 lg:px-12">
      <Helmet>
        <title>{`${SITE_NAME} | Catalog`}</title>
        <meta
          name="description"
          content="Browse the full PulseCart catalog of curated electronics, artisan stationery, and AI-ready storefront goods."
        />
        <link rel="canonical" href={absoluteUrl('/products')} />
      </Helmet>

      <section className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">{t('home.featured')}</p>
            <h1 className="text-4xl font-semibold text-[#0d0d0d]">All products</h1>
            <p className="text-sm text-muted-foreground">Search the full catalog or jump to specialized collections.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-11 rounded-full bg-white pl-9 pr-4"
                placeholder="Search products..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <Link to="/collections/birthday-card" className="inline-flex">
              <Button variant="ghost" className="gap-2 rounded-full px-4">
                <SlidersHorizontal className="h-4 w-4" />
                Curated drop
              </Button>
            </Link>
          </div>
        </div>
        <Badge variant="accent" className="rounded-full bg-[#0d0d0d] px-4 py-1 text-white">
          {filtered.length} items
        </Badge>
      </section>

      <ProductGrid products={filtered} onAdd={handleAdd} />
    </div>
  )
}

export default ProductsPage
