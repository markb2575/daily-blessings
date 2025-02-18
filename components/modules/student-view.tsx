'use client'

import { authClient } from '@/lib/auth-client'
import { useEffect, useState } from 'react'
import QAList from './qa-list'

// type QuestionData = {
//     questionId: number,
//     isFillInTheBlank: boolean,
//     question: string,
//     curriculumId: number, 
//     dayIndex: number
// } | null
export default function StudentView({curriculumId, classroomId, dayIndex}:{curriculumId:number, classroomId:number, dayIndex:number}) {
    const session = authClient.useSession()



    // if (questionData === null) return null
    return (
        <>
        <QAList curriculumId={curriculumId} dayIndex={dayIndex} classroomId={classroomId}/>
        </>
    )
}
