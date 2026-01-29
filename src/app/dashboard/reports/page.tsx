"use client";

import Link from "next/link";
import { useMissions } from "@/lib/hooks";

export default function ReportsPage() {
    const { missions } = useMissions();

    const completedMissions = missions.filter(m => m.status === "COMPLETED");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                    <p className="text-gray-500 text-sm mt-1">Security assessment reports</p>
                </div>
            </div>

            {/* Reports List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {completedMissions.length === 0 ? (
                    <div className="p-16 text-center">
                        <p className="text-gray-400 mb-2">No reports available yet</p>
                        <p className="text-gray-400 text-sm mb-4">Reports are generated when missions complete</p>
                        <Link href="/dashboard/missions" className="btn-primary">
                            View Missions
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {completedMissions.map((mission) => (
                            <div key={mission.id} className="p-5 hover:bg-gray-50 transition">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-gray-900">{mission.target_url}</span>
                                            <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 border border-green-200">
                                                COMPLETED
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Completed: {new Date(mission.updated_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Link
                                            href={`/dashboard/missions/${mission.id}`}
                                            className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        >
                                            View Details
                                        </Link>
                                        <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                            Download PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
