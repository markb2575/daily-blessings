import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { classroom, classroom_member } from '@/lib/db/schema'
import { eq, inArray } from 'drizzle-orm'
import { request } from 'http';
import { generateCode } from '@/lib/utils';

export async function POST(req: Request) {
    const data = await req.json()

    const curriculumId = data.curriculumId
    const classroomName = data.classroomName
    const userId = data.userId


    if (curriculumId == null || classroomName == null) {
        return Response.json({
            'success':false
        });
    }
    const studentCode = generateCode(7)
    const teacherCode = generateCode(7)
    const result = await db.insert(classroom).values({curriculumId: Number(curriculumId), classroomName: classroomName, studentCode: studentCode, teacherCode: teacherCode}).$returningId();
    const classroomId = result[0].classroomId
    console.log(classroomId, userId)
    await db.insert(classroom_member).values({classroomId: classroomId, userId: userId})

    return Response.json({
       'studentCode': studentCode,
       'teacherCode': teacherCode
    });
}

export async function GET(req: Request) {
    const userId = req.headers.get('userId')
    
    if (userId === null) {
      return Response.json({ status: 404 })
    }
  
    const classroomIds = await db
      .select({ classroomId: classroom_member.classroomId })
      .from(classroom_member)
      .where(eq(classroom_member.userId, userId))
  
    const classNames = await db
    .select({
      classroomName: classroom.classroomName
    })
    .from(classroom)
    .where(
        inArray(classroom.classroomId, classroomIds.map(c => c.classroomId))
    )
        return Response.json({
      classrooms: classNames
    })
    
  }

