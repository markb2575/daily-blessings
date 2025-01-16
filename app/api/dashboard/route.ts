import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { day } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

export async function GET(req: Request) {
    // // Get the timezone from request headers or default to 'UTC'
    // const timeZone = req.headers.get('timezone') || 'UTC';

    // // Get the current date in the user's time zone
    // const today = new Intl.DateTimeFormat('en-CA', {
    //     timeZone,
    //     year: 'numeric',
    //     month: '2-digit',
    //     day: '2-digit',
    // }).format(new Date());

    // Ensure the date is in 'YYYY-MM-DD' format
    // const [year, month, dayPart] = today.split('-');
    // const formattedDate = `${year}-${month}-${dayPart}`;

    // Query the database with the correct date
    // const data = await db.select().from(day).where(sql`${day.date} = ${today}`);

    // Handle case where no data exists for the date
    // if (!data[0]) {
    //     return Response.json({ error: 'No data found for the provided date' }, { status: 404 });
    // }

    // Format the date to remove the time part (T00:00:00.000Z)
    // const formattedDateWithoutTime = new Date(data[0].date).toISOString().split('T')[0];

    // Prepare the response data
    // let reference;
    // if (data[0].lowerVerse == null || data[0].upperVerse == null) {
    //     reference = `${data[0].book} ${data[0].chapter}`;
    // } else {
    //     reference = `${data[0].book} ${data[0].chapter}:${data[0].lowerVerse}-${data[0].upperVerse}`;
    // }
    
    // const url = `https://www.biblegateway.com/passage/?search=${data[0].book}+${data[0].chapter}:${data[0].lowerVerse}-${data[0].upperVerse}&version=NKJV`;

    // return Response.json({
    //     date: formattedDateWithoutTime, // Use the formatted date without time
    //     copticDate: data[0].copticDate,
    //     feast: data[0].feast,
    //     reading: reference,
    //     bibleUrl: url
    // });
}
