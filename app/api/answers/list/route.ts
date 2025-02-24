import { eq, and, inArray } from "drizzle-orm";
import { db } from "@/lib/db"; // Assuming you have a Drizzle ORM database connection setup
import { schema } from "@/lib/db/schema";


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

        // Step 2: Calculate the day indices for the current week
        const createdAtDate = new Date(classroom.createdAt); // Classroom creation date
        const currentDayIndex = classroom.dayIndex + (Number(tablePage) * 7); 
        // Current day index from the classroom
        // console.log(currentDayIndex)
        // Helper function to get the start of the week (Monday)
        function getStartOfWeek(date: Date) {
            const day = date.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
            const diff = date.getDate() - day; // Calculate the difference to get to Sunday
            return new Date(date.setDate(diff)); // Set the date to the start of the week
        }

        // Get the Sunday of the current week
        const adjustedDate = new Date(createdAtDate);
        adjustedDate.setDate(createdAtDate.getDate() + currentDayIndex);
        const startOfWeek = getStartOfWeek(adjustedDate);
        // console.log(startOfWeek)
        // Calculate the dates for each day of the week (Monday to Sunday)
        const daysOfWeek = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];
        const dayDates = daysOfWeek.map((_, index) => {
            const dayDate = new Date(startOfWeek);
            dayDate.setDate(startOfWeek.getDate() + index); // Add days to Monday
            return dayDate;
        });
        console.log(dayDates)
        // Calculate the dayIndex for each day by comparing with createdAtDate
        console.log(createdAtDate)
        const dayIndices = dayDates.map((dayDate) => {
            const timeDifference = dayDate.getTime() - createdAtDate.getTime();
            const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Difference in days
            // console.log(dayDifference)
            return dayDifference;
        });
        // console.log(dayIndices)
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
        const students = await Promise.all(
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
                        answers: answer ? [answer] : []
                    };
                    return acc;
                }, {} as Record<string, { completed: boolean; answers: string[]}>);
                return {
                    studentName: user?.name || "Unknown",
                    ...studentAnswers,
                };
            })
        );
        const table = {
            students,
            dates: dayDates.map((val) => val.toLocaleDateString()),
            indices: dayIndices
        }
        // console.log(table.students)
        // console.log(table.indices)
        return new Response(JSON.stringify(table), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}