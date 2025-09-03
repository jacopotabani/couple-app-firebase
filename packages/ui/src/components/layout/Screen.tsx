import { YStack, ScrollView } from 'tamagui'
import { Platform } from 'react-native'
import { ReactNode } from 'react'

interface ScreenProps {
  children: ReactNode
  scrollable?: boolean
  padding?: boolean
  centered?: boolean
}

export function Screen({ 
  children, 
  scrollable = false, 
  padding = true,
  centered = false 
}: ScreenProps) {
  const containerProps = {
    flex: 1,
    backgroundColor: '$background',
    ...(padding && { padding: '$4' }),
    ...(centered && {
      justifyContent: 'center' as const,
      alignItems: 'center' as const
    }),
    // Web-specific responsive behavior
    ...Platform.select({
      web: {
        maxWidth: 1200,
        marginHorizontal: 'auto',
        width: '100%'
      }
    })
  }

  if (scrollable) {
    return (
      <ScrollView
        flex={1}
        backgroundColor="$background"
        contentContainerStyle={containerProps}
      >
        {children}
      </ScrollView>
    )
  }

  return (
    <YStack {...containerProps}>
      {children}
    </YStack>
  )
}