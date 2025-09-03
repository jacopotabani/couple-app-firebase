'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Screen, YStack, H2, Button, InviteModal } from '@couple-app/ui'
import { UserPlus } from '@tamagui/lucide-icons'

export default function CoupleDetailPage() {
  const params = useParams()
  const coupleId = params.id as string
  const [showInviteModal, setShowInviteModal] = useState(false)

  // Mock couple data
  const couple = {
    id: coupleId,
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
    </Screen>
  )
}