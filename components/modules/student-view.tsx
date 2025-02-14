'use client'

import { authClient } from '@/lib/auth-client'
import { useEffect, useState } from 'react'

type QuestionData = {
    questionId: number,
    isFillInTheBlank: boolean,
    question: string,
    curriculumId: number, 
    dayIndex: number
} | null
export default function StudentView({curriculumId, classroomId, dayIndex}:{curriculumId:number, classroomId:number, dayIndex:number}) {
    const session = authClient.useSession()

    const [questionData, setQuestionData] = useState<QuestionData>(null)

    const getTodaysQuestion = async () => {
        await fetch('/api/curriculum_questions', {
            method: 'GET',
            headers: {
                dayIndex: dayIndex.toString()|| '',
                curriculumId: curriculumId.toString() || ''
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.json()
        }).then(data => {
            setQuestionData(data.question)
        })
    }

    useEffect(() => {
        getTodaysQuestion()
    }, [])

    if (questionData === null) return null
    return (
        <>
        <div>you are in the student view</div>
        <div>This is todays question:</div>
        <div>{questionData.question}</div>
        <div>{questionData.isFillInTheBlank ? "This question is fill in the blank" : "This question is not fill in the blank"}</div>
        </>
    )
}
