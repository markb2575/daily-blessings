'use client'

import { authClient } from '@/lib/auth-client'
import StudentTable from './student-table'
import { useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, Trash, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type ModalData = {
    answer: string;
    question: string;
    isFillInTheBlank: boolean;
}[] | [];

type TeacherViewProps = {
    curriculumId: number,
    classroomId: number,
    teacherCode: string,
    studentCode: string
};

export default function TeacherView({ curriculumId, classroomId, teacherCode, studentCode }: TeacherViewProps) {
    const session = authClient.useSession()
    const [modalOpened, setModalOpened] = useState(false)
    const [modalData, setModalData] = useState<ModalData>([])
    const [sheetOpen, setSheetOpen] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const router = useRouter();

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

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await fetch('/api/classroom', {
                method: 'DELETE',
                headers: {
                    classroomId: classroomId.toString(),
                },
            });
            if (!res.ok) throw new Error('Failed to delete classroom');
            toast.success('Classroom deleted');
            router.push('/');
        } catch (e) {
            toast.error('Error deleting classroom');
        } finally {
            setDeleting(false);
            setDeleteConfirm(false);
            setSheetOpen(false);
        }
    };

    return (
        <div className='flex flex-col items-center'>
            <div className="flex w-full justify-end mb-2">
                <Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
                    <DialogTrigger asChild>
                        <Settings size={25} className='hover:opacity-50 cursor-pointer mr-5 relative top-8'/>
                    </DialogTrigger>
                    <DialogContent aria-describedby={undefined}>
                        <DialogTitle>Classroom Codes</DialogTitle>
                        <DialogDescription>Share these codes with teachers or students to join your class.</DialogDescription>
                        <Label>Teacher Code</Label>
                        <div className='flex flex-row items-center gap-4 mb-2'>
                            <Input disabled value={teacherCode} />
                            <Copy className='hover:opacity-50 cursor-pointer' onClick={() => {navigator.clipboard.writeText(teacherCode); toast.success('Copied teacher code to clipboard.')}} />
                        </div>
                        <Label>Student Code</Label>
                        <div className='flex flex-row items-center gap-4 mb-2'>
                            <Input disabled value={studentCode} />
                            <Copy className='hover:opacity-50 cursor-pointer' onClick={() => {navigator.clipboard.writeText(studentCode); toast.success('Copied student code to clipboard.')}} />
                        </div>
                        <div className='mt-6'>
                            {!deleteConfirm ? (
                                <Button variant="destructive" onClick={() => setDeleteConfirm(true)}><Trash className="mr-2" />Delete Classroom</Button>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <div className="text-red-600 font-semibold">Are you sure? This cannot be undone.</div>
                                    <div className="flex gap-2">
                                        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Yes, Delete'}</Button>
                                        <Button variant="secondary" onClick={() => setDeleteConfirm(false)}>Cancel</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter className='sm:justify-start'>
                            <DialogClose asChild>
                                <Button type='button' variant='secondary'>Close</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
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