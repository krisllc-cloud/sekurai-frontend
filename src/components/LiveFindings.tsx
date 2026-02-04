"use client";

/**
 * LiveFindings - Autonomous Security Findings Display
 * 
 * Shows ONLY confirmed vulnerabilities - no percentages, no "maybe".
 * This is agentic-first: the AI decides, user observes.
 * 
 * If uncertainty exists, the agent automatically runs more tests.
 * Users only see binary results: it's a vulnerability or it isn't.
 */

interface LiveFindingsProps {
    confirmedVulns: any[];
    hypotheses?: any[]; // Not displayed, just for loading state
    missionStatus?: string; // Mission completion status
}

// Severity badge colors
const severityColors: Record<string, string> = {
    CRITICAL: "bg-red-600 text-white",
    HIGH: "bg-orange-500 text-white",
    MEDIUM: "bg-yellow-500 text-gray-900",
    LOW: "bg-blue-500 text-white",
    INFO: "bg-gray-500 text-white",
};

// Detection type to display name
const detectionDisplayNames: Record<string, string> = {
    "time_based": "Time-Based SQL Injection",
    "boolean_based": "Boolean-Based SQL Injection",
    "error_based": "Error-Based SQL Injection",
    "union_based": "UNION-Based SQL Injection",
    "sqli": "SQL Injection",
    "xss": "Cross-Site Scripting",
    "lfi": "Local File Inclusion",
    "rce": "Remote Code Execution",
};

export function LiveFindings({ confirmedVulns = [], hypotheses = [], missionStatus }: LiveFindingsProps) {
    // Only show scanning state if mission is actively working (not in terminal state)
    const isCompleted = missionStatus === 'COMPLETED' || missionStatus === 'FAILED';
    const isScanning = !isCompleted && hypotheses.length > 0 && confirmedVulns.length === 0;

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    Security Findings
                </h2>
                {confirmedVulns.length > 0 && (
                    <span className="bg-red-100 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        {confirmedVulns.length} confirmed
                    </span>
                )}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {/* Confirmed Vulnerabilities */}
                {confirmedVulns.length > 0 ? (
                    confirmedVulns.map((vuln: any, i: number) => {
                        const severity = vuln.severity || "CRITICAL";
                        const detectionType = vuln.detection_type?.replace(/_/g, ' ') || 'SQL Injection';
                        const displayName = detectionDisplayNames[vuln.detection_type] || detectionType;

                        return (
                            <div
                                key={i}
                                className="group relative rounded-xl p-4 transition-all duration-200
                                           bg-red-50 border border-red-200 hover:border-red-300 hover:shadow-sm"
                            >
                                {/* Content */}
                                <div className="relative">
                                    {/* Header Row */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide
                                                            ${severityColors[severity] || severityColors.CRITICAL}`}>
                                                {severity}
                                            </span>
                                            <span className="text-gray-900 font-medium text-sm">
                                                {displayName}
                                            </span>
                                        </div>
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium uppercase
                                                        bg-green-100 text-green-700">
                                            Confirmed
                                        </span>
                                    </div>

                                    {/* Target */}
                                    <div className="flex items-center gap-2 mb-3 text-xs">
                                        <span className={`px-1.5 py-0.5 rounded font-mono font-medium ${vuln.method === 'POST' ? 'bg-green-100 text-green-700' :
                                            vuln.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {vuln.method || 'POST'}
                                        </span>
                                        <span className="text-gray-600 font-mono truncate flex-1">
                                            {vuln.target_url}
                                        </span>
                                        {vuln.parameter && (
                                            <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-mono">
                                                {vuln.parameter}
                                            </span>
                                        )}
                                    </div>

                                    {/* Payload */}
                                    <div className="bg-gray-900 rounded-lg p-2.5">
                                        <code className="text-green-400 text-xs font-mono block truncate">
                                            {vuln.payload}
                                        </code>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : isScanning ? (
                    /* Scanning State - Agent is working */
                    <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                        <div className="relative w-16 h-16 mb-4">
                            {/* Outer pulse ring */}
                            <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-ping" style={{ animationDuration: '2s' }}></div>
                            {/* Inner spinning ring */}
                            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-blue-400 border-r-blue-400 animate-spin" style={{ animationDuration: '1.5s' }}></div>
                            {/* Center icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">Agent testing vulnerabilities...</p>
                        <p className="text-xs text-gray-400 mt-1">{hypotheses.length} hypotheses being validated</p>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                        <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <p className="text-sm text-gray-500 font-medium">No vulnerabilities found yet</p>
                        <p className="text-xs text-gray-400 mt-1">Findings will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
}
