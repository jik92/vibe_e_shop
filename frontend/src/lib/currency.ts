export const formatCurrency = (value: number | string = 0) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(
    Number(value ?? 0)
  )
