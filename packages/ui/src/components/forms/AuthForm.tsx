import { useState } from 'react'
import {
  YStack,
  XStack,
  Input,
  Button,
  Label,
  H3,
  Paragraph,
  Separator
} from 'tamagui'
import { Platform } from 'react-native'
import { Eye, EyeOff, Mail, Lock } from '@tamagui/lucide-icons'

interface AuthFormProps {
  mode: 'signin' | 'signup'
  onSubmit: (data: AuthFormData) => void
  onModeChange: (mode: 'signin' | 'signup') => void
  isLoading?: boolean
}

interface AuthFormData {
  email: string
  password: string
  confirmPassword?: string
  displayName?: string
}

export function AuthForm({ mode, onSubmit, onModeChange, isLoading = false }: AuthFormProps) {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    // Sign up specific validations
    if (mode === 'signup') {
      if (!formData.displayName?.trim()) {
        newErrors.displayName = 'Display name is required'
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <YStack gap="$4" padding="$4" maxWidth={400} width="100%">
      <YStack gap="$2" alignItems="center">
        <H3>{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</H3>
        <Paragraph theme="alt2" textAlign="center">
          {mode === 'signin' 
            ? 'Sign in to your couple account'
            : 'Join the couple community'
          }
        </Paragraph>
      </YStack>

      <YStack gap="$3">
        {/* Display Name (Sign Up Only) */}
        {mode === 'signup' && (
          <YStack gap="$2">
            <Label htmlFor="displayName">Display Name *</Label>
            <Input
              id="displayName"
              placeholder="Enter your display name"
              value={formData.displayName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, displayName: text }))}
              borderColor={errors.displayName ? '$red8' : '$borderColor'}
              autoCapitalize={Platform.select({ web: undefined, default: 'words' })}
            />
            {errors.displayName && (
              <Paragraph size="$2" color="$red10">{errors.displayName}</Paragraph>
            )}
          </YStack>
        )}

        {/* Email */}
        <YStack gap="$2">
          <Label htmlFor="email">Email *</Label>
          <XStack alignItems="center" gap="$2">
            <Mail size={20} color="$gray10" />
            <Input
              flex={1}
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              borderColor={errors.email ? '$red8' : '$borderColor'}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete={Platform.select({ web: 'email', default: undefined })}
            />
          </XStack>
          {errors.email && (
            <Paragraph size="$2" color="$red10">{errors.email}</Paragraph>
          )}
        </YStack>

        {/* Password */}
        <YStack gap="$2">
          <Label htmlFor="password">Password *</Label>
          <XStack alignItems="center" gap="$2">
            <Lock size={20} color="$gray10" />
            <Input
              flex={1}
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
              borderColor={errors.password ? '$red8' : '$borderColor'}
              secureTextEntry={!showPassword}
              autoComplete={Platform.select({ web: 'current-password', default: undefined })}
            />
            <Button
              size="$3"
              circular
              chromeless
              icon={showPassword ? EyeOff : Eye}
              onPress={() => setShowPassword(!showPassword)}
            />
          </XStack>
          {errors.password && (
            <Paragraph size="$2" color="$red10">{errors.password}</Paragraph>
          )}
        </YStack>

        {/* Confirm Password (Sign Up Only) */}
        {mode === 'signup' && (
          <YStack gap="$2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <XStack alignItems="center" gap="$2">
              <Lock size={20} color="$gray10" />
              <Input
                flex={1}
                id="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                borderColor={errors.confirmPassword ? '$red8' : '$borderColor'}
                secureTextEntry={!showConfirmPassword}
                autoComplete={Platform.select({ web: 'new-password', default: undefined })}
              />
              <Button
                size="$3"
                circular
                chromeless
                icon={showConfirmPassword ? EyeOff : Eye}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </XStack>
            {errors.confirmPassword && (
              <Paragraph size="$2" color="$red10">{errors.confirmPassword}</Paragraph>
            )}
          </YStack>
        )}
      </YStack>

      {/* Submit Button */}
      <Button
        theme="blue"
        size="$4"
        onPress={handleSubmit}
        disabled={isLoading}
        marginTop="$2"
        {...Platform.select({
          web: {
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }
        })}
      >
        {isLoading 
          ? (mode === 'signin' ? 'Signing In...' : 'Creating Account...')
          : (mode === 'signin' ? 'Sign In' : 'Create Account')
        }
      </Button>

      <Separator />

      {/* Mode Switch */}
      <XStack justifyContent="center" alignItems="center" gap="$2">
        <Paragraph size="$3" theme="alt2">
          {mode === 'signin' 
            ? "Don't have an account?"
            : "Already have an account?"
          }
        </Paragraph>
        <Button
          size="$3"
          chromeless
          onPress={() => onModeChange(mode === 'signin' ? 'signup' : 'signin')}
        >
          {mode === 'signin' ? 'Sign Up' : 'Sign In'}
        </Button>
      </XStack>
    </YStack>
  )
}