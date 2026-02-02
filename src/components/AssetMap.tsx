/**
 * AssetMap - Comprehensive Asset Discovery Dashboard
 * 
 * Displays all discovered intelligence organized by category:
 * - API Intelligence: REST, GraphQL, WebSockets
 * - SPA Architecture: Chunks, Service Workers, Routes
 * - Security Posture: CORS, Headers, WAF
 * - Content Discovery: Forms, Robots, Documentation
 */

"use client";

import React, { useState } from "react";

interface AssetMapProps {
    assetMap?: any;
    target?: string;
}

const tabs = [
    { id: "api", label: "API Intelligence", icon: "🔌" },
    { id: "spa", label: "SPA Architecture", icon: "⚛️" },
    { id: "security", label: "Security", icon: "🛡️" },
    { id: "content", label: "Content", icon: "📄" },
];

export function AssetMap({ assetMap, target }: AssetMapProps) {
    const [activeTab, setActiveTab] = useState("api");

    if (!assetMap) {
        return null;
    }

    const api = assetMap.api_intelligence || {};
    const spa = assetMap.spa_intelligence || {};
    const security = assetMap.security_posture || {};
    const content = assetMap.content_discovery || {};

    return (
        <div className="bg-white rounded-xl  shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Asset Map</h3>
                <p className="text-sm text-gray-500 mt-1">Comprehensive discovery intelligence</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-1 px-6" aria-label="Asset categories">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                px-4 py-3 text-sm font-medium border-b-2 transition-colors
                                ${activeTab === tab.id
                                    ? "border-cyan-500 text-cyan-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }
                            `}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {activeTab === "api" && (
                    <APIIntelligenceTab
                        rest={api.rest}
                        graphql={api.graphql}
                        websockets={api.websockets}
                    />
                )}
                {activeTab === "spa" && (
                    <SPAArchitectureTab
                        chunks={spa.js_chunks}
                        serviceWorkers={spa.service_workers}
                        sourceMaps={spa.source_maps}
                        aiRoutes={spa.routes_discovered_by_ai}
                    />
                )}
                {activeTab === "security" && (
                    <SecurityPostureTab
                        cors={security.cors}
                        headers={security.headers}
                        waf={security.waf}
                    />
                )}
                {activeTab === "content" && (
                    <ContentDiscoveryTab
                        forms={content.forms}
                        robots={content.robots_sitemap}
                        docs={content.documentation}
                        web3={content.web3_ai}
                    />
                )}
            </div>
        </div>
    );
}

// API Intelligence Tab
function APIIntelligenceTab({ rest, graphql, websockets }: any) {
    return (
        <div className="space-y-6">
            {/* REST APIs */}
            <AssetSection
                title="REST APIs"
                count={rest?.endpoints_count || 0}
                emptyMessage="No REST API documentation found"
            >
                {rest?.openapi_spec_url && (
                    <div className="space-y-2">
                        <Badge color="green">OpenAPI Spec Available</Badge>
                        <a
                            href={rest.openapi_spec_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-cyan-600 hover:underline block"
                        >
                            {rest.openapi_spec_url}
                        </a>
                    </div>
                )}
            </AssetSection>

            {/* GraphQL */}
            <AssetSection
                title="GraphQL"
                count={graphql?.total_operations || 0}
                emptyMessage="No GraphQL endpoints discovered"
            >
                {graphql?.endpoint && (
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            {graphql.introspection_enabled && (
                                <Badge color="yellow">Introspection Enabled</Badge>
                            )}
                        </div>
                        <p className="text-sm text-gray-600">Endpoint: {graphql.endpoint}</p>
                        <div className="text-sm text-gray-500">
                            <span className="font-medium">{graphql.queries || 0}</span> queries,
                            <span className="font-medium ml-1">{graphql.mutations || 0}</span> mutations
                        </div>
                    </div>
                )}
            </AssetSection>

            {/* WebSockets */}
            <AssetSection
                title="WebSockets"
                count={websockets?.count || 0}
                emptyMessage="No WebSocket connections found"
            >
                {websockets?.endpoints?.map((ws: any, i: number) => (
                    <div key={i} className="text-sm text-gray-600">
                        {ws.url || ws}
                    </div>
                ))}
            </AssetSection>
        </div>
    );
}

// SPA Architecture Tab
function SPAArchitectureTab({ chunks, serviceWorkers, sourceMaps, aiRoutes }: any) {
    return (
        <div className="space-y-6">
            {/* JS Chunks */}
            <AssetSection
                title="JavaScript Chunks"
                count={chunks?.chunks_found || 0}
                emptyMessage="No lazy-loaded chunks detected"
            >
                {chunks?.chunk_urls?.map((chunk: string, i: number) => (
                    <div key={i} className="text-sm font-mono text-gray-600 truncate">
                        {chunk}
                    </div>
                ))}
                {chunks?.scripts_analyzed > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                        Analyzed {chunks.scripts_analyzed} JavaScript files
                    </p>
                )}
            </AssetSection>

            {/* Service Workers */}
            <AssetSection
                title="Service Workers"
                count={serviceWorkers?.count || 0}
                emptyMessage="No service workers found"
            >
                {serviceWorkers?.cached_routes?.map((route: string, i: number) => (
                    <div key={i} className="text-sm text-gray-600">
                        {route}
                    </div>
                ))}
            </AssetSection>

            {/* AI-Discovered Routes */}
            <AssetSection
                title="AI-Discovered Routes"
                count={aiRoutes?.count || 0}
                emptyMessage="No AI-discovered routes"
            >
                {aiRoutes?.api_endpoints_found > 0 && (
                    <Badge color="purple">{aiRoutes.api_endpoints_found} API endpoints found by AI</Badge>
                )}
            </AssetSection>
        </div>
    );
}

// Security Posture Tab
function SecurityPostureTab({ cors, headers, waf }: any) {
    return (
        <div className="space-y-6">
            {/* CORS */}
            <AssetSection
                title="CORS Configuration"
                count={cors?.vulnerable_endpoints || 0}
                emptyMessage="No CORS issues detected"
            >
                {cors?.vulnerable && (
                    <Badge color="red">{cors.vulnerable_endpoints} vulnerable endpoints</Badge>
                )}
                {cors?.findings?.map((finding: any, i: number) => (
                    <div key={i} className="text-sm text-gray-600">
                        {finding.url}: {finding.issue}
                    </div>
                ))}
            </AssetSection>

            {/* Security Headers */}
            <AssetSection
                title="Security Headers"
                count={headers?.security_score || 0}
                emptyMessage="No header analysis available"
            >
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">{headers?.security_score || 0}</span>
                        <span className="text-sm text-gray-500">/ 100</span>
                    </div>
                    {headers?.missing_headers && headers.missing_headers.length > 0 && (
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Missing Headers:</p>
                            <div className="flex flex-wrap gap-1">
                                {headers.missing_headers.map((header: string, i: number) => (
                                    <span key={i} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                        {header}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {headers?.server_info && (
                        <p className="text-sm text-gray-500">Server: {headers.server_info}</p>
                    )}
                </div>
            </AssetSection>

            {/* WAF Detection */}
            <AssetSection
                title="WAF / Rate Limiting"
                count={waf?.signatures?.length || 0}
                emptyMessage="No WAF detected"
            >
                {waf?.detected && (
                    <Badge color="blue">WAF Detected</Badge>
                )}
                {waf?.signatures?.map((sig: string, i: number) => (
                    <div key={i} className="text-sm text-gray-600">
                        {sig}
                    </div>
                ))}
            </AssetSection>
        </div>
    );
}

// Content Discovery Tab
function ContentDiscoveryTab({ forms, robots, docs, web3 }: any) {
    return (
        <div className="space-y-6">
            {/* Forms */}
            <AssetSection
                title="Forms"
                count={forms?.total || 0}
                emptyMessage="No forms discovered"
            >
                <div className="space-y-2">
                    {forms?.login_forms > 0 && (
                        <Badge color="purple">{forms.login_forms} login forms</Badge>
                    )}
                    {forms?.csrf_protected > 0 && (
                        <Badge color="green">{forms.csrf_protected} CSRF protected</Badge>
                    )}
                </div>
            </AssetSection>

            {/* Robots & Sitemap */}
            <AssetSection
                title="Robots.txt & Sitemap"
                count={(robots?.disallowed_paths?.length || 0) + (robots?.sitemap_urls || 0)}
                emptyMessage="No robots.txt or sitemap found"
            >
                {robots?.disallowed_paths && robots.disallowed_paths.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Disallowed Paths:</p>
                        {robots.disallowed_paths.slice(0, 5).map((path: string, i: number) => (
                            <div key={i} className="text-sm text-gray-600 font-mono">{path}</div>
                        ))}
                    </div>
                )}
                {robots?.sitemap_urls > 0 && (
                    <p className="text-sm text-gray-600">{robots.sitemap_urls} URLs in sitemap</p>
                )}
            </AssetSection>

            {/* API Documentation */}
            <AssetSection
                title="API Documentation"
                count={docs?.swagger_ui_url || docs?.openapi_spec_url ? 1 : 0}
                emptyMessage="No API documentation found"
            >
                {docs?.swagger_ui_url && (
                    <a
                        href={docs.swagger_ui_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-cyan-600 hover:underline block"
                    >
                        Swagger UI
                    </a>
                )}
                {docs?.openapi_spec_url && (
                    <a
                        href={docs.openapi_spec_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-cyan-600 hover:underline block"
                    >
                        OpenAPI Spec
                    </a>
                )}
            </AssetSection>
        </div>
    );
}

// Reusable Section Component
function AssetSection({ title, count, emptyMessage, children }: any) {
    if (count === 0 && !children) {
        return (
            <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">{title}</h4>
                <p className="text-sm text-gray-400 italic">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
                {count > 0 && (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
                        {count}
                    </span>
                )}
            </div>
            <div className="space-y-2">{children}</div>
        </div>
    );
}

// Badge Component
function Badge({ color, children }: { color: string; children: React.ReactNode }) {
    const colors: Record<string, string> = {
        green: "bg-green-100 text-green-700",
        yellow: "bg-yellow-100 text-yellow-700",
        red: "bg-red-100 text-red-700",
        blue: "bg-blue-100 text-blue-700",
        purple: "bg-purple-100 text-purple-700",
    };

    return (
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors[color] || colors.blue}`}>
            {children}
        </span>
    );
}

export default AssetMap;
