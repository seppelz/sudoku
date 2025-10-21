import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSudokuStore } from '@/store/useSudokuStore'
import { useShallow } from 'zustand/react/shallow'

export function Announcement() {
  const { t } = useTranslation()
  const { statusMessage, setStatusMessage } = useSudokuStore(
    useShallow((state) => ({
      statusMessage: state.statusMessage,
      setStatusMessage: state.setStatusMessage,
    })),
  )
  const [visibleMessage, setVisibleMessage] = useState<string | null>(null)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (!statusMessage) {
      return
    }
    const message = t(statusMessage)
    setVisibleMessage(message)
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = window.setTimeout(() => {
      setVisibleMessage(null)
      setStatusMessage(null)
    }, 4000)
  }, [statusMessage, setStatusMessage, t])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {visibleMessage}
    </div>
  )
}
