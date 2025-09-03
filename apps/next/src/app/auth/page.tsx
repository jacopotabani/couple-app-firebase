'use client'

'use client'

import { YStack, H2, Paragraph, Button, Input, Label } from 'tamagui'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = () => {
    console.log('Auth:', { email, password })
    router.push('/')
  }

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
      <YStack gap="$4" maxWidth={400} width="100%">
        <H2 textAlign="center">Welcome Back</H2>
        <Paragraph textAlign="center" theme="alt2">
          Sign in to your couple account
        </Paragraph>

        <YStack gap="$3">
          <YStack gap="$2">
            <Label>Email</Label>
            <Input
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </YStack>

          <YStack gap="$2">
            <Label>Password</Label>
            <Input
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </YStack>

          <Button
            size="$4"
            theme="blue"
            onPress={handleSubmit}
            marginTop="$2"
          >
            Sign In
          </Button>
        </YStack>
      </YStack>
    </YStack>
  )
}