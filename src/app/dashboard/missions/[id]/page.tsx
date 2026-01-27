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

            {/* Business Context - NEW */}
            {mission.data?.business_context && (
                <div className="glass rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-4">🎯 Application Context</h2>
                    <p className="text-gray-300 mb-4">{mission.data.business_context}</p>

                    {mission.data.data_types && mission.data.data_types.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Data Types Handled</h3>
                            <div className="flex flex-wrap gap-2">
                                {mission.data.data_types.map((type: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs">
                                        {type}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 🔐 Secrets Found - AI Discovery */}
            {mission.data?.secrets_found && mission.data.secrets_found.length > 0 && (
                <div className="glass rounded-xl p-6 border border-red-500/30">
                    <h2 className="text-lg font-semibold mb-4 text-red-400">🔐 Secrets Discovered ({mission.data.secrets_found.length})</h2>
                    <div className="space-y-3">
                        {mission.data.secrets_found.map((secret: any, i: number) => (
                            <div key={i} className="bg-red-950/30 rounded-lg p-4 border border-red-500/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${secret.severity === 'critical' ? 'bg-red-500/30 text-red-300' :
                                        secret.severity === 'high' ? 'bg-orange-500/30 text-orange-300' :
                                            secret.severity === 'medium' ? 'bg-yellow-500/30 text-yellow-300' :
                                                'bg-gray-500/30 text-gray-300'
                                        }`}>
                                        {secret.severity?.toUpperCase() || 'UNKNOWN'}
                                    </span>
                                    <span className="font-medium text-white">{secret.type}</span>
                                </div>
                                <div className="font-mono text-sm bg-black/30 p-2 rounded mb-2 text-red-300">
                                    {secret.value}
                                </div>
                                {secret.why_sensitive && (
                                    <p className="text-sm text-gray-400 mb-1">
                                        <span className="text-gray-500">Why:</span> {secret.why_sensitive}
                                    </p>
                                )}
                                {secret.recommendation && (
                                    <p className="text-sm text-blue-400">
                                        <span className="text-gray-500">Action:</span> {secret.recommendation}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 📁 Files Analyzed */}
            {mission.data?.files_analyzed && mission.data.files_analyzed.length > 0 && (
                <div className="glass rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-4">📁 Files Analyzed ({mission.data.files_analyzed.length})</h2>
                    <div className="space-y-2">
                        {mission.data.files_analyzed.map((file: any, i: number) => (
                            <div key={i} className="bg-gray-900/50 rounded-lg p-3 flex items-center justify-between">
                                <div className="font-mono text-sm text-blue-300">{file.url}</div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">{file.file_type}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs ${file.risk_level === 'critical' ? 'bg-red-500/20 text-red-400' :
                                        file.risk_level === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                            file.risk_level === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {file.risk_level}
                                    </span>
                                    {file.secrets_count > 0 && (
                                        <span className="text-xs text-red-400">🔐 {file.secrets_count}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Discovery Results - Enhanced with Confidence Scores */}
            {mission.data?.endpoints && mission.data.endpoints.length > 0 && (
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Discovered Endpoints
                        </h2>
                        <div className="flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 text-green-400 rounded">
                                {/* 1A: Circle with checkmark */}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <circle cx="12" cy="12" r="10" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                                </svg>
                                Validated
                            </span>
                            <span className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
                                {/* 2B: Key icon */}
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                                </svg>
                                Auth Required
                            </span>
                        </div>
                    </div>

                    {/* Stats summary */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-blue-400">{mission.data.endpoints.length}</div>
                            <div className="text-xs text-gray-400">Total Endpoints</div>
                        </div>
                        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-green-400">
                                {mission.data.endpoints.filter((e: any) => e.validated || e.confidence_score === 1).length}
                            </div>
                            <div className="text-xs text-gray-400">Validated</div>
                        </div>
                        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-yellow-400">
                                {mission.data.endpoints.filter((e: any) => e.auth_required || e.auth_hint).length}
                            </div>
                            <div className="text-xs text-gray-400">Auth Required</div>
                        </div>
                        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-purple-400">
                                {mission.data.endpoints.filter((e: any) => (e.confidence_score || 0) >= 0.7).length}
                            </div>
                            <div className="text-xs text-gray-400">High Confidence</div>
                        </div>
                    </div>

                    {/* Endpoint list with confidence */}
                    <div className="space-y-2 max-h-[600px] overflow-auto">
                        {mission.data.endpoints
                            .sort((a: any, b: any) => {
                                // Sort by: validated first, then by confidence
                                if (a.validated && !b.validated) return -1;
                                if (!a.validated && b.validated) return 1;
                                return (b.confidence_score || 0) - (a.confidence_score || 0);
                            })
                            .map((endpoint: any, i: number) => {
                                const isValidated = endpoint.validated === true || endpoint.status_code < 300;
                                const isAuthRequired = endpoint.auth_required || endpoint.auth_hint || endpoint.status_code === 302;

                                // Only show confidence for auth-required endpoints
                                const showConfidence = isAuthRequired && !isValidated;
                                const confidence = endpoint.confidence_score ?? 0.5;
                                const confidencePercent = Math.round(confidence * 100);

                                return (
                                    <div key={i} className="bg-gray-900/50 rounded-lg p-4 hover:bg-gray-900/70 transition border border-gray-800 hover:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 flex-1">
                                                {/* Status icon - 1A circle check for validated, 2B key for auth-required */}
                                                {isAuthRequired ? (
                                                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                        <circle cx="12" cy="12" r="10" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                                                    </svg>
                                                )}

                                                {/* Method badge */}
                                                <span className={`px-2 py-1 rounded text-xs font-medium min-w-[60px] text-center ${endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                                                    endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                                                        endpoint.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            endpoint.method === 'DELETE' ? 'bg-red-500/20 text-red-400' :
                                                                'bg-gray-500/20 text-gray-400'
                                                    }`}>
                                                    {endpoint.method}
                                                </span>

                                                {/* URL */}
                                                <span className="font-mono text-sm text-blue-300 flex-1 truncate">
                                                    {endpoint.url}
                                                </span>
                                            </div>

                                            {/* Status indicator - different for validated vs auth-required */}
                                            <div className="flex items-center gap-3">
                                                {/* Source badge - 3C circuit icon for AI-discovered */}
                                                {endpoint.source && endpoint.source.includes('ai_') && (
                                                    <span className="flex items-center gap-1.5 px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M13 7H7v6h6V7z" />
                                                            <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                                                        </svg>
                                                        {endpoint.source.replace('ai_', '').replace('_', ' ')}
                                                    </span>
                                                )}

                                                {/* Validated endpoints - show "Confirmed" badge */}
                                                {isValidated && (
                                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                                                        Confirmed
                                                    </span>
                                                )}

                                                {/* Auth-required endpoints - show confidence bar */}
                                                {showConfidence && (
                                                    <div className="flex items-center gap-2 min-w-[100px]">
                                                        <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all ${confidencePercent >= 70 ? 'bg-green-500' :
                                                                    confidencePercent >= 50 ? 'bg-yellow-500' :
                                                                        'bg-orange-500'
                                                                    }`}
                                                                style={{ width: `${confidencePercent}%` }}
                                                            />
                                                        </div>
                                                        <span className={`text-xs font-medium min-w-[35px] ${confidencePercent >= 70 ? 'text-green-400' :
                                                            confidencePercent >= 50 ? 'text-yellow-400' :
                                                                'text-orange-400'
                                                            }`}>
                                                            {confidencePercent}%
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Regular discovered endpoints - just a tick */}
                                                {!isValidated && !showConfidence && (
                                                    <span className="text-green-400 text-lg">✓</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Additional details */}
                                        <div className="mt-2 ml-10 flex flex-wrap items-center gap-3 text-xs">
                                            {endpoint.params && endpoint.params.length > 0 && (
                                                <span className="text-gray-400">
                                                    📝 Params: {Array.isArray(endpoint.params) ? endpoint.params.join(', ') : endpoint.params}
                                                </span>
                                            )}
                                            {endpoint.status_code && (
                                                <span className="text-gray-500">
                                                    Status: {endpoint.status_code}
                                                </span>
                                            )}
                                            {endpoint.response_time_ms && (
                                                <span className="text-gray-500">
                                                    ⏱️ {endpoint.response_time_ms}ms
                                                </span>
                                            )}
                                            {endpoint.anomaly_reasons && endpoint.anomaly_reasons.length > 0 && (
                                                <span className="text-cyan-400">
                                                    💡 {endpoint.anomaly_reasons.join(', ')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>

                    {/* Technologies */}
                    {mission.data.technologies && mission.data.technologies.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-gray-800">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">🔧 Technologies Detected</h3>
                            <div className="flex flex-wrap gap-2">
                                {mission.data.technologies.map((tech: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

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
