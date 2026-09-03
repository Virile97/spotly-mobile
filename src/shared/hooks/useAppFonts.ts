import {
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
} from '@expo-google-fonts/bricolage-grotesque'
import {
  InterTight_400Regular,
  InterTight_500Medium,
  InterTight_600SemiBold,
} from '@expo-google-fonts/inter-tight'
import { useFonts } from 'expo-font'

export function useAppFonts() {
  return useFonts({
    BricolageGrotesque_700Bold,
    BricolageGrotesque_600SemiBold,
    InterTight_400Regular,
    InterTight_500Medium,
    InterTight_600SemiBold,
  })
}
