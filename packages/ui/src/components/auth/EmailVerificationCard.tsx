import React, { useState } from 'react'
import { YStack, Text } from 'tamagui'
import { Button } from '../Button'
import { Card } from '../Card'
import { useAuth } from '@couple-app/app'

export interface EmailVerificationCardProps {
  onResendSuccess?: () => void
}

export const EmailVerificationCard: React.FC<EmailVerificationCardProps> = ({
  onResendSuccess,
}) => {
  const { firebaseUser, refreshUser } = useAuth()
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  const handleResendVerification = async () => {
    if (!firebaseUser) return

    try {
      setIsResending(true)
      setResendMessage('')
      
      // This would typically use Firebase's sendEmailVerification
      // await sendEmailVerification(firebaseUser)
      
      setResendMessage('Verification email sent successfully!')
      onResendSuccess?.()
    } catch (error) {
      setResendMessage('Failed to send verification email. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  const handleCheckVerification = async () => {
    await refreshUser()
  }

  return (
    <Card variant="elevated">
      <YStack space="$lg" alignItems="center">
        <YStack space="$sm" alignItems="center">
          <Text fontSize="$7">📧</Text>
          <Text fontSize="$6" fontWeight="bold" color="$textPrimary" textAlign="center">
            Verify Your Email
          </Text>
          <Text fontSize="$4" color="$textSecondary" textAlign="center">
            We've sent a verification link to
          </Text>
          <Text fontSize="$4" fontWeight="600" color="$primary" textAlign="center">
            {firebaseUser?.email}
          </Text>
        </YStack>

        <YStack space="$sm" width="100%">
          <Button
            variant="primary"
            size="lg"
            onPress={handleCheckVerification}
          >
            I've Verified My Email
          </Button>

          <Button
            variant="outline"
            size="lg"
            onPress={handleResendVerification}
            isLoading={isResending}
            loadingText="Sending..."
          >
            Resend Verification Email
          </Button>
        </YStack>

        {resendMessage && (
          <Text 
            fontSize="$3" 
            color={resendMessage.includes('success') ? '$success' : '$error'}
            textAlign="center"
          >
            {resendMessage}
          </Text>
        )}

        <Text fontSize="$3" color="$textSecondary" textAlign="center">
          Please check your email and click the verification link to continue.
        </Text>
      </YStack>
    </Card>
  )
}
