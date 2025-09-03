import { useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Screen, YStack, H2, Button, InviteModal } from '@couple-app/ui'
import { StatusBar } from 'expo-status-bar'
import { UserPlus } from '@tamagui/lucide-icons'

export default function CoupleDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [showInviteModal, setShowInviteModal] = useState(false)

  // Mock couple data
  const couple = {
    id: id,
    name: 'John & Jane',
    couple_code: 'ABC123',
    description: 'Together since 2020'
  }

  return (
    <Screen scrollable>
      <YStack gap="$4">
        <H2>{couple.name}</H2>
        
        <Button
          size="$4"
          theme="blue"
          icon={UserPlus}
          onPress={() => setShowInviteModal(true)}
        >
          Invite Members
        </Button>

        <InviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          coupleCode={couple.couple_code}
          coupleName={couple.name}
        />
      </YStack>
      <StatusBar style="auto" />
    </Screen>
  )
}