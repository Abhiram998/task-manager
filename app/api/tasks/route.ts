import { NextRequest, NextResponse } from "next/server";
import { TaskService } from "@/services/task.service";
import { getSession } from "@/lib/auth";
import { withErrorHandler } from "@/lib/error-handler";
import { taskSchema } from "@/lib/validations";
import { UnauthorizedError } from "@/lib/exceptions";
import { Status } from "@prisma/client";

export const GET = withErrorHandler(async (req: NextRequest) => {
    const session = await getSession();
    if (!session) throw new UnauthorizedError();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") as Status | undefined;
    const search = searchParams.get("search") || undefined;

    const result = await TaskService.getTasks(session.userId as string, {
        page,
        limit,
        status,
        search,
    });

    return NextResponse.json(result);
});

export const POST = withErrorHandler(async (req: NextRequest) => {
    const session = await getSession();
    if (!session) throw new UnauthorizedError();

    const body = await req.json();
    const validatedData = taskSchema.parse(body);

    const task = await TaskService.createTask(session.userId as string, validatedData);

    return NextResponse.json(task, { status: 201 });
});
