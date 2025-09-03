# Cross-Platform Components Guide

## Building Components for Expo + Next.js with Tamagui

## Overview

This guide demonstrates how to create components that work seamlessly across both Expo (React Native) and Next.js (App Router) applications using Tamagui. The goal is to write components once and have them work perfectly on web, iOS, and Android with minimal platform-specific code.

## Architecture Strategy

### Component Sharing Philosophy

```
packages/ui/src/components/
├── CoupleCard.tsx           # ✅ Works on web + mobile
├── CoupleMemberList.tsx     # ✅ Works on web + mobile
├── CoupleForm.tsx           # ✅ Works on web + mobile
├── InviteModal.tsx          # ✅ Works on web + mobile
└── AuthForm.tsx             # ✅ Works on web + mobile

apps/expo/app/               # Expo Router (mobile)
├── couples/
│   ├── index.tsx           # Uses shared components
│   └── [id].tsx            # Uses shared components
└── auth/
    └── index.tsx           # Uses shared components

apps/next/app/               # Next.js App Router (web)
├── couples/
│   ├── page.tsx            # Uses shared components
│   └── [id]/page.tsx       # Uses shared components
└── auth/
    └── page.tsx            # Uses shared components
```

**Key Principle**: Components live in `packages/ui`, screens use them in both apps.

## Tamagui Configuration

### 1. Shared Tamagui Config

```typescript
// packages/ui/src/tamagui.config.ts
import { createTamagui } from '@tamagui/core'
import { config } from '@tamagui/config/v3'
import { createInterFont } from '@tamagui/font-inter'
import { createMedia } from '@tamagui/react-native-media-driver'

const interFont = createInterFont()

const tamaguiConfig = createTamagui({
  ...config,
  fonts: {
    ...config.fonts,
    body: interFont,
    heading: interFont,
  },
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  }),
})

export default tamaguiConfig
export type AppConfig = typeof tamaguiConfig
```

### 2. Next.js Configuration (App Router)

```typescript
// apps/next/next.config.js
const { withTamagui } = require('@tamagui/next-plugin')

module.exports = withTamagui({
  config: '../../packages/ui/src/tamagui.config.ts',
  components: ['@tamagui/core', '@tamagui/animations-react-native'],
  importsWhitelist: ['constants.js', 'colors.js'],
  logTimings: true,
  disableExtraction: process.env.NODE_ENV === 'development',
  shouldExtract: (path) => {
    if (path.includes('node_modules/@tamagui/core')) {
      return true
    }
    if (path.includes('packages/ui')) {
      return true
    }
  },
  excludeReactNativeWebExports: ['Switch', 'ProgressBar', 'Picker', 'CheckBox', 'Touchable'],
  experimental: {
    appDir: true, // Enable App Router
  },
})
```

### 3. Expo Configuration

```typescript
// apps/expo/app.config.js
export default {
  expo: {
    name: 'Couple App',
    slug: 'couple-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: ['@tamagui/expo-plugin'],
  },
}
```

## Cross-Platform Component Patterns

### 1. Basic Shared Component

