import { useState, type ChangeEvent, type FormEvent } from "react";
import { api } from "../api";

interface LoginProps {
    switchToRegister: () => void;
    switchToForgotPassword: () => void;
}

interface LoginForm {
    email: string;
    password: string;
}

export default function Login({ switchToRegister, switchToForgotPassword }: LoginProps) {
    const [form, setForm] = useState<LoginForm>({
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
        if (!form.email || !form.password) {
            setMessage("Email and password are required");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const { data } = await api.post("/api/auth/login", form);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            if (data.user.role === "ADMIN") {
                window.location.replace("/admin");
            } else {
                window.location.replace("/dashboard");
            }
        } catch (err) {
            setMessage((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-6 sm:p-8 rounded-xl w-full max-w-md shadow-lg"
            >
                <h2 className="text-2xl sm:text-3xl mb-4 font-bold text-center">Login</h2>

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
                    className="w-full bg-green-500 hover:bg-green-600 p-2 rounded font-semibold transition disabled:opacity-60"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                {message && (
                    <p className="mt-3 text-sm text-center text-yellow-400">
                        {message}
                    </p>
                )}

                <div className="mt-6 text-center space-y-2">
                    <button
                        onClick={switchToForgotPassword}
                        className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                    >
                        Forgot your password?
                    </button>
                    <p className="text-sm text-gray-400">
                        Don't have an account?{" "}
                        <button
                            onClick={switchToRegister}
                            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </form>
        </div>
    );
}