import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '../contexts/AuthContext'
import { useCartQuery } from '../hooks/useCartQuery'
import LanguageSwitcher from './LanguageSwitcher'

const Header = (): JSX.Element => {
  const { t } = useTranslation()
  const { user, logout, isAuthenticated } = useAuth()
  const { data: cart } = useCartQuery({
    initialData: { items: [], total_price: 0 }
  })

  const cartCount = useMemo(() => cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0, [cart])

  return (
    <header>
      <nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/">{t('nav.home')}</Link>
          <Link to="/cart">
            {t('nav.cart')} ({cartCount})
          </Link>
          <Link to="/orders">{t('nav.orders')}</Link>
          <Link to="/onboarding">{t('nav.onboarding')}</Link>
        </div>
        <div className="actions">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <button onClick={logout} style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
              {t('nav.logout')} {user?.email}
            </button>
          ) : (
            <>
              <Link to="/login">{t('nav.login')}</Link>
              <Link to="/register">{t('nav.register')}</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
