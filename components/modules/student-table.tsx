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
import { Check } from "lucide-react"

type TableData = {
    studentName: string,
    mon: DayData,
    tues: DayData,
    wed: DayData,
    thurs: DayData,
    fri: DayData,
    sat: DayData,
    sun: DayData
}[]

type DayData = {
    completed: boolean,
    answers: string[]
}

export default function StudentTable({ classroomId }: { classroomId: number }) {

    const [tableData, setTableData] = useState<TableData>([])

    const getAnswerTable = async () => {
        console.log(classroomId)
        await fetch('/api/answers/list', {
            method: 'GET',
            headers: {
                classroomId: classroomId.toString() || '',
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.json()
        }).then(data => {
            setTableData(data)

        })
    }

    useEffect(() => {
        getAnswerTable()
    }, [])


    console.log(tableData, "here")
    if (tableData.length === 0) return

    return (
        <ScrollArea className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Sun</TableHead>
                        <TableHead>Mon</TableHead>
                        <TableHead>Tues</TableHead>
                        <TableHead>Wed</TableHead>
                        <TableHead>Thurs</TableHead>
                        <TableHead>Fri</TableHead>
                        <TableHead>Sat</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableData.length ? (
                        tableData.map((row, index) => (
                            <TableRow
                                key={index}
                            >
                                <TableCell className="text-center">
                                    {row.studentName}
                                </TableCell>
                                <TableCell className="justify-items-center">
                                    {row.sun.completed && <Check />}
                                </TableCell>
                                <TableCell className="justify-items-center">
                                    {row.mon.completed && <Check />}
                                </TableCell>
                                <TableCell className="justify-items-center">
                                    {row.tues.completed && <Check />}
                                </TableCell>
                                <TableCell className="justify-items-center">
                                    {row.wed.completed && <Check />}
                                </TableCell>
                                <TableCell className="justify-items-center">
                                    {row.thurs.completed && <Check />}
                                </TableCell>
                                <TableCell className="justify-items-center">
                                    {row.fri.completed && <Check />}
                                </TableCell>
                                <TableCell className="justify-items-center">
                                    {row.sun.completed && <Check />}
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
        </ScrollArea>
    )
}