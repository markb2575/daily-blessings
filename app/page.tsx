"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Questions from "@/components/questions";

interface DashboardData {
    date: string;
    copticDate: string;
    feast: string;
    reading: string;
    bibleUrl: string;
}

export default function Home() {
    const [data, setData] = useState<DashboardData | null>(null);
    const session = authClient.useSession();
    const handleSignOut = async () => {
        await authClient.signOut();
        redirect('/login');
    };

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const fetchData = async () => {
        const response = await fetch('/api/dashboard', {
            headers: {
                'timezone': userTimeZone,
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setData(data);
        console.log(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className=" font-montserrat ">
            {data &&
                <div>
                    <div className="text-xl font-semibold text-gray-800">Welcome, {session.data?.user.name}!</div>
                    <div className="font-medium">{data.date}</div>
                    <div className="font-medium">{data.copticDate}</div>
                    <div className="font-medium">{data.feast}</div>
                    <div><a href={data.bibleUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {data.reading}
                    </a></div>
                    <Button
                        className="gap-4 font-bold text-white bg-blue-600 hover:bg-blue-700 transition duration-200"
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </Button>
                    <Questions />
                </div>
            }
        </div>
    );
}
