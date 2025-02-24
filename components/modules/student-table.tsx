'use client'
import { Textarea } from "@/components/ui/textarea"
import { Card } from "../ui/card"
import { ChangeEvent, useEffect, useState, useRef } from "react"
import { Input } from "../ui/input"
import React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { authClient } from '@/lib/auth-client'
import { ArrowLeft, ArrowRight, Check, MoveLeft, MoveRight } from "lucide-react"
import { Button } from "../ui/button"

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
    answers: string[]
}

export default function StudentTable({ classroomId }: { classroomId: number }) {

    const [tableData, setTableData] = useState<TableData>(null)
    const [tablePage, setTablePage] = useState(0)

    const getAnswerTable = async () => {
        // console.log(tablePage)
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
            <div className="flex justify-evenly mb-2 select-none">
                <ArrowLeft onClick={() => setTablePage((prev) => prev - 1)} className="hover:opacity-50"/>
                <ArrowRight onClick={() => setTablePage((prev) => prev + 1)} className="hover:opacity-50"/>
            </div>
            <div className="w-full max-w-[80vw] sm:max-w-[40vw] overflow-x-auto rounded-md border max-h-fit">
                <div className="min-w-[640px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-left">Name</TableHead>
                                <TableHead className="text-left">Sun<br/>{tableData.dates[0].split('/')[0]}/{tableData.dates[0].split('/')[1]}</TableHead>
                                <TableHead className="text-left">Mon<br/>{tableData.dates[1].split('/')[0]}/{tableData.dates[1].split('/')[1]}</TableHead>
                                <TableHead className="text-left">Tues<br/>{tableData.dates[2].split('/')[0]}/{tableData.dates[2].split('/')[1]}</TableHead>
                                <TableHead className="text-left">Wed<br/>{tableData.dates[3].split('/')[0]}/{tableData.dates[3].split('/')[1]}</TableHead>
                                <TableHead className="text-left">Thurs<br/>{tableData.dates[4].split('/')[0]}/{tableData.dates[4].split('/')[1]}</TableHead>
                                <TableHead className="text-left">Fri<br/>{tableData.dates[5].split('/')[0]}/{tableData.dates[5].split('/')[1]}</TableHead>
                                <TableHead className="text-left">Sat<br/>{tableData.dates[6].split('/')[0]}/{tableData.dates[6].split('/')[1]}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tableData.students.length ? (
                                tableData.students.map((row: StudentData, index) => (
                                    <TableRow
                                        key={index}
                                    >
                                        <TableCell className="text-left">
                                            {row.studentName}
                                        </TableCell>
                                        <TableCell className="justify-items-left">
                                            {row.sun.completed && <Check />}
                                        </TableCell>
                                        <TableCell className="justify-items-left">
                                            {row.mon.completed && <Check />}
                                        </TableCell>
                                        <TableCell className="justify-items-left">
                                            {row.tues.completed && <Check />}
                                        </TableCell>
                                        <TableCell className="justify-items-left">
                                            {row.wed.completed && <Check />}
                                        </TableCell>
                                        <TableCell className="justify-items-left">
                                            {row.thurs.completed && <Check />}
                                        </TableCell>
                                        <TableCell className="justify-items-left">
                                            {row.fri.completed && <Check />}
                                        </TableCell>
                                        <TableCell className="justify-items-left">
                                            {row.sat.completed && <Check />}
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