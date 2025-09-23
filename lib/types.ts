export type ModalData = {
    answer: string;
    question: string;
    isFillInTheBlank: boolean;
}[] | [];

export type TeacherViewProps = {
    classroomId: number,
    teacherCode: string,
    studentCode: string
};

export type TableData = {
    students: StudentData[],
    dates: string[],
    indices: number[]
} | null

export type StudentData = {
    studentName: string,
    mon: DayData,
    tues: DayData,
    wed: DayData,
    thurs: DayData,
    fri: DayData,
    sat: DayData,
    sun: DayData,
}

export type DayData = {
    completed: boolean,
    answers: { answer: string; questionId: number }[];
}

export type member = {
    classroomId: number;
    role: string;
    userId: string;
}
export type answer = {
    createdAt: Date;
    questionId: number;
    classroomId: number;
    userId: string;
    answer: string;
}[]

export type QuestionData = {
    questionId: number
    isFillInTheBlank: boolean
    question: string
    curriculumId: number
    dayIndex: number
    answer: string | string[] 
    bibleReference?: string
    bibleVerses?: string
}

export type Codes = {
    studentCode: string
    teacherCode: string
}

export type curriculums = {
    curriculumId: string;
    name: string | null;
}[]

export type ClassroomData = {
    classroomId: number,
    curriculumId: number,
    classroomName: string,
    studentCode: string, 
    teacherCode: string | '',
    dayIndex: number
} | null