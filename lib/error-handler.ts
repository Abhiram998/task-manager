import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/exceptions";
import { ZodError } from "zod";

export function withErrorHandler(handler: Function) {
    return async (req: NextRequest, ...args: any[]) => {
        try {
            // Log request
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

            return await handler(req, ...args);
        } catch (error: any) {
            console.error(error);

            if (error instanceof ApiError) {
                return NextResponse.json(
                    { message: error.message, errors: error.errors },
                    { status: error.statusCode }
                );
            }

            if (error instanceof ZodError) {
                return NextResponse.json(
                    { message: "Validation failed", errors: error.issues },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                { message: "Internal server error" },
                { status: 500 }
            );
        }
    };
}
