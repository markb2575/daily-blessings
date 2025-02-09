'use client'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { redirect } from 'next/navigation'

export function ClassTable({ role, isLoading, setIsLoading }: { role: string, isLoading: boolean, setIsLoading: Function }) {
    const [classes, setClasses] = useState<{ classroomName: string, classroomId: string }[]>([])
    const session = authClient.useSession()

    useEffect(() => {
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
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching classes:', error)
                setIsLoading(false)
            }
        }

        if (session.data?.session.userId) {
            fetchClasses()
        }
    }, [session.data?.session.userId, isLoading])

    if (classes.length === 0) {
        return <div>No classes found.</div>
    }

    return (
        <div className='flex flex-wrap justify-items-start gap-8 align-top'>
            {classes.map((value, index) => (
                <Card
                    key={index}
                    className='bg-gray-100 h-40 w-64 overflow-hidden  hover:border-gray-200 hover:border-2 hover:shadow-lg'
                    onClick={() => redirect("/classroom/"+value.classroomId)}
                >
                    <CardHeader className='pt-2 pl-2 flex-row justify-between items-center bg-gradient-to-r from-blue-500 to-blue-400'>
                    
                        <CardTitle className='text-white'>
                            {value.classroomName}
                        </CardTitle>
                        <div className='flex items-center justify-between'>
                            <Settings2 className="cursor-pointer text-white hover:text-gray-300" size={25} />
                        </div>
                    </CardHeader>
                    
                </Card>
            ))}
        </div>
    )
}


