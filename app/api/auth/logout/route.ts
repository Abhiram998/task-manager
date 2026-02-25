import { NextResponse } from "next/server";
import { removeAuthCookie } from "@/lib/auth";
import { withErrorHandler } from "@/lib/error-handler";

export const POST = withErrorHandler(async () => {
    const response = NextResponse.json(
        { message: "Logged out successfully" },
        { status: 200 }
    );

    await removeAuthCookie();

    return response;
});
