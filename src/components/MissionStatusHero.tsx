/**
 * Mission Status Hero Card
 * 
 * Top-level status card showing scan completion, severity breakdown, and actions.
 * Answers user's first question: "What happened?"
 */

import React from 'react';

interface SeverityCount {
    critical: number;
    high: number;
    medium: number;
    low: number;
}

interface MissionStatusHeroProps {
    status: 'COMPLETED' | 'FAILED' | 'RUNNING' | string;
    targetUrl: string;
    duration?: number;
    severityCounts: SeverityCount;
    onExport?: () => void;
    onShare?: () => void;
}

export function MissionStatusHero({
    status,
    targetUrl,
    duration,
    severityCounts,
    onExport,
    onShare
}: MissionStatusHeroProps) {
    const getDomain = (url: string) => {
        try {
            return new URL(url).hostname;
        } catch {
            return url;
        }
    };

    const isComplete = status === 'COMPLETED';
    const totalCriticalAndHigh = severityCounts.critical + severityCounts.high;

    return (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            {/* Status Icon + Headline */}
            <div className="flex items-center gap-4 mb-6">
                {isComplete ? (
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isComplete ? 'Scan Complete' : 'Scan Running'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {duration && <span>{duration.toFixed(2)}s</span>}
                        {duration && <span className="mx-2">•</span>}
                        <span className="font-mono text-sm">{getDomain(targetUrl)}</span>
                    </p>
                </div>
            </div>

            {/* Severity Breakdown */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {/* Critical */}
                <div className="relative">
                    <div className={`rounded-lg p-4 border-2 ${severityCounts.critical > 0
                            ? 'bg-red-50 border-red-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-600 uppercase">Critical</span>
                            <span className={`text-2xl font-bold ${severityCounts.critical > 0 ? 'text-red-600' : 'text-gray-400'
                                }`}>
                                {severityCounts.critical}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                                className="bg-red-600 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: severityCounts.critical > 0 ? '100%' : '0%' }}
                            />
                        </div>
                    </div>
                </div>

                {/* High */}
                <div className="relative">
                    <div className={`rounded-lg p-4 border-2 ${severityCounts.high > 0
                            ? 'bg-orange-50 border-orange-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-600 uppercase">High</span>
                            <span className={`text-2xl font-bold ${severityCounts.high > 0 ? 'text-orange-600' : 'text-gray-400'
                                }`}>
                                {severityCounts.high}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                                className="bg-orange-600 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: severityCounts.high > 0 ? '100%' : '0%' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Medium */}
                <div className="relative">
                    <div className={`rounded-lg p-4 border-2 ${severityCounts.medium > 0
                            ? 'bg-yellow-50 border-yellow-200'
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-600 uppercase">Medium</span>
                            <span className={`text-2xl font-bold ${severityCounts.medium > 0 ? 'text-yellow-600' : 'text-gray-400'
                                }`}>
                                {severityCounts.medium}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                                className="bg-yellow-600 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: severityCounts.medium > 0 ? '100%' : '0%' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Low */}
                <div className="relative">
                    <div className={`rounded-lg p-4 border-2 ${severityCounts.low > 0
                            ? 'bg-gray-100 border-gray-300'
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-600 uppercase">Low</span>
                            <span className={`text-2xl font-bold ${severityCounts.low > 0 ? 'text-gray-700' : 'text-gray-400'
                                }`}>
                                {severityCounts.low}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                                className="bg-gray-600 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: severityCounts.low > 0 ? '50%' : '0%' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    {totalCriticalAndHigh > 0 ? (
                        <span className="text-red-600 font-medium">
                            ⚠️ {totalCriticalAndHigh} critical/high severity {totalCriticalAndHigh === 1 ? 'issue' : 'issues'} found
                        </span>
                    ) : (
                        <span className="text-green-600 font-medium">
                            ✓ No critical or high severity issues found
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {onExport && (
                        <button
                            onClick={onExport}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export Report
                        </button>
                    )}
                    {onShare && (
                        <button
                            onClick={onShare}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            Share Results
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
