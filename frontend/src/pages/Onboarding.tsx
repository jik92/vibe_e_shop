import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { CheckCircle2 } from 'lucide-react'

import { Button } from '../components/ui/button'

const Onboarding = (): JSX.Element => {
  const { t } = useTranslation()
  const steps = (t('onboarding.steps', { returnObjects: true }) as string[]) ?? []

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-[#0d0d0d]">{t('onboarding.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('onboarding.body')}</p>
      </div>
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li key={step} className="flex items-start gap-3 rounded-2xl border border-[#E5E5E5] bg-white p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.3em]">0{index + 1}</p>
              <p className="text-lg font-semibold text-[#0d0d0d]">{step}</p>
            </div>
          </li>
        ))}
      </ol>
      <div>
        <Link to="/" className="inline-flex w-full justify-center">
          <Button className="w-full rounded-full">{t('onboarding.cta')}</Button>
        </Link>
      </div>
    </div>
  )
}

export default Onboarding
