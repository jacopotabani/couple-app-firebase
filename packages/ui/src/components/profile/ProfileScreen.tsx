import React, { useState } from 'react'
import { YStack, ScrollView } from 'tamagui'
import { User } from '@couple-app/database'
import { ProfileView } from './ProfileView'
import { ProfileEditForm } from './ProfileEditForm'
import { DeleteAccountCard } from './DeleteAccountCard'
import { useProfile } from '@couple-app/app'

export interface ProfileScreenProps {
  user: User
  isOwner?: boolean
  onProfileUpdated?: () => void
  onAccountDeleted?: () => void
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  isOwner = false,
  onProfileUpdated,
  onAccountDeleted,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const { updateProfile, error } = useProfile()

  const handleEditPress = () => {
    setIsEditing(true)
  }

  const handleSaveProfile = async (any) => {
    try {
      await updateProfile(data)
      setIsEditing(false)
      onProfileUpdated?.()
    } catch (error) {
      // Error is handled by useProfile hook
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false)
    onAccountDeleted?.()
  }

  if (showDeleteConfirm) {
    return (
      <ScrollView>
        <YStack padding="$lg" space="$lg">
          <DeleteAccountCard
            onConfirm={handleDeleteAccount}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        </YStack>
      </ScrollView>
    )
  }

  if (isEditing) {
    return (
      <ScrollView>
        <YStack padding="$lg" space="$lg">
          <ProfileEditForm
            user={user}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
          />
        </YStack>
      </ScrollView>
    )
  }

  return (
    <ScrollView>
      <YStack padding="$lg" space="$lg">
        <ProfileView
          user={user}
          onEditPress={isOwner ? handleEditPress : undefined}
          isOwner={isOwner}
        />

        {isOwner && (
          <DeleteAccountCard onConfirm={() => setShowDeleteConfirm(true)} />
        )}
      </YStack>
    </ScrollView>
  )
}
