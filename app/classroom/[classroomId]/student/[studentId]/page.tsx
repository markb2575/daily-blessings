'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { redirect } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import Navbar from '@/components/ui/navbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SettingsDialog } from '@/components/modules/settings-dialog'
import { ArrowLeft, Flame, BookOpen, CheckCircle2, Trophy, User, LogOut, Settings } from 'lucide-react'

type StudentStats = {
    studentName: string
    completionRate: number
    currentStreak: number
    longestStreak: number
    totalAnswers: number
    daysCompleted: number
    totalDaysWithQuestions: number
}

function getInitials(name: string) {
    const parts = name.trim().split(' ')
    if (parts.length === 1) return (parts[0][0] ?? '?').toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function StudentDetailPage({
    params,
}: {
    params: Promise<{ classroomId: string; studentId: string }>
}) {
    const router = useRouter()
    const session = authClient.useSession()
    const { classroomId, studentId } = React.use(params)

    const [authorized, setAuthorized] = useState(false)
    const [stats, setStats] = useState<StudentStats | null>(null)
    const [removeOpen, setRemoveOpen] = useState(false)
    const [removing, setRemoving] = useState(false)
    const [settingsOpen, setSettingsOpen] = useState(false)

    const handleSignOut = async () => {
        await authClient.signOut()
        redirect('/login')
    }

    useEffect(() => {
        if (!session.data) return
        const userId = session.data.session.userId

        const checkAccess = async () => {
            const memberRes = await fetch('/api/classroom_member', {
                method: 'GET',
                headers: { classroomId, userId },
            })
            if (!memberRes.ok) { redirect('/'); return }

            const classRes = await fetch('/api/classroom', {
                method: 'GET',
                headers: { classroomId, id: userId },
            })
            if (!classRes.ok) { redirect('/'); return }
            const data = await classRes.json()
            if (data.role?.[0]?.role !== 'teacher') { redirect('/'); return }

            setAuthorized(true)

            fetch('/api/student/stats', {
                method: 'GET',
                headers: { classroomId, studentId },
            })
                .then(r => r.json())
                .then(setStats)
        }

        checkAccess()
    }, [session.data, classroomId, studentId])

    const handleRemove = async () => {
        setRemoving(true)
        try {
            const res = await fetch('/api/classroom_member', {
                method: 'DELETE',
                headers: { classroomId, studentId },
            })
            if (!res.ok) throw new Error()
            router.push(`/classroom/${classroomId}`)
        } catch {
            setRemoving(false)
            setRemoveOpen(false)
        }
    }

    if (!authorized || !stats) return null

    return (
        <div className='flex min-h-screen font-Open_Sans'>
            <Navbar
                left={
                    <button
                        onClick={() => router.push(`/classroom/${classroomId}`)}
                        className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
                    >
                        <ArrowLeft className='h-4 w-4' />
                        Back to classroom
                    </button>
                }
                right={
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className='size-11 cursor-pointer items-center justify-center border-2 border-background bg-muted transition ease-in hover:border-border'>
                                <AvatarImage src={session.data?.user.image ?? undefined} />
                                <User />
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='absolute -right-5 -top-1 w-40 font-Open_Sans font-medium'>
                            <DropdownMenuLabel>{session.data?.user.name}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem className='cursor-pointer' onSelect={() => setTimeout(() => setSettingsOpen(true), 0)}>
                                    <Settings />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem onSelect={handleSignOut} className='cursor-pointer focus:text-red-500'>
                                    <LogOut />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                }
            />

            <div className='mx-auto mt-24 w-full max-w-xl px-4 pb-16 space-y-5'>

                {/* Student identity */}
                <div className='flex items-center gap-4'>
                    <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-lg font-bold text-brand-blue select-none'>
                        {getInitials(stats.studentName)}
                    </div>
                    <div>
                        <h1 className='text-xl font-bold text-foreground leading-tight'>{stats.studentName}</h1>
                        <span className='text-sm text-muted-foreground'>Student</span>
                    </div>
                </div>

                {/* Completion rate — featured */}
                <Card>
                    <CardContent className='px-5 pt-5 pb-5'>
                        <div className='flex items-end justify-between mb-3'>
                            <span className='text-sm font-medium text-muted-foreground'>Completion rate</span>
                            <span className='text-3xl font-bold text-foreground'>{stats.completionRate}%</span>
                        </div>
                        <div className='h-2 w-full overflow-hidden rounded-full bg-muted'>
                            <div
                                className='h-full rounded-full bg-brand-blue transition-all duration-500'
                                style={{ width: `${stats.completionRate}%` }}
                            />
                        </div>
                        <p className='mt-2 text-xs text-muted-foreground'>
                            {stats.daysCompleted} of {stats.totalDaysWithQuestions} days completed
                        </p>
                    </CardContent>
                </Card>

                {/* Secondary stats — even 2×2 grid */}
                <div className='grid grid-cols-2 gap-3'>
                    <Card>
                        <CardContent className='px-4 pt-4 pb-4'>
                            <div className='mb-2 flex items-center gap-1.5'>
                                <Flame className='h-4 w-4 text-orange-500' />
                                <span className='text-xs text-muted-foreground'>Current streak</span>
                            </div>
                            <div className='text-2xl font-bold text-foreground'>{stats.currentStreak}</div>
                            <div className='text-xs text-muted-foreground'>{stats.currentStreak === 1 ? 'day' : 'days'}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className='px-4 pt-4 pb-4'>
                            <div className='mb-2 flex items-center gap-1.5'>
                                <Trophy className='h-4 w-4 text-yellow-500' />
                                <span className='text-xs text-muted-foreground'>Longest streak</span>
                            </div>
                            <div className='text-2xl font-bold text-foreground'>{stats.longestStreak}</div>
                            <div className='text-xs text-muted-foreground'>{stats.longestStreak === 1 ? 'day' : 'days'}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className='px-4 pt-4 pb-4'>
                            <div className='mb-2 flex items-center gap-1.5'>
                                <CheckCircle2 className='h-4 w-4 text-green-500' />
                                <span className='text-xs text-muted-foreground'>Days completed</span>
                            </div>
                            <div className='text-2xl font-bold text-foreground'>{stats.daysCompleted}</div>
                            <div className='text-xs text-muted-foreground'>total</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className='px-4 pt-4 pb-4'>
                            <div className='mb-2 flex items-center gap-1.5'>
                                <BookOpen className='h-4 w-4 text-muted-foreground' />
                                <span className='text-xs text-muted-foreground'>Answers submitted</span>
                            </div>
                            <div className='text-2xl font-bold text-foreground'>{stats.totalAnswers}</div>
                            <div className='text-xs text-muted-foreground'>questions</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Danger zone */}
                <div className='border-t border-border pt-5'>
                    <p className='mb-1 text-sm font-medium text-foreground'>Remove from class</p>
                    <p className='mb-3 text-xs text-muted-foreground'>
                        Removing a student revokes their access.
                    </p>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() => setRemoveOpen(true)}
                        className='border-destructive/40 text-destructive hover:border-destructive/60 hover:bg-destructive/10 hover:text-destructive'
                    >
                        Remove from class
                    </Button>
                </div>
            </div>

            <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />

            <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
                <DialogContent className='max-w-sm'>
                    <DialogHeader>
                        <DialogTitle>Remove student?</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        <span className='font-semibold text-foreground'>{stats.studentName}</span> will be removed from
                        this class.
                    </DialogDescription>
                    <DialogFooter className='gap-2'>
                        <DialogClose asChild>
                            <Button variant='outline' size='sm'>Cancel</Button>
                        </DialogClose>
                        <Button variant='destructive' size='sm' onClick={handleRemove} disabled={removing}>
                            {removing ? 'Removing…' : 'Yes, remove'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
