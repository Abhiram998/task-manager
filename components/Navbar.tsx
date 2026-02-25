"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckSquare, LogOut, User } from "lucide-react";
import { toast } from "sonner";

export default function Navbar({ userName }: { userName?: string }) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/auth/logout", { method: "POST" });
            if (res.ok) {
                toast.success("Logged out successfully");
                router.push("/login");
                router.refresh();
            }
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    return (
        <nav className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2">
                        <CheckSquare className="w-8 h-8 text-blue-500" />
                        <span className="text-xl font-bold gradient-text">TaskPro</span>
                    </div>

                    <div className="flex items-center gap-6">
                        {userName ? (
                            <>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <User className="w-4 h-4" />
                                    <span>{userName}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-4">
                                <Link href="/login" className="text-sm font-medium hover:text-blue-400 transition-colors">
                                    Login
                                </Link>
                                <Link href="/register" className="text-sm font-medium bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
