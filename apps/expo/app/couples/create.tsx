import { Screen, CoupleForm, H2 } from '@couple-app/ui'
import { StatusBar } from 'expo-status-bar'
import { router } from 'expo-router'

export default function CreateCouplePage() {
  const handleSubmit = async (data: any) => {
    try {
      // TODO: Implement couple creation API call
      console.log('Creating couple:', data)

      // Mock success - redirect to couples list
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } catch (error) {
      console.error('Error creating couple:', error)
    }
  }

  return (
    <Screen scrollable>
      <H2 marginBottom="$4">Create New Couple</H2>
      <CoupleForm onSubmit={handleSubmit} submitText="Create Couple" />
      <StatusBar style="auto" />
    </Screen>
  )
}
