'use client'
import CreateClassroom from '@/components/modules/create-classroom'
import JoinClassroom from '@/components/modules/join-classroom'
import StudentView from '@/components/modules/student-view'
import TeacherView from '@/components/modules/teacher-view'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Navbar from '@/components/ui/navbar'
import { authClient } from '@/lib/auth-client'
import { LogOut, Settings, User } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import React from 'react'
import { useRouter } from 'next/navigation'
import DateInfo from '@/components/modules/date-info'

type DateInfoTypes = {
    date: string,
    copticDate: string,
    feast: string
} | null
 

export default function Classroom({
    params
}: {
    params: Promise<{ classroomId: string }>
}) {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const router = useRouter();
    const [role, setRole] = useState('none')
    const [dateInfo, setDateInfo] = useState<DateInfoTypes>(null)
    const session = authClient.useSession()

    const checkRole = async () => {
        const id = session.data?.session.userId

        if (id == undefined) return
        await fetch('/api/user/role', {
            method: 'GET',
            headers: {
                id: id || ''
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                return response.json()
            })
            .then(data => {
                if (data.role === 'none') {
                    redirect('/onboarding')
                }
                setRole(data.role)
            })
    }

    const handleSignOut = async () => {
        await authClient.signOut()
        redirect('/login')
    }
    const classroomId = React.use(params).classroomId
    const [userInClass, setUserInClass] = useState(false)
    const checkUserInClass = async () => {
        const userId = session.data?.session.userId
        if (userId === undefined) return
        await fetch('/api/classroom_member', {
            method: 'GET',
            headers: {
                classroomId: classroomId || '',
                userId: userId || ''
            }
        }).then(response => {
            if (!response.ok) {
                redirect('/')
            }
            setUserInClass(true)
            return response.json()
        })
    }

    const getDateInfo = async () => {
        await fetch('/api/day', {
            headers: {
                'timezone': userTimeZone,
            }
        }).then(response => {
            if (!response.ok) {
                console.log("ERROR: could not fetch date info")
                return
            }
            return response.json()
        }).then(data => {
            console.log(data)
            setDateInfo(data)
        })
    }

    useEffect(() => {
        if (!session.data) return
        checkUserInClass()
        checkRole()
        getDateInfo()
    }, [session.data])

    if (userInClass === false || dateInfo === null) return null

    return (
        <div className='flex min-h-screen font-Open_Sans'>
            <Navbar
                left={
                    <div className='flex items-center gap-4 hover:cursor-pointer hover:opacity-80' onClick={() => router.push("/")}>
                        <div className='size-8 rounded-md bg-gray-200' />
                        <div className='cursor-default text-xl font-medium hover:cursor-pointer'>
                            Daily Blessings
                        </div>
                    </div>
                }
                right={
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className='size-11 cursor-pointer items-center justify-center border-2 border-white bg-gray-100 transition ease-in hover:border-gray-200'>
                                <AvatarImage
                                    src={
                                        session.data?.user.image
                                            ? session.data?.user.image
                                            : undefined
                                    }
                                />
                                <User />
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='absolute -right-5 -top-1 w-40 bg-white font-Open_Sans font-medium'>
                            <DropdownMenuLabel>
                                {session.data?.user.name}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className='bg-gray-200' />
                            <DropdownMenuGroup>
                                <DropdownMenuItem className='cursor-pointer focus:bg-gray-100'>
                                    <Settings />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator className='bg-gray-200' />
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onClick={handleSignOut}
                                    className='cursor-pointer focus:bg-gray-100 focus:text-red-500'
                                >
                                    <LogOut />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                }

            />
            <div className='mx-10 mt-24'>
                {dateInfo && <DateInfo date={dateInfo.date} copticDate={dateInfo.copticDate} feast={dateInfo.feast}/>}
                {role === "student" ? (
                    <StudentView date={dateInfo.date}/>
                ) : (
                    <TeacherView date={dateInfo.date}/>
                )}
            </div>
        </div>
    )
}
