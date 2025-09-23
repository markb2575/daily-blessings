'use client'

import QAList from './qa-list'


export default function StudentView({curriculumId, classroomId, dayIndex}:{curriculumId:number, classroomId:number, dayIndex:number}) {

    // if (questionData === null) return null
    return (
        <>
        <QAList curriculumId={curriculumId} dayIndex={dayIndex} classroomId={classroomId}/>
        </>
    )
}
