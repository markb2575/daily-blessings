import { db } from '@/lib/db'
import { curriculum } from '@/lib/db/schema'


export async function GET() {
    const curriculums = await db.select().from(curriculum);
    return Response.json({
       curriculums: curriculums
    });
}
