import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { useAuth } from '../contexts/AuthContext'
import type { LoginPayload } from '../types/api'

const Login = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [values, setValues] = useState<LoginPayload>({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    try {
      await login(values)
      navigate({ to: '/onboarding' })
    } catch (err) {
      setError((err as Error)?.message ?? 'Login failed')
    }
  }

  return (
    <div className="form-card">
      <h2>{t('forms.login')}</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder={t('forms.email')} value={values.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder={t('forms.password')} value={values.password} onChange={handleChange} required />
        <button type="submit">{t('forms.login')}</button>
        {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      </form>
    </div>
  )
}

export default Login
