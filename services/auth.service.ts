import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signJWT } from "@/lib/auth";
import { ApiError, UnauthorizedError } from "@/lib/exceptions";
import { LoginInput, RegisterInput } from "@/lib/validations";

export class AuthService {
    static async register(data: RegisterInput) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new ApiError("User with this email already exists", 409);
        }

        const hashedPassword = await bcrypt.hash(data.password, 12);

        const user = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });

        const token = await signJWT({ userId: user.id, email: user.email });
        return { user: { id: user.id, email: user.email, name: user.name }, token };
    }

    static async login(data: LoginInput) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            throw new UnauthorizedError("Invalid email or password");
        }

        const isValidPassword = await bcrypt.compare(data.password, user.password);

        if (!isValidPassword) {
            throw new UnauthorizedError("Invalid email or password");
        }

        const token = await signJWT({ userId: user.id, email: user.email });
        return { user: { id: user.id, email: user.email, name: user.name }, token };
    }
}
