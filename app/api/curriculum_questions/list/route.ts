import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { classroom, classroom_member } from '@/lib/db/schema'
import { eq, inArray } from 'drizzle-orm'
import { request } from 'http'
import { generateCode } from '@/lib/utils'

export async function GET(req: Request) {
    // const userId = req.headers.get('userId')

    // if (userId === null) {
    //     return Response.json({ error: "Incorrect Headers" }, { status:400 });
    // }

    // const classroomIds = await db
    //     .select({ classroomId: classroom_member.classroomId })
    //     .from(classroom_member)
    //     .where(eq(classroom_member.userId, userId))

    // const classrooms = await db
    //     .select({
    //         classroomName: classroom.classroomName, classroomId: classroom.classroomId
    //     })
    //     .from(classroom)
    //     .where(
    //         inArray(
    //             classroom.classroomId,
    //             classroomIds.map(c => c.classroomId)
    //         )
    //     )
    // return Response.json({
    //     classrooms: classrooms
    // })
}
