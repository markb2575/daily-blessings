import { db } from '@/lib/db'
import { answers } from '@/lib/db/schema'

export async function POST(req: Request) {
    try {
        const classroomId = req.headers.get('classroomId');
        const userId = req.headers.get('userId');
        const { questionData } = await req.json(); // This is already a JS array/object

        // Improved validation
        if (!classroomId || !userId || !questionData || !Array.isArray(questionData)) {
            return Response.json({ error: "Missing or invalid headers or body" }, { status: 400 });
        }

        // Use a for...of loop to correctly handle async operations
        for (const value of questionData) {
            let formattedAnswer = value.answer;

            if (value.isFillInTheBlank) {
                // Ensure the answer is a string before stringifying, in case it's complex
                formattedAnswer = JSON.stringify(value.answer);
            }

            await db.insert(answers).values({
                questionId: Number(value.questionId),
                classroomId: Number(classroomId),
                answer: formattedAnswer,
                userId: userId
            }).onDuplicateKeyUpdate({
                set: { answer: formattedAnswer }
            });
        }

        return Response.json({ message: "Answers successfully submitted" }, { status: 200 });

    } catch (error) {
        console.error("Error processing answers:", error);
        return Response.json({ error: "An internal server error occurred" }, { status: 500 });
    }
}
