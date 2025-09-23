import { db } from '@/lib/db'
import { classroom, classroom_member, user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { generateCode } from '@/lib/utils';

export async function POST(req: Request) {
    const data = await req.json()

    const curriculumId = data.curriculumId
    const classroomName = data.classroomName
    const userId = data.userId


    if (curriculumId == null || classroomName == null) {
        return Response.json({ error: "Incorrect Headers" }, { status:400 });
    }
    const studentCode = generateCode(9)
    const teacherCode = generateCode(9)
    const result = await db.insert(classroom).values({curriculumId: Number(curriculumId), classroomName: classroomName, studentCode: studentCode, teacherCode: teacherCode}).$returningId();
    const classroomId = result[0].classroomId
    await db.insert(classroom_member).values({classroomId: classroomId, userId: userId, role: "teacher"})

    return Response.json({
       'studentCode': studentCode,
       'teacherCode': teacherCode
    });
}

export async function GET(req: Request) {
    const classroomId = req.headers.get('classroomId')
    const id = req.headers.get('id')


    
    if (classroomId === null || id === null) {
      return Response.json({ status: 404 })
    }

    const userRole = await db.select({ role: user.role }).from(user).where(eq(user.id, id));

    // console.log(classroomId)
    const classroomData = await db.select().from(classroom).where(eq(classroom.classroomId, Number(classroomId)))

    // console.log(classroomData)
    if (userRole[0].role === 'student') {
        // if user is student don't give them teacher code
        classroomData[0].teacherCode = ''
        return Response.json({
            classroomData: classroomData[0],
            role: userRole
        })
    } else {
        return Response.json({
            classroomData: classroomData[0],
            role: userRole
        })
    }

    
  }

export async function DELETE(req: Request) {
    const classroomId = req.headers.get('classroomId');
    if (!classroomId) {
        return Response.json({ error: 'Missing classroomId' }, { status: 400 });
    }
    try {
        // Remove classroom members first (if foreign key constraint exists)
        await db.delete(classroom_member).where(eq(classroom_member.classroomId, Number(classroomId)));
        // Remove classroom
        await db.delete(classroom).where(eq(classroom.classroomId, Number(classroomId)));
        return Response.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error deleting classroom:', error);
        return Response.json({ error: 'Failed to delete classroom', details: String(error) }, { status: 500 });
    }
}

