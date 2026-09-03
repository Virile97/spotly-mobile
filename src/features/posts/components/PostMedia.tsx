import { Image } from 'expo-image'
import { Dimensions, StyleSheet } from 'react-native'

const { width } = Dimensions.get('window')

export function PostMedia({ uri }: { uri: string }) {
  return <Image source={{ uri }} style={styles.media} contentFit="cover" />
}

const styles = StyleSheet.create({
  media: {
    width,
    height: width,
  },
})
