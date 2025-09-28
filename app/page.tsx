'use client'

import { authClient } from '@/lib/auth-client'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LogOut, Settings, User } from 'lucide-react'
import Navbar from '@/components/ui/navbar'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import CreateClassroom from '@/components/modules/create-classroom'
import JoinClassroom from '@/components/modules/join-classroom'
import { ClassTable } from '@/components/modules/class-table'

export default function Home() {
    const [role, setRole] = useState('none')
    const session = authClient.useSession()
    const handleSignOut = async () => {
        await authClient.signOut()
        redirect('/login')
    }

    // const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    useEffect(() => {
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
        checkRole()
    }, [session.data?.session.userId])



    const [isLoading, setIsLoading] = useState(true)
    const refreshClasses = () => {
        setIsLoading(prev => !prev); // Toggle state to trigger useEffect
    };

    if (role !== 'none') {
        return (
            <div className='flex min-h-screen font-Open_Sans'>
                <Navbar
                    left={
                        <div className='flex items-center gap-4'>
                            <div className='size-8 rounded-md bg-gray-200' />
                        </div>
                    }
                    right={
                        <div className='flex items-center gap-3'>
                            {/* <button className='hover:scale-200 rounded bg-yellow-200 px-2 py-2 text-[15px] font-semibold text-yellow-500 transition duration-200 hover:-translate-y-1 hover:bg-yellow-500 hover:text-white'>
                                    Blessings Shop
                                </button> */}

                            {role === 'teacher' ? 
                            <div className='flex gap-1'>
                                <CreateClassroom refreshClasses={refreshClasses} />
                                <JoinClassroom role={role} refreshClasses={refreshClasses} />
                            </div> : 
                            <JoinClassroom role={role} refreshClasses={refreshClasses} />
                            }
                            

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
                        </div>
                    }
                />

                <div className='mx-10 mt-24 w-full'>
                    <ClassTable role={role} isLoading={isLoading} setIsLoading={setIsLoading} refreshClasses={refreshClasses}/>
                </div>
            </div>
        )
    } else {
        return null
    }
}
