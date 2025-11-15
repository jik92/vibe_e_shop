import { Outlet } from '@tanstack/react-router'

import Header from './Header'

const Layout = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 pb-28 text-white">
        <div className="absolute inset-0 opacity-60 blur-3xl" style={{ background: 'radial-gradient(circle at 20% 20%, rgba(59,130,246,.35), transparent 50%)' }} />
        <div className="relative z-10">
          <Header />
        </div>
      </div>
      <main className="container relative z-20 -mt-20 px-4 pb-16 lg:px-6">
        <div className="rounded-[32px] border bg-background/95 p-6 shadow-[0_30px_120px_rgba(15,23,42,0.35)] backdrop-blur md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout
