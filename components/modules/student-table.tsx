'use client'
import { useEffect, useState } from "react"
import React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ArrowLeft, ArrowRight, Check, MoveLeft, MoveRight, X } from "lucide-react"


type TableData = {
    students: StudentData[],
    dates: string[],
    indices: number[]
} | null

type StudentData = {
    studentName: string,
    mon: DayData,
    tues: DayData,
    wed: DayData,
    thurs: DayData,
    fri: DayData,
    sat: DayData,
    sun: DayData,
}

type DayData = {
    completed: boolean,
    answers: { answer: string; questionId: number }[];
}

export default function StudentTable({ classroomId, showAnswers }: { classroomId: number; showAnswers: Function }) {

    const [tableData, setTableData] = useState<TableData>(null)
    const [tablePage, setTablePage] = useState(0)

    const getAnswerTable = async () => {
        await fetch('/api/answers/list', {
            method: 'GET',
            headers: {
                classroomId: classroomId.toString() || '',
                tablePage: tablePage.toString() || ''
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.json()
        }).then(data => {
            setTableData(data)
            console.log(data)
        })
    }

    useEffect(() => {
        getAnswerTable()
    }, [tablePage])

    if (tableData === null) return

    return (
        <div>
            <div className="flex justify-evenly mb-4 select-none">
                <ArrowLeft onClick={() => setTablePage((prev) => prev - 1)} className="hover:opacity-50 cursor-pointer" />
                <ArrowRight onClick={() => setTablePage((prev) => prev + 1)} className="hover:opacity-50 cursor-pointer" />
            </div>

                <div className="w-[340px] md:w-[640px] overflow-x-auto rounded-md border max-h-fit">
                    <div >
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">Name</TableHead>
                                    <TableHead className="text-center">Sun<br />{tableData.dates[0].split('/')[0]}/{tableData.dates[0].split('/')[1]}</TableHead>
                                    <TableHead className="text-center">Mon<br />{tableData.dates[1].split('/')[0]}/{tableData.dates[1].split('/')[1]}</TableHead>
                                    <TableHead className="text-center">Tues<br />{tableData.dates[2].split('/')[0]}/{tableData.dates[2].split('/')[1]}</TableHead>
                                    <TableHead className="text-center">Wed<br />{tableData.dates[3].split('/')[0]}/{tableData.dates[3].split('/')[1]}</TableHead>
                                    <TableHead className="text-center">Thurs<br />{tableData.dates[4].split('/')[0]}/{tableData.dates[4].split('/')[1]}</TableHead>
                                    <TableHead className="text-center">Fri<br />{tableData.dates[5].split('/')[0]}/{tableData.dates[5].split('/')[1]}</TableHead>
                                    <TableHead className="text-center">Sat<br />{tableData.dates[6].split('/')[0]}/{tableData.dates[6].split('/')[1]}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tableData.students.length ? (
                                    tableData.students.map((row: StudentData, index) => (
                                        <TableRow
                                            key={index}
                                            className="hover:bg-white"
                                        >
                                            <TableCell className="text-center">
                                                {row.studentName}
                                            </TableCell>
                                            <TableCell className="justify-items-center hover:bg-gray-100 hover:cursor-pointer" onClick={() => { showAnswers(row.sun.answers) }}>
                                                {row.sun.completed ? <Check color="green" /> : <X color="red" />}
                                            </TableCell>
                                            <TableCell className="justify-items-center hover:bg-gray-100 hover:cursor-pointer" onClick={() => { showAnswers(row.mon.answers) }}>
                                                {row.mon.completed ? <Check color="green" /> : <X color="red" />}
                                            </TableCell>
                                            <TableCell className="justify-items-center hover:bg-gray-100 hover:cursor-pointer" onClick={() => { showAnswers(row.tues.answers) }}>
                                                {row.tues.completed ? <Check color="green" /> : <X color="red" />}
                                            </TableCell>
                                            <TableCell className="justify-items-center hover:bg-gray-100 hover:cursor-pointer" onClick={() => { showAnswers(row.wed.answers) }}>
                                                {row.wed.completed ? <Check color="green" /> : <X color="red" />}
                                            </TableCell>
                                            <TableCell className="justify-items-center hover:bg-gray-100 hover:cursor-pointer" onClick={() => { showAnswers(row.thurs.answers) }}>
                                                {row.thurs.completed ? <Check color="green" /> : <X color="red" />}
                                            </TableCell>
                                            <TableCell className="justify-items-center hover:bg-gray-100 hover:cursor-pointer" onClick={() => { showAnswers(row.fri.answers) }}>
                                                {row.fri.completed ? <Check color="green" /> : <X color="red" />}
                                            </TableCell>
                                            <TableCell className="justify-items-center hover:bg-gray-100 hover:cursor-pointer" onClick={() => { showAnswers(row.sat.answers) }}>
                                                {row.sat.completed ? <Check color="green" /> : <X color="red" />}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24 text-center">
                                            No results.
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