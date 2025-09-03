'use client'

import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { config } from '@tamagui/config/v3'
import { NextThemeProvider } from '@tamagui/next-theme'

// Create a proper config with fontLanguages
const tamaguiConfig = createTamagui({
  ...config,
  fontLanguages: [],
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
        {children}
      </TamaguiProvider>
    </NextThemeProvider>
  )
}