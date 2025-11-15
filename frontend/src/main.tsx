import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'

import { router, queryClient } from './router'
import { AuthProvider } from './contexts/AuthContext'
import './i18n'
import './index.css'

export const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
)

if (typeof document !== 'undefined') {
  const container = document.getElementById('root')
  if (container) {
    const root = ReactDOM.createRoot(container)
    root.render(<App />)
  }
}
