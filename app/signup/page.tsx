"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from 'next/link'
import { authClient } from "@/lib/auth-client";
import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import { Label } from "@/components/ui/label";

export default function Signup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)
    const [confirmedPassword, setConfirmedPassword] = useState("")

    const handleGoogleSignup = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
            newUserCallbackURL: "/onboarding"
        }, {
            onRequest: () => {
                setLoading(true)
            },
            onError: (ctx) => {
                setLoading(false)
                toast.error(ctx.error.message)
            }
        })
    
    }

    const handleEmailSignup = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!email || !password || !firstName || !lastName) {
            toast.error("Please fill in all fields.")
            return;
        }
        if (confirmedPassword != password) {
            console.log(confirmedPassword, password)
            toast.error("Passwords don't match.")
            return;
        }
        const { data, error } = await authClient.signUp.email({
            'email': email,
            'password': password,
            'name': `${firstName} ${lastName}`
        }, {
            onRequest: (ctx) => {
                setLoading(true)
            },
            onSuccess: (ctx) => {
                redirect("/onboarding")
            },
            onError: (ctx) => {
                setLoading(false)
                console.log("toast error")
                toast.error(ctx.error.message)
            },
        });
    };

    return (
        <div className="font-montserrat min-h-screen flex items-center justify-center     grid place-items-center h-screen flex-col w-screen">
            <div className="w-[300px]">
                <div className="text-3xl font-bold text-neutral-700 text-center mb-8">Signup</div>
                <Button
                    className="w-full gap-4 font-bold border-neutral-400 border bg-white"
                    onClick={handleGoogleSignup}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="0.98em"
                        height="1em"
                        viewBox="0 0 256 262"
                    >
                        <path
                            fill="#4285F4"
                            d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                        />
                        <path
                            fill="#34A853"
                            d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                        />
                        <path
                            fill="#FBBC05"
                            d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                        />
                        <path
                            fill="#EB4335"
                            d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                        />
                    </svg>
                    <div className="text-neutral-700">Signup with Google</div>

                </Button>
                <div className="flex items-center gap-3 my-5">
                    <div className="h-px flex-1 bg-neutral-300"></div>
                    <div className="text-neutral-700">OR</div>
                    <div className="h-px flex-1 bg-neutral-300"></div>
                </div>
                <form onSubmit={handleEmailSignup} className="flex flex-col">
                <div className="grid grid-cols-2 gap-4">
						<div className="grid">
							<Label htmlFor="first-name" className="text-neutral-700 mb-2">First name</Label>
							<Input
                                className="border-neutral-400 text-neutral-700 mb-4 bg-white"
								id="first-name"
								placeholder="John"
								required
								onChange={(e) => {
									setFirstName(e.target.value);
								}}
								value={firstName}
							/>
						</div>
						<div className="grid">
							<Label htmlFor="last-name" className="text-neutral-700 mb-2">Last name</Label>
							<Input
                                className="border-neutral-400 text-neutral-700 mb-4 bg-white"
								id="last-name"
								placeholder="Doe"
								required
								onChange={(e) => {
									setLastName(e.target.value);
								}}
								value={lastName}
							/>
						</div>
					</div>
                    <Label htmlFor="email" className="text-neutral-700 mb-2">Email</Label>
                    <Input
                        id="email"
                        placeholder="user@example.com"
                        className="border-neutral-400 text-neutral-700 mb-4 bg-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Label htmlFor="password" className="text-neutral-700 mb-2">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="password"
                        className="border-neutral-400 text-neutral-700 mb-4 bg-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Label htmlFor="password" className="text-neutral-700 mb-2">Confirm Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="confirm password"
                        className="border-neutral-400 text-neutral-700 mb-4 bg-white"
                        value={confirmedPassword}
                        onChange={(e) => setConfirmedPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        className="bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                        {!loading ? "Signup" : <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>}
                    </Button>
                </form>
                <div className="flex-row flex gap-2 mt-5 text-sm">
                    <div>Have an account?</div><Link href={"/login"} className="font-bold text-blue-700">Login</Link>
                </div>
            </div>
        </div>
    );
}
