import { useEffect, useState, useMemo } from "react";
import { api, getAuthHeaders } from "../api";

interface User {
    _id: string;
    name?: string;
    role?: "USER" | "ADMIN";
}

interface Project {
    _id: string;
    name: string;
    category: string;
    visitLink: string;
    createdBy: string;
    user: { _id: string; name: string };
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        visitLink: "",
    });
    const [showSuggestionModal, setShowSuggestionModal] = useState(false);
    const [suggestionFormData, setSuggestionFormData] = useState({
        category: "",
        project: "",
        suggestion: "",
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data } = await api.get("/api/projects", {
                headers: getAuthHeaders(),
            });
            setProjects(data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const categories = useMemo(() => {
        const cats = [...new Set(projects.map(p => p.category))];
        return cats;
    }, [projects]);

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.category.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "" || project.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [projects, searchTerm, selectedCategory]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.replace("/");
    };

    const goToAdmin = () => {
        window.location.replace("/admin");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProject) {
                await api.put(`/api/projects/${editingProject._id}`, formData, {
                    headers: getAuthHeaders(),
                });
            } else {
                await api.post("/api/projects", formData, {
                    headers: getAuthHeaders(),
                });
            }
            fetchProjects();
            setShowAddModal(false);
            setEditingProject(null);
            setFormData({ name: "", category: "", visitLink: "" });
        } catch (error) {
            console.error("Error saving project:", error);
        }
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setFormData({
            name: project.name,
            category: project.category,
            visitLink: project.visitLink,
        });
        setShowAddModal(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/api/projects/${id}`, {
                headers: getAuthHeaders(),
            });
            fetchProjects();
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    const handleSuggestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/api/suggestions", suggestionFormData, {
                headers: getAuthHeaders(),
            });
            setShowSuggestionModal(false);
            setSuggestionFormData({ category: "", project: "", suggestion: "" });
            alert("Suggestion submitted successfully!");
        } catch (error) {
            console.error("Error submitting suggestion:", error);
            alert("Failed to submit suggestion. Please try again.");
        }
    };

    const normalizeUrl = (url: string) => {
        if (!url) return "";
        let normalized = url.trim();
        if (!/^https?:\/\//i.test(normalized)) {
            normalized = `https://${normalized}`;
        }
        return normalized;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-3 sm:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                    <h1 className="text-3xl font-bold">
                        Welcome, {user?.name || "User"} 👋
                    </h1>
                    <div className="flex gap-4">
                        {user?.role === "ADMIN" && (
                            <button
                                onClick={goToAdmin}
                                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded font-semibold"
                            >
                                Go to Admin Panel
                            </button>
                        )}
                        <button
                            onClick={() => setShowSuggestionModal(true)}
                            className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded font-semibold"
                        >
                            Give Feedback
                        </button>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded font-semibold"
                        >
                            Add Project
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-semibold"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 p-2 rounded bg-gray-800 outline-none text-sm"
                    />
                    <div>
                        <label htmlFor="category-filter" className="sr-only">Filter by category</label>
                        <select
                            id="category-filter"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="p-2 rounded bg-gray-800 outline-none text-sm w-full sm:w-auto"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                    {filteredProjects.map(project => (
                        <div key={project._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col">
                            <div className="aspect-video bg-gray-900 relative overflow-hidden rounded-t-lg border border-gray-700 group cursor-pointer">
                                {project.visitLink ? (
                                    <img
                                        src={`https://api.microlink.io/?url=${normalizeUrl(project.visitLink)}&screenshot=true&meta=false&embed=screenshot.url`}
                                        alt={project.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                        <span className="text-sm text-gray-400">No preview available</span>
                                    </div>
                                )}

                                {/* Gradient overlay like Image 1 */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80" />

                                {/* Optional hover effect */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />
                            </div>
                            <div className="p-3 sm:p-4 grow flex flex-col">
                                <h3 className="text-lg sm:text-xl font-semibold mb-2 truncate">{project.name}</h3>
                                <p className="text-gray-400 mb-3">{project.category}</p>
                                <div className="flex justify-between items-center">
                                    <a
                                        href={project.visitLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm font-semibold transition-colors transform hover:scale-105"
                                    >
                                        Visit
                                    </a>

                                    <button
                                        onClick={() => handleEdit(project)}
                                        className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm font-semibold transition-colors transform hover:scale-105"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center text-gray-400 mt-12">
                        No projects found. Try adjusting your search or add a new project.
                    </div>
                )}

                {/* Add/Edit Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-700">
                            <h2 className="text-2xl font-bold mb-6 text-center bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                {editingProject ? "Edit Project" : "Add New Project"}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Project Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter project name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Category</label>
                                    <input
                                        type="text"
                                        placeholder="Enter category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Visit Link <span className="text-gray-400 text-xs">(optional)</span></label>
                                    <input
                                        type="url"
                                        placeholder="https://example.com (optional)"
                                        value={formData.visitLink}
                                        onChange={(e) => setFormData({ ...formData, visitLink: e.target.value })}
                                        className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                                    />
                                    {formData.visitLink && (
                                        <div className="mt-2 p-2 bg-gray-700/30 rounded-lg">
                                            <p className="text-xs text-gray-400 mb-1">Preview:</p>
                                            <div className="w-full h-20 rounded bg-gray-700 border border-gray-600">
                                                <iframe
                                                    src={normalizeUrl(formData.visitLink)}
                                                    title="Link preview"
                                                    className="w-full h-full rounded"
                                                    sandbox="allow-same-origin"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-linear-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 p-3 rounded-lg font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105"
                                    >
                                        {editingProject ? "Update" : "Add"}
                                    </button>
                                    {editingProject && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (window.confirm("Are you sure you want to delete this project?")) {
                                                    handleDelete(editingProject._id);
                                                    setShowAddModal(false);
                                                    setEditingProject(null);
                                                    setFormData({ name: "", category: "", visitLink: "" });
                                                }
                                            }}
                                            className="bg-red-500 hover:bg-red-600 px-4 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                                        >
                                            Delete
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setEditingProject(null);
                                            setFormData({ name: "", category: "", visitLink: "" });
                                        }}
                                        className="bg-gray-600 hover:bg-gray-700 px-4 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Suggestions Modal */}
                {showSuggestionModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-700">
                            <h2 className="text-2xl font-bold mb-6 text-center bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                Share Your Suggestions
                            </h2>
                            <form onSubmit={handleSuggestionSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="suggestion-category" className="block text-sm font-medium mb-2">Select Category</label>
                                    <select
                                        id="suggestion-category"
                                        value={suggestionFormData.category}
                                        onChange={(e) => {
                                            setSuggestionFormData({
                                                ...suggestionFormData,
                                                category: e.target.value,
                                                project: "", // Reset project when category changes
                                            });
                                        }}
                                        className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                                        required
                                    >
                                        <option value="">Choose a category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="suggestion-project" className="block text-sm font-medium mb-2">Select Project</label>
                                    <select
                                        id="suggestion-project"
                                        value={suggestionFormData.project}
                                        onChange={(e) => setSuggestionFormData({ ...suggestionFormData, project: e.target.value })}
                                        className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                                        required
                                        disabled={!suggestionFormData.category}
                                    >
                                        <option value="">
                                            {suggestionFormData.category ? "Choose a project" : "Select a category first"}
                                        </option>
                                        {projects
                                            .filter(project => project.category === suggestionFormData.category)
                                            .map(project => (
                                                <option key={project._id} value={project._id}>{project.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="suggestion-text" className="block text-sm font-medium mb-2">Your Suggestions & Improvements</label>
                                    <textarea
                                        id="suggestion-text"
                                        placeholder="Share your thoughts, suggestions, or improvements for this project..."
                                        value={suggestionFormData.suggestion}
                                        onChange={(e) => setSuggestionFormData({ ...suggestionFormData, suggestion: e.target.value })}
                                        className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                                        rows={6}
                                        required
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 p-3 rounded-lg font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105"
                                    >
                                        Submit Suggestion
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowSuggestionModal(false);
                                            setSuggestionFormData({ category: "", project: "", suggestion: "" });
                                        }}
                                        className="bg-gray-600 hover:bg-gray-700 px-4 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};