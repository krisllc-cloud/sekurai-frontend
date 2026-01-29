"use client";

import { useMission, useMissionUpdates, useMissionFindings } from "@/lib/hooks";
import Link from "next/link";
import { use } from "react";

// Progress phases for the stepper
const PHASES = [
    { id: "discovery", label: "Discovery", icon: "🔍" },
    { id: "analysis", label: "Analysis", icon: "📊" },
    { id: "attack", label: "Attack", icon: "⚡" },
    { id: "validate", label: "Validate", icon: "✓" },
    { id: "report", label: "Report", icon: "📄" },
    { id: "complete", label: "Complete", icon: "🎯" },
];

function getPhaseIndex(status: string): number {
    const statusMap: Record<string, number> = {
        "PENDING": 0,
        "DISCOVERY": 1,
        "ANALYZING": 2,
        "EXPLOITATION": 3,
        "ATTACKING": 3,
        "VALIDATING": 4,
        "REPORTING": 5,
        "COMPLETED": 6,
    };
    return statusMap[status] || 0;
}

export default function MissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { mission, loading, error } = useMission(id);
    const { connected, messages } = useMissionUpdates(id);
    const { findings: apiFindings } = useMissionFindings(id);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading mission...</p>
                </div>
            </div>
        );
    }

    if (error || !mission) {
        return (
            <div className="p-8">
                <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-sm">
                    <p className="text-red-500 mb-4">Mission not found</p>
                    <Link href="/dashboard/missions" className="btn-primary">
                        Back to Missions
                    </Link>
                </div>
            </div>
        );
    }

    const currentPhase = getPhaseIndex(mission.status);
    const endpoints = mission.data?.endpoints || [];
    // Use API findings first, fallback to mission data secrets
    const findings = apiFindings.length > 0 ? apiFindings : (mission.data?.secrets_found || []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/dashboard/missions" className="text-blue-500 text-sm hover:underline mb-2 inline-flex items-center gap-1">
                        <span>←</span> Back to Missions
                    </Link>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                        <h1 className="text-xl font-bold text-gray-900">{mission.target_url}</h1>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{mission.target_url}</p>
                    <div className="flex items-center gap-2 mt-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                            {mission.status}
                        </span>
                        {mission.config?.ssl === false && (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-600 border border-red-200">
                                ⚠ No SSL
                            </span>
                        )}
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-600 border border-blue-200">
                            🤖 AI
                        </span>
                    </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>

            {/* Mission Progress Stepper */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-sm font-medium text-gray-700 mb-6">Mission Progress</h3>
                <div className="flex items-center justify-between">
                    {PHASES.map((phase, index) => {
                        const isComplete = index < currentPhase;
                        const isCurrent = index === currentPhase;
                        const isPending = index > currentPhase;

                        return (
                            <div key={phase.id} className="flex items-center flex-1">
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${isComplete ? 'bg-green-100 text-green-600 border-2 border-green-500' :
                                        isCurrent ? 'bg-green-50 text-green-600 border-2 border-green-400 ring-4 ring-green-100' :
                                            'bg-gray-100 text-gray-400 border-2 border-gray-200'
                                        }`}>
                                        {isComplete ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : isCurrent ? (
                                            <span className="text-lg">{phase.icon}</span>
                                        ) : (
                                            <span className="text-lg opacity-50">{phase.icon}</span>
                                        )}
                                    </div>
                                    <span className={`text-xs mt-2 ${isComplete || isCurrent ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                                        {phase.label}
                                    </span>
                                </div>
                                {index < PHASES.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-2 ${index < currentPhase ? 'bg-green-400' : 'bg-gray-200'}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Three Column Layout */}
            <div className="grid grid-cols-3 gap-6">
                {/* Attack Surface */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-blue-500">🎯</span>
                            <h3 className="font-semibold text-gray-900">Attack Surface</h3>
                        </div>
                        <span className="text-xs text-gray-500">{endpoints.length} endpoints</span>
                    </div>
                    <div className="p-4">
                        {/* Filter tabs */}
                        <div className="flex gap-2 mb-4">
                            <button className="px-3 py-1 text-xs rounded-full bg-gray-900 text-white">All</button>
                            <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">● Vuln</button>
                            <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">🔒 Auth</button>
                        </div>

                        {/* Endpoint tree */}
                        <div className="space-y-1 max-h-[400px] overflow-auto">
                            {endpoints.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center py-4">No endpoints discovered yet</p>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2 py-2 px-2 bg-gray-50 rounded">
                                        <span className="text-gray-400">↳</span>
                                        <span className="font-medium text-gray-900 text-sm">{new URL(mission.target_url).hostname}</span>
                                        <span className="text-xs text-gray-400 ml-auto">{endpoints.length}</span>
                                    </div>
                                    {endpoints.slice(0, 15).map((endpoint: any, i: number) => {
                                        const path = endpoint.url.replace(mission.target_url, '') || '/';
                                        return (
                                            <div key={i} className="flex items-center gap-2 py-1.5 px-4 hover:bg-gray-50 rounded text-sm">
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                                                    endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {endpoint.method}
                                                </span>
                                                <span className="text-gray-700 truncate">{path}</span>
                                            </div>
                                        );
                                    })}
                                    {endpoints.length > 15 && (
                                        <p className="text-xs text-gray-400 text-center pt-2">+{endpoints.length - 15} more</p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Security Findings */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-red-500">⚠</span>
                            <h3 className="font-semibold text-gray-900">Security Findings</h3>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">{findings.length} confirmed</span>
                    </div>
                    <div className="p-4 space-y-4 max-h-[500px] overflow-auto">
                        {findings.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">No vulnerabilities found yet</p>
                        ) : (
                            findings.map((finding: any, i: number) => {
                                const severity = (finding.severity || 'medium').toLowerCase();
                                const vulnType = finding.vuln_type || finding.type || 'Unknown';
                                const confidence = finding.confidence || 'CONFIRMED';
                                const endpoint = finding.endpoint || finding.location || 'N/A';
                                const payload = finding.payload || finding.value || '';

                                return (
                                    <div key={finding.id || i} className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition hover:shadow-sm">
                                        {/* Header with severity and type */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${severity === 'critical' ? 'bg-red-100 text-red-700 border border-red-200' :
                                                    severity === 'high' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                                                        severity === 'medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                            'bg-blue-100 text-blue-700 border border-blue-200'
                                                }`}>
                                                {severity}
                                            </span>
                                            <span className="text-sm font-semibold text-gray-900">{vulnType}</span>
                                            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${confidence === 'PROVEN' ? 'bg-green-100 text-green-700' :
                                                    confidence === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                                        confidence === 'LIKELY' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-gray-100 text-gray-600'
                                                }`}>
                                                {confidence}
                                            </span>
                                        </div>

                                        {/* Endpoint */}
                                        <div className="mb-2">
                                            <span className="text-xs text-gray-500">Endpoint: </span>
                                            <span className="text-xs font-mono text-blue-600">{endpoint}</span>
                                        </div>

                                        {/* Payload */}
                                        {payload && (
                                            <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-400 overflow-x-auto">
                                                <div className="text-gray-500 text-[10px] mb-1">Payload:</div>
                                                {payload.length > 100 ? payload.substring(0, 100) + '...' : payload}
                                            </div>
                                        )}

                                        {/* Evidence preview */}
                                        {finding.evidence && Object.keys(finding.evidence).length > 0 && (
                                            <div className="mt-2 text-xs text-gray-500">
                                                <span className="font-medium">Evidence:</span> {Object.keys(finding.evidence).join(', ')}
                                            </div>
                                        )}

                                        {/* Timestamp */}
                                        {finding.created_at && (
                                            <div className="mt-2 text-[10px] text-gray-400">
                                                Found: {new Date(finding.created_at).toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Agent Activity */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-purple-500">⚡</span>
                            <h3 className="font-semibold text-gray-900">Agent Activity</h3>
                        </div>
                        {connected && (
                            <span className="flex items-center gap-1 text-xs text-green-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Live
                            </span>
                        )}
                    </div>
                    <div className="p-4 space-y-3 max-h-[450px] overflow-auto">
                        {messages.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-8">Waiting for agent activity...</p>
                        ) : (
                            messages.slice(-15).reverse().map((msg, i) => (
                                <div key={i} className="flex gap-3 text-sm">
                                    <span className="text-gray-400 text-xs whitespace-nowrap">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <div>
                                        <span className={`font-medium ${msg.type === 'error' ? 'text-red-600' :
                                            msg.type === 'finding' ? 'text-orange-600' :
                                                msg.type === 'discovery' ? 'text-blue-600' :
                                                    'text-purple-600'
                                            }`}>
                                            {msg.type}
                                        </span>
                                        <p className="text-gray-600 text-xs mt-0.5">
                                            {typeof msg.data === 'string' ? msg.data : JSON.stringify(msg.data).substring(0, 60)}...
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
