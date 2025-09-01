import React, { useState } from 'react'
import { Input as TamaguiInput, InputProps as TamaguiInputProps, YStack, Text, XStack } from 'tamagui'
import { Eye, EyeOff } from '@tamagui/lucide-icons'
import { Button } from './Button'

export interface InputProps extends TamaguiInputProps {
  label?: string
  error?: string
  helperText?: string
  type?: 'text' | 'email' | 'password'
  isRequired?: boolean
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  type = 'text',
  isRequired = false,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  
  const isPassword = type === 'password'
  const inputType = isPassword ? (isPasswordVisible ? 'text' : 'password') : type

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <YStack space="$xs">
      {label && (
        <XStack alignItems="center" space="$xs">
          <Text fontSize="$4" fontWeight="500" color="$textPrimary">
            {label}
          </Text>
          {isRequired && (
            <Text fontSize="$4" color="$error">*</Text>
          )}
        </XStack>
      )}
      
      <XStack position="relative" alignItems="center">
        <TamaguiInput
          {...props}
          secureTextEntry={isPassword && !isPasswordVisible}
          keyboardType={type === 'email' ? 'email-address' : 'default'}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
          borderColor={error ? '$error' : '$border'}
          borderWidth={1}
          borderRadius="$md"
          paddingHorizontal="$md"
          height={44}
          fontSize="$4"
          backgroundColor="$background"
          focusStyle={{
            borderColor: error ? '$error' : '$primary',
            borderWidth: 2,
          }}
          flex={1}
          paddingRight={isPassword ? '$xl' : '$md'}
        />
        
        {isPassword && (
          <Button
            variant="ghost"
            size="sm"
            position="absolute"
            right="$xs"
            onPress={togglePasswordVisibility}
            icon={isPasswordVisible ? <EyeOff size="$4" /> : <Eye size="$4" />}
            zIndex={1}
          />
        )}
      </XStack>
      
      {(error || helperText) && (
        <Text 
          fontSize="$3" 
          color={error ? '$error' : '$textSecondary'}
          paddingLeft="$xs"
        >
          {error || helperText}
        </Text>
      )}
    </YStack>
  )
}
