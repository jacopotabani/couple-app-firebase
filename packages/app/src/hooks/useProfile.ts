import { useState } from 'react'
import { User, UpdateUserInput } from '@couple-app/database'
import { uploadAvatar } from '@couple-app/firebase'
import { useAuthContext } from '../contexts/AuthContext'

export interface UseProfileReturn {
  // Current user data
  user: User | null
  isLoading: boolean
  
  // Profile operations
  updateProfile: ( UpdateUserInput) => Promise<void>
  uploadUserAvatar: (file: File | Blob) => Promise<string>
  deleteAccount: () => Promise<void>
  
  // Operation states
  isUpdating: boolean
  isUploadingAvatar: boolean
  isDeletingAccount: boolean
  error: Error | null
}

export const useProfile = (): UseProfileReturn => {
  const { user, refreshUser, firebaseUser } = useAuthContext()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const clearError = () => setError(null)

  const updateProfile = async ( UpdateUserInput): Promise<void> => {
    if (!user) {
      throw new Error('No user logged in')
    }

    try {
      setIsUpdating(true)
      clearError()
      
      // This would call your API to update user profile
      // For now, we'll simulate it
      console.log('Updating profile with ', data)
      
      // Refresh user data after update
      await refreshUser()
    } catch (error) {
      setError(error as Error)
      throw error
    } finally {
      setIsUpdating(false)
    }
  }

  const uploadUserAvatar = async (file: File | Blob): Promise<string> => {
    if (!user || !firebaseUser) {
      throw new Error('No user logged in')
    }

    try {
      setIsUploadingAvatar(true)
      clearError()
      
      // Upload to Firebase Storage
      const avatarUrl = await uploadAvatar(file, firebaseUser.uid)
      
      // Update user profile with new avatar URL
      await updateProfile({ avatar_url: avatarUrl })
      
      return avatarUrl
    } catch (error) {
      setError(error as Error)
      throw error
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const deleteAccount = async (): Promise<void> => {
    if (!user || !firebaseUser) {
      throw new Error('No user logged in')
    }

    try {
      setIsDeletingAccount(true)
      clearError()
      
      // This would call your API to delete user account
      // and also delete Firebase user
      console.log('Deleting user account:', user._id)
      
      // TODO: Implement actual account deletion
      
    } catch (error) {
      setError(error as Error)
      throw error
    } finally {
      setIsDeletingAccount(false)
    }
  }

  return {
    user,
    isLoading: false, // This would come from auth context
    updateProfile,
    uploadUserAvatar,
    deleteAccount,
    isUpdating,
    isUploadingAvatar,
    isDeletingAccount,
    error,
  }
}
