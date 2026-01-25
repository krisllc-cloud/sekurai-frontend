"use client";

import Link from "next/link";
import { useMissions } from "@/lib/hooks";

export default function DashboardPage() {
    const { missions, loading, error } = useMissions();

    // Calculate stats from real missions
    const stats = {
        activeMissions: missions.filter(m =>
            ["DISCOVERY", "EXPLOITATION", "CHAINING"].includes(m.status)
        ).length,
        endpointsScanned: 0, // Will come from aggregated stats
        criticalIssues: 0,
        findingsToday: 0,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass rounded-xl p-8 text-center">
                <p className="text-red-400 mb-4">Error loading dashboard: {error}</p>
                <button onClick={() => window.location.reload()} className="btn-primary">
                    Retry
                </button>
            </div>
        );
    }
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-400 mt-1">Overview of your security operations</p>
                </div>
                <Link href="/dashboard/missions/new" className="btn-primary">
                    + New Mission
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6">
                <div className="glass rounded-xl p-6">
                    <p className="text-gray-400 text-sm mb-1">Active Missions</p>
                    <p className="text-3xl font-bold text-blue-400">{stats.activeMissions}</p>
                </div>
                <div className="glass rounded-xl p-6">
                    <p className="text-gray-400 text-sm mb-1">Findings Today</p>
                    <p className="text-3xl font-bold text-cyan-400">{stats.findingsToday}</p>
                </div>
                <div className="glass rounded-xl p-6">
                    <p className="text-gray-400 text-sm mb-1">Critical Issues</p>
                    <p className="text-3xl font-bold text-red-400">{stats.criticalIssues}</p>
                </div>
                <div className="glass rounded-xl p-6">
                    <p className="text-gray-400 text-sm mb-1">Endpoints Scanned</p>
                    <p className="text-3xl font-bold text-green-400">{stats.endpointsScanned}</p>
                </div>
            </div>

            {/* Recent Missions */}
            <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Recent Missions</h2>
                    <Link href="/dashboard/missions" className="text-blue-400 text-sm hover:underline">
                        View all
                    </Link>
                </div>

                <table className="w-full">
                    <thead>
                        <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                            <th className="pb-4">Target</th>
                            <th className="pb-4">Status</th>
                            <th className="pb-4">Findings</th>
                            <th className="pb-4">Started</th>
                            <th className="pb-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {missions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-400">
                                    No missions yet. <Link href="/dashboard/missions/new" className="text-blue-400 hover:underline">Start your first mission</Link>
                                </td>
                            </tr>
                        ) : (
                            missions.slice(0, 5).map((mission) => {
                                const startedDate = new Date(mission.created_at);
                                const now = new Date();
                                const diffMs = now.getTime() - startedDate.getTime();
                                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                                const diffDays = Math.floor(diffHours / 24);

                                const timeAgo = diffDays > 0
                                    ? `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
                                    : `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

                                return (
                                    <tr key={mission.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                                        <td className="py-4">
                                            <span className="font-medium">{mission.target_url}</span>
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${mission.status === "EXPLOITATION" ? "badge-exploitation" :
                                                    mission.status === "DISCOVERY" ? "badge-discovery" :
                                                        mission.status === "COMPLETED" ? "badge-completed" :
                                                            "bg-gray-700 text-gray-300"
                                                }`}>
                                                {mission.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-gray-300">-</td>
                                        <td className="py-4 text-gray-400">{timeAgo}</td>
                                        <td className="py-4">
                                            <Link
                                                href={`/dashboard/missions/${mission.id}`}
                                                className="text-blue-400 text-sm hover:underline"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>


        </div>
    );
}
