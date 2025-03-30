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
import { registerUserSchema } from "@/schemas"
import type { z } from "zod"

type RegisterSchema = z.infer<typeof registerUserSchema>

export default function CardsCreateAccount() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterSchema>({
        resolver: zodResolver(registerUserSchema),
    })

    console.log("form", watch())

    const onSubmit = (data: RegisterSchema) => {
        console.log("data", data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-center items-center h-screen px-4">
                <Card className="w-full max-w-md sm:max-w-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl">Create an account</CardTitle>
                        <CardDescription>
                            Enter your email below to create your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" type="text" placeholder="John Doe" {...register("name")} />
                            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                        </div>
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
                        <Button className="w-full" type="submit">Create account</Button>
                    </CardFooter>
                </Card>
            </div>
        </form>
    )
}
