"use client";

/**
 * EndpointRow - Expandable endpoint display with parameters and AI insights
 * Light mode version
 */

import React, { useState } from "react";

interface EndpointParam {
    name: string;
    type?: string;
    required?: boolean;
    location?: string;
}

interface Endpoint {
    url: string;
    method: string;
    params?: string[] | EndpointParam[];
    auth_required?: boolean;
    auth_hint?: boolean;
    validated?: boolean;
    status_code?: number;
    confidence_score?: number;
    source?: string;
    response_time_ms?: number;
    anomaly_reasons?: string[];
    business_purpose?: string;
    ai_insights?: string[];
}

interface EndpointRowProps {
    endpoint: Endpoint;
    index: number;
    compact?: boolean;
}

// Helper functions
function detectParamType(name: string): string {
    const n = name.toLowerCase();
    if (n.includes("id")) return "integer";
    if (n.includes("email")) return "email";
    if (n.includes("password")) return "password";
    if (n.includes("date") || n.includes("time")) return "datetime";
    if (n.includes("count") || n.includes("limit") || n.includes("page")) return "integer";
    if (n.includes("enabled") || n.includes("is_")) return "boolean";
    if (n.includes("url")) return "url";
    return "string";
}

function detectParamLocation(name: string, url: string): string {
    if (url.includes(`{${name}}`) || url.includes(`:${name}`)) return "path";
    return "query";
}

function generateInsights(endpoint: Endpoint, params: EndpointParam[]): string[] {
    const insights: string[] = [];
    const url = endpoint.url.toLowerCase();
    const method = endpoint.method;

    const hasIdParam = params.some(p => p.name.toLowerCase().includes("id") && p.type === "integer");
    if (hasIdParam && method === "GET") {
        insights.push("Potential IDOR - user ID appears predictable");
    }
    if (url.includes("/admin") || url.includes("/internal")) {
        insights.push("Admin endpoint - verify authorization");
    }
    if (url.includes("/login") || url.includes("/auth")) {
        insights.push("Auth endpoint - test brute force protections");
    }
    if (url.includes("/upload") || url.includes("/file")) {
        insights.push("File endpoint - test unrestricted upload");
    }
    if (url.includes("/graphql")) {
        insights.push("GraphQL - check introspection");
    }

    return insights;
}

export function EndpointRow({ endpoint, index, compact = false }: EndpointRowProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const isValidated = endpoint.validated === true || (endpoint.status_code && endpoint.status_code < 300);
    const isAuthRequired = endpoint.auth_required || endpoint.auth_hint || endpoint.status_code === 302;
    const showConfidence = isAuthRequired && !isValidated;
    const confidence = endpoint.confidence_score ?? 0.5;
    const confidencePercent = Math.round(confidence * 100);

    // Parse params
    const parsedParams: EndpointParam[] = (() => {
        if (!endpoint.params || endpoint.params.length === 0) return [];
        return (endpoint.params as any[]).map(p => {
            if (typeof p === "string") {
                const isRequired = !p.endsWith("?");
                const name = p.replace("?", "");
                return { name, type: detectParamType(name), required: isRequired, location: detectParamLocation(name, endpoint.url) };
            }
            return p as EndpointParam;
        });
    })();

    const aiInsights: string[] = endpoint.ai_insights || generateInsights(endpoint, parsedParams);

    const methodColors: Record<string, string> = {
        'GET': 'bg-green-100 text-green-700',
        'POST': 'bg-blue-100 text-blue-700',
        'PUT': 'bg-yellow-100 text-yellow-700',
        'DELETE': 'bg-red-100 text-red-700',
        'PATCH': 'bg-purple-100 text-purple-700',
    };

    return (
        <div className={`bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition overflow-hidden ${compact ? 'text-xs' : ''}`}>
            {/* Collapsed Row */}
            <div className={`cursor-pointer hover:bg-gray-50 transition ${compact ? 'p-2' : 'p-3'}`} onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                        <svg className={`w-3 h-3 text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>

                        <span className={`px-2 py-0.5 rounded text-xs font-medium min-w-[50px] text-center ${methodColors[endpoint.method] || 'bg-gray-100 text-gray-600'}`}>
                            {endpoint.method}
                        </span>

                        <span className="font-mono text-sm text-gray-700 flex-1 truncate">{endpoint.url}</span>

                        {parsedParams.length > 0 && (
                            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                                {parsedParams.length}p
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {endpoint.source?.includes('ai_') && (
                            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">AI</span>
                        )}

                        {isValidated && (
                            <span className="text-green-600 text-sm">✓</span>
                        )}

                        {showConfidence && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-yellow-600 text-sm">🔐</span>
                                <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${confidencePercent >= 70 ? 'bg-green-500' : confidencePercent >= 50 ? 'bg-yellow-500' : 'bg-orange-500'}`} style={{ width: `${confidencePercent}%` }} />
                                </div>
                                <span className="text-xs text-gray-500">{confidencePercent}%</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50 p-4 grid grid-cols-2 gap-4">
                    {/* Parameters */}
                    <div>
                        <h4 className="text-xs font-medium text-gray-500 mb-2">Parameters</h4>
                        {parsedParams.length > 0 ? (
                            <div className="space-y-1">
                                {parsedParams.map((param, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs">
                                        <span className="font-mono text-blue-600">{param.name}</span>
                                        <span className="text-gray-400">{param.type}</span>
                                        {param.required && <span className="text-red-500">*</span>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400">No parameters</p>
                        )}
                    </div>

                    {/* AI Insights */}
                    <div>
                        <h4 className="text-xs font-medium text-gray-500 mb-2">AI Insights</h4>
                        {aiInsights.length > 0 ? (
                            <div className="space-y-1">
                                {aiInsights.map((insight, i) => (
                                    <div key={i} className="text-xs text-purple-600 flex items-start gap-1">
                                        <span className="text-purple-500">•</span>
                                        {insight}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400">No specific insights</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default EndpointRow;
