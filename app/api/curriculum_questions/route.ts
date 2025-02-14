import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { classroom, classroom_member, curriculum_questions } from '@/lib/db/schema'
import { ConsoleLogWriter, eq, inArray, and } from 'drizzle-orm'

export async function GET(req: Request) {
    const dayIndex = req.headers.get('dayIndex')
    const curriculumId = req.headers.get('curriculumId')
    console.log(dayIndex, curriculumId, "aaaa")

    if (dayIndex === null || curriculumId === null) {
        return Response.json({ error: "Incorrect Headers" }, { status:400 });
    }
    const result = await db.select().from(curriculum_questions).where(and(eq(curriculum_questions.dayIndex, Number(dayIndex)),eq(curriculum_questions.curriculumId, Number(curriculumId))))

    return Response.json({
        question: result[0]
    })
}
