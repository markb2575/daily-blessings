'use client'

import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { TabsContent } from '../ui/tabs'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { authClient } from '@/lib/auth-client'
import {
    Dialog,
    DialogHeader,
    DialogTrigger,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogContent,
    DialogDescription
} from '../ui/dialog'
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from '../ui/select'
import { toast } from 'sonner'
import { Copy, Plus } from 'lucide-react'

export default function CreateClassroom({ refreshClasses }: { refreshClasses: Function }) {
    const [codes, setCodes] = useState<any>(null)
    const [curriculums, setCurriculums] = useState([])
    const [curriculumId, setCurriculumId] = useState('')
    const [classroomName, setClassroomName] = useState('')
    const session = authClient.useSession()
    const resetForm = () => {
        setCodes(null)
        setCurriculumId('')
        setClassroomName('')
    }
    const createClassroom = async () => {
        if (curriculumId === '' || classroomName === '') {
            toast.error('Please fill in all fields.')
            return
        }
        await fetch('/api/classroom', {
            method: 'POST',
            body: JSON.stringify({
                curriculumId: curriculumId || '',
                classroomName: classroomName || '',
                userId: session.data?.session.userId || ''
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                return response.json()
            })
            .then(data => {
                setCodes(data)
                refreshClasses()
            })
    }
    const getCurriculums = async () => {
        await fetch('/api/curriculum/list', {
            method: 'GET'
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.json()
        }).then(data => {
            setCurriculums(data.curriculums)
        })
    }

    useEffect(() => {
        getCurriculums()
    }, [])

    return (
        <Dialog onOpenChange={resetForm}>
            <DialogTrigger asChild>
                <Button variant='outline'>
                    <div>Create</div>
                    <Plus size={32} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                {!codes ? (
                    <>
                        <DialogTitle>Create Classroom</DialogTitle>
                        <Label htmlFor='name' className='text-neutral-700'>
                            Class Name
                        </Label>
                        <Input
                            id='name'
                            className='bg-white text-neutral-700'
                            value={classroomName}
                            onChange={e => setClassroomName(e.target.value)}
                        />
                        <Label
                            htmlFor='curriculum'
                            className='text-neutral-700'
                        >
                            Curriculum
                        </Label>
                        <Select
                            onValueChange={value => {
                                setCurriculumId(value)
                            }}
                        >
                            <SelectTrigger className='w-[180px]'>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {curriculums.map((v: any, _i) => (
                                    <SelectItem
                                        key={v.curriculumId}
                                        value={v.curriculumId}
                                    >
                                        {v.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <DialogFooter className='sm:justify-start'>
                            <DialogClose asChild>
                                <Button type='button' variant='secondary'>
                                    Close
                                </Button>
                            </DialogClose>
                            <Button
                                type='submit'
                                className='rounded bg-blue-500 font-semibold text-white transition duration-200 hover:bg-blue-600'
                                onClick={createClassroom}
                            >
                                Create
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <DialogTitle>Codes</DialogTitle>
                        <DialogDescription>
                            Send these codes teachers or students you want to
                            join your class.
                        </DialogDescription>
                        <Label>Teacher Code</Label>
                        <div className='flex flex-row items-center gap-4'>
                            <Input disabled value={codes.teacherCode} />
                            <Copy
                                className='hover:opacity-50'
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        codes.teacherCode
                                    )
                                    toast.success(
                                        'Copied teacher code to clipboard.'
                                    )
                                }}
                            />
                        </div>
                        <Label>Student Code</Label>
                        <div className='flex flex-row items-center gap-4'>
                            <Input disabled value={codes.studentCode} />
                            <Copy
                                className='hover:opacity-50'
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        codes.studentCode
                                    )
                                    toast.success(
                                        'Copied student code to clipboard.'
                                    )
                                }}
                            />
                        </div>
                        <DialogDescription>
                            You can view these again later in your class
                            settings.
                        </DialogDescription>
                        <DialogFooter className='sm:justify-start'>
                            <DialogClose asChild>
                                <Button
                                    type='button'
                                    variant='secondary'
                                    onClick={resetForm}
                                >
                                    Close
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
