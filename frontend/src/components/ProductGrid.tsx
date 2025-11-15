import type { Product } from '../types/api'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
  onAdd?: (product: Product) => void
}

const ProductGrid = ({ products, onAdd }: ProductGridProps): JSX.Element => (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {products.map((product) => (
      <ProductCard key={product.id} product={product} onAdd={onAdd} />
    ))}
  </div>
)

export default ProductGrid
