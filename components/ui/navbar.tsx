import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from 'next/link'
import { authClient } from "@/lib/auth-client";
import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import { Label } from "@/components/ui/label";

export default function Navbar({left,right} : {left?:any, right?:any}) {

    return (
        <div className="absolute w-screen h-14 top-0 shadow-lg flex justify-between items-center px-4">
            <div>
                {left}
            </div>
            <div>
                {right}
            </div>
        </div>
    );
}
