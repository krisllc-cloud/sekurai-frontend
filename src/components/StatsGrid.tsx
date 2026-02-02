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
        <section className="px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Missions Completed */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg
                                    className="w-6 h-6 text-purple-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                            {formatNumber(displayStats.total_missions)}
                        </div>
                        <div className="text-sm text-gray-400">Missions Completed</div>
                    </div>

                    {/* Endpoints Scanned */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg
                                    className="w-6 h-6 text-cyan-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                            {formatNumber(displayStats.total_endpoints)}
                        </div>
                        <div className="text-sm text-gray-400">Endpoints Scanned</div>
                    </div>

                    {/* Payloads Tested */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg
                                    className="w-6 h-6 text-blue-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                            {formatNumber(displayStats.total_payloads)}
                        </div>
                        <div className="text-sm text-gray-400">Payloads Tested</div>
                    </div>

                    {/* Vulnerabilities Found */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg
                                    className="w-6 h-6 text-red-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                            {formatNumber(displayStats.total_vulnerabilities)}
                        </div>
                        <div className="text-sm text-gray-400">Vulnerabilities Found</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
