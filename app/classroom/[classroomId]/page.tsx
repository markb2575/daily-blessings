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
import { classroom } from '@/lib/db/schema'
import Script from 'next/script'

type ClassroomData = {
    classroomId: number,
    curriculumId: number,
    classroomName: string,
    studentCode: string, 
    teacherCode: string | '',
    dayIndex: number
} | null
declare global {
    var BGLinks: {
      version: string;
      linkVerses: () => void;
      apocrypha: boolean;
    };
}

export default function Classroom({
    params
}: {
    params: Promise<{ classroomId: string }>
}) {
    // const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const router = useRouter();
    const [role, setRole] = useState('none')
    // const [dateInfo, setDateInfo] = useState<DateInfoTypes>(null)
    const [classroomData, setClassroomData] = useState<ClassroomData>(null)
    const session = authClient.useSession()
    const classroomId = React.use(params).classroomId

    const getClassroomData = async () => {
        const id = session.data?.session.userId

        if (id == undefined) return
        if (classroomId == undefined) return
        await fetch('/api/classroom', {
            method: 'GET',
            headers: {
                classroomId: classroomId || '',
                id: id || ''
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.json()
        }).then(data => {
            if (data.role === 'none') {
                redirect('/onboarding')
            }
            setClassroomData(data.classroomData)
            // console.log(data)
            setRole(data.role[0].role)
        })
    }

    const handleSignOut = async () => {
        await authClient.signOut()
        redirect('/login')
    }
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

    useEffect(() => {
        if (!session.data) return
        checkUserInClass()
        getClassroomData()
    }, [session.data])
    // console.log(role,"role")
    if (userInClass === false || classroomData === null || role === 'none') return null

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
            <div className='flex mt-24 w-full justify-center'>
                {role === "student" ? (
                    <StudentView curriculumId={classroomData.curriculumId} classroomId={Number(classroomId)} dayIndex={classroomData.dayIndex}/>
                ) : (
                    <TeacherView curriculumId={classroomData.curriculumId} classroomId={Number(classroomId)}/>
                )}
            </div>
            <Script 
                src="https://www.biblegateway.com/public/link-to-us/tooltips/bglinks.js" 
                strategy="afterInteractive"
                onLoad={() => {
                    BGLinks.version = "NKJV";
                    BGLinks.linkVerses();
                    BGLinks.apocrypha = true;
                }}
            />
        </div>
    )
}
