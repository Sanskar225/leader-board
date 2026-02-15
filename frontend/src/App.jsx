import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@store/auth.store'
import IntroSequence from '@animations/intro/IntroSequence'
import CursorFollower from '@animations/cursor/CursorFollower'
import AppRouter from './router'
import websocket from '@services/websocket.service'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
})

function App() {
  const { token, isAuthenticated } = useAuthStore()
  const [introComplete, setIntroComplete] = useState(false)

  useEffect(() => {
    if (token) {
      websocket.connect(token)
    }
    return () => websocket.disconnect()
  }, [token])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          {!introComplete && (
            <IntroSequence key="intro" onComplete={() => setIntroComplete(true)} />
          )}
        </AnimatePresence>

        {introComplete && (
          <>
            <CursorFollower />
            <AppRouter />
          </>
        )}

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
            },
          }}
        />
        
        {import.meta.env.DEV && <ReactQueryDevtools />}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App