// Mock hooks for testing
const useAuth = () => ({ user: null, loading: false })
const trpc = {
  health: { useQuery: () => ({ isSuccess: true }) },
  auth: { health: { useQuery: () => ({ isSuccess: true }) } }
}
import { Screen, YStack, XStack, H2, Button, Paragraph, CoupleCard } from '@couple-app/ui'
import { StatusBar } from 'expo-status-bar'
import { router } from 'expo-router'
import { Plus } from '@tamagui/lucide-icons'

export default function HomePage() {
  const { user, loading } = useAuth()
  const healthQuery = trpc.health.useQuery()
  const authHealthQuery = trpc.auth.health.useQuery()

  if (loading) {
    return (
      <Screen centered>
        <Paragraph size="$6">Loading...</Paragraph>
        <StatusBar style="auto" />
      </Screen>
    )
  }

  if (!user) {
    return (
      <Screen centered>
        <YStack gap="$4" alignItems="center" maxWidth={400}>
          <H2>Welcome to Couple App</H2>
          <Paragraph textAlign="center" theme="alt2">
            Connect with your partner and build beautiful memories together
          </Paragraph>
          
          {/* API Status */}
          <YStack gap="$2" padding="$4" backgroundColor="$gray2" borderRadius="$4" width="100%">
            <Paragraph fontWeight="600">API Status</Paragraph>
            <XStack justifyContent="space-between">
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
          </YStack>

          <Button
            size="$4"
            theme="blue"
            onPress={() => router.push('/auth')}
          >
            Get Started
          </Button>
        </YStack>
        <StatusBar style="auto" />
      </Screen>
    )
  }

  return (
    <Screen scrollable>
      <YStack gap="$4">
        <XStack justifyContent="space-between" alignItems="center">
          <H2>My Couples</H2>
          <Button
            size="$4"
            theme="blue"
            icon={Plus}
            onPress={() => router.push('/couples/create')}
          >
            Create
          </Button>
        </XStack>

        {/* Mock couple data for demo */}
        <YStack gap="$4">
          <CoupleCard
            couple={{
              id: '1',
              name: 'John & Jane',
              description: 'Together since 2020',
              member_count: 2,
              members: [
                { name: 'John', avatar_url: undefined },
                { name: 'Jane', avatar_url: undefined }
              ]
            }}
            onPress={() => router.push('/couples/1')}
          />
        </YStack>
      </YStack>
      <StatusBar style="auto" />
    </Screen>
  )
}