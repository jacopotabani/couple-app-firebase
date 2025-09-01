import React from 'react'
import { Card as TamaguiCard, CardProps as TamaguiCardProps } from 'tamagui'

export interface CardProps extends TamaguiCardProps {
  variant?: 'default' | 'elevated' | 'outlined'
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: '$surface',
          shadowColor: '$textPrimary',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }
      case 'outlined':
        return {
          backgroundColor: '$surface',
          borderColor: '$border',
          borderWidth: 1,
        }
      default:
        return {
          backgroundColor: '$surface',
        }
    }
  }

  return (
    <TamaguiCard
      {...props}
      {...getVariantStyles()}
      borderRadius="$lg"
      padding="$lg"
    >
      {children}
    </TamaguiCard>
  )
}