```typescript
// packages/ui/src/components/CoupleCard.tsx
import { Card, XStack, YStack, H4, Paragraph, Avatar, Button } from 'tamagui'
import { Platform } from 'react-native'

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
      size=\"$4\"
      bordered
      animation=\"bouncy\"
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
      onPress={onPress}
      // Responsive width - works on web and mobile
      width={Platform.select({
        web: 350,
        default: '100%'
      })}
      maxWidth={400}
      cursor={Platform.select({ web: 'pointer', default: undefined })}
    >
      <Card.Header padded>
        <XStack gap=\"$4\" alignItems=\"center\">
          <Avatar circular size=\"$6\">
            <Avatar.Image src={couple.avatar_url} />
            <Avatar.Fallback backgroundColor=\"$blue10\" />
          </Avatar>

          <YStack flex={1}>
            <H4 numberOfLines={1}>{couple.name}</H4>
            {couple.description && (
              <Paragraph
                theme=\"alt2\"
                size=\"$3\"
                numberOfLines={2}
              >
                {couple.description}
              </Paragraph>
            )}
          </YStack>
        </XStack>
      </Card.Header>

      <Card.Footer padded>
        <XStack justifyContent=\"space-between\" alignItems=\"center\">
          <XStack gap=\"$2\" alignItems=\"center\">
            {/* Member avatars */}
            <XStack gap=\"-$2\">
              {couple.members.slice(0, 3).map((member, index) => (
                <Avatar
                  key={index}
                  circular
                  size=\"$3\"
                  borderWidth={2}
                  borderColor=\"$background\"
                >
                  <Avatar.Image src={member.avatar_url} />
                  <Avatar.Fallback backgroundColor=\"$gray8\" />
                </Avatar>
              ))}
              {couple.member_count > 3 && (
                <Avatar
                  circular
                  size=\"$3\"
                  backgroundColor=\"$gray8\"
                  borderWidth={2}
                  borderColor=\"$background\"
                >
                  <Paragraph size=\"$2\" color=\"$gray12\">
                    +{couple.member_count - 3}
                  </Paragraph>
                </Avatar>
              )}
            </XStack>

            <Paragraph size=\"$3\" theme=\"alt2\">
              {couple.member_count} member{couple.member_count !== 1 ? 's' : ''}
            </Paragraph>
          </XStack>

          <Button size=\"$3\" theme=\"blue\">
            View
          </Button>
        </XStack>
      </Card.Footer>
    </Card>
  )
}
```

### 2. Form Component with Platform Adaptations

```typescript
// packages/ui/src/components/CoupleForm.tsx
import { useState } from 'react'
import {
  YStack,
  XStack,
  Input,
  TextArea,
  Button,
  Label,
  Select,
  DatePicker,
  H3,
  Paragraph
} from 'tamagui'
import { Platform } from 'react-native'

interface CoupleFormProps {
  initialData?: {
    name?: string
    description?: string
    anniversary_date?: Date
    privacy_level?: 'public' | 'private' | 'invite_only'
  }
  onSubmit: (data: CoupleFormData) => void
  isLoading?: boolean
  submitText?: string
}

interface CoupleFormData {
  name: string
  description: string
  anniversary_date?: Date
  privacy_level: 'public' | 'private' | 'invite_only'
}

export function CoupleForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitText = 'Create Couple'
}: CoupleFormProps) {
  const [formData, setFormData] = useState<CoupleFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    anniversary_date: initialData?.anniversary_date,
    privacy_level: initialData?.privacy_level || 'private'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Couple name is required'
    } else if (formData.name.length > 255) {
      newErrors.name = 'Name must be less than 255 characters'
    }

    if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <YStack gap=\"$4\" padding=\"$4\">
      <H3>Couple Information</H3>

      {/* Couple Name */}
      <YStack gap=\"$2\">
        <Label htmlFor=\"name\">Couple Name *</Label>
        <Input
          id=\"name\"
          placeholder=\"Enter couple name\"
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          borderColor={errors.name ? '$red8' : '$borderColor'}
          // Platform-specific keyboard handling
          autoCapitalize={Platform.select({ web: undefined, default: 'words' })}
          autoComplete={Platform.select({ web: 'off', default: undefined })}
        />
        {errors.name && (
          <Paragraph size=\"$2\" color=\"$red10\">{errors.name}</Paragraph>
        )}
      </YStack>

      {/* Description */}
      <YStack gap=\"$2\">
        <Label htmlFor=\"description\">Description</Label>
        <TextArea
          id=\"description\"
          placeholder=\"Tell us about your couple...\"
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          borderColor={errors.description ? '$red8' : '$borderColor'}
          minHeight={100}
          // Platform-specific behavior
          numberOfLines={Platform.select({ web: undefined, default: 4 })}
        />
        {errors.description && (
          <Paragraph size=\"$2\" color=\"$red10\">{errors.description}</Paragraph>
        )}
      </YStack>

      {/* Anniversary Date */}
      <YStack gap=\"$2\">
        <Label>Anniversary Date</Label>
        {Platform.select({
          web: (
            <Input
              type=\"date\"
              value={formData.anniversary_date?.toISOString().split('T')[0] || ''}
              onChangeText={(value) => {
                const date = value ? new Date(value) : undefined
                setFormData(prev => ({ ...prev, anniversary_date: date }))
              }}
            />
          ),
          default: (
            <DatePicker
              value={formData.anniversary_date}
              onDateChange={(date) => setFormData(prev => ({ ...prev, anniversary_date: date }))}
            />
          )
        })}
      </YStack>

      {/* Privacy Level */}
      <YStack gap=\"$2\">
        <Label>Privacy Level</Label>
        <Select
          value={formData.privacy_level}
          onValueChange={(value) =>
            setFormData(prev => ({
              ...prev,
              privacy_level: value as 'public' | 'private' | 'invite_only'
            }))
          }
        >
          <Select.Trigger>
            <Select.Value placeholder=\"Select privacy level\" />
          </Select.Trigger>

          <Select.Content>
            <Select.Item index={0} value=\"private\"></Select.Item>             <Select.ItemText>Private</Select.ItemText>
            </Select.Item>
            <Select.Item index={1} value=\"invite_only\">
              <Select.ItemText>Invite Only</Select.ItemText>
            </Select.Item>
            <Select.Item index={2} value=\"public\">
              <Select.ItemText>Public</Select.ItemText>
            </Select.Item>
          </Select.Content>
        </Select>
      </YStack>

      {/* Submit Button */}
      <Button
        theme=\"blue\"
        size=\"$4\"
        onPress={handleSubmit}
        disabled={isLoading}
        // Platform-specific styling
        marginTop=\"$4\"
        {...Platform.select({
          web: {
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }
        })}
      >
        {isLoading ? 'Creating...' : submitText}
      </Button>
    </YStack>
  )
}
```

