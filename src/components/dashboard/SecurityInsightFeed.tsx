"use client";

import { useEffect, useRef } from "react";

interface InsightEvent {
    timestamp: string;
    type: string;
    agent: string;
    data: {
        thought?: string;
        model?: string;
        cost?: number;
        tokens?: number;
        endpoint?: string;
        [key: string]: any;
    };
}

interface SecurityInsightFeedProps {
    events: InsightEvent[];
}

export function SecurityInsightFeed({ events }: SecurityInsightFeedProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new events
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [events]);

    const formatTime = (isoString: string) => {
        try {
            return new Date(isoString).toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch {
            return isoString;
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Intelligence Feed
                </h3>
                <span className="text-xs text-gray-500 font-mono">
                    {events.length} events
                </span>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm"
            >
                {events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <p>Waiting for agent signals...</p>
                    </div>
                ) : (
                    events.map((event, i) => (
                        <div key={i} className="flex gap-3 group animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Timestamp */}
                            <div className="shrink-0 text-gray-400 text-xs py-0.5 w-16">
                                {formatTime(event.timestamp)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${event.agent === 'IDOR' ? 'bg-red-100 text-red-700' :
                                            event.agent === 'SQLi' ? 'bg-orange-100 text-orange-700' :
                                                event.agent === 'Discovery' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-purple-100 text-purple-700'
                                        }`}>
                                        {event.agent}
                                    </span>

                                    {event.data.model && (
                                        <span className="text-[10px] text-gray-400 border border-gray-200 rounded px-1">
                                            {event.data.model}
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-700 leading-relaxed break-words">
                                    {event.data.thought || JSON.stringify(event.data)}
                                </p>

                                {event.data.endpoint && (
                                    <div className="mt-1 flex items-center gap-1 text-xs text-blue-600">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                        <span className="truncate max-w-[300px]">{event.data.endpoint}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
