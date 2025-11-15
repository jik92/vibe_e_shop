import '../index.css'

import { staticProducts } from '../data/staticProducts'

const StaticHome = (): JSX.Element => (
  <div>
    <section className="hero">
      <p className="badge">SEO</p>
      <h1>Shop curated electronics worldwide</h1>
      <p>Localized experience, multi-language support, instant checkout, and transparent orders.</p>
    </section>
    <h2>Featured products</h2>
    <div className="card-grid">
      {staticProducts.map((product) => (
        <div className="card" key={product.id}>
          {product.image_url && <img src={product.image_url} alt={product.name} />}
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <strong>${Number(product.price).toFixed(2)}</strong>
        </div>
      ))}
    </div>
  </div>
)

export default StaticHome
