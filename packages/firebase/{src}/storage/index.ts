import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  UploadResult 
} from 'firebase/storage'
import { storage } from '../app'

export interface UploadOptions {
  folder?: string
  fileName?: string
}

export const uploadFile = async (
  file: File | Blob,
  path: string,
  options?: UploadOptions
): Promise<string> => {
  try {
    const { folder = 'uploads', fileName = `file_${Date.now()}` } = options || {}
    const fullPath = `${folder}/${fileName}`
    
    const storageRef = ref(storage, fullPath)
    const uploadResult: UploadResult = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(uploadResult.ref)
    
    return downloadURL
  } catch (error: any) {
    throw new Error(`Upload failed: ${error.message}`)
  }
}

export const deleteFile = async (url: string): Promise<void> => {
  try {
    const fileRef = ref(storage, url)
    await deleteObject(fileRef)
  } catch (error: any) {
    throw new Error(`Delete failed: ${error.message}`)
  }
}

export const uploadAvatar = async (file: File | Blob, userId: string): Promise<string> => {
  return uploadFile(file, `avatars/${userId}`, {
    folder: 'avatars',
    fileName: `avatar_${userId}_${Date.now()}`
  })
}

export const uploadCoupleAvatar = async (file: File | Blob, coupleId: string): Promise<string> => {
  return uploadFile(file, `couples/${coupleId}`, {
    folder: 'couples',
    fileName: `couple_${coupleId}_${Date.now()}`
  })
}
