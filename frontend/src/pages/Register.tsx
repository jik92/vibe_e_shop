import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useAuth } from '../contexts/AuthContext'
import type { RegisterPayload } from '../types/api'

const Register = (): JSX.Element => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [values, setValues] = useState<RegisterPayload>({ email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    try {
      await register(values)
      setSuccess(t('forms.register_success'))
      setTimeout(() => navigate({ to: '/login' }), 800)
    } catch (err) {
      setError((err as Error)?.message ?? t('forms.register_error'))
    }
  }

  return (
    <Card className="mx-auto max-w-md rounded-3xl border border-slate-100 bg-white/95 shadow-2xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl text-slate-900">{t('forms.register')}</CardTitle>
        <CardDescription>{t('home.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('forms.email')}</Label>
            <Input id="email" name="email" type="email" value={values.email} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('forms.password')}</Label>
            <Input id="password" name="password" type="password" minLength={6} value={values.password} onChange={handleChange} required />
          </div>
          <Button className="w-full rounded-2xl bg-slate-900 text-white hover:bg-slate-800" type="submit">
            {t('forms.register')}
          </Button>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-emerald-500">{success}</p>}
        </form>
      </CardContent>
    </Card>
  )
}

export default Register
