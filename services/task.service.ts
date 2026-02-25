import { prisma } from "@/lib/prisma";
import { ForbiddenError, NotFoundError } from "@/lib/exceptions";
import { TaskInput } from "@/lib/validations";
import { Status } from "@prisma/client";

export class TaskService {
    static async createTask(userId: string, data: TaskInput) {
        return await prisma.task.create({
            data: {
                ...data,
                userId,
            },
        });
    }

    static async getTasks(
        userId: string,
        params: {
            page?: number;
            limit?: number;
            status?: Status;
            search?: string;
        } = {}
    ) {
        const { page = 1, limit = 10, status, search } = params;
        const skip = (page - 1) * limit;

        const where: any = {
            userId,
        };

        if (status) {
            where.status = status;
        }

        if (search) {
            where.title = {
                contains: search,
                mode: "insensitive",
            };
        }

        const [tasks, total] = await Promise.all([
            prisma.task.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.task.count({ where }),
        ]);

        return {
            tasks,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    static async updateTask(userId: string, taskId: string, data: Partial<TaskInput>) {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task) throw new NotFoundError("Task not found");
        if (task.userId !== userId) throw new ForbiddenError();

        return await prisma.task.update({
            where: { id: taskId },
            data,
        });
    }

    static async deleteTask(userId: string, taskId: string) {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task) throw new NotFoundError("Task not found");
        if (task.userId !== userId) throw new ForbiddenError();

        await prisma.task.delete({
            where: { id: taskId },
        });

        return { success: true };
    }
}
