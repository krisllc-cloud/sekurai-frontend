"use client";

import Link from "next/link";
import { useMissions } from "@/lib/hooks";

export default function MissionsPage() {
    const { missions, loading, error } = useMissions();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading missions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass rounded-xl p-8 text-center">
                <p className="text-red-400 mb-4">Error: {error}</p>
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
                    <h1 className="text-3xl font-bold">Missions</h1>
                    <p className="text-gray-400 mt-1">All security assessments</p>
                </div>
                <Link href="/dashboard/missions/new" className="btn-primary">
                    + New Mission
                </Link>
            </div>

            {/* Missions List */}
            <div className="glass rounded-xl overflow-hidden">
                {missions.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-400 mb-4">No missions yet</p>
                        <Link href="/dashboard/missions/new" className="btn-primary">
                            Launch Your First Mission
                        </Link>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                                <th className="p-4">Target</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Created</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {missions.map((mission) => {
                                const date = new Date(mission.created_at);

                                return (
                                    <tr key={mission.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                                        <td className="p-4">
                                            <span className="font-medium">{mission.target_url}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${mission.status === "EXPLOITATION" ? "badge-exploitation" :
                                                    mission.status === "DISCOVERY" ? "badge-discovery" :
                                                        mission.status === "COMPLETED" ? "badge-completed" :
                                                            "bg-gray-700 text-gray-300"
                                                }`}>
                                                {mission.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400">
                                            {date.toLocaleDateString()} {date.toLocaleTimeString()}
                                        </td>
                                        <td className="p-4">
                                            <Link
                                                href={`/dashboard/missions/${mission.id}`}
                                                className="text-blue-400 text-sm hover:underline"
                                            >
                                                View
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
