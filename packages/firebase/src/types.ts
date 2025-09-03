// Firebase Auth Types
export interface SignUpData {
  email: string
  password: string
  name: string
  displayName?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthError {
  code: string
  message: string
}