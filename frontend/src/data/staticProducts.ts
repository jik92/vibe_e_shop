import products from '../../../shared/products_seed.json'
import type { Product } from '../types/api'

type RawProduct = Omit<Product, 'id'> & { id?: number }

export const staticProducts: Product[] = (products as RawProduct[]).map((product, idx) => ({
  ...product,
  id: product.id ?? idx + 1
}))