### 3. Modal Component with Platform Differences

```typescript
// packages/ui/src/components/InviteModal.tsx
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
  Separator
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

  const inviteMessage = `Join our couple \"${coupleName}\" with code: ${coupleCode}`

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

  // Use Sheet for mobile, Dialog for web
  if (Platform.OS !== 'web') {
    return (
      <Sheet
        modal
        open={isOpen}
        onOpenChange={onClose}
        snapPoints={[40]}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame padding=\"$4\">
          <InviteContent
            coupleCode={coupleCode}
            coupleName={coupleName}
            copied={copied}
            onCopy={handleCopy}
            onShare={handleShare}
            onClose={onClose}
          />
        </Sheet.Frame>
      </Sheet>
    )
  }

  return (
    <Dialog modal open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay
          key=\"overlay\"
          animation=\"quick\"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key=\"content\"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap=\"$4\"
          padding=\"$4\"
          maxWidth={400}
        >
          <InviteContent
            coupleCode={coupleCode}
            coupleName={coupleName}
            copied={copied}
            onCopy={handleCopy}
            onShare={handleShare}
            onClose={onClose}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
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
    <YStack gap=\"$4\">
      <XStack justifyContent=\"space-between\" alignItems=\"center\">
        <H4>Invite to {coupleName}</H4>
        <Button
          size=\"$3\"
          circular
          icon={X}
          onPress={onClose}
          chromeless
        />
      </XStack>

      <Separator />

      <YStack gap=\"$3\">
        <Paragraph>Share this code with your partner:</Paragraph>

        <XStack gap=\"$2\" alignItems=\"center\">
          <Input
            flex={1}
            value={coupleCode}
            editable={false}
            textAlign=\"center\"
            fontSize=\"$6\"
            fontWeight=\"bold\"
            backgroundColor=\"$gray2\"
          />
          <Button
            size=\"$4\"
            icon={Copy}
            onPress={onCopy}
            theme={copied ? 'green' : 'blue'}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </XStack>

        {Platform.OS !== 'web' && (
          <Button
            size=\"$4\"
            theme=\"blue\"
            icon={ShareIcon}
            onPress={onShare}
          >
            Share Invitation
          </Button>
        )}

        <Paragraph size=\"$3\" theme=\"alt2\" textAlign=\"center\">
          Your partner can join by entering this code in the app
        </Paragraph>
      </YStack>
    </YStack>
  )
}
```

## App Router Integration (Next.js)

### 1. Layout Configuration

```typescript
// apps/next/app/layout.tsx
import { TamaguiProvider } from '@tamagui/core'
import { NextThemeProvider } from '@tamagui/next-theme'
import tamaguiConfig from '@/ui/tamagui.config'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang=\"en\">
      <body>
        <NextThemeProvider>
          <TamaguiProvider config={tamaguiConfig} defaultTheme=\"light\">
            {children}
          </TamaguiProvider>
        </NextThemeProvider>
      </body>
    </html>
  )
}
```

### 2. Page Components (App Router)

```typescript
// apps/next/app/couples/page.tsx
'use client'

