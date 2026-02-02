"use client";

import React, { useState, useMemo } from "react";
import { EndpointRow } from "./EndpointRow";

interface Endpoint {
    url: string;
    method: string;
    validated?: boolean;
    auth_required?: boolean;
    risk_level?: string;
    confidence_score?: number;
    [key: string]: any;
}

interface GroupedEndpointListProps {
    endpoints: Endpoint[];
}

interface EndpointGroup {
    prefix: string;
    endpoints: Endpoint[];
    isExpanded: boolean;
    riskCount: number;
    authCount: number;
}

export function GroupedEndpointList({ endpoints }: GroupedEndpointListProps) {
    const [filter, setFilter] = useState("");
    const [methodFilter, setMethodFilter] = useState("ALL");
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

    // Toggle group expansion
    const toggleGroup = (prefix: string) => {
        setExpandedGroups(prev => ({
            ...prev,
            [prefix]: !prev[prefix]
        }));
    };

    // Group endpoints logic
    const groupedEndpoints = useMemo(() => {
        // First filter
        const filtered = endpoints.filter(ep => {
            const matchesSearch = ep.url.toLowerCase().includes(filter.toLowerCase());
            const matchesMethod = methodFilter === "ALL" || ep.method === methodFilter;
            return matchesSearch && matchesMethod;
        });

        // Then group by first 2 path segments (e.g. /api/users)
        const groups: Record<string, EndpointGroup> = {};
        const miscEndpoints: Endpoint[] = [];

        filtered.forEach(ep => {
            try {
                const path = new URL(ep.url).pathname;
                const parts = path.split('/').filter(p => p);

                // Use first 2 segments as group key, or just "/" if root
                const prefix = parts.length >= 2
                    ? `/${parts[0]}/${parts[1]}`
                    : parts.length === 1 ? `/${parts[0]}` : "/";

                if (!groups[prefix]) {
                    groups[prefix] = {
                        prefix,
                        endpoints: [],
                        isExpanded: false,
                        riskCount: 0,
                        authCount: 0
                    };
                }

                groups[prefix].endpoints.push(ep);
                if (ep.risk_level === 'high' || ep.risk_level === 'critical') groups[prefix].riskCount++;
                if (ep.auth_required) groups[prefix].authCount++;

            } catch {
                miscEndpoints.push(ep);
            }
        });

        return Object.values(groups).sort((a, b) => a.prefix.localeCompare(b.prefix));
    }, [endpoints, filter, methodFilter]);

    // Calculate stats
    const totalShown = groupedEndpoints.reduce((acc, g) => acc + g.endpoints.length, 0);
    const validCount = endpoints.filter(e => e.validated).length;
    const authCount = endpoints.filter(e => e.auth_required).length;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            {/* Header Area */}
            <div className="p-4 border-b border-gray-200 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                        Discovered Endpoints
                        <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {endpoints.length}
                        </span>
                    </h2>
                </div>

                {/* Filter Toolbar */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search paths..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                    </div>

                    <select
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:border-blue-500 focus:outline-none"
                        value={methodFilter}
                        onChange={(e) => setMethodFilter(e.target.value)}
                    >
                        <option value="ALL">All Methods</option>
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                    </select>

                    <div className="flex items-center gap-2 text-xs text-gray-500 border-l border-gray-200 pl-3">
                        <span>Showing {totalShown}</span>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-h-[600px] overflow-y-auto p-2">
                {groupedEndpoints.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>No endpoints match your filters</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {groupedEndpoints.map((group) => {
                            const isExpanded = expandedGroups[group.prefix] ?? false;

                            return (
                                <div key={group.prefix} className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                                    {/* Group Header */}
                                    <div
                                        className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => toggleGroup(group.prefix)}
                                    >
                                        <div className="w-5 text-gray-400">
                                            {isExpanded ? '▼' : '▶'}
                                        </div>
                                        <div className="flex-1 font-mono text-sm text-gray-700">
                                            {group.prefix}/*
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {group.riskCount > 0 && (
                                                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded border border-red-200">
                                                    {group.riskCount} High Risk
                                                </span>
                                            )}
                                            {group.authCount > 0 && (
                                                <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded border border-yellow-200">
                                                    {group.authCount} Auth
                                                </span>
                                            )}
                                            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                                                {group.endpoints.length}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Group Content - Animated Expansion */}
                                    {isExpanded && (
                                        <div className="border-t border-gray-200 p-2 pl-8 bg-white">
                                            <div className="space-y-1">
                                                {group.endpoints.map((endpoint, i) => (
                                                    <EndpointRow key={`${group.prefix}-${i}`} endpoint={endpoint} index={i} compact={true} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer Stats */}
            <div className="bg-gray-50 border-t border-gray-200 p-3 flex justify-between text-xs text-gray-500">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> {validCount} Validated</span>
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> {authCount} Auth Required</span>
                </div>
            </div>
        </div>
    );
}
