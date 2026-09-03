import { EmptyState } from '@/shared/components/feedback/EmptyState'
import { Screen } from '@/shared/components/layout/Screen'

export default function SavedScreen() {
  return (
    <Screen>
      <EmptyState title="No saved posts yet" description="Posts you save will show up here." />
    </Screen>
  )
}
