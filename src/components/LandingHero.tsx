"use client";

import { useState } from "react";
import { SignedIn, SignedOut, useUser, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function LandingHero() {
    const [targetUrl, setTargetUrl] = useState("");
    const [isLaunching, setIsLaunching] = useState(false);
    const { user, isLoaded, isSignedIn } = useUser();
    const { getToken } = useAuth(); // Need this for backend auth

    const handleLaunchMission = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetUrl) return;

        // If not signed in, redirect to sign up with the target URL in state
        if (!isSignedIn) {
            window.location.href = `/sign-up?redirect_url=${encodeURIComponent(window.location.origin + '/dashboard')}#launch=${encodeURIComponent(targetUrl)}`;
            return;
        }

        setIsLaunching(true);
        try {
            const token = await getToken();
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/missions`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        target_url: targetUrl,
                        config: {}
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                // Check for data.mission.id based on backend response: {"status": "created", "mission": mission}
                const missionId = data.mission?.id;
                if (missionId) {
                    window.location.href = `/dashboard/missions/${missionId}`;
                } else {
                    console.error("No mission ID in response", data);
                }
            } else {
                const errorData = await response.json();
                console.error("Launch failed:", errorData);
            }
        } catch (error) {
            console.error("Failed to launch mission:", error);
        } finally {
            setIsLaunching(false);
        }
    };

    return (
        <section className="pt-40 pb-32 px-6">
            <div className="max-w-5xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-10 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                    All Agents Ready
                </div>

                {/* Heading */}
                <h1 className="text-5xl md:text-8xl font-bold leading-tight mb-8 tracking-tight">
                    <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl">
                        AGENTIC
                    </span>
                    <br />
                    <span className="text-white">Offensive Security</span>
                </h1>

                {/* Subheading */}
                <p className="text-xl md:text-2xl text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed">
                    Autonomous security testing powered by intelligent agents. Discover
                    vulnerabilities before attackers do.
                </p>

                {/* Mission Launcher - Visible to everyone */}
                <div className="max-w-2xl mx-auto mb-16 relative z-10">
                    <form onSubmit={handleLaunchMission}>
                        <div className="flex flex-col md:flex-row gap-4 p-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
                            <input
                                type="url"
                                value={targetUrl}
                                onChange={(e) => setTargetUrl(e.target.value)}
                                placeholder="https://example.com"
                                className="flex-1 px-6 py-4 rounded-xl bg-transparent border-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder-gray-500 font-medium"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isLaunching || !targetUrl}
                                className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {isLaunching ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Initializing...
                                    </span>
                                ) : "Launch Mission →"}
                            </button>
                        </div>
                        {isLoaded && !isSignedIn && (
                            <p className="text-sm text-gray-500 mt-3">
                                Sign in required to save and track missions
                            </p>
                        )}
                    </form>
                </div>

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
