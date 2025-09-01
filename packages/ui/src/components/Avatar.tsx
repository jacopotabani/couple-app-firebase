import React from 'react'
import { Circle, Image, Text, YStack } from 'tamagui'
import { User } from '@tamagui/lucide-icons'

export interface AvatarProps {
  src?: string | null
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  onPress?: () => void
  showUploadIndicator?: boolean
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = '',
  size = 'md',
  onPress,
  showUploadIndicator = false,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { size: 32, fontSize: 14 }
      case 'lg':
        return { size: 64, fontSize: 24 }
      case 'xl':
        return { size: 96, fontSize: 32 }
      default: // md
        return { size: 48, fontSize: 18 }
    }
  }

  const { size: avatarSize, fontSize } = getSizeStyles()

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <YStack position="relative">
      <Circle
        size={avatarSize}
        backgroundColor={src ? 'transparent' : '$primary'}
        pressStyle={onPress ? { opacity: 0.8 } : undefined}
        onPress={onPress}
        overflow="hidden"
      >
        {src ? (
          <Image
            source={{ uri: src }}
            width={avatarSize}
            height={avatarSize}
            borderRadius={avatarSize / 2}
          />
        ) : name ? (
          <Text
            color="white"
            fontSize={fontSize}
            fontWeight="600"
            textAlign="center"
          >
            {getInitials(name)}
          </Text>
        ) : (
          <User size={avatarSize * 0.5} color="white" />
        )}
      </Circle>
      
      {showUploadIndicator && (
        <Circle
          position="absolute"
          bottom={0}
          right={0}
          size={avatarSize * 0.3}
          backgroundColor="$primary"
          borderColor="$background"
          borderWidth={2}
        >
          <Text color="white" fontSize={avatarSize * 0.15}>+</Text>
        </Circle>
      )}
    </YStack>
  )
}
