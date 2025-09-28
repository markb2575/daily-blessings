'use client'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '../ui/card'
import { ChangeEvent, useEffect, useState, useRef } from 'react'
import { Input } from '../ui/input'
import React from 'react'
import { authClient } from '@/lib/auth-client'
import { Check } from 'lucide-react'
import { QuestionData } from '@/lib/types'


export default function QAList({
    curriculumId,
    dayIndex,
    classroomId
}: {
    curriculumId: number
    dayIndex: number
    classroomId: number
}) {
    const session = authClient.useSession()
    const [questionData, setQuestionData] = useState<QuestionData[]>([])
    const [isSaved, setIsSaved] = useState(true)
    const questionDataRef = useRef(questionData)
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const getTodaysQuestions = async () => {
            await fetch('/api/curriculum_questions', {
                method: 'GET',
                headers: {
                    dayIndex: dayIndex.toString() || '',
                    curriculumId: curriculumId.toString() || '',
                    classroomId: classroomId.toString() || '',
                    userId: session.data?.user.id.toString() || ''
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok')
                    }
                    return response.json()
                })
                .then(data => {
                    console.log(data)
                    setQuestionData(
                        data.questions.map((value: QuestionData) => {
                            if (!value.isFillInTheBlank) return value
                            // console.log(value)

                            const parsedAnswer =
                                value.answer === ''
                                    ? []
                                    : JSON.parse(value.answer as string)
                            return {
                                ...value,
                                answer: Array.isArray(parsedAnswer)
                                    ? parsedAnswer
                                    : [parsedAnswer]
                            }
                        })
                        // data.questions
                    )
                })
        }
        getTodaysQuestions()
    }, [classroomId, curriculumId, dayIndex, session.data?.user.id])

    useEffect(() => {
        questionDataRef.current = questionData
    }, [questionData])



    useEffect(() => {
        const saveData = async () => {
            try {
                console.log('hhh', questionDataRef.current)
                await fetch('/api/answers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        classroomId: classroomId.toString() || '',
                        userId: session.data?.user.id.toString() || ''
                    },
                    body: JSON.stringify({ questionData: questionDataRef.current })
                })
            } catch (error) {
                console.error('Error saving data:', error)
            }
        }
        const debounceSave = () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current)
            }
            setIsSaved(false)
            saveTimeoutRef.current = setTimeout(() => {
                saveData()
                setIsSaved(true)
            }, 2000)
        }
        debounceSave()
    }, [questionData, classroomId, session.data?.user.id])

    const handleOnTextChange = (
        e: ChangeEvent<HTMLTextAreaElement>,
        i: number
    ) => {
        setQuestionData(prev =>
            prev.map((item, index) =>
                index === i ? { ...item, answer: e.target.value } : item
            )
        )
    }

    const handleOnBlankChange = (
        e: ChangeEvent<HTMLInputElement>,
        i: number,
        blank_index: number
    ) => {
        setQuestionData(prev =>
            prev.map((item: QuestionData, index) => {
                if (index === i) {
                    const new_answer = [
                        ...(Array.isArray(item.answer) ? item.answer : [])
                    ]
                    new_answer[blank_index] = e.target.value
                    // console.log(new_answer)
                    return { ...item, answer: new_answer }
                }
                return item
            })
        )
    }

    return (
        <Card className='mb-10 flex h-fit w-full flex-col gap-4 p-5 border-0 shadow-none md:w-1/2 md:border-2 md:border md:shadow-sm'>
            <a
                className='bibleref mb-1 text-sm text-gray-500'
                target='_BLANK'
                href={`https://www.biblegateway.com/passage/?search=${questionData[0]?.bibleReference}&version=NKJV&src=tools`}
            >
                {questionData[0]?.bibleReference}
            </a>
            {questionData.map((v, i) => (
                <div key={i}>
                    {/* Do NOT show bibleReference or bibleVerses here */}
                    {v.isFillInTheBlank ? (
                        <div>
                            {v.question
                                .split('_')
                                .map((blank_value, blank_index, arr) => (
                                    <React.Fragment key={blank_index}>
                                        <span className='mb-2 inline'>
                                            {blank_value}
                                        </span>
                                        {blank_index < arr.length - 1 && (
                                            <Input
                                                value={v.answer[blank_index]}
                                                className='mx-2 mb-2 inline w-32 rounded-none border-0 border-b-2 align-middle focus-visible:border-b-blue-700 focus-visible:ring-0'
                                                onChange={e =>
                                                    handleOnBlankChange(
                                                        e,
                                                        i,
                                                        blank_index
                                                    )
                                                }
                                            />
                                        )}
                                    </React.Fragment>
                                ))}
                        </div>
                    ) : (
                        <>
                            <div className='mb-2'>{v?.question}</div>
                            <Textarea
                                value={v.answer}
                                placeholder='Enter your answer here.'
                                className='resize-none'
                                onChange={e => handleOnTextChange(e, i)}
                            />
                        </>
                    )}
                </div>
            ))}
            {isSaved ? (
                <div className='flex gap-1 text-sm'>
                    Saved
                    <Check size={20} />
                </div>
            ) : (
                <div className='text-sm'>Saving...</div>
            )}
        </Card>
    )
}
