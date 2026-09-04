import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { CUSTOM_REACTION_CATEGORIES } from '@/features/reactions/data/custom-emojis'
import {
  PRESET_REACTIONS,
  reactionFromEmoji,
  type ReactionSelection,
} from '@/features/reactions/types/reaction.types'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

const STRIP_HEIGHT = 52
const STRIP_GAP = 8
const GRID_COLUMNS = 8

export interface ReactionAnchor {
  x: number
  y: number
  width: number
  height: number
}

interface ReactionPickerProps {
  visible: boolean
  anchor: ReactionAnchor | null
  selectedEmoji: string | null
  onSelect: (selection: ReactionSelection) => void
  onClose: () => void
}

export function ReactionPicker({
  visible,
  anchor,
  selectedEmoji,
  onSelect,
  onClose,
}: ReactionPickerProps) {
  const insets = useSafeAreaInsets()
  const { width: screenWidth, height: screenHeight } = useWindowDimensions()
  const [mode, setMode] = useState<'strip' | 'custom'>('strip')
  const [stripWidth, setStripWidth] = useState(0)

  const handleClose = () => {
    setMode('strip')
    onClose()
  }

  const handleSelect = (emoji: string) => {
    onSelect(reactionFromEmoji(emoji))
    handleClose()
  }

  const onStripLayout = (event: LayoutChangeEvent) => {
    setStripWidth(event.nativeEvent.layout.width)
  }

  const stripStyle = (() => {
    if (!anchor || stripWidth === 0) {
      return { opacity: 0, top: anchor?.y ?? 0, left: spacing.md }
    }

    const left = Math.min(
      Math.max(spacing.md, anchor.x - spacing.xs),
      screenWidth - stripWidth - spacing.md
    )
    const above = anchor.y - STRIP_HEIGHT - STRIP_GAP
    const top = above >= insets.top + spacing.sm ? above : anchor.y + anchor.height + STRIP_GAP

    return { top, left, opacity: 1 }
  })()

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={handleClose}>
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close reactions"
          style={styles.backdrop}
          onPress={handleClose}
        />

        {mode === 'strip' ? (
          <View style={[styles.strip, stripStyle]} onLayout={onStripLayout}>
            {PRESET_REACTIONS.map((reaction) => {
              const isSelected = selectedEmoji === reaction.emoji

              return (
                <Pressable
                  key={reaction.kind}
                  accessibilityRole="button"
                  accessibilityLabel={reaction.kind}
                  style={[styles.preset, isSelected && styles.presetSelected]}
                  onPress={() => handleSelect(reaction.emoji)}>
                  <Text style={styles.presetEmoji}>{reaction.emoji}</Text>
                </Pressable>
              )
            })}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="More reactions"
              style={styles.plus}
              onPress={() => setMode('custom')}>
              <Ionicons name="add" size={22} color={palette.white} />
            </Pressable>
          </View>
        ) : (
          <View
            style={[
              styles.sheet,
              { maxHeight: screenHeight * 0.55, paddingBottom: Math.max(insets.bottom, spacing.sm) },
            ]}>
            <View style={styles.handle} />

            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Choose a reaction</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close reactions"
                hitSlop={6}
                style={styles.closeButton}
                onPress={handleClose}>
                <Ionicons name="close" size={18} color={palette.white} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>
              {CUSTOM_REACTION_CATEGORIES.map((category) => (
                <View key={category.id} style={styles.category}>
                  <Text style={styles.categoryLabel}>{category.label}</Text>
                  <View style={styles.grid}>
                    {category.emojis.map((emoji) => (
                      <Pressable
                        key={emoji}
                        accessibilityRole="button"
                        accessibilityLabel={`React with ${emoji}`}
                        style={[
                          styles.gridItem,
                          { width: `${100 / GRID_COLUMNS}%` },
                          selectedEmoji === emoji && styles.presetSelected,
                        ]}
                        onPress={() => handleSelect(emoji)}>
                        <Text style={styles.gridEmoji}>{emoji}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  strip: {
    position: 'absolute',
    height: STRIP_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
    backgroundColor: '#17161A',
    borderRadius: STRIP_HEIGHT / 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  preset: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetSelected: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  presetEmoji: {
    fontSize: 26,
  },
  plus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginLeft: spacing.xs,
  },
  sheet: {
    backgroundColor: '#17161A',
    borderTopLeftRadius: radius.lg + spacing.sm,
    borderTopRightRadius: radius.lg + spacing.sm,
    overflow: 'hidden',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginTop: spacing.sm,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sheetTitle: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  sheetContent: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.md,
  },
  category: {
    marginBottom: spacing.md,
  },
  categoryLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.xs,
    fontFamily: fontFamily.bodySemiBold,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  gridEmoji: {
    fontSize: 26,
  },
})
