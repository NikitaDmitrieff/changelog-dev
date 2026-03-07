'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-8 text-center">
          <p className="text-red-400 font-medium mb-1">Something went wrong</p>
          <p className="text-zinc-500 text-sm">Try refreshing the page.</p>
        </div>
      )
    }
    return this.props.children
  }
}
