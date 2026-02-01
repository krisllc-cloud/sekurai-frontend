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
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
                <p className="text-red-600 mb-4">Error: {error}</p>
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
                    <h1 className="text-3xl font-bold text-gray-900">Missions</h1>
                    <p className="text-gray-500 mt-1">All security assessments</p>
                </div>
                <Link href="/dashboard/missions/new" className="btn-primary">
                    + New Mission
                </Link>
            </div>

            {/* Missions List */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                {missions.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-500 mb-4">No missions yet</p>
                        <Link href="/dashboard/missions/new" className="btn-primary">
                            Launch Your First Mission
                        </Link>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-gray-500 text-sm border-b border-gray-200 bg-gray-50">
                                <th className="p-4 font-medium">Target</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Created</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {missions.map((mission) => {
                                const date = new Date(mission.created_at);

                                return (
                                    <tr key={mission.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                        <td className="p-4">
                                            <span className="font-medium text-gray-900">{mission.target_url}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${mission.status === "EXPLOITATION" ? "bg-red-100 text-red-700" :
                                                mission.status === "DISCOVERY" ? "bg-blue-100 text-blue-700" :
                                                    mission.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                                                        mission.status === "ANALYSIS" ? "bg-purple-100 text-purple-700" :
                                                            mission.status === "ATTACK" ? "bg-orange-100 text-orange-700" :
                                                                mission.status === "REPORTING" ? "bg-cyan-100 text-cyan-700" :
                                                                    "bg-gray-100 text-gray-600"
                                                }`}>
                                                {mission.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {date.toLocaleDateString()} {date.toLocaleTimeString()}
                                        </td>
                                        <td className="p-4">
                                            <Link
                                                href={`/dashboard/missions/${mission.id}`}
                                                className="text-blue-600 text-sm hover:underline"
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
