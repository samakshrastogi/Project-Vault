import { useState } from "react";
import axios from "axios";

interface ForgotPasswordProps {
    switchToLogin: () => void;
}

export default function ForgotPassword({ switchToLogin }: ForgotPasswordProps) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showResetForm, setShowResetForm] = useState(false);

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setMessage("Email is required");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const { data } = await axios.post(
                "http://localhost:5000/api/auth/forgot-password",
                { email }
            );

            setMessage(data.message);
            if (data.resetToken) {
                setResetToken(data.resetToken);
                setShowResetForm(true);
            }
        } catch (err: any) {
            setMessage(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            setMessage("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const { data } = await axios.post(
                "http://localhost:5000/api/auth/reset-password",
                { token: resetToken, newPassword }
            );

            setMessage(data.message);
            setTimeout(() => switchToLogin(), 2000);
        } catch (err: any) {
            setMessage(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4">
            <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-700">
                <h2 className="text-3xl mb-6 font-bold text-center bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    {showResetForm ? "Reset Password" : "Forgot Password"}
                </h2>

                {!showResetForm ? (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 p-3 rounded-lg font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                                placeholder="Enter new password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-linear-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 p-3 rounded-lg font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}

                {message && (
                    <div className={`mt-4 p-3 rounded-lg text-center text-sm ${
                        message.includes("success") || message.includes("generated")
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}>
                        {message}
                    </div>
                )}

                <button
                    onClick={switchToLogin}
                    className="w-full mt-4 text-gray-400 hover:text-white transition-colors"
                >
                    ← Back to Login
                </button>
            </div>
        </div>
    );
}