import { db } from '@/lib/db'
import { schema } from '@/lib/db/schema'
import { eq, and, inArray } from 'drizzle-orm'

export async function GET(req: Request) {
    try {
        const classroomId = req.headers.get('classroomId')
        const studentId = req.headers.get('studentId')

        if (!classroomId || !studentId) {
            return new Response(JSON.stringify({ error: 'Missing headers' }), { status: 400 })
        }

        const classroom = await db.query.classroom.findFirst({
            where: eq(schema.classroom.classroomId, parseInt(classroomId)),
        })
        if (!classroom) {
            return new Response(JSON.stringify({ error: 'Classroom not found' }), { status: 404 })
        }

        const student = await db.query.user.findFirst({
            where: eq(schema.user.id, studentId),
        })
        if (!student) {
            return new Response(JSON.stringify({ error: 'Student not found' }), { status: 404 })
        }

        const createdUTC = Date.UTC(
            new Date(classroom.createdAt).getUTCFullYear(),
            new Date(classroom.createdAt).getUTCMonth(),
            new Date(classroom.createdAt).getUTCDate()
        )
        const now = new Date()
        const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
        const currentDayIndex = Math.floor((todayUTC - createdUTC) / (1000 * 60 * 60 * 24))

        // All distinct days that have questions for this curriculum, up to today
        const questionDayRows = await db
            .selectDistinct({ dayIndex: schema.curriculum_questions.dayIndex })
            .from(schema.curriculum_questions)
            .where(eq(schema.curriculum_questions.curriculumId, classroom.curriculumId))

        const questionDays = questionDayRows
            .map(r => r.dayIndex)
            .filter(d => d <= currentDayIndex)
            .sort((a, b) => a - b)

        if (questionDays.length === 0) {
            return new Response(JSON.stringify({
                studentName: student.name,
                completionRate: 0,
                currentStreak: 0,
                longestStreak: 0,
                totalAnswers: 0,
                daysCompleted: 0,
                totalDaysWithQuestions: 0,
            }), { status: 200 })
        }

        // All questions per day
        const questions = await db.query.curriculum_questions.findMany({
            where: and(
                eq(schema.curriculum_questions.curriculumId, classroom.curriculumId),
                inArray(schema.curriculum_questions.dayIndex, questionDays)
            ),
        })
        const questionMap: Record<number, number[]> = {}
        for (const q of questions) {
            if (!questionMap[q.dayIndex]) questionMap[q.dayIndex] = []
            questionMap[q.dayIndex].push(q.questionId)
        }

        // All answers by this student in this classroom
        const allAnswers = await db.query.answers.findMany({
            where: and(
                eq(schema.answers.userId, studentId),
                eq(schema.answers.classroomId, parseInt(classroomId))
            ),
        })

        const answeredIds = new Set(allAnswers.map(a => a.questionId))

        // Which days are fully completed
        const completedDays = new Set<number>()
        for (const day of questionDays) {
            const qs = questionMap[day] ?? []
            if (qs.length > 0 && qs.every(id => answeredIds.has(id))) {
                completedDays.add(day)
            }
        }

        const daysCompleted = completedDays.size
        const totalDaysWithQuestions = questionDays.length
        const completionRate = totalDaysWithQuestions > 0
            ? Math.round((daysCompleted / totalDaysWithQuestions) * 100)
            : 0
        const totalAnswers = allAnswers.length

        // Current streak — walk backward from the most recent question day
        let currentStreak = 0
        for (let i = questionDays.length - 1; i >= 0; i--) {
            if (completedDays.has(questionDays[i])) {
                currentStreak++
            } else {
                break
            }
        }

        // Longest streak — single forward pass
        let longestStreak = 0
        let tempStreak = 0
        for (const day of questionDays) {
            if (completedDays.has(day)) {
                tempStreak++
                if (tempStreak > longestStreak) longestStreak = tempStreak
            } else {
                tempStreak = 0
            }
        }

        return new Response(JSON.stringify({
            studentName: student.name,
            completionRate,
            currentStreak,
            longestStreak,
            totalAnswers,
            daysCompleted,
            totalDaysWithQuestions,
        }), { status: 200 })
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
    }
}