import { YStack, XStack, H2, Button } from 'tamagui'
import { CoupleCard } from '@/ui/components/CoupleCard'
import { Plus } from '@tamagui/lucide-icons'
import { useRouter } from 'next/navigation'
import { api } from '@/api'

export default function CouplesPage() {
  const router = useRouter()
  const { data: couples, isLoading } = api.couple.getUserCouples.useQuery()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <YStack gap=\"$4\" padding=\"$4\" maxWidth={1200} margin=\"0 auto\">
      <XStack justifyContent=\"space-between\" alignItems=\"center\">
        <H2>My Couples</H2>
        <Button
          size=\"$4\"
          theme=\"blue\"
          icon={Plus}
          onPress={() => router.push('/couples/create')}
        >
          Create Couple
        </Button>
      </XStack>

      <XStack gap=\"$4\" flexWrap=\"wrap\">
        {couples?.map((couple) => (
          <CoupleCard
            key={couple.id}
            couple={couple}
            onPress={() => router.push(`/couples/${couple.id}`)}
          />
        ))}
      </XStack>
    </YStack>
  )
}
```

### 3. Dynamic Routes (App Router)

```typescript
// apps/next/app/couples/[id]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { YStack, H2, Button } from 'tamagui'
import { CoupleMemberList } from '@/ui/components/CoupleMemberList'
import { InviteModal } from '@/ui/components/InviteModal'
import { useState } from 'react'
import { api } from '@/api'

export default function CoupleDetailPage() {
  const params = useParams()
  const coupleId = params.id as string
  const [showInviteModal, setShowInviteModal] = useState(false)

  const { data: couple } = api.couple.getCoupleById.useQuery({ coupleId })
  const { data: members } = api.couple.getMembers.useQuery({ coupleId })

  if (!couple) return <div>Loading...</div>

  return (
    <YStack gap=\"$4\" padding=\"$4\" maxWidth={800} margin=\"0 auto\">
      <H2>{couple.name}</H2>

      <Button onPress={() => setShowInviteModal(true)}>
        Invite Members
      </Button>

      {members && (
        <CoupleMemberList
          members={members}
          currentUserId=\"current-user-id\"
          userRole=\"creator\"
          onRemoveMember={(memberId) => {
            // Handle remove member
          }}
          onLeaveCouple={() => {
            // Handle leave couple
          }}
        />
      )}

      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        coupleCode={couple.couple_code}
        coupleName={couple.name}
      />
    </YStack>
  )
}
```

## Expo Router Integration

### 1. Layout Configuration

```typescript
// apps/expo/app/_layout.tsx
import { TamaguiProvider } from '@tamagui/core'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import tamaguiConfig from '@/ui/tamagui.config'

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  if (!loaded) {
    return null
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme=\"light\">
      <Stack>
        <Stack.Screen name=\"couples\" options={{ title: 'Couples' }} />
        <Stack.Screen name=\"auth\" options={{ title: 'Authentication' }} />
      </Stack>
    </TamaguiProvider>
  )
}
```

### 2. Screen Components (Expo Router)

```typescript
// apps/expo/app/couples/index.tsx
import { YStack, XStack, H2, Button, ScrollView } from 'tamagui'
import { CoupleCard } from '@/ui/components/CoupleCard'
import { Plus } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { api } from '@/api'

