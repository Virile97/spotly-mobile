import { Keyboard, Pressable, type StyleProp, type ViewStyle } from 'react-native'

interface DismissKeyboardViewProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export function DismissKeyboardView({ children, style }: DismissKeyboardViewProps) {
  return (
    <Pressable style={style} onPress={Keyboard.dismiss} accessible={false}>
      {children}
    </Pressable>
  )
}
