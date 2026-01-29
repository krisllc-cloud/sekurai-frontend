"use client";

import Link from "next/link";
import { useMissions } from "@/lib/hooks";

export default function MissionsPage() {
    const { missions, loading, error } = useMissions();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading missions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-sm">
                    <p className="text-red-500 mb-4">Error: {error}</p>
                    <button onClick={() => window.location.reload()} className="btn-primary">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Missions</h1>
                    <p className="text-gray-500 text-sm mt-1">All security assessments</p>
                </div>
                <Link href="/dashboard/missions/new" className="btn-primary">
                    + New Mission
                </Link>
            </div>

            {/* Missions List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {missions.length === 0 ? (
                    <div className="p-16 text-center">
                        <p className="text-gray-400 mb-4">No missions yet</p>
                        <Link href="/dashboard/missions/new" className="btn-primary">
                            Launch Your First Mission
                        </Link>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-gray-500 text-sm border-b border-gray-100 bg-gray-50/50">
                                <th className="px-6 py-4 font-medium">Target</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Created</th>
                                <th className="px-6 py-4 font-medium"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {missions.map((mission) => {
                                const date = new Date(mission.created_at);

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
                                    <tr key={mission.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                                                <span className="font-medium text-gray-900">{mission.target_url}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(mission.status)}`}>
                                                {mission.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                href={`/dashboard/missions/${mission.id}`}
                                                className="text-blue-500 text-sm hover:underline font-medium"
                                            >
                                                View →
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
