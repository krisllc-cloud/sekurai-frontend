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
 * Hook to fetch a single mission
 */
export function useMission(id: string) {
    const { getToken } = useAuth();
    const [mission, setMission] = useState<Mission | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMission() {
            try {
                setLoading(true);
                const token = await getToken();
                if (!token) {
                    throw new Error("Not authenticated");
                }

                const data = await missionsAPI.get(id, token);
                setMission(data.mission);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch mission");
                setMission(null);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchMission();
        }
    }, [id, getToken]);

    return { mission, loading, error };
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
 * Hook to fetch mission findings from memory store
 */
export function useMissionFindings(missionId: string) {
    const { getToken } = useAuth();
    const [findings, setFindings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchFindings() {
            try {
                setLoading(true);
                const token = await getToken();
                if (!token) {
                    throw new Error("Not authenticated");
                }

                const data = await memoryAPI.getFindings(missionId, token);
                setFindings(data.findings || []);
                setError(null);
            } catch (err) {
                // Fallback silently - findings might not exist yet
                setFindings([]);
                setError(null);
            } finally {
                setLoading(false);
            }
        }

        if (missionId) {
            fetchFindings();
        }
    }, [missionId, getToken]);

    return { findings, loading, error, refetch: () => { } };
}

/**
 * Hook for WebSocket connection to mission updates
 */
export function useMissionUpdates(missionId: string) {
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        if (!missionId) return;

        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";
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
