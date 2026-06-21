'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface SettingsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
    const { theme, setTheme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent aria-describedby={undefined} className='max-w-sm font-Open_Sans'>
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>
                <div className='flex items-center justify-between py-2'>
                    <div className='flex items-center gap-2'>
                        {isDark ? <Moon className='size-4' /> : <Sun className='size-4' />}
                        <span className='text-sm font-medium'>Dark mode</span>
                    </div>
                    <button
                        role='switch'
                        aria-checked={isDark}
                        onClick={() => setTheme(isDark ? 'light' : 'dark')}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                            isDark ? 'bg-primary' : 'bg-input'
                        }`}
                    >
                        <span
                            className={`pointer-events-none inline-block size-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                                isDark ? 'translate-x-5' : 'translate-x-0'
                            }`}
                        />
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
