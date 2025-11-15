import { useTranslation } from 'react-i18next'
import { ShoppingCart, Star } from 'lucide-react'

import type { Product } from '../types/api'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Badge } from './ui/badge'
import { formatCurrency } from '../lib/currency'

interface ProductCardProps {
  product: Product
  onAdd?: (product: Product) => void
}

const ProductCard = ({ product, onAdd }: ProductCardProps): JSX.Element => {
  const { t } = useTranslation()
  const inStock = (product.stock ?? 0) > 0
  return (
    <Card className="group flex h-full flex-col overflow-hidden border-[#E3DCCF] bg-[#FBFAF7] shadow-lg ring-1 ring-transparent transition hover:-translate-y-1 hover:ring-[#7B6FF5]/20">
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-muted-foreground">✨</div>
        )}
        <div className="absolute left-4 top-4">
          <Badge variant={inStock ? 'accent' : 'destructive'} className="border-none bg-white/80 text-xs font-semibold uppercase tracking-wide text-slate-900">
            {inStock ? t('product.in_stock') : t('product.out_of_stock')}
          </Badge>
        </div>
      </div>
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2 text-base text-muted-foreground">{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-[#7B6FF5]">{t('product.price')}</p>
          <p className="text-2xl font-semibold text-[#2A2A2A]">{formatCurrency(product.price)}</p>
          <div className="mt-2 inline-flex items-center gap-1 text-xs text-[#4F4B45]">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span>4.9</span>
            <span>•</span>
            <span>{product.stock ?? 0} pcs</span>
          </div>
        </div>
      </CardContent>
      {onAdd && (
        <CardFooter>
          <Button variant="ghost" className="w-full gap-2 rounded-full text-[#2A2A2A]" onClick={() => onAdd(product)} disabled={!inStock}>
            <ShoppingCart className="h-4 w-4" />
            {t('buttons.add_to_cart')}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

export default ProductCard
