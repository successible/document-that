import { useEffect } from 'react'
import { useImmer } from 'use-immer'

export const useMounted = () => {
  const [mounted, setMounted] = useImmer(false)
  useEffect(() => {
    setMounted(true)
  }, [setMounted])
  return { mounted, setMounted }
}
