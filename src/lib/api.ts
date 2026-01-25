/**
 * API Client for SekurAI Backend
 * 
 * Connects to the FastAPI gateway using the Clerk JWT for authentication.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FetchOptions extends RequestInit {
    token?: string;
}

async function fetchAPI<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `API Error: ${response.status}`);
    }

    return response.json();
}

// Mission API
export const missionsAPI = {
    list: (token: string) =>
        fetchAPI<{ missions: Mission[] }>("/api/missions", { token }),

    get: (id: string, token: string) =>
        fetchAPI<{ mission: Mission }>(`/api/missions/${id}`, { token }),

    create: (data: CreateMissionRequest, token: string) =>
        fetchAPI<{ status: string; mission: Mission }>("/api/missions", {
            method: "POST",
            body: JSON.stringify(data),
            token,
        }),
};

// Memory API
export const memoryAPI = {
    getFindings: (missionId: string, token: string) =>
        fetchAPI<{ findings: Finding[] }>(`/api/memory/findings/${missionId}`, { token }),

    getEndpoints: (missionId: string, token: string) =>
        fetchAPI<{ endpoints: Endpoint[] }>(`/api/memory/endpoints/${missionId}`, { token }),

    getStats: (missionId: string, token: string) =>
        fetchAPI<{ stats: MissionStats }>(`/api/memory/stats/${missionId}`, { token }),
};

// LLM API
export const llmAPI = {
    health: () =>
        fetchAPI<{ status: string; providers: string[] }>("/api/llm/health"),
};

// Types
export interface Mission {
    id: string;
    target_url: string;
    status: string;
    phase: string;
    config: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

export interface CreateMissionRequest {
    target_url: string;
    config?: {
        mission_type?: string;
        enable_vision?: boolean;
        aggressive_mode?: boolean;
        include_subdomains?: boolean;
    };
}

export interface Finding {
    id: string;
    mission_id: string;
    vuln_type: string;
    severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
    confidence: "PROVEN" | "CONFIRMED" | "LIKELY" | "POTENTIAL";
    endpoint: string;
    payload: string;
    evidence: Record<string, unknown>;
    created_at: string;
}

export interface Endpoint {
    id: string;
    mission_id: string;
    url: string;
    method: string;
    parameters: string[];
    auth_required: boolean;
    tested: boolean;
}

export interface MissionStats {
    endpoints_discovered: number;
    endpoints_tested: number;
    findings_by_severity: Record<string, number>;
    credentials_found: number;
    sessions_active: number;
}
