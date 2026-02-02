"use client";

import { useState } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function LandingHero() {
    const [targetUrl, setTargetUrl] = useState("");
    const [isLaunching, setIsLaunching] = useState(false);
    const { user } = useUser();

    const handleLaunchMission = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetUrl) return;

        setIsLaunching(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/missions/start`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        target_url: targetUrl,
                        user_id: user?.id,
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                // Redirect to mission page
                window.location.href = `/dashboard/missions/${data.mission_id}`;
            }
        } catch (error) {
            console.error("Failed to launch mission:", error);
        } finally {
            setIsLaunching(false);
        }
    };

    return (
        <section className="pt-32 pb-20 px-6">
            <div className="max-w-5xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                    All Agents Ready
                </div>

                {/* Heading */}
                <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                    <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        AGENTIC
                    </span>
                    <br />
                    <span className="text-gray-900">Offensive Security</span>
                </h1>

                {/* Subheading */}
                <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                    Autonomous security testing powered by intelligent agents. Discover
                    vulnerabilities before attackers do.
                </p>

                {/* Mission Launcher / CTA */}
                <SignedIn>
                    <form onSubmit={handleLaunchMission} className="max-w-2xl mx-auto mb-8">
                        <div className="flex gap-3">
                            <input
                                type="url"
                                value={targetUrl}
                                onChange={(e) => setTargetUrl(e.target.value)}
                                placeholder="https://example.com"
                                className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-gray-900 placeholder-gray-400"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isLaunching || !targetUrl}
                                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLaunching ? "Launching..." : "Launch Mission →"}
                            </button>
                        </div>
                    </form>
                </SignedIn>

                <SignedOut>
                    <div className="flex gap-4 justify-center mb-8">
                        <Link
                            href="/sign-up"
                            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Get Started Free →
                        </Link>
                        <Link
                            href="/sign-in"
                            className="px-8 py-4 border-2 border-gray-300 hover:border-purple-600 text-gray-700 font-medium rounded-lg transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                </SignedOut>

                {/* Capabilities */}
                <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600">
                    <span className="px-4 py-2 bg-gray-100 rounded-full">
                        📊 Business Logic Abuse
                    </span>
                    <span className="px-4 py-2 bg-gray-100 rounded-full">
                        💉 SQL + XSS + SSRF
                    </span>
                    <span className="px-4 py-2 bg-gray-100 rounded-full">
                        ⏱️ Real-time Reports
                    </span>
                    <span className="px-4 py-2 bg-gray-100 rounded-full">
                        🔍 BOR Attacks
                    </span>
                </div>
            </div>
        </section>
    );
}
