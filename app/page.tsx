'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Plus, LogOut, Settings, User } from 'lucide-react'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from '@/components/ui/card'
import Questions from '@/components/questions'
import Navbar from '@/components/ui/navbar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { Input } from '@/components/ui/input'

// interface DashboardData {
//     date: string;
//     copticDate: string;
//     feast: string;
//     reading: string;
//     bibleUrl: string;
// }

export default function Home() {
    // const [data, setData] = useState<DashboardData | null>(null);
    const [roleChecked, setRoleChecked] = useState(false)
    const session = authClient.useSession()
    const handleSignOut = async () => {
        await authClient.signOut()
        redirect('/login')
    }

    // const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    useEffect(() => {
        checkRole()
    }, [session.data?.session.userId])

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
                console.log(data.role)
                if (data.role === 'none') {
                    redirect('/onboarding')
                }
                setRoleChecked(true)
            })
    }

    if (roleChecked) {
        return (
            <div className='font-Open_Sans grid h-screen place-items-center'>
                <Navbar
                    left={
                        <div className='flex items-center gap-4'>
                            <div className='size-8 rounded-md bg-gray-200' />
                            <div className='text-xl font-medium'>
                                Daily Blessings
                            </div>
                        </div>
                    }
                    right={
                        <div className='flex items-center gap-4'>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Plus/>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='font-Open_Sans my-2 mx-16 bg-white font-medium'>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem className='focus:bg-gray-100'>
                                            <span>Join Class</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className='bg-gray-200' />
                                        <DropdownMenuItem className='focus:bg-gray-100'>
                                            <span>Create Class</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>


                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className='items-center justify-center bg-gray-200 border-4 border-white hover:border-gray-200 size-12'>
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
                                <DropdownMenuContent className='font-Open_Sans mx-2 -my-1 w-40 bg-white font-medium'>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem className='focus:bg-gray-100'>
                                            <Settings />
                                            <span>Settings</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator className='bg-gray-200' />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onClick={handleSignOut}
                                            className='focus:bg-gray-100 focus:text-red-500'
                                        >
                                            <LogOut />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    }
                />
                <div>
                    <div className='space-y-20 text-center text-xl font-semibold text-gray-800'>
                        Welcome, {session.data?.user.name}!
                    </div>
                </div>
            </div>
        )
    } else {
        return null
    }
}
