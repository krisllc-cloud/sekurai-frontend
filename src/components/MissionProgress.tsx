/**
 * MissionProgress - 5 Phase Progress Indicator
 * 
 * Shows mission progress through 5 phases:
 * - Discovery: Crawl, endpoints, forms, tech detection
 * - Analysis: AI classification & attack strategy
 * - Attack: Injection tests, config audit
 * - Validate: Confirm findings autonomously
 * - Complete: Mission finished
 * 
 * No percentages - just phase status (pending/active/done).
 * This is an agentic-first design - the AI decides, user observes.
 */

"use client";

import React from "react";

// 6 Phase definitions (Discovery → Analysis → Attack → Validate → Report → Complete)
export const MISSION_PHASES = [
    { id: "discovery", label: "Discovery", icon: "🔍", status: "DISCOVERY" },
    { id: "analysis", label: "Analysis", icon: "🧠", status: "ANALYSIS" },
    { id: "attack", label: "Attack", icon: "⚡", status: "ATTACK" },
    { id: "validate", label: "Validate", icon: "✓", status: "VALIDATION" },
    { id: "report", label: "Report", icon: "📄", status: "REPORTING" },
    { id: "complete", label: "Complete", icon: "🏁", status: "COMPLETED" },
];

interface MissionProgressProps {
    status: string;
    currentPhase?: string;  // Legacy prop, not used but accepted for compatibility
    data?: any;             // Legacy prop, not used but accepted for compatibility
}

// Get phase state from mission status
function getPhaseState(phaseStatus: string, missionStatus: string): "pending" | "active" | "done" {
    const statusOrder = ["DISCOVERY", "ANALYSIS", "ATTACK", "VALIDATION", "REPORTING", "COMPLETED"];
    const phaseIndex = statusOrder.indexOf(phaseStatus === "COMPLETED" ? "COMPLETED" : phaseStatus);
    const missionIndex = statusOrder.indexOf(missionStatus);

    // Handle REPORTING as part of COMPLETED phase
    if (phaseStatus === "COMPLETED" && (missionStatus === "REPORTING" || missionStatus === "COMPLETED")) {
        return missionStatus === "COMPLETED" ? "done" : "active";
    }

    if (missionStatus === "FAILED") {
        return phaseIndex < missionIndex ? "done" : "pending";
    }

    if (missionIndex > phaseIndex) return "done";
    if (missionIndex === phaseIndex) return "active";
    return "pending";
}

// Phase indicator component
function PhaseIndicator({
    icon,
    label,
    state
}: {
    icon: string;
    label: string;
    state: "pending" | "active" | "done";
}) {
    const size = 52;

    return (
        <div className="flex flex-col items-center gap-1.5">
            <div
                className={`
                    relative flex items-center justify-center rounded-full text-lg transition-all duration-300
                    ${state === "done"
                        ? "bg-green-100 text-green-600 ring-2 ring-green-500/30"
                        : state === "active"
                            ? "bg-cyan-100 text-cyan-600 ring-2 ring-cyan-500/30"
                            : "bg-gray-100 text-gray-400"
                    }
                `}
                style={{ width: size, height: size }}
            >
                {state === "done" ? "✓" : icon}

                {/* Active pulse animation */}
                {state === "active" && (
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping" />
                )}
            </div>

            {/* Label */}
            <span className={`text-xs font-medium ${state === "done" ? "text-green-600" :
                state === "active" ? "text-cyan-600" :
                    "text-gray-500"
                }`}>
                {label}
            </span>
        </div>
    );
}

// Connector line between phases
function PhaseConnector({ leftDone, rightActive }: { leftDone: boolean; rightActive: boolean }) {
    return (
        <div className="flex-1 h-0.5 mx-1 relative overflow-hidden">
            <div className={`absolute inset-0 transition-colors duration-300 ${leftDone ? "bg-green-400" : "bg-gray-200"
                }`} />
            {rightActive && (
                <div className="absolute inset-0">
                    <div className="h-full w-1/2 bg-gradient-to-r from-green-400 to-cyan-400 animate-pulse" />
                </div>
            )}
        </div>
    );
}

export function MissionProgress({ status }: MissionProgressProps) {
    const phases = MISSION_PHASES.map(phase => ({
        ...phase,
        state: getPhaseState(phase.status, status)
    }));

    // Determine if mission is failed
    const isFailed = status === "FAILED";

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">Mission Progress</h3>
                {isFailed && (
                    <span className="bg-red-100 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        Failed
                    </span>
                )}
                {status === "COMPLETED" && (
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        Complete
                    </span>
                )}
            </div>

            {/* Phase indicators with connectors */}
            <div className="flex items-center">
                {phases.map((phase, index) => (
                    <React.Fragment key={phase.id}>
                        <PhaseIndicator
                            icon={phase.icon}
                            label={phase.label}
                            state={isFailed && phases[index].state === "active" ? "pending" : phase.state}
                        />
                        {index < phases.length - 1 && (
                            <PhaseConnector
                                leftDone={phase.state === "done"}
                                rightActive={phases[index + 1].state === "active"}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default MissionProgress;
