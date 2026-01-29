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
        endpointsScanned: 0,
        criticalIssues: 0,
        findingsToday: 0,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-sm">
                <p className="text-red-500 mb-4">Error loading dashboard: {error}</p>
                <button onClick={() => window.location.reload()} className="btn-primary">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Overview of your security operations</p>
                </div>
                <Link href="/dashboard/missions/new" className="btn-primary">
                    + New Mission
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-sm mb-1">Active Missions</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.activeMissions}</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-sm mb-1">Findings Today</p>
                    <p className="text-3xl font-bold text-cyan-600">{stats.findingsToday}</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-sm mb-1">Critical Issues</p>
                    <p className="text-3xl font-bold text-red-500">{stats.criticalIssues}</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-sm mb-1">Endpoints Scanned</p>
                    <p className="text-3xl font-bold text-green-500">{stats.endpointsScanned}</p>
                </div>
            </div>

            {/* Recent Missions */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Missions</h2>
                    <Link href="/dashboard/missions" className="text-blue-500 text-sm hover:underline">
                        View all
                    </Link>
                </div>

                <div className="overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-gray-500 text-sm border-b border-gray-200">
                                <th className="pb-3 font-medium">Target</th>
                                <th className="pb-3 font-medium">Status</th>
                                <th className="pb-3 font-medium">Findings</th>
                                <th className="pb-3 font-medium">Started</th>
                                <th className="pb-3 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {missions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-400">
                                        No missions yet. <Link href="/dashboard/missions/new" className="text-blue-500 hover:underline">Start your first mission</Link>
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
                                        : diffHours > 0
                                            ? `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
                                            : 'Just now';

                                    const getStatusStyle = (status: string) => {
                                        switch (status) {
                                            case "EXPLOITATION":
                                            case "ATTACKING":
                                                return "bg-orange-100 text-orange-700 border-orange-200";
                                            case "DISCOVERY":
                                            case "ANALYZING":
                                                return "bg-blue-100 text-blue-700 border-blue-200";
                                            case "COMPLETED":
                                                return "bg-green-100 text-green-700 border-green-200";
                                            case "REPORTING":
                                                return "bg-purple-100 text-purple-700 border-purple-200";
                                            default:
                                                return "bg-gray-100 text-gray-700 border-gray-200";
                                        }
                                    };

                                    return (
                                        <tr key={mission.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                            <td className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                                                    <span className="font-medium text-gray-900">{mission.target_url}</span>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(mission.status)}`}>
                                                    {mission.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-gray-600">-</td>
                                            <td className="py-4 text-gray-500">{timeAgo}</td>
                                            <td className="py-4">
                                                <Link
                                                    href={`/dashboard/missions/${mission.id}`}
                                                    className="text-blue-500 text-sm hover:underline"
                                                >
                                                    View →
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
        </div>
    );
}
