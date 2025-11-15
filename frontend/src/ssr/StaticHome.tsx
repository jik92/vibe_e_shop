import '../index.css'

import { staticProducts } from '../data/staticProducts'

const StaticHome = (): JSX.Element => (
  <div className="space-y-8">
    <section className="rounded-[32px] border border-slate-200 bg-soft-gradient px-6 py-12 shadow-xl md:px-12">
      <div className="space-y-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase text-slate-900">
          SEO
        </span>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">Shop curated electronics worldwide</h1>
          <p className="text-lg text-muted-foreground">Localized experience, multi-language support, instant checkout, and transparent orders.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <StaticStat label="Products ready to ship" value="500+" />
          <StaticStat label="Global destinations" value="40+" />
          <StaticStat label="Avg. support rating" value="4.9/5" />
        </div>
      </div>
    </section>
    <section className="space-y-4">
      <div>
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Featured products</p>
        <h2 className="text-3xl font-semibold text-slate-900">Featured products</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {staticProducts.map((product) => (
          <article
            key={product.id}
            className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white/90 shadow-lg transition hover:-translate-y-1"
          >
            <div className="h-44 w-full overflow-hidden bg-slate-100">
              {product.image_url ? <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" /> : null}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <h3 className="text-xl font-semibold text-slate-900">{product.name}</h3>
              <p className="flex-1 text-sm text-muted-foreground">{product.description}</p>
              <p className="text-lg font-semibold text-slate-900">${Number(product.price).toFixed(2)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  </div>
)

const StaticStat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-3xl border border-white/60 bg-white/80 p-4 text-center text-slate-900 shadow-sm">
    <p className="text-3xl font-semibold">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
)

export default StaticHome
