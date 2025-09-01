import React from 'react'
import { YStack, XStack, Text, Separator } from 'tamagui'
import { User } from '@couple-app/database'
import { Card } from '../Card'
import { Avatar } from '../Avatar'
import { Button } from '../Button'
import { Edit, Mail, Calendar } from '@tamagui/lucide-icons'

export interface ProfileViewProps {
  user: User
  onEditPress?: () => void
  onAvatarPress?: () => void
  isOwner?: boolean
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onEditPress,
  onAvatarPress,
  isOwner = false,
}) => {
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  return (
    <Card variant="elevated">
      <YStack space="$lg">
        {/* Avatar and basic info */}
        <YStack space="$md" alignItems="center">
          <Avatar
            src={user.avatar_url}
            name={user.name}
            size="xl"
            onPress={isOwner ? onAvatarPress : undefined}
            showUploadIndicator={isOwner}
          />
          
          <YStack space="$xs" alignItems="center">
            <Text fontSize="$7" fontWeight="bold" color="$textPrimary">
              {user.name}
            </Text>
            
            <XStack alignItems="center" space="$xs">
              <Mail size="$4" color="$textSecondary" />
              <Text fontSize="$4" color="$textSecondary">
                {user.email}
              </Text>
            </XStack>
          </YStack>
        </YStack>

        <Separator />

        {/* Additional info */}
        <YStack space="$md">
          <XStack alignItems="center" space="$sm">
            <Calendar size="$4" color="$textSecondary" />
            <YStack flex={1}>
              <Text fontSize="$3" color="$textSecondary" fontWeight="500">
                Member since
              </Text>
              <Text fontSize="$4" color="$textPrimary">
                {formatDate(user.created_at)}
              </Text>
            </YStack>
          </XStack>
        </YStack>

        {/* Edit button for owner */}
        {isOwner && onEditPress && (
          <>
            <Separator />
            <Button
              variant="outline"
              size="lg"
              onPress={onEditPress}
              icon={<Edit size="$4" />}
            >
              Edit Profile
            </Button>
          </>
        )}
      </YStack>
    </Card>
  )
}
