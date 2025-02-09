'use client'
import { authClient } from '@/lib/auth-client'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import React from 'react'

export default function Classroom({
    params
}: {
    params: Promise<{ classroomId: string }>
}) {
    const session = authClient.useSession()
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
    useEffect(() => {
        if (!session.data) return
        checkUserInClass()
    }, [session.data])
    if (userInClass === false) return null

    return <div>{classroomId}</div>
}
