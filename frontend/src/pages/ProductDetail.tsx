import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLoaderData, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { BadgeCheck } from 'lucide-react'

import { api } from '../api/client'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useAuth } from '../contexts/AuthContext'
import type { Product } from '../types/api'
import { formatCurrency } from '../lib/currency'

type ProductLoaderData = { product: Product }

const ProductDetail = (): JSX.Element => {
  const loaderData = useLoaderData({}) as ProductLoaderData | undefined
  const params = useParams({})
  const { isAuthenticated } = useAuth()
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const { data } = useQuery<Product>({
    ...api.productQuery(params.productId),
    initialData: loaderData?.product
  })

  const mutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      api.addToCart({ product_id: productId, quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  })

  if (!data) {
    return <p>Product not found.</p>
  }

  const inStock = (data.stock ?? 0) > 0

  return (
    <Card className="mx-auto max-w-3xl rounded-[32px] border border-slate-100 bg-white/95 shadow-2xl">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] bg-slate-100 p-4">
          {data.image_url ? (
            <img src={data.image_url} alt={data.name} className="h-full w-full rounded-[24px] object-cover" />
          ) : (
            <div className="flex h-full min-h-[320px] items-center justify-center text-6xl">📱</div>
          )}
        </div>
        <div className="flex flex-col">
          <CardHeader className="space-y-4 p-0">
            <CardTitle className="text-3xl text-slate-900">{data.name}</CardTitle>
            <CardDescription className="text-base text-muted-foreground">{data.description}</CardDescription>
            <Badge variant={inStock ? 'accent' : 'destructive'} className="w-fit rounded-full bg-slate-900 text-white">
              {inStock ? t('product.in_stock') : t('product.out_of_stock')}
            </Badge>
          </CardHeader>
          <CardContent className="mt-auto space-y-4 p-0">
            <p className="text-sm uppercase tracking-wide text-muted-foreground">{t('product.price')}</p>
            <p className="text-4xl font-semibold text-slate-900">{formatCurrency(data.price)}</p>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm text-muted-foreground">
              <BadgeCheck className="h-4 w-4 text-slate-900" />
              {t('product.stock_label', { count: data.stock ?? 0 })}
            </div>
            {isAuthenticated && (
              <Button
                className="w-full rounded-2xl bg-slate-900 text-white hover:bg-slate-800"
                size="lg"
                disabled={!inStock}
                onClick={() => mutation.mutate({ productId: data.id, quantity: 1 })}
              >
                {t('buttons.add_to_cart')}
              </Button>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  )
}

export default ProductDetail
