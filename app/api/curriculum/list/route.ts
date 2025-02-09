import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { curriculum } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { request } from 'http';


export async function GET(req: Request) {
    const curriculums = await db.select().from(curriculum);
    return Response.json({
       curriculums: curriculums
    });
}
