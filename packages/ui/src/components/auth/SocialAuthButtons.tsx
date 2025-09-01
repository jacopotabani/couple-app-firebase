import React from 'react'
import { YStack, XStack, Text } from 'tamagui'
import { Button } from '../Button'
import { useAuth, useErrorHandler } from '@couple-app/app'

// These icons would typically come from a react-native-vector-icons or similar
const GoogleIcon = () => <Text>G</Text> // Placeholder
const AppleIcon = () => <Text>🍎</Text> // Placeholder

export interface SocialAuthButtonsProps {
  onSuccess?: () => void
  showApple?: boolean
  showGoogle?: boolean
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  onSuccess,
  showApple = true,
  showGoogle = true,
}) => {
  const { signInWithGoogle, signInWithApple, isSigningIn } = useAuth()
  const { getErrorMessage } = useErrorHandler()

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      onSuccess?.()
    } catch (error) {
      // Error is handled by useAuth hook
    }
  }

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple()
      onSuccess?.()
    } catch (error) {
      // Error is handled by useAuth hook
    }
  }

  if (!showGoogle && !showApple) {
    return null
  }

  return (
    <YStack space="$md">
      <XStack alignItems="center" space="$sm">
        <YStack flex={1} height={1} backgroundColor="$border" />
        <Text fontSize="$3" color="$textSecondary">
          or continue with
        </Text>
        <YStack flex={1} height={1} backgroundColor="$border" />
      </XStack>

      <YStack space="$sm">
        {showGoogle && (
          <Button
            variant="outline"
            size="lg"
            onPress={handleGoogleSignIn}
            disabled={isSigningIn}
            icon={<GoogleIcon />}
          >
            Continue with Google
          </Button>
        )}

        {showApple && (
          <Button
            variant="outline"
            size="lg"
            onPress={handleAppleSignIn}
            disabled={isSigningIn}
            icon={<AppleIcon />}
          >
            Continue with Apple
          </Button>
        )}
      </YStack>
    </YStack>
  )
}
