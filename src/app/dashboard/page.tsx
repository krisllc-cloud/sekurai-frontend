"use client";

import Link from "next/link";
import { useMissions } from "@/lib/hooks";

export default function DashboardPage() {
    const { missions, loading, error } = useMissions();

    // Calculate stats from real missions
    const activeMissions = missions.filter(m =>
        ["DISCOVERY", "EXPLOITATION", "ANALYSIS", "ATTACK", "CHAINING"].includes(m.status)
    ).length;

    const completedMissions = missions.filter(m => ["COMPLETED", "REPORTING"].includes(m.status)).length;
    const totalEndpoints = missions.reduce((sum, m) => sum + (m.endpoints_discovered || 0), 0);
    const totalFindings = missions.reduce((sum, m) => sum + (m.findings_count || 0), 0);

    // Calculate severity breakdown
    const severityCounts = missions.reduce((acc, m) => {
        const data = m.data || {};
        const vulns = data.confirmed_vulns || [];
        vulns.forEach((v: any) => {
            const sev = (v.severity || 'medium').toLowerCase();
            acc[sev] = (acc[sev] || 0) + 1;
        });
        return acc;
    }, { critical: 0, high: 0, medium: 0, low: 0 } as Record<string, number>);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    </div>
                    <p className="text-gray-500 mt-4">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
                <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
                <button onClick={() => window.location.reload()} className="btn-primary">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Security operations overview</p>
                </div>
                <Link href="/dashboard/missions/new" className="btn-primary flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Mission
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4">
                {/* Total Missions */}
                <div className="stat-card" style={{ '--accent': '#3b82f6' } as React.CSSProperties}>
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">{missions.length}</p>
                            <p className="text-sm text-gray-500">Total Missions</p>
                        </div>
                    </div>
                </div>

                {/* Vulnerabilities Found */}
                <div className="stat-card" style={{ '--accent': '#dc2626' } as React.CSSProperties}>
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-red-100 text-red-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">{totalFindings}</p>
                            <p className="text-sm text-gray-500">Vulnerabilities</p>
                        </div>
                    </div>
                </div>

                {/* Endpoints Discovered */}
                <div className="stat-card" style={{ '--accent': '#16a34a' } as React.CSSProperties}>
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-green-100 text-green-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">{totalEndpoints}</p>
                            <p className="text-sm text-gray-500">Endpoints</p>
                        </div>
                    </div>
                </div>

                {/* Active Scans */}
                <div className="stat-card" style={{ '--accent': '#f59e0b' } as React.CSSProperties}>
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-3xl font-bold text-gray-900">{activeMissions}</p>
                            {activeMissions > 0 && <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>}
                        </div>
                        <p className="text-sm text-gray-500">Active</p>
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-3 gap-6">
                {/* Severity Breakdown */}
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Severity Breakdown</h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-24 text-sm font-medium text-gray-600">Critical</div>
                            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min((severityCounts.critical / Math.max(totalFindings, 1)) * 100, 100)}%` }}></div>
                            </div>
                            <div className="w-8 text-right text-sm font-bold text-gray-900">{severityCounts.critical}</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-24 text-sm font-medium text-gray-600">High</div>
                            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.min((severityCounts.high / Math.max(totalFindings, 1)) * 100, 100)}%` }}></div>
                            </div>
                            <div className="w-8 text-right text-sm font-bold text-gray-900">{severityCounts.high}</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-24 text-sm font-medium text-gray-600">Medium</div>
                            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${Math.min((severityCounts.medium / Math.max(totalFindings, 1)) * 100, 100)}%` }}></div>
                            </div>
                            <div className="w-8 text-right text-sm font-bold text-gray-900">{severityCounts.medium}</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-24 text-sm font-medium text-gray-600">Low</div>
                            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min((severityCounts.low / Math.max(totalFindings, 1)) * 100, 100)}%` }}></div>
                            </div>
                            <div className="w-8 text-right text-sm font-bold text-gray-900">{severityCounts.low}</div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="col-span-2 card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Active & Recent Missions</h2>
                        <Link href="/dashboard/missions" className="text-sm text-blue-600 hover:text-blue-700 transition flex items-center gap-1">
                            View all
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {missions.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 mb-4">No missions yet</p>
                            <Link href="/dashboard/missions/new" className="btn-primary inline-flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Start your first mission
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {missions.slice(0, 6).map((mission) => {
                                const startedDate = new Date(mission.created_at);
                                const now = new Date();
                                const diffMs = now.getTime() - startedDate.getTime();
                                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                                const diffDays = Math.floor(diffHours / 24);
                                const timeAgo = diffDays > 0 ? `${diffDays}d ago` : diffHours > 0 ? `${diffHours}h ago` : 'Just now';

                                let domain = mission.target_url;
                                try { domain = new URL(mission.target_url).hostname; } catch { }

                                const isActive = ["DISCOVERY", "ANALYSIS", "ATTACK", "EXPLOITATION"].includes(mission.status);

                                return (
                                    <Link
                                        key={mission.id}
                                        href={`/dashboard/missions/${mission.id}`}
                                        className="block"
                                    >
                                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-white hover:shadow-sm transition group">
                                            {/* Domain */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition">
                                                        {domain}
                                                    </p>
                                                    {isActive && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
                                                </div>
                                            </div>

                                            {/* Status badge */}
                                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${mission.status === "COMPLETED" || mission.status === "REPORTING"
                                                ? "bg-green-100 text-green-700"
                                                : isActive
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-gray-100 text-gray-600"
                                                }`}>
                                                {mission.status === "REPORTING" ? "Complete" : mission.status}
                                            </span>

                                            {/* Stats */}
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                {(mission.findings_count ?? 0) > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                        {mission.findings_count}
                                                    </span>
                                                )}
                                                <span>{mission.endpoints_discovered || 0} eps</span>
                                            </div>

                                            {/* Time */}
                                            <span className="text-xs text-gray-400 w-16 text-right">{timeAgo}</span>

                                            {/* Arrow */}
                                            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
