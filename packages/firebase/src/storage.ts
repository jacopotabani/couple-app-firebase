import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { app } from './config'

const storage = getStorage(app)

export const uploadAvatar = async (file: File | Blob, userId: string): Promise<string> => {
  const fileName = file instanceof File ? file.name : 'avatar.jpg'
  const avatarRef = ref(storage, `avatars/${userId}/${Date.now()}-${fileName}`)
  const snapshot = await uploadBytes(avatarRef, file)
  return getDownloadURL(snapshot.ref)
}

export const uploadFile = async (file: File, path: string): Promise<string> => {
  const fileRef = ref(storage, path)
  const snapshot = await uploadBytes(fileRef, file)
  return getDownloadURL(snapshot.ref)
}