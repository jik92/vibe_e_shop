import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLoaderData, useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { api } from '../api/client'
import { useAuth } from '../contexts/AuthContext'
import type { Product } from '../types/api'

const currency = (value: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(value))

type ProductLoaderData = { product: Product }

const ProductDetail = (): JSX.Element => {
  const loaderData = useLoaderData({}) as ProductLoaderData | undefined
  const params = useParams({})
  const { isAuthenticated } = useAuth()
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const { data } = useQuery<Product>({
    ...api.productQuery(params.productId),
    initialData: loaderData?.product
  })

  const mutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      api.addToCart({ product_id: productId, quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  })

  if (!data) {
    return <p>Product not found.</p>
  }

  return (
    <article className="card" style={{ maxWidth: '720px', margin: '0 auto' }}>
      {data.image_url && <img src={data.image_url} alt={data.name} />}
      <h2>{data.name}</h2>
      <p>{data.description}</p>
      <p>
        <strong>{currency(data.price)}</strong>
      </p>
      <p>Stock: {data.stock}</p>
      {isAuthenticated && <button onClick={() => mutation.mutate({ productId: data.id, quantity: 1 })}>{t('buttons.add_to_cart')}</button>}
    </article>
  )
}

export default ProductDetail
