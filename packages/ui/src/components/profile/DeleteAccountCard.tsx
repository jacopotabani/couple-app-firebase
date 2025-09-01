import React, { useState } from 'react'
import { YStack, Text, XStack } from 'tamagui'
import { Card } from '../Card'
import { Button } from '../Button'
import { Input } from '../Input'
import { AlertTriangle, Trash2 } from '@tamagui/lucide-icons'
import { useProfile } from '@couple-app/app'

export interface DeleteAccountCardProps {
  onConfirm?: () => void
  onCancel?: () => void
}

export const DeleteAccountCard: React.FC<DeleteAccountCardProps> = ({
  onConfirm,
  onCancel,
}) => {
  const [confirmText, setConfirmText] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  const { isDeletingAccount, deleteAccount, user } = useProfile()

  const handleDeleteRequest = () => {
    setShowConfirmation(true)
  }

  const handleConfirmDelete = async () => {
    if (confirmText !== 'DELETE') {
      return
    }

    try {
      await deleteAccount()
      onConfirm?.()
    } catch (error) {
      // Error is handled by useProfile hook
    }
  }

  const handleCancel = () => {
    setShowConfirmation(false)
    setConfirmText('')
    onCancel?.()
  }

  if (!showConfirmation) {
    return (
      <Card variant="outlined">
        <YStack space="$md">
          <XStack alignItems="center" space="$sm">
            <AlertTriangle size="$5" color="$warning" />
            <Text fontSize="$5" fontWeight="600" color="$textPrimary">
              Danger Zone
            </Text>
          </XStack>

          <YStack space="$sm">
            <Text fontSize="$4" color="$textPrimary" fontWeight="500">
              Delete Account
            </Text>
            <Text fontSize="$3" color="$textSecondary">
              Once you delete your account, there is no going back. This action cannot be undone and will permanently delete all your data including couples, memories, and personal information.
            </Text>
          </YStack>

          <Button
            variant="outline"
            size="md"
            onPress={handleDeleteRequest}
            icon={<Trash2 size="$4" />}
            theme="red"
          >
            Delete My Account
          </Button>
        </YStack>
      </Card>
    )
  }

  return (
    <Card variant="elevated">
      <YStack space="$lg">
        <YStack space="$sm" alignItems="center">
          <AlertTriangle size="$7" color="$error" />
          <Text fontSize="$6" fontWeight="bold" color="$error" textAlign="center">
            Delete Account
          </Text>
          <Text fontSize="$4" color="$textSecondary" textAlign="center">
            This action cannot be undone
          </Text>
        </YStack>

        <YStack space="$sm">
          <Text fontSize="$4" color="$textPrimary">
            Are you absolutely sure you want to delete your account?
          </Text>
          
          <YStack space="$xs">
            <Text fontSize="$3" color="$textSecondary">
              • All your couples and memories will be permanently deleted
            </Text>
            <Text fontSize="$3" color="$textSecondary">
              • You will be removed from all couples you've joined
            </Text>
            <Text fontSize="$3" color="$textSecondary">
              • Your profile and personal data will be erased
            </Text>
            <Text fontSize="$3" color="$textSecondary">
              • This action cannot be reversed
            </Text>
          </YStack>
        </YStack>

        <Input
          label={`Type "DELETE" to confirm`}
          value={confirmText}
          onChangeText={setConfirmText}
          placeholder="DELETE"
          autoCapitalize="characters"
        />

        <YStack space="$sm">
          <Button
            variant="primary"
            size="lg"
            onPress={handleConfirmDelete}
            isLoading={isDeletingAccount}
            loadingText="Deleting account..."
            disabled={confirmText !== 'DELETE' || isDeletingAccount}
            theme="red"
            icon={<Trash2 size="$4" />}
          >
            Delete Account Permanently
          </Button>

          <Button
            variant="outline"
            size="lg"
            onPress={handleCancel}
            disabled={isDeletingAccount}
          >
            Cancel
          </Button>
        </YStack>
      </YStack>
    </Card>
  )
}
