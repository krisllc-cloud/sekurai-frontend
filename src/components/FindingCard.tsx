/**
 * Vulnerability Finding Card
 * 
 * Displays a single confirmed vulnerability with:
 * - Summary (collapsed state)
 * - Tabbed details (PoC, Raw Request, Raw Response, AI Analysis, Remediation)
 * - Progressive disclosure pattern
 */

import React, { useState } from 'react';

interface VulnerabilityFinding {
    detection_type: string;
    target_url: string;
    method?: string;
    parameter?: string;
    payload: string;
    confidence: number;
    db_dialect?: string;
    reasoning?: string;
    raw_request?: string;
    response_snippet?: string;
    severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

interface FindingCardProps {
    finding: VulnerabilityFinding;
}

export function FindingCard({ finding }: FindingCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<'poc' | 'request' | 'response' | 'analysis' | 'remediation'>('poc');
    const [copySuccess, setCopySuccess] = useState(false);

    const severity = finding.severity || 'CRITICAL';

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const tabs = [
        { id: 'poc' as const, label: 'PoC Payload' },
        { id: 'request' as const, label: 'Raw Request' },
        { id: 'response' as const, label: 'Raw Response' },
        { id: 'analysis' as const, label: 'AI Analysis' },
        { id: 'remediation' as const, label: 'Remediation' },
    ];

    return (
        <div className="bg-white rounded-lg border-2 border-red-200 overflow-hidden">
            {/* Header (always visible) */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                        <span className="px-3 py-1 rounded-md text-xs font-bold uppercase bg-red-600 text-white">
                            {severity}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {finding.detection_type.replace(/_/g, ' ')}
                        </h3>
                        {finding.db_dialect && (
                            <span className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded">
                                {finding.db_dialect}
                            </span>
                        )}
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-green-100 text-green-700 border border-green-300">
                        ✓ CONFIRMED
                    </span>
                </div>

                {/* Target URL */}
                <div className="mb-3">
                    <span className="text-blue-600 font-mono text-sm font-medium">{finding.method || 'POST'}</span>
                    <span className="text-gray-700 font-mono text-sm ml-2">{finding.target_url}</span>
                    {finding.parameter && (
                        <span className="text-orange-600 ml-2 text-sm">→ <span className="font-mono">{finding.parameter}</span></span>
                    )}
                </div>

                {/* Summary */}
                <p className="text-sm text-gray-600 mb-4">
                    User input <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{finding.parameter || 'parameter'}</code> directly in {finding.detection_type.toLowerCase().includes('sql') ? 'SQL query' : 'application logic'} without sanitization
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium text-sm"
                    >
                        {isExpanded ? (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                                Hide Details
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                View Details
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => handleCopy(finding.payload)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {copySuccess ? 'Copied!' : 'Copy Payload'}
                    </button>
                </div>
            </div>

            {/* Expandable Details Section */}
            {isExpanded && (
                <div className="border-t border-gray-200">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 bg-gray-50 px-4">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === tab.id
                                        ? 'text-blue-600 border-b-2 border-blue-600 -mb-px'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'poc' && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-semibold text-gray-700">Proof of Concept</h4>
                                    <button
                                        onClick={() => handleCopy(finding.payload)}
                                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Copy
                                    </button>
                                </div>
                                <pre className="bg-gray-900 p-4 rounded-lg text-green-400 text-sm font-mono overflow-x-auto">
                                    {`${finding.method || 'POST'} ${finding.target_url}
${finding.parameter}=${finding.payload}`}
                                </pre>

                                <div className="mt-4">
                                    <h5 className="text-xs font-semibold text-gray-600 uppercase mb-2">Attack Vector</h5>
                                    <code className="bg-gray-100 px-3 py-2 rounded text-sm block font-mono text-gray-800">
                                        {finding.payload}
                                    </code>
                                </div>

                                <div className="mt-4">
                                    <h5 className="text-xs font-semibold text-gray-600 uppercase mb-2">Expected Behavior</h5>
                                    <p className="text-sm text-gray-700">
                                        Authentication bypassed. Application returns different response when boolean condition is true vs false, confirming SQL injection.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'request' && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-semibold text-gray-700">HTTP Request Headers</h4>
                                    <button
                                        onClick={() => handleCopy(finding.raw_request || '')}
                                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Copy
                                    </button>
                                </div>
                                <pre className="bg-gray-900 p-4 rounded-lg text-gray-300 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                                    {finding.raw_request || `${finding.method || 'POST'} ${new URL(finding.target_url).pathname} HTTP/1.1
Host: ${new URL(finding.target_url).hostname}
User-Agent: SekurAI/2.0 (Agentic Security Scanner)
Accept: */*
Content-Type: application/x-www-form-urlencoded
Content-Length: ${finding.payload.length}
Connection: close

${finding.parameter}=${finding.payload}`}
                                </pre>
                            </div>
                        )}

                        {activeTab === 'response' && (
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-semibold text-gray-700">HTTP Response</h4>
                                    <button
                                        onClick={() => handleCopy(finding.response_snippet || '')}
                                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Copy
                                    </button>
                                </div>
                                <pre className="bg-gray-900 p-4 rounded-lg text-red-400 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                                    {finding.response_snippet || 'No response data captured'}
                                </pre>
                            </div>
                        )}

                        {activeTab === 'analysis' && (
                            <div>
                                <div className="mb-4">
                                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium mb-3">
                                        {finding.detection_type.replace(/_/g, ' ')}
                                    </span>
                                    <p className="text-sm text-gray-700 mb-4">
                                        {finding.reasoning || "The application's SQL query is vulnerable because user input is directly concatenated without parameterization."}
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                    <h5 className="text-xs font-semibold text-gray-600 uppercase mb-2">Confidence Score</h5>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-600 h-2 rounded-full"
                                                style={{ width: `${finding.confidence}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-green-600">{finding.confidence}%</span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2">Confirmed via browser validation</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'remediation' && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-4">How to Fix This Vulnerability</h4>

                                <div className="space-y-4">
                                    <div className="border-l-4 border-red-500 pl-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">1</span>
                                            <h5 className="font-semibold text-gray-900">Immediate Action</h5>
                                            <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded">CRITICAL</span>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-2">
                                            Replace string concatenation with parameterized queries
                                        </p>
                                        <pre className="bg-gray-900 p-3 rounded text-xs text-gray-300 font-mono overflow-x-auto">
                                            {`// VULNERABLE CODE
String query = "SELECT * FROM users WHERE username = '" 
  + request.getParameter("${finding.parameter}") + "'";

// SECURE CODE  
String query = "SELECT * FROM users WHERE username = ?";
PreparedStatement stmt = conn.prepareStatement(query);
stmt.setString(1, request.getParameter("${finding.parameter}"));`}
                                        </pre>
                                    </div>

                                    <div className="border-l-4 border-orange-500 pl-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">2</span>
                                            <h5 className="font-semibold text-gray-900">Input Validation</h5>
                                            <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded">HIGH</span>
                                        </div>
                                        <p className="text-sm text-gray-700">
                                            Implement allowlist validation for username format
                                        </p>
                                    </div>

                                    <div className="border-l-4 border-yellow-500 pl-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-xs font-bold">3</span>
                                            <h5 className="font-semibold text-gray-900">Defense in Depth</h5>
                                            <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-600 rounded">MEDIUM</span>
                                        </div>
                                        <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                                            <li>Apply principle of least privilege to DB user</li>
                                            <li>Enable SQL query logging and monitoring</li>
                                            <li>Implement rate limiting on this endpoint</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
