import { Stack } from 'expo-router'
import { TamaguiProvider, tamaguiConfig } from '@couple-app/ui'
import { useFonts } from 'expo-font'

// Mock AuthProvider for testing
const AuthProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  if (!loaded) {
    return null
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <AuthProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Couple App' }} />
          <Stack.Screen name="auth" options={{ title: 'Authentication' }} />
          <Stack.Screen name="couples" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </TamaguiProvider>
  )
}