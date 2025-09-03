import { useState } from 'react'
import { Screen, AuthForm } from '@couple-app/ui'
import { StatusBar } from 'expo-status-bar'
import { router } from 'expo-router'

// Mock auth functions for testing
const useAuth = () => ({
  signIn: async (email: string, password: string) => console.log('Sign in:', email),
  signUp: async (email: string, password: string, name: string) => console.log('Sign up:', email),
  loading: false
})

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const { signIn, signUp, loading } = useAuth()

  const handleSubmit = async (data: any) => {
    try {
      if (mode === 'signin') {
        await signIn(data.email, data.password)
      } else {
        await signUp(data.email, data.password, data.displayName)
      }
      router.push('/')
    } catch (error) {
      console.error('Auth error:', error)
    }
  }

  return (
    <Screen centered>
      <AuthForm
        mode={mode}
        onSubmit={handleSubmit}
        onModeChange={setMode}
        isLoading={loading}
      />
      <StatusBar style="auto" />
    </Screen>
  )
}