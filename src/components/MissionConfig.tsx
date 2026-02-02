"use client";

/**
 * MissionConfig - Clean visual configuration panel
 * 
 * Compact display matching the design:
 * - Features column with ON/OFF badges
 * - Discovery Modules as pill badges (checked/unchecked)
 * - Target Information with minimal icons
 */

import React from "react";

interface MissionConfigProps {
    config: Record<string, any>;
    targetUrl: string;
}

export function MissionConfig({ config, targetUrl }: MissionConfigProps) {
    // Parse domain
    let domain = "";
    try {
        domain = new URL(targetUrl).hostname;
    } catch {
        domain = targetUrl;
    }

    // Feature toggles - compact list
    const features = [
        { key: "enable_vision", label: "Vision AI", icon: "👁️" },
        { key: "aggressive_mode", label: "Aggressive Mode", icon: "⚡" },
        { key: "include_subdomains", label: "Subdomains", icon: "🌐" },
        { key: "enable_ai_reasoning", label: "AI Reasoning", icon: "🧠" },
    ];

    // Discovery modules - as checkable pills
    const modules = [
        { key: "enable_swagger", label: "Swagger" },
        { key: "enable_robots_sitemap", label: "Robots/Sitemap" },
        { key: "enable_graphql", label: "GraphQL" },
        { key: "enable_cors_probe", label: "CORS Probe" },
        { key: "enable_waf_detection", label: "WAF Detection" },
        { key: "enable_websocket", label: "WebSocket" },
        { key: "enable_source_maps", label: "Source Maps" },
        { key: "enable_web3_ai", label: "Web3 & AI" },
    ];

    return (
        <div className="glass rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Scan Configuration
            </h3>

            <div className="grid grid-cols-3 gap-6">
                {/* Features - compact toggles */}
                <div>
                    <h4 className="text-xs text-gray-500 mb-2">Features</h4>
                    <div className="space-y-2">
                        {features.map(f => {
                            const isOn = config[f.key] === true;
                            return (
                                <div key={f.key} className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-sm text-gray-300">
                                        <span className="text-xs">{f.icon}</span>
                                        {f.label}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${isOn ? "bg-green-500/20 text-green-400" : "bg-gray-700 text-gray-500"
                                        }`}>
                                        {isOn ? "ON" : "OFF"}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Discovery Modules - pill badges */}
                <div>
                    <h4 className="text-xs text-gray-500 mb-2">Discovery Modules</h4>
                    <div className="flex flex-wrap gap-1.5">
                        {modules.map(m => {
                            const isEnabled = config[m.key] === true;
                            return (
                                <span
                                    key={m.key}
                                    className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${isEnabled
                                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                            : "bg-gray-800 text-gray-500 border border-gray-700"
                                        }`}
                                >
                                    {isEnabled && "✓"} {m.label}
                                </span>
                            );
                        })}
                    </div>
                    <p className="text-[10px] text-gray-600 mt-2">
                        {modules.filter(m => config[m.key]).length} modules enabled
                    </p>
                </div>

                {/* Target Information - minimal */}
                <div>
                    <h4 className="text-xs text-gray-500 mb-2">Target Information</h4>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">🌐</span>
                            <div>
                                <div className="text-[10px] text-gray-500">Domain</div>
                                <div className="text-sm font-medium text-white">{domain}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={targetUrl.startsWith("https") ? "text-green-400" : "text-yellow-400"}>
                                {targetUrl.startsWith("https") ? "🔒" : "⚠️"}
                            </span>
                            <div>
                                <div className="text-[10px] text-gray-500">SSL Status</div>
                                <div className={`text-sm font-medium ${targetUrl.startsWith("https") ? "text-green-400" : "text-yellow-400"
                                    }`}>
                                    {targetUrl.startsWith("https") ? "Secure" : "No SSL"}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-purple-400">📋</span>
                            <div>
                                <div className="text-[10px] text-gray-500">Mission Type</div>
                                <div className="text-sm font-medium text-purple-300">
                                    {config.mission_type?.replace(/_/g, " ") || "full_security_audit"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MissionConfig;
