import { NextRequest, NextResponse } from "next/server";
import { TaskService } from "@/services/task.service";
import { getSession } from "@/lib/auth";
import { withErrorHandler } from "@/lib/error-handler";
import { updateTaskSchema } from "@/lib/validations";
import { UnauthorizedError } from "@/lib/exceptions";

export const PUT = withErrorHandler(
    async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
        const session = await getSession();
        if (!session) throw new UnauthorizedError();

        const { id } = await params;
        const body = await req.json();
        const validatedData = updateTaskSchema.parse(body);

        const task = await TaskService.updateTask(
            session.userId as string,
            id,
            validatedData
        );

        return NextResponse.json(task);
    }
);

export const DELETE = withErrorHandler(
    async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
        const session = await getSession();
        if (!session) throw new UnauthorizedError();

        const { id } = await params;
        await TaskService.deleteTask(session.userId as string, id);

        return NextResponse.json({ message: "Task deleted successfully" });
    }
);
