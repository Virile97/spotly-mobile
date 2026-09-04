import { Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

import type { ProfileImageType } from '@/features/profile/types/profile.types'
import { resolveProfileImageContentType } from '@/features/profile/utils/profile'

interface PickedProfileImage {
  uri: string
  contentType: ReturnType<typeof resolveProfileImageContentType>
}

function chooseImageSource(type: ProfileImageType): Promise<'camera' | 'library' | null> {
  return new Promise((resolve) => {
    let settled = false
    const done = (source: 'camera' | 'library' | null) => {
      if (settled) return
      settled = true
      resolve(source)
    }

    Alert.alert(type === 'avatar' ? 'Change photo' : 'Change background', undefined, [
      { text: 'Camera', onPress: () => done('camera') },
      { text: 'Photo library', onPress: () => done('library') },
      { text: 'Cancel', style: 'cancel', onPress: () => done(null) },
    ], { cancelable: true, onDismiss: () => done(null) })
  })
}

async function launchPicker(
  type: ProfileImageType,
  source: 'camera' | 'library'
): Promise<PickedProfileImage | null> {
  const permission =
    source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync()

  if (!permission.granted) return null

  const aspect: [number, number] = type === 'avatar' ? [1, 1] : [16, 9]
  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect,
    quality: 0.85,
  }

  const result =
    source === 'camera'
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options)

  if (result.canceled || !result.assets[0]) return null

  const asset = result.assets[0]
  return {
    uri: asset.uri,
    contentType: resolveProfileImageContentType(asset.mimeType, asset.uri),
  }
}

export async function pickProfileImageFromSource(
  type: ProfileImageType,
  source: 'camera' | 'library'
): Promise<PickedProfileImage | null> {
  return launchPicker(type, source)
}

export async function pickProfileImage(type: ProfileImageType): Promise<PickedProfileImage | null> {
  const source = await chooseImageSource(type)
  if (!source) return null

  // The system picker must open after the alert has fully dismissed.
  await new Promise((resolve) => setTimeout(resolve, 350))
  return launchPicker(type, source)
}
