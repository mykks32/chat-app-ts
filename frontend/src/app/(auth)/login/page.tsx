"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginUserSchema } from "@/schemas"
import type { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import userService from "@/services/auth"
import Link from "next/link"

type LoginSchema = z.infer<typeof loginUserSchema>

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
        resolver: zodResolver(loginUserSchema),
    })

    const mutate = useMutation({
        mutationFn: (data: LoginSchema) => userService.loginUser(data),
        onSuccess: async () => {
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        },
        onError: (error) => {
            console.error("Login failed:", error);
        }
    });



    const onSubmit = (data: LoginSchema) => {
        mutate.mutate(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col justify-center items-center h-screen px-4">
                <Card className="w-full max-w-md sm:max-w-lg">
                    <CardHeader className="space-y-1">
                        <div className="flex">
                            Don&apos;t have an account? &nbsp;
                            <Link href="/register" className="text-primary underline hover:text-primary/80 transition">
                                Register
                            </Link>
                        </div>
                        <CardTitle className="text-2xl">Login to your account</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" {...register("password")} />
                            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" type="submit" disabled={mutate.isPending}>
                            {mutate.isPending ? "Logging in..." : "Login"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </form>
    )
}
