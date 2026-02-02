/**
 * HeaderIntelligence Component
 * 
 * Displays security intelligence extracted from HTTP headers:
 * - Security headers (CSP, HSTS, X-Frame-Options)
 * - Cookie analysis (Secure, HttpOnly, SameSite flags)
 * - Server fingerprinting
 * - Attack vectors identified
 */

"use client";

import React, { useState } from "react";

interface CookieInfo {
    name: string;
    secure: boolean;
    httponly: boolean;
    samesite: string;
    is_session: boolean;
    is_jwt: boolean;
    issues: string[];
}

interface HeaderIntel {
    // Security headers
    has_csp: boolean;
    has_hsts: boolean;
    has_x_frame_options: boolean;
    has_xss_protection: boolean;
    csp_policy?: string;
    hsts_max_age?: number;

    // Server info
    server_version?: string;
    powered_by?: string;
    framework_hints: string[];

    // Cookies
    session_cookies: string[];
    auth_cookies: string[];
    cookies_secure: string[];
    cookies_httponly: string[];
    cookies_insecure: string[];

    // CORS
    cors_config?: Record<string, string>;
    cors_misconfiguration: boolean;

    // Vulnerabilities
    missing_security_headers: string[];
    security_vulnerabilities: string[];

    // Scoring
    security_score: number;
    risk_level: string;
}

interface Endpoint {
    url: string;
    method: string;
    status_code?: number;
    response_headers?: Record<string, string>;
    security_headers?: Record<string, string>;
    header_intelligence?: HeaderIntel;
}

interface HeaderIntelligenceProps {
    endpoints: Endpoint[];
}

