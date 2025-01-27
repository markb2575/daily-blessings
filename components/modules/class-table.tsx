import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Settings2 , EllipsisVertical } from 'lucide-react'


export function ClassTable() {
const classes = [{"classroomName": "5th Grade"}, {"classroomName": "5th Grade"}, {"classroomName": "4th Grade"}, {"classroomName": "3th Grade"}, {"classroomName": "2th Grade"}]

    return (
        <div className='flex flex-wrap gap-8 justify-items-start align-top'>
        
        {classes.map((value: any, index)=>(
            <Card key={index} className='overflow-hidden transition-all hover:shadow-lg size-72'>
                <CardHeader className='flex flex-row justify-between items-center bg-blue-300'>
                <CardTitle className='line-clamp-1'>{value.classroomName}</CardTitle>
                <div className='flex items-center justify-between'>  
                        <Settings2 size={30}/> 
                </div>
            </CardHeader>
               
            </Card>
            
        ))}
        
        </div>
    )
}


{/* <div className='relative h-48 w-full'>
                <img
                    alt={title}
                    className='h-full w-full object-cover'
                />
            </div>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Users className='h-4 w-4' />
                        
                    </div>
                </div>
                <CardTitle className='line-clamp-1'>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className='line-clamp-2 text-sm text-muted-foreground'>
                    {description}
                </p>
            </CardContent>
            <CardFooter className='flex justify-between'>
                <Button variant='outline' size='sm'>
                    <BookOpen className='mr-2 h-4 w-4' />
                    Edit
                </Button>
                <Button size='sm'>Enter</Button>
            </CardFooter> */}