import { db } from '@/lib/db'
import { classroom, classroom_member } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(req: Request) {
    const data = await req.json()
    const userId = data.userId
    const studentCode = data.studentCode
    const teacherCode = data.teacherCode

    if (userId == '') {
        return Response.json({ error: "Incorrect Headers" }, { status:400 });
    }

    if (studentCode !== undefined) {
        //user is a student
        const result = await db
            .select({ classroomId: classroom.classroomId })
            .from(classroom)
            .where(eq(classroom.studentCode, studentCode))
        if (result.length === 0) {
            return Response.json(
                { error: 'No class was found' },
                { status: 404 }
            )
        }

        //error when you are already in the class
        const isInClass = await db
            .select({ userId: classroom_member.userId })
            .from(classroom_member)
            .where(
                and(
                    eq(classroom_member.classroomId, result[0].classroomId),
                    eq(classroom_member.userId, userId)
                )
            )
        if (isInClass.length > 0) {
            return Response.json(
                { error: 'Student is already in this class' },
                { status: 404 }
            )
        }
        await db
            .insert(classroom_member)
            .values({ classroomId: result[0].classroomId, userId: userId, role: "student" })
        return Response.json(
            { status: 200 }
        )
    } else if (teacherCode !== undefined) {
        //user is a teacher
        const result = await db
            .select({ classroomId: classroom.classroomId })
            .from(classroom)
            .where(eq(classroom.teacherCode, teacherCode))

        //error for when you are already in the class
        const isInClass = await db
            .select({ userId: classroom_member.userId })
            .from(classroom_member)
            .where(
                and(
                    eq(classroom_member.classroomId, result[0].classroomId),
                    eq(classroom_member.userId, userId)
                )
            )
        if (isInClass.length > 0) {
            return Response.json(
                { error: 'Teacher is already in this class' },
                { status: 404 }
            )
        }
        await db
            .insert(classroom_member)
            .values({ classroomId: result[0].classroomId, userId: userId, role: "teacher" })
        return Response.json(
            { status: 200 }
        )
    }

    return Response.json({ error: "Could not insert to classroom" }, { status:400 });
}

export async function GET(req: Request) {
    const classroomId = req.headers.get('classroomId')
    const userId = req.headers.get('userId')

    if (classroomId === null || userId === null) {
        return Response.json({ error: "Incorrect Headers" });
    }

    const classroom = await db
        .select()
        .from(classroom_member)
        .where(
            and(
                eq(classroom_member.userId, userId),
                eq(classroom_member.classroomId, Number(classroomId))
            )
        )
    if (classroom.length === 0) {
        // console.log("not in class")
        return Response.json({ error: "Not Found"}, { status:404 });
    }
    return Response.json(
        { status: 200 }
    )
}
