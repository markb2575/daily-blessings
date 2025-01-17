import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { request } from 'http';


export async function GET(req: Request) {
    const id = req.headers.get('id');

    if (id == null) {
        return Response.json({
            'success':false
        });
    }
    const userRole = await db.select({ role: user.role }).from(user).where(eq(user.id, id));
    console.log("role: ", userRole);
    return Response.json({
       hasRole: userRole[0].role == "none" ? false : true
    });
}
