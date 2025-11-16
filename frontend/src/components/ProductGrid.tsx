import type { Product } from '../types/api'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
  onAdd?: (product: Product) => void
}

const ProductGrid = ({ products, onAdd }: ProductGridProps): JSX.Element => (
  <div
    className="grid gap-6 justify-items-start"
    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 250px))' }}
  >
    {products.map((product) => (
      <ProductCard key={product.id} product={product} onAdd={onAdd} />
    ))}
  </div>
)

export default ProductGrid
