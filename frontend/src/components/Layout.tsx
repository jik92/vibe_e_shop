import { Outlet } from '@tanstack/react-router'

import Header from './Header'

const Layout = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#2A2A2A]">
      <Header />
      <main className="mx-auto w-full max-w-[1440px] px-4 py-12 lg:px-12">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
