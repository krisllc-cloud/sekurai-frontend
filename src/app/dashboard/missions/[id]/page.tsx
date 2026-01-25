"use client";

import { useMission, useMissionUpdates } from "@/lib/hooks";
import Link from "next/link";
import { use } from "react";

export default function MissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { mission, loading, error } = useMission(id);
    const { connected, messages } = useMissionUpdates(id);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading mission...</p>
                </div>
            </div>
        );
    }

    if (error || !mission) {
        return (
            <div className="glass rounded-xl p-8 text-center">
                <p className="text-red-400 mb-4">Mission not found</p>
                <Link href="/dashboard/missions" className="btn-primary">
                    Back to Missions
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/dashboard/missions" className="text-blue-400 text-sm hover:underline mb-2 inline-block">
                        ← Back to Missions
                    </Link>
                    <h1 className="text-2xl font-bold">{mission.target_url}</h1>
                    <div className="flex items-center gap-4 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${mission.status === "EXPLOITATION" ? "badge-exploitation" :
                                mission.status === "DISCOVERY" ? "badge-discovery" :
                                    mission.status === "COMPLETED" ? "badge-completed" :
                                        "bg-gray-700 text-gray-300"
                            }`}>
                            {mission.status}
                        </span>
                        {connected && (
                            <span className="flex items-center gap-1 text-green-400 text-xs">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                Live
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Mission Info */}
            <div className="grid grid-cols-2 gap-6">
                <div className="glass rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-4">Mission Details</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">ID</span>
                            <span className="font-mono text-xs">{mission.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Created</span>
                            <span>{new Date(mission.created_at).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Status</span>
                            <span>{mission.status}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Phase</span>
                            <span>{mission.phase || "-"}</span>
                        </div>
                    </div>
                </div>

                <div className="glass rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-4">Configuration</h2>
                    <pre className="text-xs bg-gray-900/50 rounded-lg p-4 overflow-auto">
                        {JSON.stringify(mission.config, null, 2)}
                    </pre>
                </div>
            </div>

            {/* Live Updates */}
            <div className="glass rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Activity Log</h2>
                <div className="space-y-2 font-mono text-sm max-h-96 overflow-auto">
                    {messages.length === 0 ? (
                        <p className="text-gray-500">Waiting for updates...</p>
                    ) : (
                        messages.map((msg, i) => (
                            <div key={i} className="flex gap-3 text-gray-300">
                                <span className="text-gray-500 text-xs">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                                <span className="text-blue-400">[{msg.type}]</span>
                                <span>{JSON.stringify(msg.data)}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
