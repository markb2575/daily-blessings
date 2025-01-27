'use client'

import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { TabsContent } from '../ui/tabs'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { LogIn } from 'lucide-react'
import {
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogContent,
    Dialog,
    DialogTrigger
} from '../ui/dialog'
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from '../ui/select'

export default function JoinClassroom() {
    // const [curriculums, setCurriculums] = useState([])
    // const [curriculumId, setCurriculumId] = useState('')
    // const [className, setClassName] = useState('')
    // const getCurriculums = async () => {
    //     await fetch('/api/curriculum/list', {
    //         method: 'GET'
    //     })
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok')
    //             }
    //             return response.json()
    //         })
    //         .then(data => {
    //             console.log(data.curriculums, 'curriculums')
    //             setCurriculums(data.curriculums)
    //         })
    // }

    useEffect(() => {
        // getCurriculums()
    }, [])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='outline'>
                    <div>Join</div>
                    <LogIn size={32} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Join Classroom</DialogTitle>
                <DialogFooter className='sm:justify-start'>
                    <DialogClose asChild>
                        <Button type='button' variant='secondary'>
                            Close
                        </Button>
                    </DialogClose>
                    <Button
                        type='submit'
                        className='rounded bg-blue-500 py-2 font-semibold text-white transition duration-200 hover:bg-blue-600'
                    >
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
