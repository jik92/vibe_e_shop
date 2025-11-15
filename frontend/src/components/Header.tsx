import { Link } from '@tanstack/react-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, InfinityIcon, Sparkles, ShoppingCart } from 'lucide-react'

import { useAuth } from '../contexts/AuthContext'
import { useCartQuery } from '../hooks/useCartQuery'
import { Button } from './ui/button'
import LanguageSwitcher from './LanguageSwitcher'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from './ui/navigation-menu'
import { cn } from '../lib/utils'

const Header = (): JSX.Element => {
  const { t } = useTranslation()
  const { user, logout, isAuthenticated } = useAuth()
  const { data: cart } = useCartQuery({ initialData: { items: [], total_price: 0 } })

  const cartCount = useMemo(() => cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0, [cart])

  const dropdownItems = [
    {
      label: t('nav.home'),
      description: t('home.subtitle'),
      to: '/'
    },
    {
      label: t('nav.onboarding'),
      description: t('onboarding.body'),
      to: '/onboarding'
    }
  ]

  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-[#E3DCCF] bg-[#F7F4EF]/95 backdrop-blur">
      <div className="mx-auto grid w-full gap-4 px-4 py-4 text-[#2A2A2A] lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:px-12">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7B6FF5] text-white shadow-inner">
            <InfinityIcon className="h-6 w-6" />
          </div>
          <div className="hidden sm:block">
            <p className="text-lg font-semibold tracking-tight">PulseCart</p>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#7B6FF5]">AI Commerce</p>
          </div>
        </Link>

        <NavigationMenu className="justify-center">
          <NavigationMenuList className="rounded-full border border-[#E3DCCF] bg-white/80 px-2 py-1 shadow-[0_10px_40px_rgba(122,111,245,0.12)]">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="rounded-full px-5 text-[#2A2A2A]">Product</NavigationMenuTrigger>
              <NavigationMenuContent className="mt-4 rounded-3xl border border-[#E3DCCF] bg-white p-6 shadow-2xl">
                <ul className="grid gap-4 lg:w-[420px]">
                  {dropdownItems.map((item) => (
                    <li key={item.label}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={item.to}
                          className="block rounded-2xl border border-transparent p-4 transition hover:border-[#E3DCCF] hover:bg-[#FBFAF7]"
                        >
                          <p className="text-sm font-semibold text-[#2A2A2A]">{item.label}</p>
                          <p className="text-xs text-[#4F4B45]">{item.description}</p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuIndicator />
        </NavigationMenu>

        <div className="flex items-center justify-end gap-2">
          <LanguageSwitcher />
          <Link to="/checkout" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm" className="relative rounded-full px-4 text-[#2A2A2A]">
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 rounded-full bg-[#7B6FF5] px-2 py-[2px] text-xs font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <Button size="sm" variant="ghost" className="gap-2 rounded-full px-5 text-[#2A2A2A]" onClick={() => setUserMenuOpen((prev) => !prev)}>
                <span className="truncate">{user?.email}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-[#E3DCCF] bg-white/95 text-sm shadow-xl">
                  <Link
                    to="/cart"
                    className="flex items-center justify-between rounded-t-2xl px-4 py-3 text-[#2A2A2A] transition hover:bg-[#FBFAF7]"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <span>{t('nav.cart')}</span>
                    {cartCount > 0 && (
                      <span className="rounded-full bg-[#F0EAFD] px-2 text-xs font-semibold text-[#7B6FF5]">{cartCount}</span>
                    )}
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center justify-between px-4 py-3 text-[#2A2A2A] transition hover:bg-[#FBFAF7]"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <span>{t('nav.orders')}</span>
                  </Link>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false)
                      logout()
                    }}
                    className="flex w-full items-center justify-between rounded-b-2xl px-4 py-3 text-left text-[#D92D20] transition hover:bg-[#FDECEC]"
                  >
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="inline-flex">
              <Button size="sm" variant="ghost" className="rounded-full px-5 text-[#2A2A2A]">
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
  helper?: string
  badge?: number
}

const NavItem = ({ to, label, helper, badge }: NavItemProps) => (
  <Link
    to={to}
    className={({ isActive }) =>
      cn(
        'group relative inline-flex min-w-[120px] flex-1 items-center gap-2 rounded-full px-4 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B6FF5]',
        isActive ? 'bg-[#7B6FF5] text-white shadow-lg' : 'text-[#2A2A2A]'
      )
    }
  >
    <span className="flex flex-1 flex-col leading-tight">
      <span className="text-sm font-semibold">{label}</span>
      {helper ? <span className="text-[11px] text-[#7B6FF5] group-hover:text-[#4F4B45]">{helper}</span> : null}
    </span>
    {badge ? (
      <span className="rounded-full bg-[#F0EAFD] px-2 text-xs font-semibold text-[#7B6FF5]">{badge}</span>
    ) : null}
  </Link>
)

export default Header
