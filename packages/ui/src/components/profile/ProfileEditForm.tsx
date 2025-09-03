import React, { useState, useEffect } from 'react'
import { YStack, Text } from 'tamagui'
import { User, UpdateUserInput } from '@couple-app/database'
import { Card } from '../Card'
import { Button } from '../Button'
import { Input } from '../Input'
import { Avatar } from '../Avatar'
import { useProfile } from '@couple-app/app'

export interface ProfileEditFormProps {
  user: User
  onSave?: (data: UpdateUserInput) => void
  onCancel?: () => void
  onAvatarChange?: (file: File | Blob) => void
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  user,
  onSave,
  onCancel,
  onAvatarChange,
}) => {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  
  const { isUpdating, isUploadingAvatar, error } = useProfile()

  useEffect(() => {
    setName(user.name)
    setEmail(user.email)
  }, [user])

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

  const handleSave = () => {
    const isNameValid = validateName(name)
    const isEmailValid = validateEmail(email)

    if (!isNameValid || !isEmailValid) {
      return
    }

    const updatedData: UpdateUserInput = {}
    
    if (name.trim() !== user.name) {
      updatedData.name = name.trim()
    }
    
    if (email !== user.email) {
      updatedData.email = email
    }

    if (Object.keys(updatedData).length > 0) {
      onSave?.(updatedData)
    } else {
      onCancel?.()
    }
  }

  const hasChanges = 
    name.trim() !== user.name || 
    email !== user.email

  return (
    <Card variant="elevated">
      <YStack space="$lg">
        <YStack space="$sm" alignItems="center">
          <Text fontSize="$6" fontWeight="bold" color="$textPrimary">
            Edit Profile
          </Text>
          <Text fontSize="$4" color="$textSecondary">
            Update your personal information
          </Text>
        </YStack>

        {/* Avatar section */}
        <YStack space="$md" alignItems="center">
          <Avatar
            src={user.avatar_url}
            name={name}
            size="lg"
            onPress={() => {
              // This would typically open an image picker
              console.log('Avatar press - open image picker')
            }}
            showUploadIndicator
          />
          
          {isUploadingAvatar && (
            <Text fontSize="$3" color="$textSecondary">
              Uploading avatar...
            </Text>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onPress={() => {
              // This would open image picker
              console.log('Change avatar pressed')
            }}
            disabled={isUploadingAvatar}
          >
            Change Avatar
          </Button>
        </YStack>

        {/* Form fields */}
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
            helperText="Note: Changing email will require re-verification"
          />

          {error && (
            <Text fontSize="$3" color="$error" textAlign="center">
              {error.message}
            </Text>
          )}
        </YStack>

        {/* Action buttons */}
        <YStack space="$sm">
          <Button
            variant="primary"
            size="lg"
            onPress={handleSave}
            isLoading={isUpdating}
            loadingText="Saving..."
            disabled={!hasChanges || isUpdating || isUploadingAvatar}
          >
            Save Changes
          </Button>

          <Button
            variant="outline"
            size="lg"
            onPress={onCancel}
            disabled={isUpdating || isUploadingAvatar}
          >
            Cancel
          </Button>
        </YStack>
      </YStack>
    </Card>
  )
}
