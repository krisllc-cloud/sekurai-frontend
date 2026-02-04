"use client";

/**
 * React hooks for SekurAI API calls
 * 
 * Automatically handles Clerk authentication tokens.
 */

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { missionsAPI, memoryAPI, type Mission, type MissionStats } from "./api";

/**
 * Hook to fetch missions list
 */
export function useMissions() {
    const { getToken } = useAuth();
    const [missions, setMissions] = useState<Mission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMissions() {
            try {
                setLoading(true);
                const token = await getToken();
                if (!token) {
                    throw new Error("Not authenticated");
                }

                const data = await missionsAPI.list(token);
                setMissions(data.missions);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch missions");
                setMissions([]);
            } finally {
                setLoading(false);
            }
        }

        fetchMissions();
    }, [getToken]);

    return { missions, loading, error };
}

/**
 * Hook to fetch a single mission with auto-refresh for active missions
 * Polls every 5 seconds when mission is in DISCOVERY or EXPLOITATION status
 */
export function useMission(id: string) {
    const { getToken } = useAuth();
    const [mission, setMission] = useState<Mission | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchMission = async (showLoading = false) => {
        try {
            if (showLoading) setLoading(true);
            else setIsRefreshing(true);

            const token = await getToken();
            if (!token) {
                throw new Error("Not authenticated");
            }

            const data = await missionsAPI.get(id, token);
            setMission(data.mission);
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch mission");
            setMission(null);
        } finally {
            if (showLoading) setLoading(false);
            setIsRefreshing(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        if (id) {
            fetchMission(true);
        }
    }, [id, getToken]);

    // Auto-refresh for active missions (every 5 seconds)
    useEffect(() => {
        if (!mission) return;

        const isActive = ['DISCOVERY', 'EXPLOITATION', 'PENDING', 'RUNNING'].includes(mission.status);
        if (!isActive) return;

        const intervalId = setInterval(() => {
            fetchMission(false); // Don't show loading spinner on refresh
        }, 5000);

        return () => clearInterval(intervalId);
    }, [mission?.status, id, getToken]);

    // Manual refresh function
    const refresh = () => fetchMission(false);

    return { mission, loading, error, refresh, isRefreshing, lastUpdated };
}

/**
 * Hook to fetch mission stats
 */
export function useMissionStats(missionId: string) {
    const { getToken } = useAuth();
    const [stats, setStats] = useState<MissionStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                setLoading(true);
                const token = await getToken();
                if (!token) {
                    throw new Error("Not authenticated");
                }

                const data = await memoryAPI.getStats(missionId, token);
                setStats(data.stats);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch stats");
                setStats(null);
            } finally {
                setLoading(false);
            }
        }

        if (missionId) {
            fetchStats();
        }
    }, [missionId, getToken]);

    return { stats, loading, error };
}

/**
 * Hook for WebSocket connection to mission updates
 */
export function useMissionUpdates(missionId: string) {
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        if (!missionId) return;

        // Derive WebSocket URL from API URL
        // Convert http://api.example.com to wss://api.example.com (or ws:// for localhost)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
            console.error("NEXT_PUBLIC_API_URL environment variable is not set");
            return;
        }

        let wsUrl: string;
        if (apiUrl.startsWith("https://")) {
            wsUrl = apiUrl.replace("https://", "wss://");
        } else if (apiUrl.startsWith("http://")) {
            wsUrl = apiUrl.replace("http://", "ws://");
        } else {
            wsUrl = `wss://${apiUrl}`;
        }

        const ws = new WebSocket(`${wsUrl}/ws/missions/${missionId}`);

        ws.onopen = () => {
            setConnected(true);
            console.log(`Connected to mission ${missionId}`);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages(prev => [...prev, data]);
        };

        ws.onclose = () => {
            setConnected(false);
            console.log(`Disconnected from mission ${missionId}`);
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        // Ping every 30s to keep connection alive
        const pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send("ping");
            }
        }, 30000);

        return () => {
            clearInterval(pingInterval);
            ws.close();
        };
    }, [missionId]);

    return { connected, messages };
}

/**
 * Hook for Real-time Dashboard Stream (Neural Activity & Insights)
 * Connects to /ws/mission/{missionId}/dashboard
 */
export function useDashboardStream(missionId: string) {
    const [connected, setConnected] = useState(false);
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        if (!missionId) return;

        // Derive WebSocket URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
            console.error("NEXT_PUBLIC_API_URL environment variable is not set - cannot connect to dashboard stream");
            return;
        }

        let wsUrl: string;

        // Handle conversion from http/https to ws/wss
        if (apiUrl.startsWith("https://")) {
            wsUrl = apiUrl.replace("https://", "wss://");
        } else if (apiUrl.startsWith("http://")) {
            wsUrl = apiUrl.replace("http://", "ws://");
        } else {
            // If just domain is provided
            wsUrl = `ws://${apiUrl}`;
        }

        // Remove /api suffix if present to prevent double path
        wsUrl = wsUrl.replace(/\/api$/, "");

        const ws = new WebSocket(`${wsUrl}/ws/mission/${missionId}/dashboard`);

        ws.onopen = () => {
            setConnected(true);
            console.log(`Connected to dashboard stream for ${missionId}`);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // Add to events list
                setEvents(prev => [...prev, data].slice(-50)); // Keep last 50
            } catch (e) {
                console.error("Failed to parse dashboard event", e);
            }
        };

        ws.onclose = () => {
            setConnected(false);
            // console.log(`Disconnected from dashboard stream ${missionId}`);
        };

        ws.onerror = (error) => {
            console.error("Dashboard WebSocket error:", error);
        };

        // Ping intervals
        const pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send("ping");
            }
        }, 30000);

        return () => {
            clearInterval(pingInterval);
            ws.close();
        };
    }, [missionId]);

    // Function to set initial history (e.g. from REST API)
    const setHistory = (history: any[]) => {
        setEvents(history);
    };

    return { connected, events, setHistory };
}