export default function CouplesScreen() {
  const { data: couples, isLoading } = api.couple.getUserCouples.useQuery()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <ScrollView>
      <YStack gap=\"$4\" padding=\"$4\">
        <XStack justifyContent=\"space-between\" alignItems=\"center\">
          <H2>My Couples</H2>
          <Button
            size=\"$4\"
            theme=\"blue\"
            icon={Plus}
            onPress={() => router.push('/couples/create')}
          >
            Create
          </Button>
        </XStack>

        <YStack gap=\"$4\">
          {couples?.map((couple) => (
            <CoupleCard
              key={couple.id}
              couple={couple}
              onPress={() => router.push(`/couples/${couple.id}`)}
            />
          ))}
        </YStack>
      </YStack>
    </ScrollView>
  )
}
```

### 3. Dynamic Routes (Expo Router)

```typescript
// apps/expo/app/couples/[id].tsx
import { useLocalSearchParams } from 'expo-router'
import { YStack, H2, Button, ScrollView } from 'tamagui'
import { CoupleMemberList } from '@/ui/components/CoupleMemberList'
import { InviteModal } from '@/ui/components/InviteModal'
import { useState } from 'react'
import { api } from '@/api'

export default function CoupleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [showInviteModal, setShowInviteModal] = useState(false)

  const { data: couple } = api.couple.getCoupleById.useQuery({ coupleId: id })
  const { data: members } = api.couple.getMembers.useQuery({ coupleId: id })

  if (!couple) return <div>Loading...</div>

  return (
    <ScrollView>
      <YStack gap=\"$4\" padding=\"$4\">
        <H2>{couple.name}</H2>

        <Button onPress={() => setShowInviteModal(true)}>
          Invite Members
        </Button>

        {members && (
          <CoupleMemberList
            members={members}
            currentUserId=\"current-user-id\"
            userRole=\"creator\"
            onRemoveMember={(memberId) => {
              // Handle remove member
            }}
            onLeaveCouple={() => {
              // Handle leave couple
            }}
          />
        )}

        <InviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          coupleCode={couple.couple_code}
          coupleName={couple.name}
        />
      </YStack>
    </ScrollView>
  )
}
```

## Platform-Specific Patterns

### 1. Conditional Rendering

```typescript
import { Platform } from 'react-native'

// Simple platform check
const MyComponent = () => (
  <YStack>
    {Platform.select({
      web: <WebSpecificComponent />,
      ios: <IOSSpecificComponent />,
      android: <AndroidSpecificComponent />,
      default: <DefaultComponent />
    })}
  </YStack>
)

// Platform-specific props
<Button
  {...Platform.select({
    web: { cursor: 'pointer' },
    default: {}
  })}
>
  Click me
</Button>
```

### 2. Platform-Specific Files

```typescript
// packages/ui/src/components/FileUpload.web.tsx
export function FileUpload() {
  return (
    <input
      type=\"file\"
      accept=\"image/*\"
      onChange={handleFileChange}
    />
  )
}

// packages/ui/src/components/FileUpload.native.tsx
import * as ImagePicker from 'expo-image-picker'

export function FileUpload() {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })
    // Handle result
  }

  return (
    <Button onPress={pickImage}>
      Pick Image
    </Button>
  )
}

// packages/ui/src/components/FileUpload.tsx
import { Platform } from 'react-native'

