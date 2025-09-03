'use client'

import { YStack, XStack, H2, Button, Paragraph, Card } from 'tamagui'
import { useRouter } from 'next/navigation'

// Mock hooks for testing
const useAuth = () => ({ user: null, loading: false })
const trpc = {
  health: { useQuery: () => ({ isSuccess: true }) },
  auth: { health: { useQuery: () => ({ isSuccess: true }) } }
}

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const healthQuery = trpc.health.useQuery()
  const authHealthQuery = trpc.auth.health.useQuery()

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Paragraph size="$6">Loading...</Paragraph>
      </YStack>
    )
  }

  if (!user) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <YStack gap="$4" alignItems="center" maxWidth={400}>
          <H2>Welcome to Couple App</H2>
          <Paragraph textAlign="center" theme="alt2">
            Connect with your partner and build beautiful memories together
          </Paragraph>
          
          {/* API Status */}
          <Card padding="$4" width="100%">
            <Paragraph fontWeight="600" marginBottom="$2">API Status</Paragraph>
            <XStack justifyContent="space-between" marginBottom="$2">
              <Paragraph>Main API:</Paragraph>
              <Paragraph color={healthQuery.isSuccess ? '$green10' : '$red10'}>
                {healthQuery.isSuccess ? '✅ Connected' : '❌ Disconnected'}
              </Paragraph>
            </XStack>
            <XStack justifyContent="space-between">
              <Paragraph>Auth API:</Paragraph>
              <Paragraph color={authHealthQuery.isSuccess ? '$green10' : '$red10'}>
                {authHealthQuery.isSuccess ? '✅ Connected' : '❌ Disconnected'}
              </Paragraph>
            </XStack>
          </Card>

          <Button
            size="$4"
            theme="blue"
            onPress={() => router.push('/auth')}
          >
            Get Started
          </Button>
        </YStack>
      </YStack>
    )
  }

  return (
    <YStack flex={1} padding="$4">
      <YStack gap="$4">
        <XStack justifyContent="space-between" alignItems="center">
          <H2>My Couples</H2>
          <Button
            size="$4"
            theme="blue"
            onPress={() => router.push('/couples/create')}
          >
            Create Couple
          </Button>
        </XStack>

        {/* Mock couple data for demo */}
        <Card padding="$4">
          <H2>John & Jane</H2>
          <Paragraph theme="alt2">Together since 2020</Paragraph>
          <Button 
            size="$3" 
            theme="blue" 
            marginTop="$3"
            onPress={() => router.push('/couples/1')}
          >
            View Couple
          </Button>
        </Card>
      </YStack>
    </YStack>
  )
}