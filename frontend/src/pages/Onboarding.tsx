import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { CheckCircle2 } from 'lucide-react'

import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'

const Onboarding = (): JSX.Element => {
  const { t } = useTranslation()
  const steps = (t('onboarding.steps', { returnObjects: true }) as string[]) ?? []

  return (
    <Card className="mx-auto max-w-3xl rounded-[32px] border border-slate-100 bg-white/95 shadow-2xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl text-slate-900">{t('onboarding.title')}</CardTitle>
        <CardDescription>{t('onboarding.body')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li key={step} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">0{index + 1}</p>
                <p className="text-lg font-semibold text-slate-900">{step}</p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
      <CardFooter>
        <Link to="/" className="w-full">
          <Button className="w-full rounded-2xl bg-slate-900 text-white hover:bg-slate-800">{t('onboarding.cta')}</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default Onboarding
