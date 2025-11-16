import {useTranslation} from 'react-i18next'
import {ShoppingCart, Star} from 'lucide-react'
import {Link} from '@tanstack/react-router'

import type {Product} from '../types/api'
import {Button} from './ui/button'
import {Card} from './ui/card'
import {Badge} from './ui/badge'
import {formatCurrency} from '../lib/currency'

interface ProductCardProps {
    product: Product
    onAdd?: (product: Product) => void
}

const ProductCard = ({product, onAdd}: ProductCardProps): JSX.Element => {
    const {t} = useTranslation()
    const inStock = (product.stock ?? 0) > 0
    return (
        <Card
            className="group flex h-[250px] w-[250px] flex-col overflow-hidden border-[#E3DCCF] bg-[#FBFAF7] shadow-lg ring-1 ring-transparent transition hover:-translate-y-1 hover:ring-[#111111]/20">
            <Link to="/products/$productId" params={{productId: product.id.toString()}} className="flex-1">
                <div className="relative h-[130px] w-full overflow-hidden bg-slate-100">
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name}
                             className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                             loading="lazy"/>
                    ) : (
                        <div className="flex h-full items-center justify-center text-4xl text-muted-foreground">✨</div>
                    )}
                    <div className="absolute left-4 top-4">
                        <Badge variant={inStock ? 'accent' : 'destructive'}
                               className="border-none bg-white/80 text-xs font-semibold uppercase tracking-wide text-slate-900">
                            {inStock ? t('product.in_stock') : t('product.out_of_stock')}
                        </Badge>
                    </div>
                </div>
                <div className="flex h-[110px] flex-col justify-between gap-2 px-4 py-3">
                    <p className="line-clamp-2 text-base font-semibold text-[#111111]">{product.name}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
                    <div className="flex items-end justify-between gap-3 px-4 pb-4 pt-2">
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-[0.4em] text-[#111111]">{t('product.price')}</p>
                            <p className="text-xl font-semibold text-[#2A2A2A]">{formatCurrency(product.price)}</p>
                            <div className="inline-flex items-center gap-1 text-[10px] text-[#4F4B45]">
                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"/>
                                <span>4.9</span>
                                <span>•</span>
                                <span>{product.stock ?? 0} pcs</span>
                            </div>
                        </div>
                        {onAdd && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-9 rounded-full px-3 text-xs font-semibold text-[#2A2A2A]"
                                onClick={() => onAdd(product)}
                                disabled={!inStock}
                            >
                                <ShoppingCart className="mr-1 h-4 w-4"/>
                                {t('buttons.add_to_cart')}
                            </Button>
                        )}
                    </div>
                </div>
            </Link>
        </Card>
    )
}

export default ProductCard
