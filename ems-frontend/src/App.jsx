import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import AppRouter from './routes/AppRouter'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,       // 2 min
      gcTime: 1000 * 60 * 10,          // 10 min
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) return false
        return failureCount < 2
      },
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation error:', error?.response?.data?.message || error.message)
      },
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
