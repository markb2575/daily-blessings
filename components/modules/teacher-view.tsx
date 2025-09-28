'use client'

import StudentTable from './student-table'
import { useEffect, useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, Trash, Settings, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { ModalData, TeacherViewProps } from '@/lib/types';
import { createPortal } from 'react-dom'

export default function TeacherView({ classroomId, teacherCode, studentCode }: TeacherViewProps) {
    const [modalOpened, setModalOpened] = useState(false)
    const [modalData, setModalData] = useState<ModalData>([])
    const [sheetOpen, setSheetOpen] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const router = useRouter();
    
    useEffect(() => {
        if (modalOpened) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [modalOpened])

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
        } catch {
            toast.error('Error deleting classroom');
        } finally {
            setDeleting(false);
            setDeleteConfirm(false);
            setSheetOpen(false);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-6">
  
        <StudentTable classroomId={classroomId} setModalData={setModalData} setModalOpened={setModalOpened} />
        <div className="flex w-full justify-end">
          <Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-border hover:bg-accent bg-transparent mr-8 md:mr-0 mb-8">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined} className="bg-card border-border max-w-md rounded-md">
              <DialogTitle className="text-xl font-semibold text-foreground">Classroom Settings</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Manage your classroom codes and settings.
              </DialogDescription>
  
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Teacher Code</Label>
                  <div className="flex items-center gap-3">
                    <Input disabled value={teacherCode} className="font-mono bg-muted text-foreground border-border" />
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0 border-border hover:bg-accent bg-transparent"
                      onClick={() => {
                        navigator.clipboard.writeText(teacherCode)
                        toast.success("Teacher code copied to clipboard!")
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
  
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Student Code</Label>
                  <div className="flex items-center gap-3">
                    <Input disabled value={studentCode} className="font-mono bg-muted text-foreground border-border" />
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0 border-border hover:bg-accent bg-transparent"
                      onClick={() => {
                        navigator.clipboard.writeText(studentCode)
                        toast.success("Student code copied to clipboard!")
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
  
              <div className="mt-8 pt-4 border-t border-border">
                <div className="space-y-3">
                  <div className="text-sm font-medium text-foreground">Danger Zone</div>
                  {!deleteConfirm ? (
                    <Button variant="destructive" size="sm" className="gap-2" onClick={() => setDeleteConfirm(true)}>
                      <Trash className="h-4 w-4" />
                      Delete Classroom
                    </Button>
                  ) : (
                    <div className="space-y-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <div className="flex items-center gap-2 text-destructive text-sm font-medium">
                        <AlertTriangle className="h-4 w-4" />
                        Are you sure? This cannot be undone.
                      </div>
                      <div className="flex gap-2">
                        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
                          {deleting ? "Deleting..." : "Yes, Delete"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border bg-transparent"
                          onClick={() => setDeleteConfirm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
  
              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="border-border">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {modalOpened && createPortal(
          <div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setModalOpened(false)}
          >
            <div
              className="w-full max-w-2xl bg-card border border-border rounded-lg shadow-lg p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Student Answers</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setModalOpened(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </Button>
              </div>
              <div className="space-y-4">
                {modalData.map((v, i) => {
                  if (v.isFillInTheBlank) {
                    const parts = v.question.split("_")
                    const answerArray = Array.isArray(JSON.parse(v.answer)) ? JSON.parse(v.answer) : [v.answer]
  
                    return (
                      <div key={i} className="p-4 rounded-lg bg-muted/50 border border-border">
                        <div className="text-foreground">
                          {parts.map((part, index) => (
                            <span key={index}>
                              {part}
                              {index < answerArray.length && (
                                <span className="font-semibold text-brand-blue bg-brand-blue/10 px-2 py-1 rounded">
                                  {answerArray[index]}
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  } else {
                    return (
                      <div key={i} className="p-4 rounded-lg bg-muted/50 border border-border space-y-2">
                        <div className="text-sm text-muted-foreground font-medium">Question:</div>
                        <div className="text-foreground">{v.question}</div>
                        <div className="text-sm text-muted-foreground font-medium">Answer:</div>
                        <div className="font-semibold text-brand-blue">{v.answer}</div>
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          </div>, document.body
        )}
      </div>
    )
}