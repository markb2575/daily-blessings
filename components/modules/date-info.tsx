'use client'

type DateInfoTypes = {
    date?: string,
    copticDate?: string,
    feast?: string
}

export default function DateInfo({date, copticDate, feast} : DateInfoTypes) {
    return (
        <>
            <div>Todays Date is {date}</div>
            <div>Todays Coptic Date is {copticDate}</div>
            <div>We are currently in {feast}</div>
        </>
    )
}
