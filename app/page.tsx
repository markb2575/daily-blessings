"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function Home() {
    const handleSignOut = async () => {
        await authClient.signOut();
        redirect('/login')
    };
    return (
        <div>
            <Button
                className="w-52 gap-4 font-bold border-gray-400 border bg-white"
                onClick={handleSignOut}
            ></Button>
        </div>
    );
}
