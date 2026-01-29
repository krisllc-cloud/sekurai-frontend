"use client";

import Link from "next/link";
import { useMissions } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { memoryAPI } from "@/lib/api";

export default function FindingsPage() {
    const { missions } = useMissions();
    const { getToken } = useAuth();
    const [allFindings, setAllFindings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAllFindings() {
            if (missions.length === 0) {
                setLoading(false);
                return;
            }

            try {
                const token = await getToken();
                if (!token) return;

                const findingsPromises = missions.map(async (mission: any) => {
                    // Get findings from memory store API
                    let memoryFindings: any[] = [];
                    try {
                        const data = await memoryAPI.getFindings(mission.id, token);
                        memoryFindings = (data.findings || []).map((f: any) => ({
                            ...f,
                            mission_target: mission.target_url,
                            mission_id: mission.id,
                        }));
                    } catch {
                        // API might not have findings
                    }

                    // Also include findings from PostgreSQL (mission.data)
                    const dbFindings: any[] = [];

                    // Confirmed vulns from attack phase
                    if (mission.data?.confirmed_vulns) {
                        mission.data.confirmed_vulns.forEach((v: any) => {
                            dbFindings.push({
                                ...v,
                                mission_target: mission.target_url,
                                mission_id: mission.id,
                            });
                        });
                    }

                    // Secrets found from discovery phase
                    if (mission.data?.secrets_found) {
                        mission.data.secrets_found.forEach((s: any) => {
                            dbFindings.push({
                                ...s,
                                vuln_type: s.type || 'Secret Exposure',
                                mission_target: mission.target_url,
                                mission_id: mission.id,
                            });
                        });
                    }

                    // Prefer memory findings, fallback to DB
                    return memoryFindings.length > 0 ? memoryFindings : dbFindings;
                });

                const results = await Promise.all(findingsPromises);
                const merged = results.flat().sort((a, b) =>
                    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
                );
                setAllFindings(merged);
            } catch (err) {
                console.error("Failed to fetch findings:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchAllFindings();
    }, [missions, getToken]);

    const getSeverityStyle = (severity: string) => {
        const s = (severity || 'medium').toLowerCase();
        switch (s) {
            case 'critical': return 'bg-red-100 text-red-700 border-red-200';
            case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading findings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Findings</h1>
                    <p className="text-gray-500 text-sm mt-1">All security vulnerabilities discovered across missions</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        {allFindings.filter(f => f.severity?.toLowerCase() === 'critical').length} Critical
                    </span>
                    <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                        {allFindings.filter(f => f.severity?.toLowerCase() === 'high').length} High
                    </span>
                </div>
            </div>

            {/* Findings List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {allFindings.length === 0 ? (
                    <div className="p-16 text-center">
                        <p className="text-gray-400 mb-4">No findings yet</p>
                        <Link href="/dashboard/missions/new" className="btn-primary">
                            Start a Mission
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {allFindings.map((finding, i) => (
                            <div key={finding.id || i} className="p-5 hover:bg-gray-50 transition">
                                <div className="flex items-start gap-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${getSeverityStyle(finding.severity)}`}>
                                        {finding.severity || 'MEDIUM'}
                                    </span>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-gray-900">{finding.vuln_type || finding.type || 'Unknown'}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${finding.confidence === 'PROVEN' || finding.confidence === 'CONFIRMED'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {finding.confidence || 'CONFIRMED'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-2">
                                            <Link href={`/dashboard/missions/${finding.mission_id}`} className="text-blue-500 hover:underline">
                                                {finding.mission_target}
                                            </Link>
                                        </p>
                                        <p className="text-xs font-mono text-gray-600 truncate">
                                            {finding.endpoint || finding.location || 'N/A'}
                                        </p>
                                        {finding.payload && (
                                            <div className="mt-2 bg-gray-900 rounded p-2 font-mono text-xs text-green-400 truncate">
                                                {finding.payload.substring(0, 80)}...
                                            </div>
                                        )}
                                    </div>
                                    <Link
                                        href={`/dashboard/missions/${finding.mission_id}`}
                                        className="text-blue-500 text-sm hover:underline"
                                    >
                                        View →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
