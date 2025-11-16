import {Outlet, useLocation} from '@tanstack/react-router'

import Header from './Header'
import Footer from './Footer'


const Layout = (): JSX.Element => {
    const location = useLocation()
    const isHomePage = location.pathname === '/'

    return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#2A2A2A]">
      <Header />
      <main className={`w-full pt-0 pb-12`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
