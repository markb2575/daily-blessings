import { eq, and, inArray } from "drizzle-orm";
import { db } from "@/lib/db"; // Assuming you have a Drizzle ORM database connection setup
import { schema } from "@/lib/db/schema";


export async function GET(req: Request) {
    try {
        const classroomId = req.headers.get('classroomId');
        if (!classroomId) {
            return new Response(JSON.stringify({ error: "classroomId header is required" }), { status: 400 });
        }

        // Step 1: Get the classroom details
        const classroom = await db.query.classroom.findFirst({
            where: eq(schema.classroom.classroomId, parseInt(classroomId)),
        });

        if (!classroom) {
            return new Response(JSON.stringify({ error: "Classroom not found" }), { status: 404 });
        }

        // Step 2: Calculate the day indices for the current week
        const createdAtDate = new Date(classroom.createdAt); // Classroom creation date
        const currentDayIndex = classroom.dayIndex; // Current day index from the classroom

        // Helper function to get the start of the week (Monday)
        function getStartOfWeek(date: Date): Date {
            const day = date.getDay(); // 0 (Sunday) to 6 (Saturday)
            const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday as the start of the week
            return new Date(date.setDate(diff));
        }

        // Get the Monday of the current week
        const startOfWeek = getStartOfWeek(new Date());

        // Calculate the dates for each day of the week (Monday to Sunday)
        const daysOfWeek = ["mon", "tues", "wed", "thurs", "fri", "sat", "sun"];
        const dayDates = daysOfWeek.map((_, index) => {
            const dayDate = new Date(startOfWeek);
            dayDate.setDate(startOfWeek.getDate() + index); // Add days to Monday
            return dayDate;
        });

        // Calculate the dayIndex for each day by comparing with createdAtDate
        const dayIndices = dayDates.map((dayDate) => {
            const timeDifference = dayDate.getTime() - createdAtDate.getTime();
            const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Difference in days
            return currentDayIndex + dayDifference;
        });
        // Step 3: Fetch questionIds for each day
        const questions = await db.query.curriculum_questions.findMany({
            where: and(
                eq(schema.curriculum_questions.curriculumId, classroom.curriculumId),
                inArray(schema.curriculum_questions.dayIndex, dayIndices)
            ),
        });
        
        const questionMap = questions.reduce((acc: any, q: any) => {
            acc[q.dayIndex] = q.questionId;
            return acc;
        }, {} as Record<number, number>);

        // Step 4: Fetch all students in the classroom
        const members = await db.query.classroom_member.findMany({
            where: and(
                eq(schema.classroom_member.classroomId, parseInt(classroomId)),
                eq(schema.classroom_member.role, "student")
            ),
        });

        const userIds = members.map((member: any) => member.userId);

        // Step 5: Fetch answers for all students
        const answers = await db.query.answers.findMany({
            where: and(
                inArray(schema.answers.questionId, Object.values(questionMap)),
                inArray(schema.answers.userId, userIds),
                eq(schema.answers.classroomId, parseInt(classroomId))
            ),
        });

        const answerMap = answers.reduce((acc: any, answer: any) => {
            if (!acc[answer.userId]) acc[answer.userId] = {};
            acc[answer.userId][answer.questionId] = answer.answer;
            return acc;
        }, {} as Record<string, Record<number, string>>);

        // Step 6: Format the data into the desired JSON structure
        const studentsData = await Promise.all(
            members.map(async (member: any) => {
                const user = await db.query.user.findFirst({
                    where: eq(schema.user.id, member.userId),
                });

                const studentAnswers = daysOfWeek.reduce((acc, day, index) => {
                    const dayIndex = dayIndices[index];
                    const questionId = questionMap[dayIndex];
                    const answer = answerMap[member.userId]?.[questionId];
                    acc[day] = {
                        completed: !!answer,
                        answers: answer ? [answer] : [],
                    };
                    return acc;
                }, {} as Record<string, { completed: boolean; answers: string[] }>);

                return {
                    studentName: user?.name || "Unknown",
                    ...studentAnswers,
                };
            })
        );

        return new Response(JSON.stringify(studentsData), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}