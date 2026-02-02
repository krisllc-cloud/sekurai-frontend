"use client";

import { useEffect, useState, useRef } from "react";

interface AgentActivityEntry {
    timestamp: string;
    agent: string;
    message: string;
    type: 'info' | 'success' | 'error' | 'warning';
}

interface AgentActivityStreamProps {
    missionId: string;
    status: string;
    recentMessages?: any[];
    mission?: any;  // Full mission data with active_agents
}

export function AgentActivityStream({ missionId, status, recentMessages = [], mission }: AgentActivityStreamProps) {
    const [activities, setActivities] = useState<AgentActivityEntry[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Generate activity entries from mission status changes
    useEffect(() => {
        const statusActivities: AgentActivityEntry[] = [];
        const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

        if (status === 'DISCOVERY') {
            statusActivities.push({
                timestamp: now,
                agent: 'Discovery',
                message: 'Crawling target, extracting endpoints...',
                type: 'info'
            });
        } else if (status === 'ANALYSIS') {
            statusActivities.push({
                timestamp: now,
                agent: 'Analysis',
                message: 'AI classifying endpoints by risk...',
                type: 'info'
            });
        } else if (status === 'ATTACK') {
            // Dynamically show active attack agents from backend
            const activeAgents = mission?.active_agents || [];

            if (activeAgents.length > 0) {
                // Backend sends {name, message} objects - display them directly (zero hardcoding)
                activeAgents.forEach((agent: any) => {
                    statusActivities.push({
                        timestamp: now,
                        agent: agent.name || agent,  // Support both object and string format
                        message: agent.message || 'Testing vulnerabilities...',
                        type: 'warning'
                    });
                });
            } else {
                // Fallback if no active_agents data
                statusActivities.push({
                    timestamp: now,
                    agent: 'Attack',
                    message: 'Running security tests...',
                    type: 'warning'
                });
            }
        } else if (status === 'REPORTING') {
            statusActivities.push({
                timestamp: now,
                agent: 'Report',
                message: 'Generating security report...',
                type: 'success'
            });
        }

        setActivities(prev => {
            const newActivities = [...statusActivities, ...prev];
            const seen = new Set();
            return newActivities.filter(a => {
                const key = `${a.agent}-${a.message}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            }).slice(0, 50);
        });
    }, [status]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [activities]);

    const isActive = ['DISCOVERY', 'ANALYSIS', 'ATTACK'].includes(status);

    const getAgentBadgeStyle = (agent: string) => {
        const styles: Record<string, string> = {
            'Discovery': 'bg-blue-100 text-blue-700',
            'Analysis': 'bg-purple-100 text-purple-700',
            'SQLi': 'bg-red-100 text-red-700',
            'XSS': 'bg-orange-100 text-orange-700',
            'CMDI': 'bg-yellow-100 text-yellow-700',
            'SSRF': 'bg-pink-100 text-pink-700',
            'Report': 'bg-green-100 text-green-700',
            'Attack': 'bg-amber-100 text-amber-700',
        };
        return styles[agent] || 'bg-gray-100 text-gray-700';
    };

    const getMessageStyle = (type: string) => {
        const styles: Record<string, string> = {
            'success': 'text-green-700',
            'error': 'text-red-700',
            'warning': 'text-amber-700',
            'info': 'text-gray-600',
        };
        return styles[type] || 'text-gray-600';
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    Agent Activity
                </h2>
                {isActive && (
                    <span className="flex items-center gap-1.5 text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Live
                    </span>
                )}
            </div>

            {/* Activity Stream */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto rounded-xl bg-gray-50 border border-gray-200 p-3 space-y-2"
            >
                {activities.length > 0 ? (
                    activities.map((activity, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-100 transition-colors group"
                        >
                            <span className="text-[10px] text-gray-400 font-mono shrink-0 pt-0.5 tabular-nums">
                                {activity.timestamp}
                            </span>
                            <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium ${getAgentBadgeStyle(activity.agent)}`}>
                                {activity.agent}
                            </span>
                            <span className={`text-xs ${getMessageStyle(activity.type)} leading-relaxed`}>
                                {activity.message}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-xs text-gray-500">Waiting for agent activity...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
