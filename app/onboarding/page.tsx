"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { redirect } from 'next/navigation'
import { LucideGraduationCap, LucideSchool } from "lucide-react";

export default function Login() {
    const session = authClient.useSession();
    const [role, setRole] = useState("student");
    const [roleChecked, setRoleChecked] = useState(false);

    useEffect(() => {
        checkRole();
    });

    const checkRole = async () => {
        const id = session.data?.session.userId
        if (id == undefined) return;
        await fetch('/api/user/role', {
            method: 'GET',
            headers: {
                'id': id || ''
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            console.log(data.role)
            if (data.role != "none") {
                redirect("/");
            }
            setRoleChecked(true)
        })
    }
    const handleUpdateRole = async () => {
        const id = session.data?.session.userId
        if (id == undefined) return;
        await fetch('/api/user/role', {
            method: 'POST',
            headers: {
                'id': id || '',
                'role': role
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            redirect("/");
        })
    }
    if (roleChecked) {
        return (
            <div className="font-Open_Sans min-h-screen flex items-center justify-center">
                <Card className="bg-gray-100 flex-col p-8 m-4 w-full xs:w-2/3 sm:w-1/2 lg:w-1/3 max-w-xl border-gray-400 shadow-lg flex">
                    <Label className="text-gray-700 mb-4 text-lg">I am a...</Label>
                    <div className="flex-col flex gap-4">
                        <Button
                            className={`[&_svg]:size-5 mx2 w-full h-14 font-bold justify-start border-2 border-gray-400 bg-white  ${role === "teacher" ? " border-blue-400 " : " border-0"}`}
                            onClick={() => {
                                setRole("teacher")
                                console.log("setting teacher role");
                            }}
                        >
                            <div>
                                <div className="flex flex-row text-base gap-2"><LucideSchool />Teacher</div>
                                <div className="text-gray-700 text-xs">Teacher can create classes</div>
                            </div>
                        </Button>
                        <Button
                            className={`[&_svg]:size-5 mx2 w-full h-14 font-bold justify-start border-2 border-gray-400 bg-white  ${role === "student" ? " border-blue-400 " : " border-0"}`}
                            onClick={() => {
                                setRole("student")
                                console.log("setting student role");
                            }}
                        >
                            <div>
                                <div className="flex flex-row text-base gap-2"><LucideGraduationCap />Student</div>
                                <div className="text-gray-700 text-xs">Students can join classes with a code</div>
                            </div>
                        </Button>
                        <Button onClick={handleUpdateRole} className="bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition duration-200">Get Started</Button>
                    </div>
                </Card>
            </div>
        )
    } else {
        return null
    }
}
