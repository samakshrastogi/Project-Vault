import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";

interface RegisterProps {
    switchToLogin: () => void;
}

interface RegisterForm {
    name: string;
    email: string;
    password: string;
}

export default function Register({ switchToLogin }: RegisterProps) {
    const [form, setForm] = useState<RegisterForm>({
        name: "",
        email: "",
        password: "",
    });

    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.password) {
            setMessage("All fields are required");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const { data } = await axios.post(
                "http://localhost:5000/api/auth/register",
                form
            );

            setMessage(data.message);
            setForm({ name: "", email: "", password: "" });
        } catch (err: any) {
            setMessage(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-lg"
            >
                <h2 className="text-2xl mb-4 font-bold text-center">Register</h2>

                <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 rounded bg-gray-700 outline-none"
                    required
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 rounded bg-gray-700 outline-none"
                    required
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full mb-3 p-2 rounded bg-gray-700 outline-none"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded font-semibold transition disabled:opacity-60"
                >
                    {loading ? "Registering..." : "Register"}
                </button>

                {message && (
                    <p className="mt-3 text-sm text-center text-green-400">
                        {message}
                    </p>
                )}

                <p className="mt-4 text-sm text-center">
                    Already have an account?{" "}
                    <span
                        className="text-blue-400 cursor-pointer hover:underline"
                        onClick={switchToLogin}
                    >
                        Login
                    </span>
                </p>
            </form>
        </div>
    );
}