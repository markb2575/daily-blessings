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
       role: userRole[0].role
    });
}

export async function POST(req: Request) {
    const id = req.headers.get('id');
    const role = req.headers.get('role')
    if (id == null || role == null) {
        return Response.json({
            'success':false
        });
    }

    await db.update(user).set({role: role}).where(eq(user.id, id))

    return Response.json({
       'success':true
    });
}
