"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from 'next/link'
import { authClient } from "@/lib/auth-client";
import { redirect } from 'next/navigation'
import { toast } from 'sonner'


export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!email || !password || !username) {
            toast.error("Please fill in all fields.")
            return;
        }
        const { data, error } = await authClient.signUp.email({
            'email': email,
            'password': password,
            'name': username,
        }, {
            onRequest: (ctx) => {
                setLoading(true)
            },
            onSuccess: (ctx) => {
                redirect("/")
            },
            onError: (ctx) => {
                setLoading(false)
                console.log("toast error")
                toast.error(ctx.error.message)
           
                // alert(ctx.error.message);
            },
        });
        console.log("Signing up with:", { email, password });
        // setError(""); // Clear error on successful submission
    };

    return (
        <div className="font-montserrat min-h-screen flex items-center justify-center">
            <Card className="bg-gray-100 flex-col p-8 m-4 w-full xs:w-2/3 sm:w-1/2 lg:w-1/3 max-w-xl border-gray-400 shadow-lg">
                <div className="text-3xl font-bold text-gray-700 text-center mb-8">Signup</div>
                <Button

                    className="w-full gap-4 font-bold border-gray-400 border bg-white"
                    onClick={async () => {
                        await authClient.signIn.social({
                            provider: "google",
                            callbackURL: "/",
                        }, {
                            onRequest: () => {
                                setLoading(true)
                            },
                            onSuccess: () => {
                                // redirect("/")

                            },
                            onError: (ctx) => {
                                setLoading(false)
                                toast.error(ctx.error.message)
                            }
                        })
                    }}
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
                    <div className="text-gray-700">Signup with Google</div>

                </Button>
                <div className="flex items-center gap-3 my-5">
                    <div className="h-px flex-1 bg-gray-300"></div>
                    <div className="text-gray-700">OR</div>
                    <div className="h-px flex-1 bg-gray-300"></div>
                </div>
                {/* {error && <div className="text-red-500 text-sm">{error}</div>} */}
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <Input
                        placeholder="Username"
                        className="border-gray-400 text-gray-700 mb-4 bg-white"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input
                        placeholder="Email"
                        className="border-gray-400 text-gray-700 mb-4 bg-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        className="border-gray-400 text-gray-700 mb-4 bg-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
            </Card>
        </div>
    );
}
