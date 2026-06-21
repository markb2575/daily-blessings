import { eq, and, inArray, max } from "drizzle-orm";
import { db } from "@/lib/db"; // Assuming you have a Drizzle ORM database connection setup
import { schema } from "@/lib/db/schema";
import { member } from "@/lib/types";

export async function GET(req: Request) {
    try {
        const classroomId = req.headers.get('classroomId');
        const tablePage = req.headers.get('tablePage');
        if (!classroomId || !tablePage) {
            return new Response(JSON.stringify({ error: "Missing header values" }), { status: 400 });
        }

        // Step 1: Get the classroom details
        const classroom = await db.query.classroom.findFirst({
            where: eq(schema.classroom.classroomId, parseInt(classroomId)),
        });

        if (!classroom) {
            return new Response(JSON.stringify({ error: "Classroom not found" }), { status: 404 });
        }

        // Step 2: Calculate the day indices for the current week — use UTC throughout
        // to avoid local-timezone getDate()/setDate() mismatches with the UTC-based day count.
        const createdUTC = Date.UTC(
            new Date(classroom.createdAt).getUTCFullYear(),
            new Date(classroom.createdAt).getUTCMonth(),
            new Date(classroom.createdAt).getUTCDate()
        );
        const now = new Date();
        const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

        const [maxDayRow] = await db
            .select({ maxDay: max(schema.curriculum_day.dayIndex) })
            .from(schema.curriculum_day)
            .where(eq(schema.curriculum_day.curriculumId, classroom.curriculumId));
        const totalWeeks = Math.ceil(((maxDayRow?.maxDay ?? 0) + 1) / 7);

        // Start of the displayed week (Sunday), offset by tablePage weeks
        const weekStartUTC = todayUTC + (Number(tablePage) * 7 * 24 * 60 * 60 * 1000);
        const weekStartDate = new Date(weekStartUTC);
        const sundayOffset = weekStartDate.getUTCDay(); // days since Sunday
        const startOfWeekUTC = weekStartUTC - sundayOffset * 24 * 60 * 60 * 1000;

        const daysOfWeek: DayOfWeek[] = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];
        const dayDates = daysOfWeek.map((_, index) => new Date(startOfWeekUTC + index * 24 * 60 * 60 * 1000));
        const dayIndices = dayDates.map(dayDate =>
            Math.floor((dayDate.getTime() - createdUTC) / (1000 * 60 * 60 * 24))
        );
        // Step 3: Fetch questionIds for each day
        const questions = await db.query.curriculum_questions.findMany({
            where: and(
                eq(schema.curriculum_questions.curriculumId, classroom.curriculumId),
                inArray(schema.curriculum_questions.dayIndex, dayIndices)
            ),
        });
        
        const questionMap: Record<number, number[]> = questions.reduce((acc, q) => {
            if (acc[q.dayIndex]) {
                // If the dayIndex already exists, push the questionId to the array
                acc[q.dayIndex].push(q.questionId);
            } else {
                // Otherwise, initialize the dayIndex with a new array
                acc[q.dayIndex] = [q.questionId];
            }
            return acc;
        }, {} as Record<number, number[]>);

        // Step 4: Fetch all students in the classroom
        const members = await db.query.classroom_member.findMany({
            where: and(
                eq(schema.classroom_member.classroomId, parseInt(classroomId)),
                eq(schema.classroom_member.role, "student")
            ),
        });
        const userIds = members.map((member: member) => member.userId);
        // Step 5: Fetch answers for all students
        const answers = await db.query.answers.findMany({
            where: and(
                inArray(schema.answers.questionId, Object.values(questionMap).flat()),
                inArray(schema.answers.userId, userIds),
                eq(schema.answers.classroomId, parseInt(classroomId))
            ),
        });
        const answerMap = answers.reduce((acc, answer) => {
            if (!acc[answer.userId]) acc[answer.userId] = {};
            acc[answer.userId][answer.questionId] = answer.answer;
            return acc;
        }, {} as Record<string, Record<number, string>>);

        // Step 6: Format the data into the desired JSON structure
        type StudentAnswer = {
            completed: boolean;
            hasQuestions: boolean;
            answers: { answer: string; questionId: number }[];
        };
        type DayOfWeek = "mon" | "tues" | "wed" | "thurs" | "fri" | "sat" | "sun";

        // unsed for now
        // type StudentAnswers = {
        //     [key in DayOfWeek]: StudentAnswer;
        // };

        const students = await Promise.all(
            members.map(async (member: member) => {
                const user = await db.query.user.findFirst({
                    where: eq(schema.user.id, member.userId),
                });
        
                const studentAnswers = daysOfWeek.reduce((acc, day, index) => {
                    const dayIndex = dayIndices[index];
                    const questionIds = questionMap[dayIndex] ?? [];

                    if (questionIds.length === 0) {
                        acc[day] = { completed: false, hasQuestions: false, answers: [] };
                        return acc;
                    }

                    if (
                        !answerMap[member.userId] ||
                        !questionIds.every((id) => id in answerMap[member.userId]!)
                    ) {
                        acc[day] = { completed: false, hasQuestions: true, answers: [] };
                        return acc;
                    }

                    const answers = questionIds
                        .map((id) => {
                            const answer = answerMap[member.userId]?.[id];
                            return answer ? { answer, questionId: id } : null;
                        })
                        .filter((item): item is { answer: string; questionId: number } => item !== null);

                    acc[day] = {
                        completed: answers.length > 0,
                        hasQuestions: true,
                        answers,
                    };
                    return acc;
                }, {} as Record<string, StudentAnswer>);
        
                return {
                    studentId: member.userId,
                    studentName: user?.name || "Unknown",
                    ...studentAnswers,
                };
            })
        );
        // console.log("students", students)
        const firstWeekStart = -(new Date(createdUTC).getUTCDay());
        const table = {
            students,
            dates: dayDates.map((val) => `${val.getUTCMonth() + 1}/${val.getUTCDate()}/${val.getUTCFullYear()}`),
            indices: dayIndices,
            totalWeeks,
            firstWeekStart,
        }
        // console.log(table.indices)
        return new Response(JSON.stringify(table), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}