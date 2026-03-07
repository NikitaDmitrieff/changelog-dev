import { ErrorBoundary } from '@/components/error-boundary'
import { KeyboardShortcuts } from '@/components/keyboard-shortcuts'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      {children}
      <KeyboardShortcuts />
    </ErrorBoundary>
  )
}
