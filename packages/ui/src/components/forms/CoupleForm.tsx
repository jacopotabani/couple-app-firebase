import { useState } from 'react'
import {
  YStack,
  XStack,
  Input,
  TextArea,
  Button,
  Label,
  Select,
  H3,
  Paragraph,
  Adapt,
  Sheet
} from 'tamagui'
import { Platform } from 'react-native'
import { ChevronDown, Check } from '@tamagui/lucide-icons'

interface CoupleFormProps {
  initialData?: {
    name?: string
    description?: string
    anniversary_date?: Date
    privacy_level?: 'public' | 'private' | 'invite_only'
  }
  onSubmit: (data: CoupleFormData) => void
  isLoading?: boolean
  submitText?: string
}

interface CoupleFormData {
  name: string
  description: string
  anniversary_date?: Date
  privacy_level: 'public' | 'private' | 'invite_only'
}

export function CoupleForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitText = 'Create Couple'
}: CoupleFormProps) {
  const [formData, setFormData] = useState<CoupleFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    anniversary_date: initialData?.anniversary_date,
    privacy_level: initialData?.privacy_level || 'private'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Couple name is required'
    } else if (formData.name.length > 255) {
      newErrors.name = 'Name must be less than 255 characters'
    }

    if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters'
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
    <YStack gap="$4" padding="$4">
      <H3>Couple Information</H3>

      {/* Couple Name */}
      <YStack gap="$2">
        <Label htmlFor="name">Couple Name *</Label>
        <Input
          id="name"
          placeholder="Enter couple name"
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          borderColor={errors.name ? '$red8' : '$borderColor'}
          // Platform-specific keyboard handling
          autoCapitalize={Platform.select({ web: undefined, default: 'words' })}
          autoComplete={Platform.select({ web: 'off', default: undefined })}
        />
        {errors.name && (
          <Paragraph size="$2" color="$red10">{errors.name}</Paragraph>
        )}
      </YStack>

      {/* Description */}
      <YStack gap="$2">
        <Label htmlFor="description">Description</Label>
        <TextArea
          id="description"
          placeholder="Tell us about your couple..."
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          borderColor={errors.description ? '$red8' : '$borderColor'}
          minHeight={100}
          // Platform-specific behavior
          numberOfLines={Platform.select({ web: undefined, default: 4 })}
        />
        {errors.description && (
          <Paragraph size="$2" color="$red10">{errors.description}</Paragraph>
        )}
      </YStack>

      {/* Anniversary Date */}
      <YStack gap="$2">
        <Label>Anniversary Date</Label>
        {Platform.select({
          web: (
            <Input
              value={formData.anniversary_date?.toISOString().split('T')[0] || ''}
              onChangeText={(value) => {
                const date = value ? new Date(value) : undefined
                setFormData(prev => ({ ...prev, anniversary_date: date }))
              }}
              {...(Platform.OS === 'web' && { type: 'date' })}
            />
          ),
          default: (
            <Button
              onPress={() => {
                // This would open a native date picker
                console.log('Open date picker')
              }}
              justifyContent="flex-start"
              backgroundColor="$background"
              borderWidth={1}
              borderColor="$borderColor"
            >
              <Paragraph>
                {formData.anniversary_date 
                  ? formData.anniversary_date.toLocaleDateString()
                  : 'Select anniversary date'
                }
              </Paragraph>
            </Button>
          )
        })}
      </YStack>

      {/* Privacy Level */}
      <YStack gap="$2">
        <Label>Privacy Level</Label>
        <Button
          onPress={() => {
            // Cycle through privacy levels for demo
            const levels: Array<'public' | 'private' | 'invite_only'> = ['private', 'invite_only', 'public']
            const currentIndex = levels.indexOf(formData.privacy_level)
            const nextIndex = (currentIndex + 1) % levels.length
            setFormData(prev => ({ ...prev, privacy_level: levels[nextIndex] }))
          }}
          justifyContent="flex-start"
          backgroundColor="$background"
          borderWidth={1}
          borderColor="$borderColor"
        >
          <Paragraph>
            {formData.privacy_level === 'private' && 'Private'}
            {formData.privacy_level === 'invite_only' && 'Invite Only'}
            {formData.privacy_level === 'public' && 'Public'}
          </Paragraph>
        </Button>
      </YStack>

      {/* Submit Button */}
      <Button
        theme="blue"
        size="$4"
        onPress={handleSubmit}
        disabled={isLoading}
        marginTop="$4"
        {...Platform.select({
          web: {
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }
        })}
      >
        {isLoading ? 'Creating...' : submitText}
      </Button>
    </YStack>
  )
}