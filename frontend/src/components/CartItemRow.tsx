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
    <div className="flex min-h-[250px] flex-col gap-4 rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm">
      <div className="grid grid-cols-[96px,1fr] gap-3">
        <div className="h-[120px] w-[96px] overflow-hidden rounded-2xl bg-slate-100">
          {item.product?.image_url ? (
            <img src={item.product.image_url} alt={item.product?.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-3xl text-muted-foreground">📦</div>
          )}
        </div>
        <div className="flex flex-col justify-between gap-2">
          <div>
            <p className="text-base font-semibold text-[#0d0d0d]">{item.product?.name}</p>
            <p className="text-sm text-muted-foreground">{formatCurrency(item.product?.price ?? 0)} / item</p>
          </div>
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs uppercase tracking-wide text-slate-700">
              x{quantity}
            </Badge>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Subtotal</p>
              <p className="text-lg font-semibold text-[#0d0d0d]">{formatCurrency(item.subtotal_price ?? 0)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-auto space-y-2">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={1}
            className="h-10 flex-1 rounded-xl bg-slate-50"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <Button size="sm" variant="outline" className="flex-1 rounded-xl" onClick={() => onUpdate(item.id, quantity)}>
            {t('buttons.update')}
          </Button>
        </div>
        {confirming ? (
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" className="flex-1" onClick={() => setConfirming(false)}>
              {t('buttons.cancel')}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="flex-1 rounded-xl"
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
          <Button size="sm" variant="ghost" className="w-full rounded-xl text-[#D92D20]" onClick={() => setConfirming(true)}>
            <Trash2 className="mr-1.5 h-4 w-4" />
            {t('buttons.remove')}
          </Button>
        )}
      </div>
    </div>
  )
}

export default CartItemRow
