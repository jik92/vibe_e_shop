import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Trash2 } from 'lucide-react'

import type { CartItem } from '../types/api'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { formatCurrency } from '../lib/currency'

interface CartItemRowProps {
  item: CartItem
  onUpdate: (id: number, quantity: number) => void
  onRemove: (id: number) => void
}

const CartItemRow = ({ item, onUpdate, onRemove }: CartItemRowProps): JSX.Element => {
  const { t } = useTranslation()
  const [quantity, setQuantity] = useState(item.quantity)
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm sm:flex-row sm:items-center">
      <div className="h-32 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-24 sm:w-24">
        {item.product?.image_url ? (
          <img src={item.product.image_url} alt={item.product?.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl text-muted-foreground">📦</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold text-slate-900">{item.product?.name}</p>
            <p className="text-sm text-muted-foreground">{formatCurrency(item.product?.price ?? 0)}</p>
          </div>
          <Badge variant="accent" className="bg-slate-900 text-white">
            {formatCurrency(item.subtotal_price ?? 0)}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            type="number"
            min={1}
            className="w-24 rounded-xl bg-slate-50"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <Button size="sm" variant="outline" className="rounded-xl" onClick={() => onUpdate(item.id, quantity)}>
            {t('buttons.update')}
          </Button>
          {confirming ? (
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>
                {t('buttons.cancel')}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="rounded-xl"
                onClick={() => {
                  onRemove(item.id)
                  setConfirming(false)
                }}
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                {t('buttons.confirm_remove')}
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="ghost" className="rounded-xl text-[#D92D20]" onClick={() => setConfirming(true)}>
              <Trash2 className="mr-1.5 h-4 w-4" />
              {t('buttons.remove')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CartItemRow
