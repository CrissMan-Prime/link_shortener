import { ShortenerSchema, ShortenerUpdateSchema } from "@/schema";
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
    } catch {
        return NextResponse.json(
            { message: "Failed to create the link" },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json(
                { message: "No result" },
                { status: 400 }
            )
        };

        const link = await prisma.link.findMany({
            where: {
                owner: session?.user.uuid as string
            },
            select: {
                uuid: true,
                owner: true,
                shorta: true,
                original: true
            },
        });
        if (!link) {
            return NextResponse.json(
                { message: "No result" },
                { status: 400 }
            )
        };

        return NextResponse.json(link);
    } catch {
        return NextResponse.json(
            { error: "Failed to fetch user" },
            { status: 500 }
        )
    };
}


export async function PUT(req: NextRequest) {
    try {
        const data = await req.json();
        const validatedData = await ShortenerUpdateSchema.safeParse(data);
        const session = await auth()
        if (!validatedData) {
            return NextResponse.json(
                { message: "Invalid Data" },
                { status: 400 }
            )
        };
        const isOwner = await prisma.link.findMany({
            where:{
                uuid: data.uuid,
                owner: data.owner
            }
        })
        if (!isOwner) {
            return NextResponse.json(
                { message: "You are not the owner" },
                { status: 400 }
            )
        };
        if (!session) {
            return NextResponse.json(
                { message: "You are not connected" },
                { status: 400 }
            )
        };
        
        const link = await prisma.link.update({
            where: {
                uuid: data.uuid
            },
            data: {
                original: data.original
            }
        })

        if (!link) {
            return NextResponse.json(
                { message: "The link could not be updated." },
                { status: 400 }
            )
        };
        
        return NextResponse.json(
            { message: "The Link is update" },
            { status: 200 }
        );
    } catch {
        return NextResponse.json(
            { message: "Failed to create the link" },
            { status: 500 }
        )
    }
}


export async function DELETE(req: NextRequest) {
    try {
        const data = await req.json();
        const validatedData = await ShortenerUpdateSchema.safeParse(data);
        const session = await auth()
        if (!validatedData) {
            return NextResponse.json(
                { message: "Invalid Data" },
                { status: 400 }
            )
        };
        const isOwner = await prisma.link.findMany({
            where:{
                uuid: data.uuid,
                owner: data.owner
            }
        })
        if (!isOwner) {
            return NextResponse.json(
                { message: "You are not the owner" },
                { status: 400 }
            )
        };
        if (!session) {
            return NextResponse.json(
                { message: "You are not connected" },
                { status: 400 }
            )
        };
        
        const link = await prisma.link.delete({
            where: {
                uuid: data.uuid
            },
        });

        if (!link) {
            return NextResponse.json(
                { message: "The link could not be delete." },
                { status: 400 }
            )
        };
        
        return NextResponse.json(
            { message: "The Link is delete" },
            { status: 200 }
        );
    } catch {
        return NextResponse.json(
            { message: "Failed to delete the link" },
            { status: 500 }
        )
    }
}