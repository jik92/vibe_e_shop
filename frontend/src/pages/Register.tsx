import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

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
      setSuccess('Account created. Continue to login.')
      setTimeout(() => navigate({ to: '/login' }), 800)
    } catch (err) {
      setError((err as Error)?.message ?? 'Registration failed')
    }
  }

  return (
    <div className="form-card">
      <h2>{t('forms.register')}</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder={t('forms.email')} value={values.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder={t('forms.password')} value={values.password} onChange={handleChange} required minLength={6} />
        <button type="submit">{t('forms.register')}</button>
        {error && <p style={{ color: '#ef4444' }}>{error}</p>}
        {success && <p style={{ color: '#16a34a' }}>{success}</p>}
      </form>
    </div>
  )
}

export default Register
