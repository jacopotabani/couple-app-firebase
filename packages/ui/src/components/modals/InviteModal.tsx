import { useState } from 'react'
import {
  Dialog,
  Sheet,
  YStack,
  XStack,
  Button,
  Input,
  H4,
  Paragraph,
  Separator,
  Adapt
} from 'tamagui'
import { Platform, Share, Clipboard } from 'react-native'
import { Copy, Share as ShareIcon, X } from '@tamagui/lucide-icons'

interface InviteModalProps {
  isOpen: boolean
  onClose: () => void
  coupleCode: string
  coupleName: string
}

export function InviteModal({ isOpen, onClose, coupleCode, coupleName }: InviteModalProps) {
  const [copied, setCopied] = useState(false)

  const inviteMessage = `Join our couple "${coupleName}" with code: ${coupleCode}`

  const handleCopy = async () => {
    if (Platform.OS === 'web') {
      await navigator.clipboard.writeText(coupleCode)
    } else {
      Clipboard.setString(coupleCode)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (Platform.OS !== 'web' && Share.share) {
      try {
        await Share.share({
          message: inviteMessage,
          title: 'Join Our Couple'
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Web fallback - copy to clipboard
      await handleCopy()
    }
  }

  // Use Sheet for all platforms for now to avoid Dialog type issues
  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={onClose}
      dismissOnSnapToBottom
      snapPoints={[50]}
    >
      <Sheet.Frame padding="$4" gap="$4">
        <InviteContent
          coupleCode={coupleCode}
          coupleName={coupleName}
          copied={copied}
          onCopy={handleCopy}
          onShare={handleShare}
          onClose={onClose}
        />
      </Sheet.Frame>
      <Sheet.Overlay />
    </Sheet>
  )
}

// Shared content component
function InviteContent({
  coupleCode,
  coupleName,
  copied,
  onCopy,
  onShare,
  onClose
}: {
  coupleCode: string
  coupleName: string
  copied: boolean
  onCopy: () => void
  onShare: () => void
  onClose: () => void
}) {
  return (
    <YStack gap="$4">
      <XStack justifyContent="space-between" alignItems="center">
        <H4>Invite to {coupleName}</H4>
        <Button
          size="$3"
          circular
          icon={X}
          onPress={onClose}
          chromeless
        />
      </XStack>

      <Separator />

      <YStack gap="$3">
        <Paragraph>Share this code with your partner:</Paragraph>

        <XStack gap="$2" alignItems="center">
          <Input
            flex={1}
            value={coupleCode}
            editable={false}
            textAlign="center"
            fontSize="$6"
            fontWeight="bold"
            backgroundColor="$gray2"
          />
          <Button
            size="$4"
            icon={Copy}
            onPress={onCopy}
            theme={copied ? 'green' : 'blue'}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </XStack>

        {Platform.OS !== 'web' && (
          <Button
            size="$4"
            theme="blue"
            icon={ShareIcon}
            onPress={onShare}
          >
            Share Invitation
          </Button>
        )}

        <Paragraph size="$3" theme="alt2" textAlign="center">
          Your partner can join by entering this code in the app
        </Paragraph>
      </YStack>
    </YStack>
  )
}