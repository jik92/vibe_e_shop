import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { InfinityIcon } from 'lucide-react'

import { useAuth } from '../contexts/AuthContext'
import { useCartQuery } from '../hooks/useCartQuery'
import { Button } from './ui/button'
import LanguageSwitcher from './LanguageSwitcher'
import { cn } from '../lib/utils'

const Header = (): JSX.Element => {
  const { t } = useTranslation()
  const { user, logout, isAuthenticated } = useAuth()
  const { data: cart } = useCartQuery({ initialData: { items: [], total_price: 0 } })

  const cartCount = useMemo(() => cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0, [cart])

  const navItems = [
    { to: '/', label: t('nav.home') },
    { to: '/cart', label: t('nav.cart'), badge: cartCount },
    { to: '/orders', label: t('nav.orders') },
    { to: '/onboarding', label: t('nav.onboarding') }
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-[#E3DCCF] bg-[#F7F4EF]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1440px] items-center gap-4 px-4 py-4 lg:px-12">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7B6FF5] text-white">
            <InfinityIcon className="h-6 w-6" />
          </div>
          <div className="hidden sm:block">
            <p className="text-lg font-semibold tracking-tight text-[#2A2A2A]">PulseCart</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#7B6FF5]">AI Commerce</p>
          </div>
        </Link>
        <nav className="flex flex-1 items-center justify-center gap-1 rounded-full border border-[#E3DCCF] bg-white/80 px-2 py-1 text-sm text-[#2A2A2A]">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <Button className="rounded-full bg-[#7B6FF5] px-5 text-white transition hover:bg-[#A69CFF]" onClick={logout} size="sm">
              {user?.email}
            </Button>
          ) : (
            <Link to="/login" className="inline-flex">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-[#2A2A2A]/15 bg-white px-5 text-[#2A2A2A] hover:bg-[#FBFAF7]"
              >
                {t('nav.login')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

interface NavItemProps {
  to: string
  label: string
  badge?: number
}

const NavItem = ({ to, label, badge }: NavItemProps) => (
  <Link
    to={to}
    className={({ isActive }) =>
      cn(
        'inline-flex items-center gap-2 rounded-full px-4 py-2 transition hover:text-[#7B6FF5]',
        isActive ? 'bg-[#7B6FF5] text-black shadow-sm' : 'text-[#2A2A2A]'
      )
    }
  >
    <span>{label}</span>
    {badge ? <span className="rounded-full bg-[#F0EAFD] px-2 text-xs font-semibold text-[#7B6FF5]">{badge}</span> : null}
  </Link>
)

export default Header
