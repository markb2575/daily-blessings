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
        <div></div>
    )
}
