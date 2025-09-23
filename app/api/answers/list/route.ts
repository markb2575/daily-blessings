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
        // Calculate the dates for each day of the week (Monday to Sunday)
        const daysOfWeek: DayOfWeek[] = ["mon", "tues", "wed", "thurs", "fri", "sat", "sun"];
        const dayDates = daysOfWeek.map((_, index) => {
            const dayDate = new Date(startOfWeek);
            dayDate.setDate(startOfWeek.getDate() + index); // Add days to Monday
            return dayDate;
        });
        // Calculate the dayIndex for each day by comparing with createdAtDate
        const dayIndices = dayDates.map((dayDate) => {
            const timeDifference = dayDate.getTime() - createdAtDate.getTime();
            const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Difference in days
            return dayDifference;
        });
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
        const userIds = members.map((member: any) => member.userId);
        // Step 5: Fetch answers for all students
        const answers = await db.query.answers.findMany({
            where: and(
                inArray(schema.answers.questionId, Object.values(questionMap).flat()),
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
        type StudentAnswer = {
            completed: boolean;
            answers: { answer: string; questionId: number }[];
        };
        type DayOfWeek = "mon" | "tues" | "wed" | "thurs" | "fri" | "sat" | "sun";

        // unsed for now
        // type StudentAnswers = {
        //     [key in DayOfWeek]: StudentAnswer;
        // };

        const students = await Promise.all(
            members.map(async (member: any) => {
                const user = await db.query.user.findFirst({
                    where: eq(schema.user.id, member.userId),
                });
        
                const studentAnswers = daysOfWeek.reduce((acc, day, index) => {
                    const dayIndex = dayIndices[index];
                    const questionIds = questionMap[dayIndex]; // Array of question IDs for the current day
        
                    // console.log("questionIds", questionIds);
                    // console.log("answers", answerMap[member.userId]);
                    // console.log("acc", acc);
        
                    // Check if answerMap[member.userId] is undefined or keys don't match questionIds
                    if (
                        !answerMap[member.userId] || // Check if answerMap[member.userId] is undefined
                        !questionIds.every((id) => id in answerMap[member.userId]!) // Check if all questionIds exist as keys
                    ) {
                        acc[day] = {
                            completed: false,
                            answers: [], // No answers if the check fails
                        };
                        return acc;
                    }
        
                    // Extract and format answers with their corresponding questionIds
                    const answers = questionIds
                        .map((id) => {
                            const answer = answerMap[member.userId]?.[id]; // Get the answer for the questionId
                            return answer
                                ? { answer, questionId: id } // Pair the answer with its questionId
                                : null; // Exclude invalid answers
                        })
                        .filter((item): item is { answer: string; questionId: number } => item !== null); // Filter out nulls and refine type
        
                    acc[day] = {
                        completed: answers.length > 0, // Completed if there are valid answers
                        answers: answers, // Array of { answer, questionId }
                    };
                    return acc;
                }, {} as Record<string, StudentAnswer>);
        
                return {
                    studentName: user?.name || "Unknown",
                    ...studentAnswers,
                };
            })
        );
        // console.log("students", students)
        const table = {
            students,
            dates: dayDates.map((val) => val.toLocaleDateString()),
            indices: dayIndices
        }
        // console.log(table.indices)
        return new Response(JSON.stringify(table), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}