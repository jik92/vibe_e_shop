import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { CartItem } from '../types/api'

const currency = (value: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(value))

interface CartItemRowProps {
  item: CartItem
  onUpdate: (id: number, quantity: number) => void
  onRemove: (id: number) => void
}

const CartItemRow = ({ item, onUpdate, onRemove }: CartItemRowProps): JSX.Element => {
  const { t } = useTranslation()
  const [quantity, setQuantity] = useState(item.quantity)

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#fff', padding: '1rem', borderRadius: '10px', marginBottom: '0.75rem' }}>
      {item.product?.image_url && <img src={item.product.image_url} alt={item.product.name} width={96} height={96} style={{ borderRadius: '8px', objectFit: 'cover' }} />}
      <div style={{ flex: 1 }}>
        <strong>{item.product?.name}</strong>
        <p style={{ margin: '0.2rem 0', color: '#6b7280' }}>{currency(item.product?.price ?? 0)}</p>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} style={{ width: '80px', padding: '0.35rem' }} />
          <button onClick={() => onUpdate(item.id, quantity)}>{t('buttons.update')}</button>
          <button onClick={() => onRemove(item.id)} style={{ background: '#f87171' }}>
            {t('buttons.remove')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartItemRow
