
import { NextRequest, NextResponse } from "next/server";
import { RegisterSchema } from "@/schema";
import { hash } from "bcrypt-ts";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
    try {
        const data = await req.json()
        const validatedData = await RegisterSchema.safeParse(data);
        const session = await auth()

        const userExists = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });

        if (!validatedData) {
            return NextResponse.json(
                { message: "Invalid Data" },
                { status: 400 }
            )
        };
        if (session) {
            return NextResponse.json(
                { message: "You are already connected" },
                { status: 400 }
            )
        };

        if (userExists) {
            return NextResponse.json(
                { message: "There is already an account with this email address." },
                { status: 400 }
            )
        };

        const hashedPass = await hash(data.password, 15)

        const user = await prisma.user.create({
            data: {
                firstName: data.firstName,
                name: data.name,
                email: data.email,
                password: hashedPass,
                role: "User",
            }
        });

        if (!user) {
            return NextResponse.json(
                { message: "The account could not created in the database." },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { message: "The user is created" },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to create a user" + error },
            { status: 500 }
        )
    }
}