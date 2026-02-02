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

    // Fetch real stats from API
    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/public/stats/platform`
                );
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch platform stats:", error);
            }
        }
        fetchStats();
    }, []);

    // Animate counters
    useEffect(() => {
        const duration = 2000; // 2 seconds
        const steps = 60; // 60 fps
        const stepDuration = duration / steps;

        const counters = [
            { key: "total_missions" as keyof PlatformStats, target: stats.total_missions },
            { key: "total_endpoints" as keyof PlatformStats, target: stats.total_endpoints },
            { key: "total_payloads" as keyof PlatformStats, target: stats.total_payloads },
            { key: "total_vulnerabilities" as keyof PlatformStats, target: stats.total_vulnerabilities },
        ];

        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep++;
            const progress = Math.min(currentStep / steps, 1);

            // Easing function (ease-out)
            const eased = 1 - Math.pow(1 - progress, 3);

            setDisplayStats({
                total_missions: Math.floor(stats.total_missions * eased),
                total_endpoints: Math.floor(stats.total_endpoints * eased),
                total_payloads: Math.floor(stats.total_payloads * eased),
                total_vulnerabilities: Math.floor(stats.total_vulnerabilities * eased),
            });

            if (progress >= 1) {
                clearInterval(interval);
            }
        }, stepDuration);

        return () => clearInterval(interval);
    }, [stats]);

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    return (
        <section className="py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Missions Completed */}
                    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-purple-600"
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
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {formatNumber(displayStats.total_missions)}
                        </div>
                        <div className="text-sm text-gray-600">Missions Completed</div>
                    </div>

                    {/* Endpoints Scanned */}
                    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-cyan-600"
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
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {formatNumber(displayStats.total_endpoints)}
                        </div>
                        <div className="text-sm text-gray-600">Endpoints Scanned</div>
                    </div>

                    {/* Payloads Tested */}
                    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-blue-600"
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
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {formatNumber(displayStats.total_payloads)}
                        </div>
                        <div className="text-sm text-gray-600">Payloads Tested</div>
                    </div>

                    {/* Vulnerabilities Found */}
                    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-red-600"
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
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {formatNumber(displayStats.total_vulnerabilities)}
                        </div>
                        <div className="text-sm text-gray-600">Vulnerabilities Found</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
