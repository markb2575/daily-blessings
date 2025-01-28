import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { classroom, classroom_member,user } from '@/lib/db/schema'
import { eq,and } from 'drizzle-orm'
import { request } from 'http';
import { generateCode } from '@/lib/utils';


export async function POST(req: Request) {
    const data = await req.json()
    const userId = data.userId
    const studentCode = data.studentCode
    const teacherCode = data.teacherCode

    console.log("User Id: ",userId,"Student Code: ",studentCode);
  
    console.log("Codes: ",studentCode,teacherCode)

    if (userId == '') {
        return Response.json({
            'success':false
        });
    }

    if(studentCode !== undefined){
        //user is a student 
        console.log("InStudentCode") 
        const result = await db.select({classroomId: classroom.classroomId }).from(classroom).where(eq(classroom.studentCode,studentCode));
        await db.insert(classroom_member).values({classroomId: result[0].classroomId, userId: userId})
        const isInClass = await db.select({userId: classroom_member.userId }).from(classroom_member).where(and(eq(classroom_member.classroomId,result[0].classroomId),eq(classroom_member.userId,userId)));
        if(isInClass.length > 0){
            return Response.json({
                'success':false
            });
        }
        console.log(result)
    }else if(teacherCode !== undefined) {
        //user is a teacher
        console.log("InTeacherCode") 
        const result = await db.select({classroomId: classroom.classroomId }).from(classroom).where(eq(classroom.teacherCode,teacherCode));
        const isInClass = await db.select({userId: classroom_member.userId }).from(classroom_member).where(and(eq(classroom_member.classroomId,result[0].classroomId),eq(classroom_member.userId,userId)));
        if(isInClass.length > 0){
            return Response.json({
                'success':false
            });
        }
        console.log("isInClass: ",isInClass)
        await db.insert(classroom_member).values({classroomId: result[0].classroomId, userId: userId})
        console.log(result)
    }
    // const result = await db.select({ role: user.role }).from(user).where(eq(user.id, userId));
    // console.log("User Role: ", result[0].role)
    // const role = result[0].role

    // if(role === "teacher"){
        
    // }else if (role === "student"){

    // }

    // const result = await db.insert(classroom).values({curriculumId: Number(curriculumId), classroomName: classroomName, studentCode: studentCode, teacherCode: teacherCode}).$returningId();
    // const classroomId = result[0].classroomId
    // console.log(classroomId, userId.userId)
    // await db.insert(classroom_member).values({classroomId: classroomId, userId: userId})

    return Response.json({
        'success':true
    });
}
