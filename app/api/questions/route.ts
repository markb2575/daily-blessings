import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
// import { questions } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'


// export async function GET(req: Request) {
    // Get the timezone from request headers or default to 'UTC'
    // const timeZone = req.headers.get('timezone') || 'UTC';

    // // Get the current date in the user's time zone
    // const today = new Intl.DateTimeFormat('en-CA', {
    //     timeZone,
    //     year: 'numeric',
    //     month: '2-digit',
    //     day: '2-digit',
    // }).format(new Date());

    // // Ensure the date is in 'YYYY-MM-DD' format
    // // const [year, month, dayPart] = today.split('-');
    // // const formattedDate = `${year}-${month}-${dayPart}`;

    // const data = await db.select().from(questions).where(sql`${questions.date} = ${today}`);

    // return Response.json({
    //     'questions': data.map((v,i) => (
    //         {
    //             'question': v.question,
    //             'isFillInTheBlank': v.isFillInTheBlank
    //         }
    //     )),
    // });
// }