export function HeaderIntelligence({ endpoints }: HeaderIntelligenceProps) {
    const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
    const [expandedSection, setExpandedSection] = useState<string | null>("security");

    // Filter endpoints that have header data
    const endpointsWithHeaders = endpoints.filter(ep => ep.response_headers || ep.header_intelligence);

    // Aggregate security posture across all endpoints
    const securitySummary = React.useMemo(() => {
        const summary = {
            totalEndpoints: endpointsWithHeaders.length,
            missingCSP: 0,
            missingHSTS: 0,
            insecureCookies: 0,
            corsMisconfig: 0,
            avgSecurityScore: 0,
            serverVersionsExposed: 0,
        };

        let totalScore = 0;
        endpointsWithHeaders.forEach(ep => {
            const intel = ep.header_intelligence;
            if (intel) {
                if (!intel.has_csp) summary.missingCSP++;
                if (!intel.has_hsts) summary.missingHSTS++;
                summary.insecureCookies += intel.cookies_insecure?.length || 0;
                if (intel.cors_misconfiguration) summary.corsMisconfig++;
                totalScore += intel.security_score || 0;
                if (intel.server_version) summary.serverVersionsExposed++;
            }
        });

        summary.avgSecurityScore = endpointsWithHeaders.length > 0
            ? Math.round(totalScore / endpointsWithHeaders.length)
            : 0;

        return summary;
    }, [endpointsWithHeaders]);

    if (endpointsWithHeaders.length === 0) {
        return (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-500">No header intelligence available yet</p>
            </div>
        );
    }

    const selectedIntel = selectedEndpoint?.header_intelligence;

    return (
        <div className="space-y-4">
            {/* Security Posture Overview */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Security Posture</h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-2xl font-bold text-gray-900">{securitySummary.avgSecurityScore}</div>
                        <div className="text-xs text-gray-500">Avg Security Score</div>
                    </div>

                    <div className="text-center p-3 bg-yellow-50 rounded">
                        <div className="text-2xl font-bold text-yellow-700">{securitySummary.missingCSP}</div>
                        <div className="text-xs text-gray-500">Missing CSP</div>
                    </div>

                    <div className="text-center p-3 bg-orange-50 rounded">
                        <div className="text-2xl font-bold text-orange-700">{securitySummary.insecureCookies}</div>
                        <div className="text-xs text-gray-500">Insecure Cookies</div>
                    </div>

                    <div className="text-center p-3 bg-red-50 rounded">
                        <div className="text-2xl font-bold text-red-700">{securitySummary.corsMisconfig}</div>
                        <div className="text-xs text-gray-500">CORS Issues</div>
                    </div>
                </div>
            </div>

            {/* Endpoint Selector */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Select Endpoint
                </label>
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    onChange={(e) => {
                        const ep = endpointsWithHeaders[parseInt(e.target.value)];
                        setSelectedEndpoint(ep || null);
                    }}
                    defaultValue=""
                >
                    <option value="" disabled>Choose an endpoint...</option>
                    {endpointsWithHeaders.map((ep, idx) => (
                        <option key={idx} value={idx}>
                            {ep.method} {new URL(ep.url).pathname}
                        </option>
                    ))}
                </select>
            </div>

            {/* Detailed Header Intelligence */}
            {selectedEndpoint && selectedIntel && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {/* Security Headers Section */}
                    <div className="border-b border-gray-200">
                        <button
                            onClick={() => setExpandedSection(expandedSection === "security" ? null : "security")}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                        >
                            <span className="text-sm font-semibold text-gray-900">🔒 Security Headers</span>
                            <span className="text-xs text-gray-500">
                                {expandedSection === "security" ? "▼" : "▶"}
                            </span>
                        </button>

                        {expandedSection === "security" && (
                            <div className="p-4 bg-gray-50 space-y-2">
                                <SecurityHeaderRow label="Content-Security-Policy" present={selectedIntel.has_csp} value={selectedIntel.csp_policy} />
                                <SecurityHeaderRow label="Strict-Transport-Security" present={selectedIntel.has_hsts} value={selectedIntel.hsts_max_age ? `max-age=${selectedIntel.hsts_max_age}` : undefined} />
                                <SecurityHeaderRow label="X-Frame-Options" present={selectedIntel.has_x_frame_options} />
                                <SecurityHeaderRow label="X-XSS-Protection" present={selectedIntel.has_xss_protection} />

                                {selectedIntel.missing_security_headers.length > 0 && (
                                    <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                                        <div className="text-xs font-semibold text-yellow-800 mb-1">Missing Headers:</div>
                                        {selectedIntel.missing_security_headers.map(h => (
                                            <div key={h} className="text-xs text-yellow-700 ml-2">• {h}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Cookies Section */}
                    <div className="border-b border-gray-200">
                        <button
                            onClick={() => setExpandedSection(expandedSection === "cookies" ? null : "cookies")}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                        >
                            <span className="text-sm font-semibold text-gray-900">🍪 Cookies & Session</span>
                            <span className="text-xs text-gray-500">
                                {selectedIntel.session_cookies.length + selectedIntel.auth_cookies.length} found
                            </span>
                        </button>

                        {expandedSection === "cookies" && (
                            <div className="p-4 bg-gray-50 space-y-2">
                                {selectedIntel.session_cookies.length > 0 && (
                                    <div>
                                        <div className="text-xs font-semibold text-gray-700 mb-1">Session Cookies:</div>
                                        {selectedIntel.session_cookies.map(name => (
                                            <CookieRow
                                                key={name}
                                                name={name}
                                                secure={selectedIntel.cookies_secure.includes(name)}
                                                httponly={selectedIntel.cookies_httponly.includes(name)}
                                                insecure={selectedIntel.cookies_insecure.includes(name)}
                                            />
                                        ))}
                                    </div>
                                )}

                                {selectedIntel.auth_cookies.length > 0 && (
                                    <div className="mt-3">
                                        <div className="text-xs font-semibold text-gray-700 mb-1">Auth Cookies:</div>
                                        {selectedIntel.auth_cookies.map(name => (
                                            <CookieRow
                                                key={name}
                                                name={name}
                                                secure={selectedIntel.cookies_secure.includes(name)}
                                                httponly={selectedIntel.cookies_httponly.includes(name)}
                                                insecure={selectedIntel.cookies_insecure.includes(name)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Server Fingerprint Section */}
                    <div className="border-b border-gray-200">
                        <button
                            onClick={() => setExpandedSection(expandedSection === "server" ? null : "server")}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                        >
                            <span className="text-sm font-semibold text-gray-900">🖥️ Server Fingerprint</span>
                            <span className="text-xs text-gray-500">
                                {expandedSection === "server" ? "▼" : "▶"}
                            </span>
                        </button>

                        {expandedSection === "server" && (
                            <div className="p-4 bg-gray-50 space-y-2">
                                {selectedIntel.server_version && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600">Server:</span>
                                        <span className="text-xs font-mono text-gray-900">{selectedIntel.server_version}</span>
                                    </div>
                                )}
                                {selectedIntel.powered_by && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-600">Powered By:</span>
                                        <span className="text-xs font-mono text-gray-900">{selectedIntel.powered_by}</span>
                                    </div>
                                )}
                                {selectedIntel.framework_hints.length > 0 && (
                                    <div className="mt-2">
                                        <div className="text-xs font-semibold text-gray-700 mb-1">Framework Hints:</div>
                                        {selectedIntel.framework_hints.map((hint, i) => (
                                            <div key={i} className="text-xs text-gray-600 ml-2">• {hint}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Vulnerabilities Section */}
                    {selectedIntel.security_vulnerabilities.length > 0 && (
                        <div className="border-b border-gray-200">
                            <button
                                onClick={() => setExpandedSection(expandedSection === "vulns" ? null : "vulns")}
                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                            >
                                <span className="text-sm font-semibold text-red-600">⚠️ Vulnerabilities Detected</span>
                                <span className="text-xs text-gray-500">
                                    {selectedIntel.security_vulnerabilities.length}
                                </span>
                            </button>

                            {expandedSection === "vulns" && (
                                <div className="p-4 bg-red-50 space-y-1">
                                    {selectedIntel.security_vulnerabilities.map((vuln, i) => (
                                        <div key={i} className="text-xs text-red-700">• {vuln}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function SecurityHeaderRow({ label, present, value }: { label: string; present: boolean; value?: string }) {
    return (
        <div className="flex items-start justify-between py-1">
            <span className="text-xs text-gray-600">{label}</span>
            <div className="text-right">
                {present ? (
                    <>
                        <span className="text-xs font-semibold text-green-600">✓ Present</span>
                        {value && <div className="text-xs text-gray-500 font-mono mt-0.5">{value.slice(0, 50)}</div>}
                    </>
                ) : (
                    <span className="text-xs font-semibold text-red-600">✗ Missing</span>
                )}
            </div>
        </div>
    );
}

function CookieRow({ name, secure, httponly, insecure }: { name: string; secure: boolean; httponly: boolean; insecure: boolean }) {
    return (
        <div className={`flex items-center justify-between py-1 px-2 rounded ${insecure ? 'bg-yellow-50' : 'bg-white'}`}>
            <span className="text-xs font-mono text-gray-900">{name}</span>
            <div className="flex gap-1">
                {secure && <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded">Secure</span>}
                {httponly && <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded">HttpOnly</span>}
                {insecure && <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded">⚠️ Insecure</span>}
            </div>
        </div>
    );
}

export default HeaderIntelligence;
