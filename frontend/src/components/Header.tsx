import { Link } from '@tanstack/react-router'
import { useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { LogOut, Package, ShoppingBag, ShoppingCart, Sparkles, UserPlus } from 'lucide-react'

import { useAuth } from '../contexts/AuthContext'
import { useCartQuery } from '../hooks/useCartQuery'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import LanguageSwitcher from './LanguageSwitcher'
import { cn } from '../lib/utils'

const Header = (): JSX.Element => {
  const { t } = useTranslation()
  const { user, logout, isAuthenticated } = useAuth()
  const { data: cart } = useCartQuery({
    initialData: { items: [], total_price: 0 }
  })

  const cartCount = useMemo(() => cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0, [cart])

  return (
    <header className="container px-4 py-6 text-white lg:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Link to="/" className="inline-flex items-center gap-3 text-lg font-semibold tracking-tight text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <p>PulseCart</p>
            <p className="text-sm text-white/70">{t('home.subtitle')}</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <Button
              variant="secondary"
              className="bg-white/10 text-white hover:bg-white/20"
              size="sm"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {user?.email}
            </Button>
          ) : (
            <>
              <Link to="/login" className="inline-flex">
                <Button variant="secondary" size="sm" className="bg-white/10 text-white hover:bg-white/20">
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t('nav.login')}
                </Button>
              </Link>
              <Link to="/register" className="inline-flex">
                <Button variant="secondary" size="sm" className="bg-white text-slate-900 hover:bg-slate-100">
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t('nav.register')}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
      <nav className="mt-6 flex flex-wrap items-center gap-2 text-sm font-medium">
        <NavLink to="/" label={t('nav.home')} />
        <NavLink
          to="/cart"
          label={
            <span className="inline-flex items-center gap-2">
              {t('nav.cart')}
              {cartCount > 0 && (
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {cartCount}
                </Badge>
              )}
            </span>
          }
          icon={<ShoppingCart className="h-4 w-4" />}
        />
        <NavLink to="/orders" label={t('nav.orders')} icon={<Package className="h-4 w-4" />} />
        <NavLink to="/onboarding" label={t('nav.onboarding')} />
        <NavLink to="/checkout" label={t('nav.checkout')} />
      </nav>
    </header>
  )
}

type NavLinkProps = {
  to: string
  label: ReactNode
  icon?: ReactNode
}

const NavLink = ({ to, label, icon }: NavLinkProps) => (
  <Link
    to={to}
    className={({ isActive }) =>
      cn(
        'inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-white/80 transition hover:bg-white/20 hover:text-white',
        isActive && 'bg-white/25 text-white shadow-lg'
      )
    }
  >
    {icon}
    <span>{label}</span>
  </Link>
)

export default Header
