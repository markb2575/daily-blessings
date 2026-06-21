'use client'

import { Toaster } from 'sonner'
import { useTheme } from 'next-themes'

export function ThemedToaster() {
    const { resolvedTheme } = useTheme()
    return <Toaster theme={resolvedTheme as 'light' | 'dark'} />
}
