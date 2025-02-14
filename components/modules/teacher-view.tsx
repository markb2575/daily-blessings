'use client'

import { authClient } from '@/lib/auth-client'


export default function TeacherView({curriculumId, classroomId}:{curriculumId:number, classroomId:number}) {
    const session = authClient.useSession()


    // const getCurriculums = async () => {
    //     await fetch('/api/curriculum/list', {
    //         method: 'GET'
    //     }).then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok')
    //         }
    //         return response.json()
    //     }).then(data => {
    //         setCurriculums(data.curriculums)
    //     })
    // }

    // useEffect(() => {
    //     getCurriculums()
    // }, [])

    return (
        <div>teacher view</div>
    )
}
