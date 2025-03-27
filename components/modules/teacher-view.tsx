'use client'

import { authClient } from '@/lib/auth-client'
import StudentTable from './student-table'
import { useState } from 'react'

type ModalData = {
    answer: string;
    question: string;
    isFillInTheBlank: boolean;
}[] | [];

export default function TeacherView({ curriculumId, classroomId }: { curriculumId: number, classroomId: number }) {
    const session = authClient.useSession()
    const [modalOpened, setModalOpened] = useState(false)
    const [modalData, setModalData] = useState<ModalData>([])

    const showAnswers = async (answers: { answer: string; questionId: number }[]) => {
        if (answers.every(answer => answer.answer.trim() === '')) {
            return;
        }
        try {
            // Step 1: Extract questionIds from the answers array
            const questionIds = answers.map(answer => answer.questionId);

            // Step 2: Fetch data from the API
            const response = await fetch('/api/curriculum_questions/list', {
                method: 'GET',
                headers: {
                    'questionIds': JSON.stringify(questionIds), // Serialize as JSON string
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Step 3: Parse the fetched data
            const data: { isFillInTheBlank: boolean, question: string, questionId: number }[] = await response.json();

            // Step 4: Combine answers and fetched data into modalData format
            const combinedData = answers.map(answer => {
                const matchingQuestion = data.find(q => q.questionId === answer.questionId);
                return {
                    answer: answer.answer,
                    question: matchingQuestion?.question || '', // Use empty string if no match
                    isFillInTheBlank: matchingQuestion?.isFillInTheBlank || false, // Default to false if no match
                };
            });

            // Step 5: Update the modalData state
            setModalData(combinedData);
            setModalOpened(true)
            

            console.log('Combined Data:', combinedData);
        } catch (error) {
            console.error('Error fetching curriculum questions:', error);
        }
    };

    return (
        <div className='flex w-full justify-center'>
            <StudentTable classroomId={classroomId} showAnswers={showAnswers} />
            {modalOpened && <div className="backdrop-blur-sm w-screen h-screen fixed left-0 top-0 m-0 p-0 flex flex-col items-center justify-center bg-gray-100 bg-opacity-50" onClick={() => setModalOpened(false)}>
                <div className="w-full max-w-2xl px-4 rounded-md p-6 shadow-md bg-white">
                    {modalData.map((v, i) => {
                        if (v.isFillInTheBlank) {
                            // Split the question into parts based on underscores ('_')
                            const parts = v.question.split('_');

                            // Parse the answer string into an array
                            const answerArray = Array.isArray(JSON.parse(v.answer))
                                ? JSON.parse(v.answer)
                                : [v.answer];

                            // Render the question with styled answers interspersed
                            return (
                                <div key={i} className='mb-4'>
                                    {parts.map((part, index) => (
                                        <span key={index}>
                                            {part}
                                            {index < answerArray.length && (
                                                <span className="font-bold">{answerArray[index]}</span>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            );
                        } else {
                            return (
                                <div key={i} className='mb-4'>
                                    <div>{v.question}</div>
                                    <div className="font-bold">{v.answer}</div>
                                </div>
                            )
                        }
                    })}
                </div>
            </div>}
        </div>
    )
}