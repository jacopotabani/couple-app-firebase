import { Card, XStack, YStack, H4, Paragraph, Avatar, Button } from 'tamagui'
import { Platform } from 'react-native'
import { Eye } from '@tamagui/lucide-icons'

interface CoupleCardProps {
  couple: {
    id: string
    name: string
    description?: string
    member_count: number
    avatar_url?: string
    members: Array<{ avatar_url?: string; name: string }>
  }
  onPress: () => void
}

export function CoupleCard({ couple, onPress }: CoupleCardProps) {
  return (
    <Card
      elevate
      size="$4"
      bordered
      animation="bouncy"
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
      onPress={onPress}
      // Responsive width - works on web and mobile
      width={Platform.OS === 'web' ? 350 : '100%'}
      maxWidth={400}
      cursor={Platform.OS === 'web' ? 'pointer' : undefined}
    >
      <Card.Header padded>
        <XStack gap="$4" alignItems="center">
          <Avatar circular size="$6">
            <Avatar.Image src={couple.avatar_url} />
            <Avatar.Fallback backgroundColor="$blue10" />
          </Avatar>

          <YStack flex={1}>
            <H4 numberOfLines={1}>{couple.name}</H4>
            {couple.description && (
              <Paragraph
                theme="alt2"
                size="$3"
                numberOfLines={2}
              >
                {couple.description}
              </Paragraph>
            )}
          </YStack>
        </XStack>
      </Card.Header>

      <Card.Footer padded>
        <XStack justifyContent="space-between" alignItems="center">
          <XStack gap="$2" alignItems="center">
            {/* Member avatars */}
            <XStack gap="-$2">
              {couple.members.slice(0, 3).map((member, index) => (
                <Avatar
                  key={index}
                  circular
                  size="$3"
                  borderWidth={2}
                  borderColor="$background"
                >
                  <Avatar.Image src={member.avatar_url} />
                  <Avatar.Fallback backgroundColor="$gray8" />
                </Avatar>
              ))}
              {couple.member_count > 3 && (
                <Avatar
                  circular
                  size="$3"
                  backgroundColor="$gray8"
                  borderWidth={2}
                  borderColor="$background"
                >
                  <Paragraph size="$2" color="$gray12">
                    +{couple.member_count - 3}
                  </Paragraph>
                </Avatar>
              )}
            </XStack>

            <Paragraph size="$3" theme="alt2">
              {couple.member_count} member{couple.member_count !== 1 ? 's' : ''}
            </Paragraph>
          </XStack>

          <Button size="$3" theme="blue" icon={Eye}>
            View
          </Button>
        </XStack>
      </Card.Footer>
    </Card>
  )
}