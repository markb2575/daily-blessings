import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { answers, classroom, classroom_member, curriculum_questions } from '@/lib/db/schema'
import { ConsoleLogWriter, eq, inArray, and } from 'drizzle-orm'

export async function POST(req: Request) {
    const classroomId = req.headers.get('classroomId')
    const questionData = req.headers.get('questionData')
    const userId = req.headers.get('userId')
    if (classroomId === null || questionData === "" || userId === null || questionData === null) {
        return Response.json({ error: "Incorrect Headers" }, { status: 400 });
    }
    JSON.parse(questionData).forEach(async (value: any, index: number) => {
        let formattedAnswer = value.answer
        if (value.isFillInTheBlank) {
            formattedAnswer = JSON.stringify(value.answer)
        }
        
        await db.insert(answers).values({ questionId: Number(value.questionId), classroomId: Number(classroomId), answer: formattedAnswer, userId: userId }).onDuplicateKeyUpdate({ set: {answer: formattedAnswer}})
    })
    return Response.json({ status: 200 });
}