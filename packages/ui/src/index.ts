// Tamagui configuration
export { default as tamaguiConfig } from './tamagui.config'
export type { AppConfig } from './tamagui.config'

// Form components
export * from './components/forms/CoupleForm'
export * from './components/forms/AuthForm'

// List components
export * from './components/lists/CoupleCard'

// Modal components
export * from './components/modals/InviteModal'

// Layout components
export * from './components/layout/Screen'

// Re-export Tamagui components for convenience
export {
  TamaguiProvider,
  Theme,
  YStack,
  XStack,
  Button,
  Input,
  Card,
  H1, H2, H3, H4,
  Paragraph,
  Avatar,
  Separator,
  Dialog,
  Sheet,
  Select,
  Label,
  TextArea,
  ScrollView
} from 'tamagui'

// Legacy exports (keeping for backward compatibility)
export { Button as LegacyButton, type ButtonProps } from './components/Button'
export { Input as LegacyInput, type InputProps } from './components/Input'
export { Card as LegacyCard, type CardProps } from './components/Card'
export { Avatar as LegacyAvatar, type AvatarProps } from './components/Avatar'
