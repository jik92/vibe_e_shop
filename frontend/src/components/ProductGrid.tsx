import type { Product } from '../types/api'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
  onAdd?: (product: Product) => void
}

const ProductGrid = ({ products, onAdd }: ProductGridProps): JSX.Element => (
  <div className="flex flex-wrap justify-center gap-6">
    {products.map((product) => (
      <ProductCard key={product.id} product={product} onAdd={onAdd} />
    ))}
  </div>
)

export default ProductGrid
