import React, { useState } from 'react'
import { YStack, Text, XStack } from 'tamagui'
import { Button } from '../Button'
import { Input } from '../Input'
import { Card } from '../Card'
import { useAuth, useErrorHandler } from '@couple-app/app'

export interface SignUpFormProps {
  onSignIn?: () => void
  onSuccess?: () => void
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  onSignIn,
  onSuccess,
}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  
  const { signUp, isSigningUp, error } = useAuth()
  const { getErrorMessage, clearError } = useErrorHandler()

  const validateName = (name: string): boolean => {
    if (!name.trim()) {
      setNameError('Name is required')
      return false
    }
    if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters')
      return false
    }
    setNameError('')
    return true
  }

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
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, and one number')
      return false
    }
    setPasswordError('')
    return true
  }

  const validateConfirmPassword = (confirmPassword: string): boolean => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password')
      return false
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match')
      return false
    }
    setConfirmPasswordError('')
    return true
  }

  const handleSubmit = async () => {
    const isNameValid = validateName(name)
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword)

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return
    }

    try {
      clearError()
      await signUp({
        email,
        password,
        displayName: name.trim(),
      })
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
            Create Account
          </Text>
          <Text fontSize="$4" color="$textSecondary" textAlign="center">
            Join us and start managing your couple journey
          </Text>
        </YStack>

        <YStack space="$md">
          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            error={nameError}
            placeholder="Enter your full name"
            isRequired
            onBlur={() => validateName(name)}
          />

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
            placeholder="Create a password"
            isRequired
            helperText="Must contain at least 6 characters with uppercase, lowercase, and number"
            onBlur={() => validatePassword(password)}
          />

          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={confirmPasswordError}
            placeholder="Confirm your password"
            isRequired
            onBlur={() => validateConfirmPassword(confirmPassword)}
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
            isLoading={isSigningUp}
            loadingText="Creating account..."
            disabled={!name || !email || !password || !confirmPassword || isSigningUp}
          >
            Create Account
          </Button>
        </YStack>

        {onSignIn && (
          <XStack justifyContent="center" alignItems="center" space="$xs">
            <Text fontSize="$3" color="$textSecondary">
              Already have an account?
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onPress={onSignIn}
            >
              Sign In
            </Button>
          </XStack>
        )}
      </YStack>
    </Card>
  )
}
