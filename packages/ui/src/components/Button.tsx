import React from 'react'
import { Button as TamaguiButton, ButtonProps as TamaguiButtonProps, Spinner } from 'tamagui'

export interface ButtonProps extends TamaguiButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  loadingText?: string
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  children,
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '$primary',
          borderColor: '$primary',
          color: 'white',
          pressStyle: { backgroundColor: '$primaryDark' },
        }
      case 'secondary':
        return {
          backgroundColor: '$secondary',
          borderColor: '$secondary',
          color: 'white',
          pressStyle: { backgroundColor: '$secondaryDark' },
        }
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: '$primary',
          color: '$primary',
          borderWidth: 1,
          pressStyle: { backgroundColor: '$primaryLight' },
        }
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          color: '$textPrimary',
          pressStyle: { backgroundColor: '$backgroundSecondary' },
        }
      default:
        return {}
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          height: 36,
          paddingHorizontal: '$md',
          fontSize: 14,
        }
      case 'lg':
        return {
          height: 52,
          paddingHorizontal: '$xl',
          fontSize: 18,
        }
      default: // md
        return {
          height: 44,
          paddingHorizontal: '$lg',
          fontSize: 16,
        }
    }
  }

  return (
    <TamaguiButton
      {...props}
      {...getVariantStyles()}
      {...getSizeStyles()}
      disabled={disabled || isLoading}
      borderRadius="$md"
      fontWeight="600"
      icon={isLoading ? <Spinner size="small" color="currentColor" /> : props.icon}
    >
      {isLoading && loadingText ? loadingText : children}
    </TamaguiButton>
  )
}
