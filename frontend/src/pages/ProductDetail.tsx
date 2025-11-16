import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useLoaderData, useNavigate, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { BadgeCheck, CheckCircle2, Heart, Truck } from 'lucide-react'

import { api } from '../api/client'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useAuth } from '../contexts/AuthContext'
import type { Product } from '../types/api'
import { formatCurrency } from '../lib/currency'
import { SITE_NAME, absoluteUrl } from '../config/seo'
import { Helmet } from 'react-helmet-async'

type ProductLoaderData = { product: Product }
const SPECIAL_PRODUCT_NAME = 'Birthday Bakery Blue Gold Card'

const ProductDetail = (): JSX.Element => {
  const loaderData = useLoaderData({}) as ProductLoaderData | undefined
  const params = useParams({ strict: false })
  const { isAuthenticated } = useAuth()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const productId = params?.productId

  const { data } = useQuery<Product>({
    ...api.productQuery(productId ?? ''),
    initialData: loaderData?.product,
    enabled: Boolean(productId)
  })

  const product = productId ? data : loaderData?.product

  const addMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      api.addToCart({ product_id: productId, quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  })

  const buyMutation = useMutation({
    mutationFn: async (productId: number) => {
      await api.addToCart({ product_id: productId, quantity: 1 })
      return api.createOrder()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      navigate({ to: '/orders' })
    }
  })

  if (!product) {
    return <p>Product not found.</p>
  }

  const inStock = (product.stock ?? 0) > 0
  const canonicalPath = productId ? `/products/${product.id}` : '/collections/birthday-card'
  const productUrl = absoluteUrl(canonicalPath)
  const productImage = product.image_url ? product.image_url : absoluteUrl('/img.png')

  const handleAdd = () => {
    if (!isAuthenticated) {
      navigate({ to: '/login' })
      return
    }
    addMutation.mutate({ productId: product.id, quantity: 1 })
  }

  const handleBuy = () => {
    if (!isAuthenticated) {
      navigate({ to: '/login' })
      return
    }
    buyMutation.mutate(product.id)
  }

  const isSpecial = product.name === SPECIAL_PRODUCT_NAME

  return (
    <div>
      <Helmet>
        <title>{`${product.name} | ${SITE_NAME}`}</title>
        <meta name="description" content={product.description} />
        <link rel="canonical" href={productUrl} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={`${product.name} | ${SITE_NAME}`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:url" content={productUrl} />
        <meta property="og:image" content={productImage} />
        <meta property="product:price:amount" content={String(product.price)} />
        <meta property="product:price:currency" content="USD" />
        <meta property="product:availability" content={inStock ? 'in stock' : 'out of stock'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} | ${SITE_NAME}`} />
        <meta name="twitter:description" content={product.description} />
        <meta name="twitter:image" content={productImage} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: product.name,
            image: productImage,
            description: product.description,
            sku: product.id,
            offers: {
              '@type': 'Offer',
              url: productUrl,
              priceCurrency: 'USD',
              price: product.price,
              availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
            }
          })}
        </script>
      </Helmet>
        <SpecialProductView
          product={product}
          inStock={inStock}
          onAdd={handleAdd}
          onBuy={handleBuy}
          addPending={addMutation.isPending}
          buyPending={buyMutation.isPending}
        />

    </div>
  )
}

const SpecialProductView = ({
  product,
  inStock,
  onAdd,
  onBuy,
  addPending,
  buyPending
}: {
  product: Product
  inStock: boolean
  onAdd: () => void
  onBuy: () => void
  addPending: boolean
  buyPending: boolean
}) => (
  <div className="space-y-12 px-0 py-6 lg:px-0">
    <section className="grid gap-10 rounded-[32px] border border-[#E3E3E3] bg-white p-6 shadow-2xl lg:grid-cols-2 lg:p-10">
      <div className="space-y-5">
        <Badge variant="accent" className="rounded-full bg-black text-white">
          Limited release
        </Badge>
        <h1 className="text-4xl font-semibold text-[#0d0d0d] lg:text-5xl">{product.name}</h1>
        <p className="text-lg text-muted-foreground">
          Inspired by artisan birthday cakes, this card combines blue velvet washes with gold foil hand lettering. Thick recycled cotton
          stock holds embossed sprinkles for a tactile finish.
        </p>
        <div className="text-3xl font-semibold text-[#0d0d0d]">{formatCurrency(product.price)}</div>
        <div className="flex flex-wrap gap-3">
          <Button className="rounded-full px-6 py-3" onClick={onBuy} disabled={!inStock || buyPending}>
            {buyPending ? 'Processing...' : 'Buy now'}
          </Button>
          <Button variant="ghost" className="rounded-full px-6 py-3 text-[#0d0d0d]" onClick={onAdd} disabled={!inStock || addPending}>
            Add to cart
          </Button>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-[#E3E3E3] bg-[#FBFBFB] p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-black" />
            <span>Ships worldwide within 3 business days.</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-black" />
            <span>Foil-pressed in a carbon-neutral studio.</span>
          </div>
        </div>
      </div>
      <div className="rounded-[28px] bg-[#F6F6F6] p-4">
        {product.image_url ? (
          <img src={product.image_url} alt={`${product.name} preview`} className="h-full w-full rounded-[24px] object-cover" />
        ) : (
          <div className="flex h-full min-h-[320px] items-center justify-center text-6xl">🎂</div>
        )}
      </div>
    </section>

    <section className="grid gap-6 lg:grid-cols-3">
      {specialFeatures.map((feature) => (
        <article key={feature.title} className="rounded-3xl border border-[#E3E3E3] bg-white/80 p-5 text-[#0d0d0d]">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <CheckCircle2 className="h-5 w-5 text-black" />
            {feature.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
        </article>
      ))}
    </section>

    <section className="rounded-[32px] border border-[#E3E3E3] bg-white/80 p-6 text-sm text-muted-foreground lg:p-10">
      <h2 className="text-2xl font-semibold text-[#0d0d0d]">Design notes</h2>
      <p className="mt-3">
        The palette mirrors fresh cream, glazed blueberries, and gold flake toppers. Each card ships with a powder blue envelope and reusable
        keepsake sleeve. Perfect for baker-themed celebrations or artisan markets.
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-[#0d0d0d]">
        <span>Recycled cotton stock</span>
        <span>Foil stamped</span>
        <span>Blue velvet wash</span>
      </div>
      <div className="mt-6">
        <Link to="/products/$productId" params={{ productId: product.id.toString() }} className="text-sm font-semibold text-[#0d0d0d] hover:text-[#7d7d7d]">
          View technical specs ↗
        </Link>
      </div>
    </section>
  </div>
)

const specialFeatures = [
  {
    title: 'Hand-finished foil',
    body: '24k gold-toned foil adds shimmer to every lettering stroke without smudging.'
  },
  {
    title: 'Museum-grade texture',
    body: '640gsm cotton stock with embossed sprinkles for a tactile bakery finish.'
  },
  {
    title: 'Keepsake packaging',
    body: 'Delivered inside a soft-touch sleeve so recipients can store the card long-term.'
  }
]

export default ProductDetail
