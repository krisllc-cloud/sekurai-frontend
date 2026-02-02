"use client";

import { useEffect, useState } from "react";

interface PlatformStats {
    total_missions: number;
    total_endpoints: number;
    total_payloads: number;
    total_vulnerabilities: number;
}

export default function StatsGrid() {
    const [stats, setStats] = useState<PlatformStats>({
        total_missions: 0,
        total_endpoints: 0,
        total_payloads: 0,
        total_vulnerabilities: 0,
    });
    const [displayStats, setDisplayStats] = useState<PlatformStats>(stats);

    // Base stats to ensure platform looks active (User Request)
    const BASELINES = {
        total_missions: 115,
        total_endpoints: 8240,
        total_payloads: 58400,
        total_vulnerabilities: 2150
    };

    // Fetch real stats from API and add baselines
    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/public/stats/platform`
                );
                if (response.ok) {
                    const data = await response.json();
                    setStats({
                        total_missions: data.total_missions + BASELINES.total_missions,
                        total_endpoints: data.total_endpoints + BASELINES.total_endpoints,
                        total_payloads: data.total_payloads + BASELINES.total_payloads,
                        total_vulnerabilities: data.total_vulnerabilities + BASELINES.total_vulnerabilities,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch platform stats:", error);
                // Fallback to minimal baselines if API fails
                setStats(BASELINES);
            }
        }
        fetchStats();
    }, []);

    // Animate counters
    useEffect(() => {
        const duration = 2000; // 2 seconds
        const steps = 60; // 60 fps
        const stepDuration = duration / steps;

        // Start from 0 or previous display
        let currentIter = 0;

        const interval = setInterval(() => {
            currentIter++;
            const progress = Math.min(currentIter / steps, 1);

            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);

            setDisplayStats({
                total_missions: Math.floor(stats.total_missions * ease),
                total_endpoints: Math.floor(stats.total_endpoints * ease),
                total_payloads: Math.floor(stats.total_payloads * ease),
                total_vulnerabilities: Math.floor(stats.total_vulnerabilities * ease),
            });

            if (progress >= 1) clearInterval(interval);
        }, stepDuration);

        return () => clearInterval(interval);
    }, [stats]);

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(0)}K`; // Changed to fixed(0) for cleaner K look (8K vs 8.2K) unless large
        return num.toString();
    };

    return (
        <section className="py-20 px-6 relative z-10">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-wrap justify-center gap-x-16 gap-y-12 md:gap-x-24">
                    {/* Missions Completed */}
                    <div className="text-center group">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent mb-2">
                            {formatNumber(displayStats.total_missions)}
                        </div>
                        <div className="text-sm text-gray-500 uppercase tracking-wider font-medium">Missions</div>
                    </div>

                    {/* Endpoints Scanned */}
                    <div className="text-center group">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-600/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent mb-2">
                            {formatNumber(displayStats.total_endpoints)}
                        </div>
                        <div className="text-sm text-gray-500 uppercase tracking-wider font-medium">Endpoints</div>
                    </div>

                    {/* Payloads Tested */}
                    <div className="text-center group">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-2">
                            {formatNumber(displayStats.total_payloads)}
                        </div>
                        <div className="text-sm text-gray-500 uppercase tracking-wider font-medium">Payloads</div>
                    </div>

                    {/* Vulnerabilities Found */}
                    <div className="text-center group">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-300 bg-clip-text text-transparent mb-2">
                            {formatNumber(displayStats.total_vulnerabilities)}
                        </div>
                        <div className="text-sm text-gray-500 uppercase tracking-wider font-medium">Vulnerabilities</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
