"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Invalid credentials");
            }

            toast.success("Welcome back!");
            router.push("/dashboard");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a]">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl">
                            <CheckSquare className="w-10 h-10 text-blue-500" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Sign in to TaskPro</h1>
                    <p className="text-gray-400">Manage your workspace with ease</p>
                </div>

                <div className="card glass">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="input-field"
                                placeholder="name@example.com"
                                autoComplete="email"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-gray-300">Password</label>
                            </div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="input-field"
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-400">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-blue-500 hover:underline font-medium">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
