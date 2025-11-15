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
      variant="outline"
      className="gap-2 rounded-full border-[#E3DCCF] bg-white/70 text-[#2A2A2A] hover:bg-[#FBFAF7]"
      onClick={handleSwitch}
    >
      <Globe className="h-4 w-4" />
      {nextLanguage === 'zh' ? '中文' : 'EN'}
    </Button>
  )
}

export default LanguageSwitcher
