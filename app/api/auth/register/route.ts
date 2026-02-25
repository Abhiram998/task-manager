import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { withErrorHandler } from "@/lib/error-handler";
import { registerSchema } from "@/lib/validations";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export const POST = withErrorHandler(async (req: NextRequest) => {
    const body = await req.json();
    const validatedData = registerSchema.parse(body);

    const { user, token } = await AuthService.register(validatedData);

    const response = NextResponse.json(
        { message: "User registered successfully", user },
        { status: 201 }
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
