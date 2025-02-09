import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { request } from 'http';


export async function GET(req: Request) {
    const id = req.headers.get('id');

    if (id == null) {
        return Response.json({ error: "Incorrect Headers" }, { status:400 });
    }
    const userRole = await db.select({ role: user.role }).from(user).where(eq(user.id, id));
    return Response.json({
       role: userRole[0].role
    });
}

export async function POST(req: Request) {
    const id = req.headers.get('id');
    const role = req.headers.get('role')
    if (id == null || role == null) {
        return Response.json({ error: "Incorrect Headers" }, { status:400 });
    }

    await db.update(user).set({role: role}).where(eq(user.id, id))

    return Response.json(
        { status: 200 }
    )
}
