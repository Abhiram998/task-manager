"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import TaskItem from "@/components/TaskItem";
import TaskForm from "@/components/TaskForm";
import { Search, Filter, ChevronLeft, ChevronRight, Loader2, ClipboardList } from "lucide-react";
import { debounce } from "lodash";

export default function DashboardPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<string>("");
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/tasks/stats");
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Failed to fetch stats");
        }
    };

    const fetchUser = async () => {
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error("Failed to fetch user");
        }
    };

    const fetchTasks = async (searchQuery = search) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: "5",
                ...(status && { status }),
                ...(searchQuery && { search: searchQuery }),
            });
            const res = await fetch(`/api/tasks?${queryParams}`);
            if (res.ok) {
                const data = await res.json();
                setTasks(data.tasks);
                setTotalPages(data.pagination.totalPages);
                fetchStats();
            }
        } catch (error) {
            console.error("Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    };

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((query: string) => {
            setPage(1);
            fetchTasks(query);
        }, 500),
        [status]
    );

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [page, status]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearch(query);
        debouncedSearch(query);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <Navbar userName={user?.name || user?.email} />

            <main className="max-w-4xl mx-auto px-4 py-12">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold mb-2">Workspace</h1>
                    <p className="text-gray-400">Manage your daily goals and track progress.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    className="input-field pl-10"
                                    value={search}
                                    onChange={handleSearchChange}
                                />
                            </div>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <select
                                    className="input-field pl-10 appearance-none pr-8 cursor-pointer"
                                    onChange={(e) => {
                                        setStatus(e.target.value);
                                        setPage(1);
                                    }}
                                    value={status}
                                >
                                    <option value="">All Status</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                </div>
                            ) : tasks.length > 0 ? (
                                <>
                                    <div className="grid gap-3">
                                        {tasks.map((task) => (
                                            <TaskItem key={task.id} task={task} onUpdate={fetchTasks} />
                                        ))}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="flex justify-center items-center gap-4 mt-8">
                                            <button
                                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                                disabled={page === 1}
                                                className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-20 transition-colors"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            <span className="text-sm font-medium text-gray-400">
                                                Page {page} of {totalPages}
                                            </span>
                                            <button
                                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                                disabled={page === totalPages}
                                                className="p-2 hover:bg-white/5 rounded-lg disabled:opacity-20 transition-colors"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                                    <ClipboardList className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                                    <h3 className="text-xl font-medium text-gray-500">No tasks found</h3>
                                    <p className="text-gray-600 mt-2">Try adjusting your filters or search query.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <TaskForm onSuccess={fetchTasks} />

                        <div className="card glass">
                            <h3 className="font-bold mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Total Tasks</span>
                                    <span className="font-mono">{stats.total}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Completed</span>
                                    <span className="font-mono text-green-500">{stats.completed}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Pending</span>
                                    <span className="font-mono text-blue-500">{stats.pending}</span>
                                </div>
                                <div className="pt-4 border-t border-white/5">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500 uppercase font-bold tracking-widest">Efficiency</span>
                                        <span className="text-blue-400 font-bold">
                                            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div
                                            className="bg-blue-500 h-full transition-all duration-500"
                                            style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
