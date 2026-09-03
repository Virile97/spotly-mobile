import { useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import { palette } from '@/theme/colors'
import { fontFamily } from '@/theme/fonts'
import { radius, spacing } from '@/theme/spacing'
import { fontSize } from '@/theme/typography'
import { MONTH_NAMES, getDaysInMonth, isSameDay } from '@/shared/utils/date'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const YEAR_RANGE = 100

export interface CalendarModalProps {
  visible: boolean
  value: Date | null
  onClose: () => void
  onConfirm: (date: Date) => void
  title?: string
  maxYear?: number
  yearRange?: number
}

export function CalendarModal({
  visible,
  value,
  onClose,
  onConfirm,
  title = 'Select a date',
  maxYear,
  yearRange = YEAR_RANGE,
}: CalendarModalProps) {
  const today = new Date()
  const latestYear = maxYear ?? today.getFullYear()
  const initial = value ?? today

  const [viewYear, setViewYear] = useState(initial.getFullYear())
  const [viewMonth, setViewMonth] = useState(initial.getMonth())
  const [selectedDate, setSelectedDate] = useState<Date | null>(value)
  const [openDropdown, setOpenDropdown] = useState<'month' | 'year' | null>(null)

  const years = Array.from({ length: yearRange }, (_, i) => latestYear - i)
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const selectMonth = (month: number) => {
    setViewMonth(month)
    setOpenDropdown(null)
  }

  const selectYear = (year: number) => {
    setViewYear(year)
    setOpenDropdown(null)
  }

  const selectDay = (day: number) => {
    setSelectedDate(new Date(viewYear, viewMonth, day))
  }

  const handleReset = () => {
    setSelectedDate(null)
    setViewYear(today.getFullYear())
    setViewMonth(today.getMonth())
  }

  const handleConfirm = () => {
    if (selectedDate) {
      onConfirm(selectedDate)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {openDropdown ? <Pressable style={styles.dropdownOverlay} onPress={() => setOpenDropdown(null)} /> : null}

          <Text style={styles.title}>{title}</Text>

          <View style={styles.header}>
            <View style={styles.dropdownWrapper}>
              <Pressable
                accessibilityRole="button"
                style={styles.dropdownTrigger}
                onPress={() => setOpenDropdown(openDropdown === 'month' ? null : 'month')}>
                <Text style={styles.dropdownTriggerText}>{MONTH_NAMES[viewMonth]}</Text>
                <Text style={styles.dropdownCaret}>▾</Text>
              </Pressable>
            </View>

            <View style={styles.dropdownWrapper}>
              <Pressable
                accessibilityRole="button"
                style={styles.dropdownTrigger}
                onPress={() => setOpenDropdown(openDropdown === 'year' ? null : 'year')}>
                <Text style={styles.dropdownTriggerText}>{viewYear}</Text>
                <Text style={styles.dropdownCaret}>▾</Text>
              </Pressable>
            </View>
          </View>

          {openDropdown === 'month' ? (
            <View style={[styles.dropdownList, styles.dropdownListLeft]}>
              <ScrollView style={styles.dropdownScroll} nestedScrollEnabled keyboardShouldPersistTaps="handled">
                {MONTH_NAMES.map((month, index) => (
                  <Pressable
                    key={month}
                    accessibilityRole="button"
                    style={styles.dropdownOption}
                    onPress={() => selectMonth(index)}>
                    <Text
                      style={[styles.dropdownOptionText, index === viewMonth && styles.dropdownOptionTextActive]}>
                      {month}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : null}

          {openDropdown === 'year' ? (
            <View style={[styles.dropdownList, styles.dropdownListRight]}>
              <ScrollView style={styles.dropdownScroll} nestedScrollEnabled keyboardShouldPersistTaps="handled">
                {years.map((year) => (
                  <Pressable
                    key={year}
                    accessibilityRole="button"
                    style={styles.dropdownOption}
                    onPress={() => selectYear(year)}>
                    <Text style={[styles.dropdownOptionText, year === viewYear && styles.dropdownOptionTextActive]}>
                      {year}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : null}

          <View style={styles.weekdayRow}>
            {WEEKDAYS.map((day, index) => (
              <Text key={`${day}-${index}`} style={styles.weekdayLabel}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.grid}>
            {cells.map((day, index) => {
              if (day === null) {
                return <View key={`empty-${index}`} style={styles.dayCell} />
              }
              const cellDate = new Date(viewYear, viewMonth, day)
              const isSelected = selectedDate ? isSameDay(cellDate, selectedDate) : false
              return (
                <Pressable key={day} accessibilityRole="button" style={styles.dayCell} onPress={() => selectDay(day)}>
                  <View style={[styles.dayCircle, isSelected && styles.dayCircleSelected]}>
                    <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>{day}</Text>
                  </View>
                </Pressable>
              )
            })}
          </View>

          <View style={styles.actions}>
            <Pressable accessibilityRole="button" style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetLabel}>Reset</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={[styles.okButton, !selectedDate && styles.okButtonDisabled]}
              disabled={!selectedDate}
              onPress={handleConfirm}>
              <Text style={styles.okLabel}>OK</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  sheet: {
    position: 'relative',
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#161418',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  title: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.headlineSemiBold,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 15,
  },
  dropdownWrapper: {
    position: 'relative',
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  dropdownTriggerText: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.bodySemiBold,
  },
  dropdownCaret: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: fontSize.xs,
  },
  dropdownList: {
    position: 'absolute',
    top: 92,
    width: 150,
    height: 220,
    backgroundColor: '#1F1C21',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
    zIndex: 20,
  },
  dropdownListLeft: {
    left: spacing.md,
  },
  dropdownListRight: {
    right: spacing.md,
  },
  dropdownScroll: {
    height: 220,
  },
  dropdownOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  dropdownOptionText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  dropdownOptionTextActive: {
    color: palette.pink500,
    fontFamily: fontFamily.bodySemiBold,
  },
  weekdayRow: {
    flexDirection: 'row',
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.4)',
    fontSize: fontSize.xs,
    fontFamily: fontFamily.bodyMedium,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleSelected: {
    backgroundColor: palette.pink500,
  },
  dayText: {
    color: palette.white,
    fontSize: fontSize.sm,
    fontFamily: fontFamily.body,
  },
  dayTextSelected: {
    fontFamily: fontFamily.bodySemiBold,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  resetButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  resetLabel: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
  okButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: palette.pink500,
  },
  okButtonDisabled: {
    opacity: 0.4,
  },
  okLabel: {
    color: palette.white,
    fontSize: fontSize.md,
    fontFamily: fontFamily.bodySemiBold,
  },
})
