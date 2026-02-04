"use client";

import { useMission, useMissionUpdates, useDashboardStream } from "@/lib/hooks";
import Link from "next/link";
import { use, useEffect } from "react";
import { MissionProgress } from "@/components/MissionProgress";
import { EndpointRow } from "@/components/EndpointRow";
import { GroupedEndpointList } from "@/components/GroupedEndpointList";
import { LiveFindings } from "@/components/LiveFindings";
import { AttackSurfaceTree } from "@/components/AttackSurfaceTree";
import { MissionStatusHero } from "@/components/MissionStatusHero";
import { FindingCard } from "@/components/FindingCard";
import { NeuralActivityMap } from "@/components/dashboard/NeuralActivityMap";
import { SecurityInsightFeed } from "@/components/dashboard/SecurityInsightFeed";

export default function MissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { mission, loading, error, refresh, isRefreshing, lastUpdated } = useMission(id);
    const { connected, messages } = useMissionUpdates(id);
    const { connected: dashConnected, events } = useDashboardStream(id);

    // Auto-refresh when mission is in active phases
    useEffect(() => {
        const activePhases = ['DISCOVERY', 'ANALYSIS', 'ATTACK'];
        if (mission?.status && activePhases.includes(mission.status)) {
            const interval = setInterval(() => {
                refresh();
            }, 5000); // Poll every 5 seconds
            return () => clearInterval(interval);
        }
    }, [mission?.status, refresh]);

    // Parse domain from URL
    const getDomain = (url: string): string => {
        try {
            return new URL(url).hostname;
        } catch (e: unknown) {
            void e;
            return url;
        }
    };

    const isSecure = mission?.target_url?.startsWith("https");

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
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
                <p className="text-red-600 mb-4">Mission not found</p>
                <Link href="/dashboard/missions" className="btn-primary">
                    Back to Missions
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            {/* Subtle gradient background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>
                <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-100/20 rounded-full blur-3xl -z-10"></div>
            </div>

            {/* Header - Enhanced with target info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <Link href="/dashboard/missions" className="text-blue-600 text-sm hover:underline mb-3 inline-flex items-center gap-1 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Missions
                        </Link>

                        {/* Target URL as title with domain indicator */}
                        <div className="flex items-center gap-3 mt-2">
                            <span className={`w-2 h-2 rounded-full ${isSecure ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                            <h1 className="text-2xl font-bold text-gray-900">{getDomain(mission.target_url)}</h1>
                        </div>

                        {/* Full URL - subtle */}
                        <p className="text-sm text-gray-500 font-mono mt-1 ml-5">{mission.target_url}</p>

                        {/* Status badges row */}
                        <div className="flex items-center gap-3 mt-4 ml-5">
                            <span className={`badge ${mission.status === "EXPLOITATION" ? "badge-exploitation" :
                                mission.status === "DISCOVERY" ? "badge-discovery" :
                                    mission.status === "COMPLETED" ? "badge-completed" :
                                        "bg-gray-700 text-gray-300"
                                }`}>
                                {mission.status}
                            </span>

                            {connected && (
                                <span className="live-indicator">
                                    Live Updates
                                </span>
                            )}

                            <span className={`text-xs px-2 py-1 rounded ${isSecure ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                {isSecure ? '🔒 SSL' : '⚠️ No SSL'}
                            </span>

                            {mission.config?.enable_ai_reasoning && (
                                <span className="text-xs px-2 py-1 rounded bg-purple-500/10 text-purple-400 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    AI
                                </span>
                            )}

                            {isRefreshing && (
                                <span className="flex items-center gap-1.5 text-xs text-blue-400">
                                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={refresh}
                            className="btn-ghost rounded-lg"
                            title="Refresh data"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* 6-Phase Progress Rings */}
            <MissionProgress
                currentPhase={mission.phase || "discovery"}
                status={mission.status}
                data={mission.data}
            />

            {/* 3-Column Layout: Attack Surface | Live Findings | Neural Dashboard */}
            <div className="grid grid-cols-12 gap-4 h-[480px]">
                {/* Attack Surface - Left Column */}
                <div className="col-span-3 rounded-xl bg-white shadow-sm border border-gray-200 p-4 overflow-y-auto">
                    <AttackSurfaceTree
                        endpoints={mission.data?.endpoints || []}
                        confirmedVulnEndpoints={
                            (mission.data?.confirmed_vulns || []).map((v: any) => v.target_url)
                        }
                    />
                </div>

                {/* Live Findings - Center Column (Primary) */}
                <div className="col-span-5 rounded-xl bg-white shadow-sm border border-gray-200 p-4 overflow-y-auto">
                    <LiveFindings
                        confirmedVulns={mission.data?.confirmed_vulns || []}
                        hypotheses={mission.data?.attack_queue || []}
                    />
                </div>

                {/* Neural Dashboard - Right Column (2-row layout) */}
                <div className="col-span-4 flex flex-col gap-4">
                    {/* Neural Activity Map */}
                    <div className="h-[220px]">
                        <NeuralActivityMap
                            activeAgents={mission.data?.agents ? Object.keys(mission.data.agents).map(name => ({
                                name,
                                status: mission.data?.agents?.[name]?.status || 'idle'
                            })) : []}
                            recentEvents={events}
                        />
                    </div>

                    {/* Security Insight Feed */}
                    <div className="flex-1">
                        <SecurityInsightFeed events={events} />
                    </div>
                </div>
            </div>

            {/* Business Context */}
            {mission.data?.business_context && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span>🎯</span>
                        Application Context
                    </h2>
                    <p className="text-gray-600 mb-4">{mission.data.business_context}</p>

                    {mission.data.data_types && mission.data.data_types.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Data Types Handled</h3>
                            <div className="flex flex-wrap gap-2">
                                {mission.data.data_types.map((type: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                                        {type}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 🧠 AI Analysis Summary */}
            {(mission.data?.analysis || mission.data?.attack_queue) && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        AI Security Analysis
                    </h2>

                    {/* Risk Breakdown Cards */}
                    {mission.data?.analysis?.risk_breakdown && (
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            <div className="bg-red-100 border border-red-200 rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold text-red-600">{mission.data.analysis.risk_breakdown.critical}</div>
                                <div className="text-xs text-red-600 uppercase font-medium mt-1">Critical</div>
                            </div>
                            <div className="bg-orange-100 border border-orange-200 rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold text-orange-600">{mission.data.analysis.risk_breakdown.high}</div>
                                <div className="text-xs text-orange-600 uppercase font-medium mt-1">High</div>
                            </div>
                            <div className="bg-yellow-100 border border-yellow-200 rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold text-yellow-600">{mission.data.analysis.risk_breakdown.medium}</div>
                                <div className="text-xs text-yellow-600 uppercase font-medium mt-1">Medium</div>
                            </div>
                            <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 text-center">
                                <div className="text-3xl font-bold text-gray-600">{mission.data.analysis.risk_breakdown.low}</div>
                                <div className="text-xs text-gray-500 uppercase font-medium mt-1">Low</div>
                            </div>
                        </div>
                    )}

                    {/* Attack Queue Summary */}
                    {mission.data?.analysis && (
                        <div className="flex items-center gap-6 mb-6 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span><strong className="text-white">{mission.data.analysis.attack_queue_size}</strong> attacks queued</span>
                            </div>
                            {mission.data.analysis.duration_seconds && (
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Analyzed in <strong className="text-gray-900">{mission.data.analysis.duration_seconds}s</strong></span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Top Attack Hypotheses */}
                    {mission.data?.attack_queue && mission.data.attack_queue.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-600 mb-3">Top Attack Hypotheses</h3>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                {mission.data.attack_queue.slice(0, 5).map((attack, i) => (
                                    <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${attack.owasp_category.startsWith('A01') ? 'bg-red-100 text-red-700' :
                                                    attack.owasp_category.startsWith('A03') ? 'bg-orange-100 text-orange-700' :
                                                        attack.owasp_category.startsWith('A07') ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-purple-100 text-purple-700'
                                                    }`}>
                                                    {attack.attack_type.replace(/_/g, ' ')}
                                                </span>
                                                <span className="text-xs text-gray-500">{attack.owasp_category}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs">
                                                <span className="text-gray-500">Confidence:</span>
                                                <span className={`font-medium ${attack.confidence >= 0.8 ? 'text-green-600' :
                                                    attack.confidence >= 0.6 ? 'text-yellow-600' :
                                                        'text-gray-600'
                                                    }`}>{Math.round(attack.confidence * 100)}%</span>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-700 mb-2">
                                            <span className="text-blue-600 font-mono text-xs">{attack.target_method}</span>{' '}
                                            <span className="font-mono text-xs">{attack.target_endpoint}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{attack.rationale}</p>

                                        {attack.payloads_to_try && attack.payloads_to_try.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {attack.payloads_to_try.slice(0, 3).map((payload, j) => (
                                                    <span key={j} className="text-xs font-mono bg-gray-800 text-green-400 px-2 py-0.5 rounded">
                                                        {payload.length > 30 ? payload.substring(0, 30) + '...' : payload}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Mission Status Hero - NEW */}
            {mission.status === 'COMPLETED' && mission.data?.confirmed_vulns && (
                <MissionStatusHero
                    status={mission.status}
                    targetUrl={mission.target_url}
                    duration={mission.data.analysis?.duration_seconds}
                    severityCounts={{
                        critical: mission.data.confirmed_vulns.filter((v: any) =>
                            v.severity === 'CRITICAL' || !v.severity
                        ).length,
                        high: mission.data.confirmed_vulns.filter((v: any) =>
                            v.severity === 'HIGH'
                        ).length,
                        medium: mission.data.confirmed_vulns.filter((v: any) =>
                            v.severity === 'MEDIUM'
                        ).length,
                        low: mission.data.confirmed_vulns.filter((v: any) =>
                            v.severity === 'LOW'
                        ).length,
                    }}
                    onExport={() => {
                        // TODO: Implement export functionality
                        alert('Export functionality coming soon!');
                    }}
                    onShare={() => {
                        // TODO: Implement share functionality
                        alert('Share functionality coming soon!');
                    }}
                />
            )}

            {/* 🎯 Confirmed Vulnerabilities - Redesigned with Finding Cards */}
            {mission.data?.confirmed_vulns && mission.data.confirmed_vulns.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Critical Vulnerabilities ({mission.data.confirmed_vulns.length})
                        </h2>
                        <button
                            onClick={() => alert('Export all findings coming soon!')}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export All
                        </button>
                    </div>

                    <div className="space-y-4">
                        {mission.data.confirmed_vulns.map((vuln: any, i: number) => (
                            <FindingCard
                                key={i}
                                finding={{
                                    detection_type: vuln.detection_type || 'SQL Injection',
                                    target_url: vuln.target_url,
                                    method: vuln.method || 'POST',
                                    parameter: vuln.parameter,
                                    payload: vuln.payload,
                                    confidence: vuln.confidence ? Math.round(vuln.confidence * 100) : 95,
                                    db_dialect: vuln.db_dialect,
                                    reasoning: vuln.reasoning,
                                    raw_request: vuln.raw_request,
                                    response_snippet: vuln.response_snippet,
                                    severity: vuln.severity || 'CRITICAL',
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* 🔐 Secrets Found - AI Discovery */}
            {mission.data?.secrets_found && mission.data.secrets_found.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-red-200">
                    <h2 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                        <span>🔐</span>
                        Secrets Discovered ({mission.data.secrets_found.length})
                    </h2>
                    <div className="space-y-3">
                        {mission.data.secrets_found.map((secret: any, i: number) => (
                            <div key={i} className="bg-red-50 rounded-lg p-4 border border-red-200">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${secret.severity === 'critical' ? 'bg-red-600 text-white' :
                                        secret.severity === 'high' ? 'bg-orange-600 text-white' :
                                            secret.severity === 'medium' ? 'bg-yellow-600 text-white' :
                                                'bg-gray-600 text-white'
                                        }`}>
                                        {secret.severity?.toUpperCase() || 'UNKNOWN'}
                                    </span>
                                    <span className="font-medium text-gray-900">{secret.type}</span>
                                </div>
                                <div className="font-mono text-sm bg-gray-900 p-2 rounded mb-2 text-red-400">
                                    {secret.value}
                                </div>
                                {secret.why_sensitive && (
                                    <p className="text-sm text-gray-600 mb-1">
                                        <span className="text-gray-500">Why:</span> {secret.why_sensitive}
                                    </p>
                                )}
                                {secret.recommendation && (
                                    <p className="text-sm text-blue-600">
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
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span>📁</span>
                        Files Analyzed ({mission.data.files_analyzed.length})
                    </h2>
                    <div className="space-y-2">
                        {mission.data.files_analyzed.map((file: any, i: number) => (
                            <div key={i} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between border border-gray-200">
                                <div className="font-mono text-sm text-blue-600">{file.url}</div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">{file.file_type}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs ${file.risk_level === 'critical' ? 'bg-red-100 text-red-700' :
                                        file.risk_level === 'high' ? 'bg-orange-100 text-orange-700' :
                                            file.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-600'
                                        }`}>
                                        {file.risk_level}
                                    </span>
                                    {file.secrets_count > 0 && (
                                        <span className="text-xs text-red-600">🔐 {file.secrets_count}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Discovery Results - Enhanced Scalable View */}
            {mission.data?.endpoints && mission.data.endpoints.length > 0 && (
                <div className="space-y-6">
                    <GroupedEndpointList endpoints={mission.data.endpoints} />

                    {/* Technologies - kept separate as it's distinct from the list */}
                    {mission.data.technologies && mission.data.technologies.length > 0 && (
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-600 mb-3">🔧 Technologies Detected</h3>
                            <div className="flex flex-wrap gap-2">
                                {mission.data.technologies.map((tech: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm border border-purple-200">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
