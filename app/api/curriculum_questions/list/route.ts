import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { classroom, classroom_member, curriculum_questions } from '@/lib/db/schema'
import { eq, inArray } from 'drizzle-orm'
import { request } from 'http'
import { generateCode } from '@/lib/utils'

export async function GET(req: Request) {
    const questionIdsHeader = req.headers.get('questionIds')
    if (!questionIdsHeader) {
        return new Response(JSON.stringify({ error: "Missing header values" }), { status: 400 });
    }

    let questionIds: number[];
    try {
        questionIds = JSON.parse(questionIdsHeader);
    } catch (parseError) {
        return new Response(
            JSON.stringify({ error: "Invalid 'questionIds' format. Expected a JSON array." }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    if (!Array.isArray(questionIds) || !questionIds.every(id => typeof id === 'number')) {
        return new Response(
            JSON.stringify({ error: "'questionIds' must be an array of numbers." }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }
    const questions = await db.select({question:curriculum_questions.question, isFillInTheBlank:curriculum_questions.isFillInTheBlank, questionId:curriculum_questions.questionId}).from(curriculum_questions).where(inArray(curriculum_questions.questionId, questionIds))
    return new Response(JSON.stringify(questions), { status: 200 });
}