export const FileUpload = Platform.select({
  web: () => require('./FileUpload.web').FileUpload,
  default: () => require('./FileUpload.native').FileUpload,
})()
```

### 3. Responsive Design

```typescript
// Using Tamagui's media queries
<YStack
  gap=\"$4\"
  padding=\"$4\"
  // Mobile: full width, Web: max width with centering
  $gtSm={{
    maxWidth: 1200,
    marginHorizontal: 'auto'
  }}
>
  <XStack
    gap=\"$4\"
    // Mobile: column layout, Web: row layout
    flexDirection=\"column\"
    $gtMd={{
      flexDirection: 'row'
    }}
  >
    <YStack flex={1}>Content</YStack>
    <YStack
      width=\"100%\"
      $gtMd={{
        width: 300
      }}
    >
      Sidebar
    </YStack>
  </XStack>
</YStack>
```

## Best Practices

### 1. Component Organization

```
packages/ui/src/components/
├── base/                    # Basic building blocks
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Card.tsx
├── forms/                   # Form-specific components
│   ├── CoupleForm.tsx
│   ├── AuthForm.tsx
│   └── ValidationMessage.tsx
├── lists/                   # List and grid components
│   ├── CoupleCard.tsx
│   ├── CoupleMemberList.tsx
│   └── MemberAvatar.tsx
├── modals/                  # Modal and overlay components
│   ├── InviteModal.tsx
│   ├── ConfirmDialog.tsx
│   └── ImagePicker.tsx
└── layout/                  # Layout components
    ├── Screen.tsx
    ├── Header.tsx
    └── Navigation.tsx
```

### 2. Type Safety

```typescript
// Shared types
export interface Couple {
  id: string
  name: string
  description?: string
  member_count: number
  avatar_url?: string
  couple_code: string
  privacy_level: 'public' | 'private' | 'invite_only'
  created_at: Date
  updated_at: Date
}

// Component props with strict typing
interface CoupleCardProps {
  couple: Couple
  onPress: () => void
  showMembers?: boolean
}

// Platform-specific type extensions
interface PlatformSpecificProps {
  web?: Record<string, any>
  native?: Record<string, any>
}
```

### 3. Performance Optimization

```typescript
import { memo, useMemo } from 'react'

// Memoize expensive components
export const CoupleCard = memo(({ couple, onPress }: CoupleCardProps) => {
  const memberAvatars = useMemo(() =>
    couple.members.slice(0, 3).map(member => member.avatar_url),
    [couple.members]
  )

  return (
    // Component JSX
  )
})

// Lazy load heavy components
const InviteModal = lazy(() => import('./InviteModal'))
```

### 4. Testing Strategy

```typescript
// Component tests that work for both platforms
import { render, fireEvent } from '@testing-library/react-native'
import { CoupleCard } from '../CoupleCard'

describe('CoupleCard', () => {
  const mockCouple = {
    id: '1',
    name: 'Test Couple',
    member_count: 2,
    members: [],
  }

  it('renders couple information correctly', () => {
    const { getByText } = render(<CoupleCard couple={mockCouple} onPress={jest.fn()} />)

    expect(getByText('Test Couple')).toBeTruthy()
    expect(getByText('2 members')).toBeTruthy()
  })

  it('calls onPress when pressed', () => {
    const onPress = jest.fn()
    const { getByTestId } = render(<CoupleCard couple={mockCouple} onPress={onPress} />)

    fireEvent.press(getByTestId('couple-card'))
    expect(onPress).toHaveBeenCalled()
  })
})
```

## Summary

This approach gives you:

✅ **Single Component Codebase**: Write once, works everywhere  
✅ **Platform Optimization**: Automatic platform-specific optimizations  
✅ **Type Safety**: Full TypeScript support across platforms  
✅ **Performance**: Optimized builds for web and mobile  
✅ **Developer Experience**: Hot reload, debugging, and tooling  
✅ **Responsive Design**: Automatic adaptation to different screen sizes  
✅ **Native Feel**: Platform-appropriate interactions and animations

The key is leveraging Tamagui's cross-platform capabilities while using Platform.select() for the few cases where platform-specific behavior is needed. This gives you maximum code reuse with native performance and feel on each platform.
