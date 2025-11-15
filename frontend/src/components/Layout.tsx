import { Outlet } from '@tanstack/react-router'

import Header from './Header'

const Layout = (): JSX.Element => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
  </>
)

export default Layout
