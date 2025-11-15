import { useTranslation } from 'react-i18next'

const LanguageSwitcher = (): JSX.Element => {
  const { i18n } = useTranslation()
  const next = i18n.language === 'en' ? 'zh' : 'en'

  const handleSwitch = () => {
    i18n.changeLanguage(next)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next
    }
  }

  return (
    <button
      onClick={handleSwitch}
      style={{
        padding: '0.4rem 0.75rem',
        borderRadius: '999px',
        border: '1px solid rgba(255,255,255,0.4)',
        background: 'transparent',
        color: '#fff',
        cursor: 'pointer'
      }}
    >
      {next === 'zh' ? '中文' : 'EN'}
    </button>
  )
}

export default LanguageSwitcher
