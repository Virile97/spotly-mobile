import { Ionicons } from '@expo/vector-icons'
import { useRouter, type Href } from 'expo-router'
import { useState, type ReactNode } from 'react'
import { Pressable, ScrollView, StyleSheet, Switch, Text, View, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useLogout } from '@/features/auth/hooks/useLogout'
import { useUiStore } from '@/store/ui.store'
import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'

export function SettingsScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { mutate: logout, isPending } = useLogout()
  const themeOverride = useUiStore((state) => state.themeOverride)
  const setThemeOverride = useUiStore((state) => state.setThemeOverride)
  const [pushEnabled, setPushEnabled] = useState(true)
  const [privateAccount, setPrivateAccount] = useState(false)

  const darkMode = themeOverride !== 'light'

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backButton}
          onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={palette.white} />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}>
        <Section label="ACCOUNT">
          <LinkRow label="Edit profile" onPress={() => router.push('/settings/account' as Href)} />
          <LinkRow label="Change password" />
          <LinkRow label="Email & phone" last />
        </Section>

        <Section label="PREFERENCES">
          <ToggleRow
            label="Dark mode"
            value={darkMode}
            onValueChange={(value) => setThemeOverride(value ? 'dark' : 'light')}
          />
          <ToggleRow label="Push notifications" value={pushEnabled} onValueChange={setPushEnabled} />
          <LinkRow label="Language" value="English" last />
        </Section>

        <Section label="PRIVACY">
          <ToggleRow label="Private account" value={privateAccount} onValueChange={setPrivateAccount} />
          <LinkRow label="Blocked users" onPress={() => router.push('/settings/privacy' as Href)} last />
        </Section>

        <Section label="CONTENT">
          <LinkRow label="Saved items" onPress={() => router.push('/saved' as Href)} />
          <LinkRow label="Archive" last />
        </Section>

        <Section label="SUPPORT">
          <LinkRow label="Help center" />
          <LinkRow label="Terms & Privacy Policy" last />
        </Section>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isPending }}
          style={styles.logoutCard}
          disabled={isPending}
          onPress={() => logout()}>
          <Ionicons name="log-out-outline" size={20} color={palette.red500} />
          <Text style={styles.logoutLabel}>Log out</Text>
        </Pressable>

        <Text style={styles.version}>Spotly v1.0.0</Text>
      </ScrollView>
    </View>
  )
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  )
}

function LinkRow({
  label,
  value,
  last,
  onPress,
}: {
  label: string
  value?: string
  last?: boolean
  onPress?: () => void
}) {
  return (
    <Pressable
      accessibilityRole="button"
      style={[styles.row, last && styles.rowLast]}
      onPress={onPress}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.35)" />
      </View>
    </Pressable>
  )
}

function ToggleRow({
  label,
  value,
  onValueChange,
}: {
  label: string
  value: boolean
  onValueChange: (value: boolean) => void
}) {
  return (
    <View style={[styles.row, styles.toggleRow]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.switchWrap} pointerEvents="box-none">
        <Switch
          value={value}
          onValueChange={onValueChange}
          style={styles.switch}
          trackColor={{ false: '#3A393E', true: palette.pink500 }}
          thumbColor={palette.white}
          ios_backgroundColor="#3A393E"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A090B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: palette.white,
    fontSize: 28,
    lineHeight: 34,
    fontFamily: fontFamily.headline,
  },
  content: {
    paddingHorizontal: spacing.md,
    gap: spacing.lg,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    letterSpacing: 0.8,
    fontFamily: fontFamily.bodySemiBold,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: '#17161A',
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  toggleRow: {
    paddingRight: 22,
  },
  rowLabel: {
    flex: 1,
    color: palette.white,
    fontSize: fontSize.md,
    lineHeight: 20,
    fontFamily: fontFamily.body,
    includeFontPadding: false,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowValue: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: fontSize.sm,
    lineHeight: 18,
    fontFamily: fontFamily.body,
    includeFontPadding: false,
  },
  switchWrap: {
    width: 51,
    height: 31,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 2,
  },
  switch: {
    transform: [{ scale: 0.75 }],
    ...(Platform.OS === 'ios' ? { marginVertical: -8 } : null),
  },
  logoutCard: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: '#17161A',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoutLabel: {
    color: palette.red500,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  version: {
    marginTop: spacing.sm,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.28)',
    fontSize: 12,
    fontFamily: fontFamily.body,
  },
})
