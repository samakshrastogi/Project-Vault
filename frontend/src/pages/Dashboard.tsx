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
                            <div className="aspect-video bg-gray-700 relative overflow-hidden rounded-t-lg border border-gray-700">
                                {project.visitLink ? (
                                    <iframe
                                        src={normalizeUrl(project.visitLink)}
                                        title={project.name}
                                        className="w-full h-full"
                                        sandbox="allow-same-origin allow-scripts"
                                        onError={(e) => {
                                            const target = e.target as HTMLIFrameElement;
                                            target.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                        <span className="text-sm text-gray-400">No preview available</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-3 sm:p-4 grow flex flex-col">
                                <h3 className="text-lg sm:text-xl font-semibold mb-2 truncate">{project.name}</h3>
                                <p className="text-gray-400 mb-3">{project.category}</p>
                                <div className="flex gap-2">
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
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
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
                                        onChange={(e) => setFormData({...formData, visitLink: e.target.value})}
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
            </div>
        </div>
    );
};