"use client";

import { useState } from "react";
import { Plus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export default function TaskForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const title = formData.get("title");
        const description = formData.get("description");

        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                body: JSON.stringify({ title, description }),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                toast.success("Task created!");
                setIsOpen(false);
                onSuccess();
            } else {
                const error = await res.json();
                toast.error(error.message || "Failed to create task");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-white/10 text-gray-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
            >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add new task</span>
            </button>
        );
    }

    return (
        <div className="card glass">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Create Task</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block uppercase">Title</label>
                    <input
                        name="title"
                        required
                        className="input-field"
                        placeholder="Focus on the project..."
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block uppercase">Description</label>
                    <textarea
                        name="description"
                        className="input-field min-h-[100px] resize-none"
                        placeholder="Optional details..."
                    />
                </div>
                <button
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Task"}
                </button>
            </form>
        </div>
    );
}
