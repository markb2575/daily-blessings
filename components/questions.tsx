"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

interface Data {
    questions: Questions[];
}
interface Questions {
    question: string;
    isFillInTheBlank: boolean;
}

export default function Questions() {
    const [data, setData] = useState<Data | null>(null);

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const fetchData = async () => {
        const response = await fetch('/api/questions', {
            headers: {
                'timezone': userTimeZone,
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setData(data);
        console.log("data", data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Card className="w-full max-w-md shadow-lg">
            Questions:
            {data &&

                <div>
                    {data.questions.map((v, i) => {
                        console.log("map", v, i)
                        if (v.isFillInTheBlank) {
                            console.log(v.question.split("_"))
                        } else {
                            return <div key={i}>{v.question}</div>
                        }
                        
                    })}
                </div>
            }
        </Card>


    );
}
