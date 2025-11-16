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

const Header = (): JSX.Element => {
  const { t } = useTranslation()
  const { user, logout, isAuthenticated } = useAuth()
  const { data: cart } = useCartQuery({ initialData: { items: [], total_price: 0 } })

  const cartCount = useMemo(() => cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0, [cart])

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
    <header className="sticky top-0 z-40 border-b border-[#E3DCCF]/30 bg-[#F7F4EF]/30 backdrop-blur-xl">
      <div className="mx-auto grid w-full gap-2 px-4 py-3 text-[#2A2A2A] lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:px-10">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-white shadow-inner">
            <InfinityIcon className="h-6 w-6" />
          </div>
          <div className="hidden sm:block">
            <p className="text-lg font-semibold tracking-tight">PulseCart</p>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#111111]">AI Commerce</p>
          </div>
        </Link>

        <NavigationMenu className="justify-center ml-3">
          <NavigationMenuList className="items-center gap-1 rounded-full bg-white/70 px-2 py-1 text-sm shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
            {[
              { label: t('nav.home'), to: '/' },
              { label: t('nav.products'), to: '/products' },
              { label: 'Collection', to: '/collections/birthday-card' },
              { label: t('nav.onboarding'), to: '/onboarding' }
            ].map((item) => (
              <NavigationMenuItem key={item.to}>
                <NavigationMenuLink asChild>
                  <Link to={item.to} className="inline-flex items-center rounded-full px-3 py-2 text-[#2A2A2A] transition hover:bg-[#F0F0F0]">
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center justify-end gap-2">
          <LanguageSwitcher />
          <Link to="/checkout" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm" className="relative rounded-full px-3 text-[#2A2A2A]">
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 rounded-full bg-[#111111] px-2 py-[2px] text-xs font-semibold text-white">
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
                      <span className="rounded-full bg-[#F2F2F2] px-2 text-xs font-semibold text-[#111111]">{cartCount}</span>
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

export default Header
