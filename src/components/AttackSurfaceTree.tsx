"use client";

import { useState } from "react";

interface Endpoint {
    url: string;
    method: string;
    params?: any[];
    validated?: boolean;
    auth_required?: boolean;
}

interface AttackSurfaceTreeProps {
    endpoints: Endpoint[];
    confirmedVulnEndpoints?: string[];
}

export function AttackSurfaceTree({ endpoints = [], confirmedVulnEndpoints = [] }: AttackSurfaceTreeProps) {
    const [filter, setFilter] = useState<'all' | 'vulnerable' | 'auth'>('all');
    const [expanded, setExpanded] = useState(true);

    // Group endpoints by path prefix
    const groupByPath = (eps: Endpoint[]) => {
        const groups: Record<string, Endpoint[]> = {};
        eps.forEach(ep => {
            try {
                const url = new URL(ep.url);
                const parts = url.pathname.split('/').filter(Boolean);
                const key = '/' + (parts[0] || '');
                if (!groups[key]) groups[key] = [];
                groups[key].push(ep);
            } catch {
                if (!groups['/other']) groups['/other'] = [];
                groups['/other'].push(ep);
            }
        });
        return groups;
    };

    const filteredEndpoints = endpoints.filter(ep => {
        if (filter === 'vulnerable') return confirmedVulnEndpoints.includes(ep.url);
        if (filter === 'auth') return ep.auth_required;
        return true;
    });

    const grouped = groupByPath(filteredEndpoints);
    const domain = endpoints[0]?.url ? new URL(endpoints[0].url).hostname : 'target';

    const getMethodColor = (method: string) => {
        const colors: Record<string, string> = {
            'GET': 'text-blue-700 bg-blue-100',
            'POST': 'text-green-700 bg-green-100',
            'PUT': 'text-yellow-700 bg-yellow-100',
            'DELETE': 'text-red-700 bg-red-100',
            'PATCH': 'text-purple-700 bg-purple-100',
        };
        return colors[method] || 'text-gray-700 bg-gray-100';
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                    </div>
                    Attack Surface
                </h2>
                <span className="text-xs text-gray-500 tabular-nums">{endpoints.length} endpoints</span>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1.5 mb-3">
                {(['all', 'vulnerable', 'auth'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-2.5 py-1 text-xs rounded-full transition-all duration-200 ${filter === f
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {f === 'all' ? 'All' : f === 'vulnerable' ? (
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                Vuln
                            </span>
                        ) : (
                            <span className="flex items-center gap-1">🔒 Auth</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tree */}
            <div className="flex-1 overflow-hidden rounded-xl bg-gray-50 border border-gray-200">
                {/* Root */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center gap-2 p-3 hover:bg-gray-100 text-left border-b border-gray-200 transition-colors"
                >
                    <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-blue-600 font-medium text-sm">{domain}</span>
                    <span className="text-xs text-gray-400 ml-auto tabular-nums">{filteredEndpoints.length}</span>
                </button>

                {expanded && (
                    <div className="max-h-[600px] overflow-y-auto">
                        {Object.entries(grouped).map(([path, eps]) => (
                            <div key={path}>
                                <div className="px-4 py-1.5 text-[10px] uppercase tracking-wider text-gray-500 bg-gray-100 border-b border-gray-200 font-medium">
                                    {path}
                                </div>
                                {eps.map((ep, i) => {
                                    const isVuln = confirmedVulnEndpoints.includes(ep.url);
                                    return (
                                        <div
                                            key={i}
                                            className={`flex items-center gap-2 px-4 py-1.5 text-xs transition-colors border-b border-gray-100 last:border-0 ${isVuln ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-100'
                                                }`}
                                        >
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium ${getMethodColor(ep.method)}`}>
                                                {ep.method}
                                            </span>
                                            <span className="text-gray-600 truncate flex-1 font-mono text-[11px]">
                                                {(() => {
                                                    try {
                                                        return new URL(ep.url).pathname;
                                                    } catch {
                                                        return ep.url;
                                                    }
                                                })()}
                                            </span>
                                            {isVuln && (
                                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                            )}
                                            {ep.auth_required && (
                                                <span className="text-yellow-600 text-[10px]">🔒</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
