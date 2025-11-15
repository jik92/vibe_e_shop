import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

import { Button } from './ui/button'

const LanguageSwitcher = (): JSX.Element => {
  const { i18n } = useTranslation()
  const nextLanguage = i18n.language === 'en' ? 'zh' : 'en'

  const handleSwitch = () => {
    i18n.changeLanguage(nextLanguage)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = nextLanguage
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      className="gap-2 border border-white/30 bg-transparent text-white hover:bg-white/10"
      onClick={handleSwitch}
    >
      <Globe className="h-4 w-4" />
      {nextLanguage === 'zh' ? '中文' : 'EN'}
    </Button>
  )
}

export default LanguageSwitcher
