import { ShortenerSchema } from "@/schema";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma";
import { nanoid } from '@sitnik/nanoid'


export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const validatedData = await ShortenerSchema.safeParse(data);
        const session = await auth()
        if (!validatedData) {
            return NextResponse.json(
                { message: "Invalid Data" },
                { status: 400 }
            )
        };

        if (!session) {
            return NextResponse.json(
                { message: "You are not connected" },
                { status: 400 }
            )
        };
        const sortLink = await nanoid(6)
        const shorta = await prisma.link.create({
            data: {
                original: data.original,
                shorta: sortLink,
                owner: data.author
            }
        });
     /*    const user = await prisma.user.update({
            where: {
                uuid: session.user.uuid
            },
            data: {
                link: {
                    [
                        sortLink
                    ]
            }
            }
        }) */
        if (!shorta) {
            return NextResponse.json(
                { message: "The link could not be processed, try again." },
                { status: 400 }
            )
        };
        return NextResponse.json(
            { message: "The Link is created" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to create the link" + error },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const session = await auth()
        console.log(session?.user.uuid)
        const link = await prisma.user.findUnique({
            where: {
                uuid: session?.user.uuid
            },
            select: {
                owner: true,
                shorta: true,
                uuid: true,
                original: true,
            },
        });

        return NextResponse.json(
            { link },
            { status: 200 }
        );
        return NextResponse;
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch user" + error },
            { status: 500 }
        )
    };
}