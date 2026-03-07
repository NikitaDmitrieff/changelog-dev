'use client'

import { useEffect, useRef } from 'react'

interface ViewTrackerProps {
  entryIds: string[]
}

export default function ViewTracker({ entryIds }: ViewTrackerProps) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current || entryIds.length === 0) return
    tracked.current = true

    for (const id of entryIds) {
      navigator.sendBeacon(`/api/entries/${id}/view`)
    }
  }, [entryIds])

  return null
}
