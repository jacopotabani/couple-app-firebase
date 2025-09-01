import React, { useState } from 'react'
import { YStack, Text, XStack } from 'tamagui'
import { Button } from '../Button'
import { Input } from '../Input'
import { Card } from '../Card'
import { useAuth, useErrorHandler } from '@couple-app/app'
// import { useAuth, useErrorHandler } from '@couple-app/app'

export interface LoginFormProps {
  onForgotPassword?: () => void
  onSignUp?: () => void
  onSuccess?: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onForgotPassword,
  onSignUp,
  onSuccess,
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  
  const { signIn, isSigningIn, error } = useAuth()
  const { getErrorMessage, clearError } = useErrorHandler()

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError('Email is required')
      return false
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    setEmailError('')
    return true
  }

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Password is required')
      return false
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return false
    }
    setPasswordError('')
    return true
  }

  const handleSubmit = async () => {
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)

    if (!isEmailValid || !isPasswordValid) {
      return
    }

    try {
      clearError()
      await signIn({ email, password })
      onSuccess?.()
    } catch (err) {
      // Error is handled by useAuth hook
    }
  }

  return (
    <Card variant="elevated">
      <YStack space="$lg">
        <YStack space="$sm" alignItems="center">
          <Text fontSize="$7" fontWeight="bold" color="$textPrimary">
            Welcome Back
          </Text>
          <Text fontSize="$4" color="$textSecondary" textAlign="center">
            Sign in to your account to continue
          </Text>
        </YStack>

        <YStack space="$md">
          <Input
            label="Email"
            type="email"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            placeholder="Enter your email"
            isRequired
            onBlur={() => validateEmail(email)}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
            placeholder="Enter your password"
            isRequired
            onBlur={() => validatePassword(password)}
            onSubmitEditing={handleSubmit}
          />

          {error && (
            <Text fontSize="$3" color="$error" textAlign="center">
              {getErrorMessage(error)}
            </Text>
          )}
        </YStack>

        <YStack space="$md">
          <Button
            variant="primary"
            size="lg"
            onPress={handleSubmit}
            isLoading={isSigningIn}
            loadingText="Signing in..."
            disabled={!email || !password || isSigningIn}
          >
            Sign In
          </Button>

          {onForgotPassword && (
            <Button
              variant="ghost"
              size="sm"
              onPress={onForgotPassword}
            >
              Forgot Password?
            </Button>
          )}
        </YStack>

        {onSignUp && (
          <XStack justifyContent="center" alignItems="center" space="$xs">
            <Text fontSize="$3" color="$textSecondary">
              Don't have an account?
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onPress={onSignUp}
            >
              Sign Up
            </Button>
          </XStack>
        )}
      </YStack>
    </Card>
  )
}
