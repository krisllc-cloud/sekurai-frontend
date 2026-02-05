/**
 * Security Assessment Report
 * 
 * Professional report view for completed missions with:
 * - Executive summary
 * - Findings grouped by severity
 * - Attack surface stats
 * - Export options
 */

import React from 'react';

interface VulnerabilityFinding {
    detection_type: string;
    target_url: string;
    method?: string;
    parameter?: string;
    payload: string;
    confidence: number;
    db_dialect?: string;
    reasoning?: string;
    severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

interface SecurityReportProps {
    mission: any;  // Accept any mission object with flexible data shape
}

export function SecurityReport({ mission }: SecurityReportProps) {
    const { confirmed_vulns, endpoints, technologies, analysis } = mission.data;

    // Group by severity
    const bySeverity = {
        CRITICAL: confirmed_vulns.filter((v: any) => v.severity === 'CRITICAL' || !v.severity),
        HIGH: confirmed_vulns.filter((v: any) => v.severity === 'HIGH'),
        MEDIUM: confirmed_vulns.filter((v: any) => v.severity === 'MEDIUM'),
        LOW: confirmed_vulns.filter((v: any) => v.severity === 'LOW'),
    };

    const getDomain = (url: string) => {
        try {
            return new URL(url).hostname;
        } catch {
            return url;
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExportJSON = () => {
        const report = {
            target: mission.target_url,
            date: mission.created_at,
            findings: confirmed_vulns,
            stats: {
                total: confirmed_vulns.length,
                critical: bySeverity.CRITICAL.length,
                high: bySeverity.HIGH.length,
                medium: bySeverity.MEDIUM.length,
                low: bySeverity.LOW.length,
            }
        };
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `security-report-${getDomain(mission.target_url)}-${new Date().toISOString()}.json`;
        a.click();
    };

    return (
        <div className="bg-white p-8 max-w-5xl mx-auto print:p-4">
            {/* Header */}
            <div className="mb-8 border-b pb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Security Assessment Report
                </h1>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-600">Target:</span>
                        <span className="ml-2 font-mono text-blue-600">{mission.target_url}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Date:</span>
                        <span className="ml-2">{new Date(mission.created_at).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Executive Summary */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Executive Summary</h2>

                {/* Severity Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className={`border-2 rounded-lg p-4 text-center ${bySeverity.CRITICAL.length > 0 ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                        }`}>
                        <div className="text-3xl font-bold text-red-600">{bySeverity.CRITICAL.length}</div>
                        <div className="text-xs uppercase font-medium text-gray-600 mt-1">Critical</div>
                    </div>
                    <div className={`border-2 rounded-lg p-4 text-center ${bySeverity.HIGH.length > 0 ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-gray-50'
                        }`}>
                        <div className="text-3xl font-bold text-orange-600">{bySeverity.HIGH.length}</div>
                        <div className="text-xs uppercase font-medium text-gray-600 mt-1">High</div>
                    </div>
                    <div className={`border-2 rounded-lg p-4 text-center ${bySeverity.MEDIUM.length > 0 ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-gray-50'
                        }`}>
                        <div className="text-3xl font-bold text-yellow-600">{bySeverity.MEDIUM.length}</div>
                        <div className="text-xs uppercase font-medium text-gray-600 mt-1">Medium</div>
                    </div>
                    <div className={`border-2 rounded-lg p-4 text-center ${bySeverity.LOW.length > 0 ? 'border-gray-300 bg-gray-100' : 'border-gray-200 bg-gray-50'
                        }`}>
                        <div className="text-3xl font-bold text-gray-600">{bySeverity.LOW.length}</div>
                        <div className="text-xs uppercase font-medium text-gray-600 mt-1">Low</div>
                    </div>
                </div>

                {/* Attack Surface */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Attack Surface Analysis</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li>• <strong>{endpoints?.length || 0}</strong> endpoints analyzed</li>
                        <li>• <strong>{technologies?.length || 0}</strong> technologies detected: {technologies?.join(', ') || 'None'}</li>
                        <li>• Scan completed in <strong>{analysis?.duration_seconds?.toFixed(2) || 'N/A'}s</strong></li>
                        <li>• <strong>{confirmed_vulns.length}</strong> vulnerabilities confirmed</li>
                    </ul>
                </div>
            </section>

            {/* Findings by Severity */}
            {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(severity => (
                bySeverity[severity].length > 0 && (
                    <section key={severity} className="mb-8 page-break-inside-avoid">
                        <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${severity === 'CRITICAL' ? 'text-red-600' :
                            severity === 'HIGH' ? 'text-orange-600' :
                                severity === 'MEDIUM' ? 'text-yellow-600' :
                                    'text-gray-600'
                            }`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {severity} Findings ({bySeverity[severity].length})
                        </h2>

                        <div className="space-y-4">
                            {bySeverity[severity].map((finding: any, i: number) => (
                                <div key={i} className={`border-l-4 pl-4 py-2 ${severity === 'CRITICAL' ? 'border-red-500 bg-red-50' :
                                    severity === 'HIGH' ? 'border-orange-500 bg-orange-50' :
                                        severity === 'MEDIUM' ? 'border-yellow-500 bg-yellow-50' :
                                            'border-gray-400 bg-gray-50'
                                    } rounded-r`}>
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-gray-900">
                                            {i + 1}. {finding.detection_type.replace(/_/g, ' ')}
                                        </h3>
                                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded border border-green-300">
                                            {finding.confidence}% Confidence
                                        </span>
                                    </div>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        <li><strong>Endpoint:</strong> <code className="bg-white px-1 rounded text-xs">{finding.target_url}</code></li>
                                        <li><strong>Method:</strong> {finding.method || 'POST'}</li>
                                        <li><strong>Parameter:</strong> <code className="bg-white px-1 rounded text-xs">{finding.parameter || 'N/A'}</code></li>
                                        <li><strong>Payload:</strong> <code className="bg-white px-1 rounded text-xs break-all">{finding.payload}</code></li>
                                        {finding.db_dialect && <li><strong>Database:</strong> {finding.db_dialect}</li>}
                                        {finding.reasoning && <li><strong>Impact:</strong> {finding.reasoning}</li>}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )
            ))}

            {/* No Findings */}
            {confirmed_vulns.length === 0 && (
                <div className="text-center py-12 bg-green-50 border border-green-200 rounded-lg">
                    <svg className="w-16 h-16 mx-auto text-green-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-bold text-green-900 mb-2">No Vulnerabilities Found</h3>
                    <p className="text-green-700">The security scan completed successfully with no confirmed vulnerabilities.</p>
                </div>
            )}

            {/* Export Buttons */}
            <div className="flex gap-3 mt-8 pt-6 border-t print:hidden">
                <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Report
                </button>
                <button
                    onClick={handleExportJSON}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export JSON
                </button>
            </div>
        </div>
    );
}
