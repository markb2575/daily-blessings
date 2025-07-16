'use client'

import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { TabsContent } from '../ui/tabs'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { LogIn } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import {
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogContent,
    Dialog,
    DialogTrigger
} from '../ui/dialog'

export default function JoinClassroom({ role, refreshClasses }: { role: string, refreshClasses: Function }) {
    const [code, setCode] = useState('')
    const session = authClient.useSession()
    const [open, setOpen] = useState(false)
    
    const resetForm = () => {
        setCode('')
    }
    
    
    const joinClass = async () =>{

        if (code === '') {
            toast.error("Please enter a classroom code");
            return; 
        }

        await fetch('/api/classroom_member', {
            method: 'POST',
            body: JSON.stringify({
                [role === 'student' ? 'studentCode' : 'teacherCode']: code,
                userId: session.data?.session.userId || '',
            })
        })
            .then(response => {
                if (!response.ok) {
                    toast.error("Unable to join class")
                    return response;
                }
                setOpen(false)
                refreshClasses()
                return response
                
            })
    }
    
    return (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
            <DialogTrigger asChild>
                <Button variant='outline' onClick={() => setOpen(true)}>  
                    <div>Join</div>
                    <LogIn size={32} />
                </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined}>
                <DialogTitle>Join Classroom</DialogTitle>
                <Label htmlFor='name' className='text-neutral-700'>
                            Class Code  
                        </Label>
                        <Input
                            id='name'
                            className='bg-white text-neutral-700'
                            value={code}
                            onChange={e => setCode(e.target.value)}
                        />
                <DialogFooter className='sm:justify-start'>
                    <DialogClose asChild>
                        <Button type='button' variant='secondary'>
                            Close
                        </Button>
                    </DialogClose>
                    <Button
                        type='submit'
                        className='rounded bg-blue-500 py-2 font-semibold text-white transition duration-200 hover:bg-blue-600'
                        onClick= {()=>{
                            joinClass();
                            // inClassAlready();
                        }}
                    >
                        Join
                    </Button>
                    
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
