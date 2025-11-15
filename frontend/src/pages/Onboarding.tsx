import { useTranslation } from 'react-i18next'

const Onboarding = (): JSX.Element => {
  const { t } = useTranslation()
  return (
    <div className="card" style={{ maxWidth: '720px', margin: '0 auto' }}>
      <h2>{t('onboarding.title')}</h2>
      <p>{t('onboarding.body')}</p>
      <ul>
        <li>Switch languages instantly.</li>
        <li>Browse curated electronics.</li>
        <li>Track cart and order history.</li>
      </ul>
    </div>
  )
}

export default Onboarding
