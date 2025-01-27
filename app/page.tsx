'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Plus, LogOut, Settings, User, LogIn } from 'lucide-react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import Navbar from '@/components/ui/navbar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
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

                setRole(data.role)
            })
    }

    if (role !== 'none') {
        return (
            <div className='font-Open_Sans min-h-screen flex justify-center'>
                <Navbar
                    left={
                        <div className='flex items-center gap-4'>
                            <div className='size-8 rounded-md bg-gray-200' />
                            <div className='cursor-default text-xl font-medium'>
                                Daily Blessings
                            </div>
                        </div>
                    }
                    right={
                        <div className='flex items-center gap-4'>
                            {/* <button className='hover:scale-200 rounded bg-yellow-200 px-2 py-2 text-[15px] font-semibold text-yellow-500 transition duration-200 hover:-translate-y-1 hover:bg-yellow-500 hover:text-white'>
                                Blessings Shop
                            </button> */}

                            <CreateClassroom
                                userId={session.data?.session.userId}
                            />

                            <JoinClassroom />

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

                <div className= 'mt-24 mx-10'>
                    <div className='cursor-default space-y-20 mb-8 text-2xl font-semibold'>
                        Welcome, {session.data?.user.name}! You are a {role}
                    </div>
                    <ClassTable/>
                </div>    
                    
                    
                   

            </div>
        )
    } else {
        return null
    }
}
