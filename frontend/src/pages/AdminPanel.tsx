import { useEffect, useState } from "react";
import { api, getAuthHeaders } from "../api";

interface User {
    _id: string;
    email: string;
    status: "PENDING" | "APPROVED";
}

interface Suggestion {
    _id: string;
    project: { name: string; category: string };
    category: string;
    suggestion: string;
    user: { _id: string; name: string };
    createdAt: string;
}

export default function AdminPanel() {
    const [users, setUsers] = useState<User[]>([]);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

    const loadUsers = async () => {
        const res = await api.get("/api/users", {
            headers: getAuthHeaders(),
        });
        setUsers(res.data);
    };

    const loadSuggestions = async () => {
        const res = await api.get("/api/suggestions", {
            headers: getAuthHeaders(),
        });
        setSuggestions(res.data);
    };

    useEffect(() => {
        void api
            .get("/api/users", {
                headers: getAuthHeaders(),
            })
            .then((res) => setUsers(res.data))
            .catch((error) => console.error(error));

        void api
            .get("/api/suggestions", {
                headers: getAuthHeaders(),
            })
            .then((res) => setSuggestions(res.data))
            .catch((error) => console.error(error));
    }, []);

    const approveUser = async (id: string) => {
        await api.patch(
            "/api/auth/approve",
            { userId: id },
            {
                headers: getAuthHeaders(),
            }
        );
        void loadUsers();
    };

    const deleteSuggestion = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this suggestion?")) {
            await api.delete(`/api/suggestions/${id}`, {
                headers: getAuthHeaders(),
            });
            void loadSuggestions();
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-10">
            <h1 className="text-2xl sm:text-3xl mb-6 font-bold">Admin Panel</h1>

            <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="hidden sm:grid grid-cols-3 p-3 border-b border-gray-700 font-semibold">
                    <span>Email</span>
                    <span>Status</span>
                    <span>Action</span>
                </div>

                <div className="divide-y divide-gray-700">
                    {users
                        .filter((u) => u.status === "PENDING")
                        .map((user) => (
                            <div
                                key={user._id}
                                className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-0 p-3 sm:p-3 border-b sm:border-b border-gray-700 items-start sm:items-center"
                            >
                                <div className="sm:hidden text-xs text-gray-400">Email</div>
                                <span className="font-medium text-sm sm:text-base">{user.email}</span>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
                                    <span className="sm:hidden text-xs text-gray-400">Status:</span>
                                    <span className="text-yellow-400 text-sm sm:text-base">{user.status}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
                                    <span className="sm:hidden text-xs text-gray-400">Action:</span>
                                    <button
                                        onClick={() => approveUser(user._id)}
                                        className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded w-fit text-sm"
                                    >
                                        Approve
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Suggestions Section */}
            <h2 className="text-xl sm:text-2xl mb-4 font-bold mt-8">User Suggestions</h2>
            <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="hidden sm:grid grid-cols-5 p-3 border-b border-gray-700 font-semibold">
                    <span>Project</span>
                    <span>Category</span>
                    <span>Suggestion</span>
                    <span>User</span>
                    <span>Action</span>
                </div>
                <div className="divide-y divide-gray-700">
                    {suggestions.map((suggestion) => (
                        <div
                            key={suggestion._id}
                            className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-0 p-3 sm:p-3 border-b sm:border-b border-gray-700 items-start sm:items-center"
                        >
                            <div className="sm:hidden text-xs text-gray-400">Project</div>
                            <span className="font-medium text-sm sm:text-base">{suggestion.project.name}</span>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
                                <span className="sm:hidden text-xs text-gray-400">Category:</span>
                                <span className="text-blue-400 text-sm sm:text-base">{suggestion.category}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
                                <span className="sm:hidden text-xs text-gray-400">Suggestion:</span>
                                <span className="text-sm sm:text-base max-w-xs truncate" title={suggestion.suggestion}>
                                    {suggestion.suggestion}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
                                <span className="sm:hidden text-xs text-gray-400">User:</span>
                                <span className="text-sm sm:text-base">{suggestion.user.name}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
                                <span className="sm:hidden text-xs text-gray-400">Action:</span>
                                <button
                                    onClick={() => deleteSuggestion(suggestion._id)}
                                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded w-fit text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {suggestions.length === 0 && (
                    <div className="p-6 text-center text-gray-400">
                        No suggestions yet
                    </div>
                )}
            </div>
        </div>
    );
}