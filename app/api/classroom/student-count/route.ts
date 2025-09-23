import { db } from '@/lib/db'
import { classroom_member } from '@/lib/db/schema'
import { eq, and, count } from 'drizzle-orm'

export async function GET(req: Request) {
    const classroomId = req.headers.get('classroomId')
    const userId = req.headers.get('userId')

    if (classroomId === null || userId === null) {
        return Response.json({ error: "Incorrect Headers" }, { status: 400 });
    }

    // Verify user has access to this classroom
    const userAccess = await db
        .select()
        .from(classroom_member)
        .where(
            and(
                eq(classroom_member.userId, userId),
                eq(classroom_member.classroomId, Number(classroomId))
            )
        )

    if (userAccess.length === 0) {
        return Response.json({ error: "Access denied" }, { status: 403 });
    }

    // Get student count for the classroom
    const studentCount = await db
        .select({ count: count() })
        .from(classroom_member)
        .where(
            and(
                eq(classroom_member.classroomId, Number(classroomId)),
                eq(classroom_member.role, 'student')
            )
        )

    return Response.json({
        studentCount: studentCount[0]?.count || 0
    })
}
