"use client";

import { useState, useRef, useEffect } from "react";
import { CheckCircle2, Circle, Edit2, Trash2, Clock, Check, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Task {
    id: string;
    title: string;
    description?: string;
    status: "PENDING" | "COMPLETED";
    createdAt: string;
}

export default function TaskItem({ task, onUpdate }: { task: Task; onUpdate: () => void }) {
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState({ title: task.title, description: task.description || "" });
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    const toggleStatus = async () => {
        setLoading(true);
        try {
            const newStatus = task.status === "PENDING" ? "COMPLETED" : "PENDING";
            const res = await fetch(`/api/tasks/${task.id}`, {
                method: "PUT",
                body: JSON.stringify({ status: newStatus }),
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                onUpdate();
            }
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!editValue.title.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/tasks/${task.id}`, {
                method: "PUT",
                body: JSON.stringify(editValue),
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                setIsEditing(false);
                onUpdate();
            }
        } catch (error) {
            toast.error("Failed to update task");
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async () => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Task deleted");
                onUpdate();
            }
        } catch (error) {
            toast.error("Failed to delete task");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`group flex items-center gap-4 p-4 rounded-xl border transition-all ${task.status === "COMPLETED" ? "bg-white/5 border-white/5 opacity-60" : "bg-card border-card-border hover:border-blue-500/50"
            }`}>
            <button
                onClick={toggleStatus}
                disabled={loading || isEditing}
                className="text-blue-500 hover:scale-110 transition-transform disabled:opacity-50"
            >
                {task.status === "COMPLETED" ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
            </button>

            <div className="flex-1 min-w-0">
                {isEditing ? (
                    <div className="space-y-2">
                        <input
                            ref={inputRef}
                            value={editValue.title}
                            onChange={(e) => setEditValue({ ...editValue, title: e.target.value })}
                            className="bg-transparent border-b border-blue-500 w-full focus:outline-none text-white font-medium"
                            placeholder="Task title"
                        />
                        <input
                            value={editValue.description}
                            onChange={(e) => setEditValue({ ...editValue, description: e.target.value })}
                            className="bg-transparent border-b border-white/10 w-full focus:outline-none text-sm text-gray-400"
                            placeholder="Add description..."
                        />
                    </div>
                ) : (
                    <>
                        <h3 className={`font-medium truncate ${task.status === "COMPLETED" ? "line-through text-gray-500" : ""}`}>
                            {task.title}
                        </h3>
                        {task.description && (
                            <p className="text-sm text-gray-500 truncate mt-0.5">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500 uppercase tracking-wider">
                            <Clock className="w-3 h-3" />
                            {format(new Date(task.createdAt), "MMM d, HH:mm")}
                        </div>
                    </>
                )}
            </div>

            <div className="flex items-center gap-1">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleUpdate}
                            disabled={loading}
                            className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                        >
                            <Check className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            disabled={loading}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setIsEditing(true)}
                            disabled={loading}
                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-blue-400 transition-all hover:bg-blue-400/10 rounded-lg"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={deleteTask}
                            disabled={loading}
                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-lg"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
