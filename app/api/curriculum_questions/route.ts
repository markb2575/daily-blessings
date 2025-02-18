import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { answers, classroom, classroom_member, curriculum_questions } from '@/lib/db/schema'
import { ConsoleLogWriter, eq, inArray, and } from 'drizzle-orm'

export async function GET(req: Request) {
    // Extract headers
    const dayIndex = req.headers.get('dayIndex');
    const curriculumId = req.headers.get('curriculumId');
    const classroomId = req.headers.get('classroomId');
    const userId = req.headers.get('userId');

    // Validate headers
    if (dayIndex === null || curriculumId === null || classroomId === null || userId === null) {
        return Response.json({ error: "Incorrect Headers" }, { status: 400 });
    }

    try {
        // Fetch questions based on dayIndex and curriculumId
        const result = await db.select().from(curriculum_questions).where(
            and(
                eq(curriculum_questions.dayIndex, Number(dayIndex)),
                eq(curriculum_questions.curriculumId, Number(curriculumId))
            )
        );

        // Map over the questions and fetch answers for each question
        const questionsWithAnswers = await Promise.all(result.map(async (value) => {
            // Fetch the answer for the current questionId, classroomId, and userId
            const answerResult = await db.select().from(answers).where(
                and(
                    eq(answers.classroomId, Number(classroomId)),
                    eq(answers.userId, userId),
                    eq(answers.questionId, value.questionId)
                )
            );

            // Use the fetched answer if it exists, otherwise default to ""
            const answer = answerResult.length > 0 ? answerResult[0].answer : "";
            // console.log(answer,"asefas")
            // Return the updated question object with the answer
            return {
                ...value,
                answer: answer,
            };
        }));

        // Return the final response with questions and their answers
        return Response.json({
            questions: questionsWithAnswers,
        });

    } catch (error) {
        console.error("Error fetching data:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
