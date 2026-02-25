import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { withErrorHandler } from "@/lib/error-handler";
import { loginSchema } from "@/lib/validations";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export const POST = withErrorHandler(async (req: NextRequest) => {
    const body = await req.json();
    const validatedData = loginSchema.parse(body);

    const { user, token } = await AuthService.login(validatedData);

    const response = NextResponse.json(
        { message: "Login successful", user },
        { status: 200 }
    );

    response.cookies.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
    });

    return response;
});
