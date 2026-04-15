import { useEffect, useState } from "react";
import axios from "axios";

interface User {
    _id: string;
    email: string;
    status: "PENDING" | "APPROVED";
}

export default function AdminPanel() {
    const [users, setUsers] = useState<User[]>([]);
    const token = localStorage.getItem("token");

    const fetchUsers = async () => {
        const res = await axios.get("http://localhost:5000/api/users", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setUsers(res.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const approveUser = async (id: string) => {
        await axios.patch(
            "http://localhost:5000/api/auth/approve",
            { userId: id },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        fetchUsers();
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-10">
            <h1 className="text-2xl mb-6 font-bold">Admin Panel</h1>

            <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="grid grid-cols-3 p-3 border-b border-gray-700 font-semibold">
                    <span>Email</span>
                    <span>Status</span>
                    <span>Action</span>
                </div>

                {users
                    .filter((u) => u.status === "PENDING")
                    .map((user) => (
                        <div
                            key={user._id}
                            className="grid grid-cols-3 p-3 border-b border-gray-700 items-center"
                        >
                            <span>{user.email}</span>
                            <span className="text-yellow-400">{user.status}</span>

                            <button
                                onClick={() => approveUser(user._id)}
                                className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded w-fit"
                            >
                                Approve
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}