import { useTranslation } from 'react-i18next'

import type { Product } from '../types/api'

const currency = (value: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(value))

interface ProductCardProps {
  product: Product
  onAdd?: (product: Product) => void
}

const ProductCard = ({ product, onAdd }: ProductCardProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <div className="card">
      {product.image_url && <img src={product.image_url} alt={product.name} loading="lazy" />}
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <strong>{currency(product.price)}</strong>
      {onAdd && <button onClick={() => onAdd(product)}>{t('buttons.add_to_cart')}</button>}
    </div>
  )
}

export default ProductCard
