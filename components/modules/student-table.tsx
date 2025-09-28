'use client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { ArrowLeft, ArrowRight, Calendar, Check, X } from 'lucide-react'
import { ModalData, StudentData, TableData } from '@/lib/types'
import { Button } from '../ui/button'

export default function StudentTable({
    classroomId,
    setModalData,
    setModalOpened
}: {
    classroomId: number
    setModalData: Dispatch<SetStateAction<ModalData>>
    setModalOpened: Dispatch<SetStateAction<boolean>>
}) {
    const [tableData, setTableData] = useState<TableData>(null)
    const [tablePage, setTablePage] = useState(0)

    const showAnswers = async (
        answers: { answer: string; questionId: number }[]
    ) => {
        if (answers.every(answer => answer.answer.trim() === '')) {
            return
        }
        try {
            // Step 1: Extract questionIds from the answers array
            const questionIds = answers.map(answer => answer.questionId)

            // Step 2: Fetch data from the API
            const response = await fetch('/api/curriculum_questions/list', {
                method: 'GET',
                headers: {
                    questionIds: JSON.stringify(questionIds) // Serialize as JSON string
                }
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            // Step 3: Parse the fetched data
            const data: {
                isFillInTheBlank: boolean
                question: string
                questionId: number
            }[] = await response.json()

            // Step 4: Combine answers and fetched data into modalData format
            const combinedData = answers.map(answer => {
                const matchingQuestion = data.find(
                    q => q.questionId === answer.questionId
                )
                return {
                    answer: answer.answer,
                    question: matchingQuestion?.question || '', // Use empty string if no match
                    isFillInTheBlank:
                        matchingQuestion?.isFillInTheBlank || false // Default to false if no match
                }
            })

            // Step 5: Update the modalData state
            setModalData(combinedData)
            setModalOpened(true)

            // console.log('Combined Data:', combinedData);
        } catch (error) {
            console.error('Error fetching curriculum questions:', error)
        }
    }

    useEffect(() => {
        const getAnswerTable = async () => {
            await fetch('/api/answers/list', {
                method: 'GET',
                headers: {
                    classroomId: classroomId.toString() || '',
                    tablePage: tablePage.toString() || ''
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok')
                    }
                    return response.json()
                })
                .then(data => {
                    setTableData(data)
                })
        }
        getAnswerTable()
    }, [tablePage, classroomId])

    if (tableData === null) {
        return (null)
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-center gap-4'>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setTablePage(prev => Math.max(0, prev - 1))}
                    disabled={tablePage === 0}
                    className='gap-2 border-border hover:bg-accent'
                >
                    <ArrowLeft className='h-4 w-4' />
                    Previous
                </Button>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <Calendar className='h-4 w-4' />
                    Week {tablePage + 1}
                </div>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setTablePage(prev => prev + 1)}
                    className='gap-2 border-border hover:bg-accent'
                >
                    Next
                    <ArrowRight className='h-4 w-4' />
                </Button>
            </div>

            <div className='max-h-fit w-screen overflow-x-auto md:rounded-md border-0 md:border md:w-[640px]'>
                <div className='border-none min-w-[300px] rounded-lg bg-card shadow-sm'>
                    <Table>
                        <TableHeader>
                            <TableRow className='border-border hover:bg-transparent'>
                                <TableHead className='bg-muted/50 text-center font-semibold text-foreground'>
                                    Name
                                </TableHead>
                                <TableHead className='bg-muted/50 text-center font-semibold text-foreground'>
                                    Sun
                                    <br />
                                    <span className='text-xs text-muted-foreground'>
                                        {tableData.dates[0].split('/')[0]}/
                                        {tableData.dates[0].split('/')[1]}
                                    </span>
                                </TableHead>
                                <TableHead className='bg-muted/50 text-center font-semibold text-foreground'>
                                    Mon
                                    <br />
                                    <span className='text-xs text-muted-foreground'>
                                        {tableData.dates[1].split('/')[0]}/
                                        {tableData.dates[1].split('/')[1]}
                                    </span>
                                </TableHead>
                                <TableHead className='bg-muted/50 text-center font-semibold text-foreground'>
                                    Tue
                                    <br />
                                    <span className='text-xs text-muted-foreground'>
                                        {tableData.dates[2].split('/')[0]}/
                                        {tableData.dates[2].split('/')[1]}
                                    </span>
                                </TableHead>
                                <TableHead className='bg-muted/50 text-center font-semibold text-foreground'>
                                    Wed
                                    <br />
                                    <span className='text-xs text-muted-foreground'>
                                        {tableData.dates[3].split('/')[0]}/
                                        {tableData.dates[3].split('/')[1]}
                                    </span>
                                </TableHead>
                                <TableHead className='bg-muted/50 text-center font-semibold text-foreground'>
                                    Thu
                                    <br />
                                    <span className='text-xs text-muted-foreground'>
                                        {tableData.dates[4].split('/')[0]}/
                                        {tableData.dates[4].split('/')[1]}
                                    </span>
                                </TableHead>
                                <TableHead className='bg-muted/50 text-center font-semibold text-foreground'>
                                    Fri
                                    <br />
                                    <span className='text-xs text-muted-foreground'>
                                        {tableData.dates[5].split('/')[0]}/
                                        {tableData.dates[5].split('/')[1]}
                                    </span>
                                </TableHead>
                                <TableHead className='bg-muted/50 text-center font-semibold text-foreground'>
                                    Sat
                                    <br />
                                    <span className='text-xs text-muted-foreground'>
                                        {tableData.dates[6].split('/')[0]}/
                                        {tableData.dates[6].split('/')[1]}
                                    </span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tableData.students.length ? (
                                tableData.students.map(
                                    (row: StudentData, index) => (
                                        <TableRow
                                            key={index}
                                            className='border-border transition-colors hover:bg-accent/50'
                                        >
                                            <TableCell className="text-center font-medium text-foreground">
                                            {row.studentName.split(" ")[0]}{" "}
                                            {row.studentName.split(" ")[1]?.[0]}.
                                            </TableCell>
                                            <TableCell
                                                className='text-center transition-colors hover:cursor-pointer hover:bg-accent'
                                                onClick={() => {
                                                    showAnswers(row.sun.answers)
                                                }}
                                            >
                                                {row.sun.completed ? (
                                                    <Check className='text-green-500 mx-auto h-5 w-5' />
                                                ) : (
                                                    <X className='mx-auto h-5 w-5 text-black/50' />
                                                )}
                                            </TableCell>
                                            <TableCell
                                                className='text-center transition-colors hover:cursor-pointer hover:bg-accent'
                                                onClick={() => {
                                                    showAnswers(row.mon.answers)
                                                }}
                                            >
                                                {row.mon.completed ? (
                                                    <Check className='text-green-500 mx-auto h-5 w-5' />
                                                ) : (
                                                    <X className='mx-auto h-5 w-5 text-black/50' />
                                                )}
                                            </TableCell>
                                            <TableCell
                                                className='text-center transition-colors hover:cursor-pointer hover:bg-accent'
                                                onClick={() => {
                                                    showAnswers(
                                                        row.tues.answers
                                                    )
                                                }}
                                            >
                                                {row.tues.completed ? (
                                                    <Check className='text-green-500 mx-auto h-5 w-5' />
                                                ) : (
                                                    <X className='mx-auto h-5 w-5 text-black/50' />
                                                )}
                                            </TableCell>
                                            <TableCell
                                                className='text-center transition-colors hover:cursor-pointer hover:bg-accent'
                                                onClick={() => {
                                                    showAnswers(row.wed.answers)
                                                }}
                                            >
                                                {row.wed.completed ? (
                                                    <Check className='text-green-500 mx-auto h-5 w-5' />
                                                ) : (
                                                    <X className='mx-auto h-5 w-5 text-black/50' />
                                                )}
                                            </TableCell>
                                            <TableCell
                                                className='text-center transition-colors hover:cursor-pointer hover:bg-accent'
                                                onClick={() => {
                                                    showAnswers(
                                                        row.thurs.answers
                                                    )
                                                }}
                                            >
                                                {row.thurs.completed ? (
                                                    <Check className='text-green-500 mx-auto h-5 w-5' />
                                                ) : (
                                                    <X className='mx-auto h-5 w-5 text-black/50' />
                                                )}
                                            </TableCell>
                                            <TableCell
                                                className='text-center transition-colors hover:cursor-pointer hover:bg-accent'
                                                onClick={() => {
                                                    showAnswers(row.fri.answers)
                                                }}
                                            >
                                                {row.fri.completed ? (
                                                    <Check className='text-green-500 mx-auto h-5 w-5' />
                                                ) : (
                                                    <X className='mx-auto h-5 w-5 text-black/50' />
                                                )}
                                            </TableCell>
                                            <TableCell
                                                className='text-center transition-colors hover:cursor-pointer hover:bg-accent'
                                                onClick={() => {
                                                    showAnswers(row.sat.answers)
                                                }}
                                            >
                                                {row.sat.completed ? (
                                                    <Check className='text-green-500 mx-auto h-5 w-5' />
                                                ) : (
                                                    <X className='mx-auto h-5 w-5 text-black/50' />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )
                                )
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className='h-24 text-center text-muted-foreground'
                                    >
                                        No students found for this week.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
