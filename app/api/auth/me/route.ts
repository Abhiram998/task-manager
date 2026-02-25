import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withErrorHandler } from "@/lib/error-handler";
import { UnauthorizedError } from "@/lib/exceptions";

export const GET = withErrorHandler(async () => {
    const session = await getSession();

    if (!session) {
        throw new UnauthorizedError();
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId as string },
        select: { id: true, email: true, name: true, createdAt: true },
    });

    if (!user) {
        throw new UnauthorizedError();
    }

    return NextResponse.json({ user });
});
