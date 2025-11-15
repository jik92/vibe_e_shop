import { Outlet } from '@tanstack/react-router'

import Header from './Header'
import Footer from './Footer'

const Layout = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#2A2A2A]">
      <Header />
      <main className="w-full px-0 pt-0 pb-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
