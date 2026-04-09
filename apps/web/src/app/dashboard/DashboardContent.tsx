"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Plus, Trash2, ExternalLink, RefreshCw, Calendar, Globe } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  domain: string;
  url: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectUrl, setNewProjectUrl] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Load projects
  useEffect(() => {
    if (status === "authenticated") {
      fetchProjects();
    }
  }, [status]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/v1/projects", {
        headers: {
          Authorization: `Bearer ${session?.user?.id}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/v1/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.id}`,
        },
        body: JSON.stringify({
          name: newProjectName,
          url: newProjectUrl,
        }),
      });

      if (response.ok) {
        setNewProjectName("");
        setNewProjectUrl("");
        setShowNewProject(false);
        fetchProjects();
      }
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;

    try {
      const response = await fetch(`/api/v1/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.user?.id}`,
        },
      });

      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const handleAuditProject = (project: Project) => {
    router.push(`/website-audit?url=${encodeURIComponent(project.url)}&projectId=${project.id}`);
  };

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#080b0f] via-[#0e1318] to-[#080b0f]">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin">
              <RefreshCw className="w-8 h-8 text-[#00e5d1]" />
            </div>
            <p className="mt-4 text-[rgba(255,255,255,0.5)]">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080b0f] via-[#0e1318] to-[#080b0f]">
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-[#00e5d1]">Projects</span>
            </h1>
            <p className="text-[rgba(255,255,255,0.5)]">
              Manage and monitor your websites
            </p>
          </div>
          <button
            onClick={() => setShowNewProject(!showNewProject)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#00e5d1] to-[#00d4bf] hover:shadow-lg hover:shadow-cyan-500/20 text-[#080b0f] font-semibold py-3 px-6 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>

        {/* New Project Form */}
        {showNewProject && (
          <div className="mb-12 p-6 bg-gradient-to-b from-[#141a21] to-[#0e1318] border border-[rgba(255,255,255,0.06)] rounded-xl">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Project name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="bg-[#0a0d12] border border-[rgba(255,255,255,0.08)] rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#00e5d1]/50"
                  required
                />
                <input
                  type="url"
                  placeholder="Website URL (https://example.com)"
                  value={newProjectUrl}
                  onChange={(e) => setNewProjectUrl(e.target.value)}
                  className="bg-[#0a0d12] border border-[rgba(255,255,255,0.08)] rounded-lg py-2 px-4 text-white focus:outline-none focus:border-[#00e5d1]/50"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-[#00e5d1] hover:bg-[#00d4bf] text-[#080b0f] font-semibold py-2 px-6 rounded-lg transition"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewProject(false)}
                  className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] text-white font-semibold py-2 px-6 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-[#00e5d1] mx-auto mb-4" />
            <p className="text-[rgba(255,255,255,0.5)]">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 px-6 bg-gradient-to-b from-[#141a21] to-[#0e1318] border border-[rgba(255,255,255,0.06)] rounded-xl">
            <Globe className="w-12 h-12 text-[rgba(255,255,255,0.2)] mx-auto mb-4" />
            <p className="text-[rgba(255,255,255,0.5)] mb-4">No projects yet. Create one to get started.</p>
            <button
              onClick={() => setShowNewProject(true)}
              className="inline-flex items-center gap-2 bg-[#00e5d1] hover:bg-[#00d4bf] text-[#080b0f] font-semibold py-2 px-4 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Create First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group p-6 bg-gradient-to-b from-[#141a21] to-[#0e1318] border border-[rgba(255,255,255,0.06)] hover:border-[#00e5d1]/30 rounded-xl transition"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{project.name}</h3>
                    <p className="text-sm text-[rgba(255,255,255,0.4)] truncate">
                      {project.domain}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Status */}
                <div className="mb-4 p-3 bg-[rgba(0,229,209,0.05)] border border-[rgba(0,229,209,0.1)] rounded-lg">
                  <p className="text-xs text-[rgba(255,255,255,0.5)] mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${project.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                    <span className="text-sm font-medium text-[rgba(255,255,255,0.7)]">
                      {project.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-[rgba(255,255,255,0.4)]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3 h-3" />
                    <span>Monitor</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAuditProject(project)}
                    className="flex-1 bg-[#00e5d1] hover:bg-[#00d4bf] text-[#080b0f] font-semibold py-2 rounded-lg transition text-sm flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Audit
                  </button>
                  <button
                    onClick={() => window.open(project.url, '_blank')}
                    className="flex-1 bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] text-white font-semibold py-2 rounded-lg transition text-sm flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
