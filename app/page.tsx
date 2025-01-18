"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Questions from "@/components/questions";

// interface DashboardData {
//     date: string;
//     copticDate: string;
//     feast: string;
//     reading: string;
//     bibleUrl: string;
// }

export default function Home() {
    // const [data, setData] = useState<DashboardData | null>(null);
    const [roleChecked, setRoleChecked] = useState(false);
    const session = authClient.useSession();
    const handleSignOut = async () => {
        await authClient.signOut();
        redirect('/login');
    };

    // const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    useEffect(() => {
        checkRole();
    }, [session.data?.session.userId]);

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
            if (data.role === "none") {
                redirect("/onboarding");
            }
            setRoleChecked(true)
        })
    }

    if (roleChecked) {
        return (
            <div className=" font-montserrat grid place-items-center h-screen ">
                {/*{data &&*/}
                <div>
                    <div className="text-xl font-semibold text-gray-800 space-y-20 text-center">Welcome, {session.data?.user.name}!</div>
                    {/*<div className="font-medium">{data.date}</div>*/}
                    {/*<div className="font-medium">{data.copticDate}</div>*/}
                    {/*<div className="font-medium">{data.feast}</div>*/}
                    {/*<div><a href={data.bibleUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">*/}
                    {/*    {data.reading}*/}
                    {/*</a></div>*/}
                    <Button
                        className="font-bold text-white bg-blue-600 hover:bg-blue-700 transition duration-200 ml-[50px]"
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </Button>
                    {/*<Questions />*/}
                </div>
                {/*}*/}
            </div>
        );
    } else {
        return null
    }
}
