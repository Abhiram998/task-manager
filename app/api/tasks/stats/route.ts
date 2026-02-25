import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { withErrorHandler } from "@/lib/error-handler";
import { UnauthorizedError } from "@/lib/exceptions";

export const GET = withErrorHandler(async (req: NextRequest) => {
    const session = await getSession();
    if (!session) throw new UnauthorizedError();

    const userId = session.userId as string;

    const [total, pending, completed] = await Promise.all([
        prisma.task.count({ where: { userId } }),
        prisma.task.count({ where: { userId, status: "PENDING" } }),
        prisma.task.count({ where: { userId, status: "COMPLETED" } }),
    ]);

    return NextResponse.json({
        total,
        pending,
        completed,
    });
});
