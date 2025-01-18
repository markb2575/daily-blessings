"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from 'next/link'
import { authClient } from "@/lib/auth-client";
import { redirect } from 'next/navigation'
import { toast } from 'sonner';

export default function Login() {
    const session = authClient.useSession();
    const [role, setRole] = useState("student");

    useEffect(() => {
        checkRole();
    });

    const checkRole = async () => {
        const id = session.data?.session.userId

        if (id == undefined) return;

        const response = await fetch('/api/user/hasRole', {
            headers: {
                'id': id || ''
            }
        });

        const object = await response.json()
        console.log(object.hasRole);

        if (object.hasRole) {
            redirect("/dashboard");
        }

    }
    return (
        <div className="font-montserrat min-h-screen flex items-center justify-center">
            <Card className="bg-gray-100 flex-col p-8 m-4 w-full xs:w-2/3 sm:w-1/2 lg:w-1/3 max-w-xl border-gray-400 shadow-lg">
                <div className="text-3xl font-bold text-gray-700 text-center mb-8">Choose your account type</div>
                <div className="flex space-x-4
                ">
                    <Button
                        className={`w-full gap-4 mx2 w-1/2 font-bold border bg-white hover:bg-gray-50 ${role === "teacher" ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-white"}`}
                        onClick={() => {
                            setRole("teacher")
                            console.log("setting teacher role");
                        }}
                    >
                        <div className="text-gray-700">Teacher</div>
                    </Button>
                    <Button
                        className={` w-full gap-4 mx2 w-1/2 font-bold border bg-white hover:bg-gray-50 ${role === "student" ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-white"}`}
                        onClick={() => {
                            setRole("student")
                            console.log("setting student role");
                        }}
                    >
                        <div className="text-gray-700">Student</div>
                    </Button>
                </div>
            </Card>
        </div>
    )
}
