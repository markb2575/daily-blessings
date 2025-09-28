'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Users, BookOpen } from 'lucide-react'
import { SetStateAction, Dispatch, useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import CreateClassroom from './create-classroom'
import JoinClassroom from './join-classroom'

export function ClassTable({
    role,
    isLoading,
    setIsLoading,
    refreshClasses
}: {
    role: string
    isLoading: boolean
    setIsLoading: Dispatch<SetStateAction<boolean>>
    refreshClasses: () => void
}) {
    const [classes, setClasses] = useState<
        { classroomName: string; classroomId: string }[]
    >([])
    const [studentCounts, setStudentCounts] = useState<Record<string, number>>(
        {}
    )
    const session = authClient.useSession()
    const router = useRouter()

    useEffect(() => {
        const fetchStudentCounts = async (
            classrooms: { classroomName: string; classroomId: string }[]
        ) => {
            const counts: Record<string, number> = {}

            for (const classroom of classrooms) {
                try {
                    const response = await fetch(
                        '/api/classroom/student-count',
                        {
                            method: 'GET',
                            headers: {
                                classroomId: classroom.classroomId,
                                userId: session.data?.session.userId || ''
                            }
                        }
                    )

                    if (response.ok) {
                        const data = await response.json()
                        counts[classroom.classroomId] = data.studentCount
                    } else {
                        counts[classroom.classroomId] = 0
                    }
                } catch (error) {
                    console.error(
                        `Error fetching student count for classroom ${classroom.classroomId}:`,
                        error
                    )
                    counts[classroom.classroomId] = 0
                }
            }

            setStudentCounts(counts)
        }
        const fetchClasses = async () => {
            try {
                const response = await fetch('/api/classroom/list', {
                    method: 'GET',
                    headers: {
                        userId: session.data?.session.userId || ''
                    }
                })

                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }

                const data = await response.json()
                setClasses(data.classrooms)

                // Fetch student counts for all classrooms
                await fetchStudentCounts(data.classrooms)

                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching classes:', error)
                setIsLoading(false)
            }
        }

        if (session.data?.session.userId) {
            fetchClasses()
        }
    }, [session.data?.session.userId, isLoading, setIsLoading])

    if (isLoading) {
        return (
            <div className='flex justify-center md:pt-16'>
                <div className='grid w-full max-w-5xl grid-cols-1 place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                    {[...Array(8)].map((_, index) => (
                        <Card key={index} className='h-48 w-60 rounded-lg'>
                            <div className='flex h-full animate-pulse flex-col justify-between rounded-lg bg-muted p-6'>
                                <div>
                                    <div className='h-5 w-3/4 rounded bg-muted-foreground/20'></div>
                                    <div className='mt-2 h-3 w-1/4 rounded bg-muted-foreground/20'></div>
                                </div>
                                <div className='space-y-3'>
                                    <div className='h-3 w-1/2 rounded bg-muted-foreground/20'></div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (classes.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center py-16 text-center'>
                <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
                    <BookOpen className='h-8 w-8 text-muted-foreground' />
                </div>
                <h3 className='mb-2 text-lg font-semibold text-foreground'>
                    No classes found
                </h3>
                <p className='max-w-sm text-muted-foreground'>
                    {role === 'teacher'
                        ? "You haven't created any classes yet. Create your first class to get started."
                        : "You're not enrolled in any classes yet. Ask your teacher for a class code to join."}
                </p>
            </div>
        )
    }

    return (
        <div className='flex justify-center md:pt-16 pb-8'>
            <div className='grid w-full max-w-5xl grid-cols-1 place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {classes.map(classroom => (
                    <Card
                        key={classroom.classroomId}
                        className='group h-48 w-60 cursor-pointer border-border/50 transition-all duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10'
                        onClick={() =>
                            router.push('/classroom/' + classroom.classroomId)
                        }
                    >
                        <CardHeader className='relative overflow-hidden pb-3'>
                            <div className='absolute inset-0 rounded-md bg-gradient-to-br from-primary/10 via-primary/5 to-transparent' />
                            <div className='relative flex items-start justify-between'>
                                <div className='min-w-0 flex-1'>
                                    <CardTitle className='truncate text-lg font-semibold text-foreground transition-colors duration-200 group-hover:text-primary'>
                                        {classroom.classroomName}
                                    </CardTitle>
                                    <p className='mt-1 text-sm capitalize text-muted-foreground'>
                                        {role}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className='pt-0'>
                            <div className='space-y-3'>
                                <div className='flex flex-col text-sm text-muted-foreground'>
                                    <div className='flex items-center gap-1 pt-3'>
                                        <Users className='h-4 w-4' />
                                        <span>
                                            {studentCounts[
                                                classroom.classroomId
                                            ] || 0}{' '}
                                            students
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-1 pt-3'>
                                        <BookOpen className='h-4 w-4' />
                                        <span>
                                            {(() => {
                                                const today = new Date()
                                                let target = new Date(
                                                    today.getFullYear(),
                                                    8,
                                                    11
                                                ) // September = 8 (0-based month index)

                                                // If today is past 9/11 this year, move to next year
                                                if (today > target) {
                                                    target = new Date(
                                                        today.getFullYear() + 1,
                                                        8,
                                                        11
                                                    )
                                                }

                                                // Difference in days
                                                const diffTime =
                                                    target.getTime() -
                                                    today.getTime()
                                                const diffDays = Math.ceil(
                                                    diffTime /
                                                        (1000 * 60 * 60 * 24)
                                                )

                                                return `${diffDays} days left`
                                            })()}
                                        </span>
                                    </div>
                                </div>

                                {/* <div className='flex items-center justify-between'>
                                <div className='text-xs text-muted-foreground'>
                                    Last activity:{' '}
                                    {Math.floor(Math.random() * 7) + 1}d ago
                                </div>
                                <div className='h-2 w-2 animate-pulse rounded-full bg-accent' />
                            </div> */}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {role === 'teacher' ? (
                    <Card className="flex flex-col items-center justify-center h-48 w-60 border-2 border-dashed border-border/50 gap-2">
                        <CreateClassroom refreshClasses={refreshClasses} />
                        <JoinClassroom role={role} refreshClasses={refreshClasses} />
                    </Card>
                ) : (
                    <Card className="flex flex-col items-center justify-center h-48 w-60 border-2 border-dashed border-border/50">
                        <JoinClassroom role={role} refreshClasses={refreshClasses} />
                    </Card>
                )}
            </div>
        </div>
    )
}
