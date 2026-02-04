"use client";

import { useEffect, useState } from "react";

interface AgentNode {
    id: string;
    x: number;
    y: number;
    status: 'idle' | 'active' | 'finding' | 'error';
    label: string;
}

interface NeuralActivityMapProps {
    activeAgents: { name: string; status: string }[];
    recentEvents: any[];
}

export function NeuralActivityMap({ activeAgents, recentEvents }: NeuralActivityMapProps) {
    const [nodes, setNodes] = useState<AgentNode[]>([]);
    const [links, setLinks] = useState<{ source: string, target: string }[]>([]);
    const [activePulses, setActivePulses] = useState<{ id: string, x: number, y: number }[]>([]);

    // Initialize nodes based on agents
    useEffect(() => {
        // Fixed positions for stability in this version
        const center = { x: 50, y: 50 };
        const radius = 35;

        const newNodes: AgentNode[] = [
            { id: 'core', x: 50, y: 50, status: 'active', label: 'Orchestrator' },
            ...activeAgents.map((agent, i) => {
                const angle = (i * (360 / activeAgents.length)) * (Math.PI / 180);
                return {
                    id: agent.name,
                    x: 50 + radius * Math.cos(angle),
                    y: 50 + radius * Math.sin(angle),
                    status: agent.status as any,
                    label: agent.name
                };
            })
        ];

        setNodes(newNodes);
        setLinks(newNodes.filter(n => n.id !== 'core').map(n => ({ source: 'core', target: n.id })));
    }, [activeAgents]);

    // Handle pulse effects on new events
    useEffect(() => {
        if (recentEvents.length > 0) {
            const latest = recentEvents[0]; // Most recent event
            const agentNode = nodes.find(n => n.id === latest.agent);

            if (agentNode) {
                // Trigger pulse at agent node
                const pulseId = Math.random().toString();
                setActivePulses(prev => [...prev, { id: pulseId, x: agentNode.x, y: agentNode.y }]);

                // Cleanup pulse after animation
                setTimeout(() => {
                    setActivePulses(prev => prev.filter(p => p.id !== pulseId));
                }, 1000);
            }
        }
    }, [recentEvents, nodes]);

    return (
        <div className="w-full h-full min-h-[300px] bg-slate-900 rounded-xl overflow-hidden relative border border-slate-800 shadow-inner">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                {/* Background Grid */}
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                </pattern>
                <rect width="100" height="100" fill="url(#grid)" />

                {/* Links */}
                {links.map((link, i) => {
                    const source = nodes.find(n => n.id === link.source);
                    const target = nodes.find(n => n.id === link.target);
                    if (!source || !target) return null;

                    return (
                        <line
                            key={i}
                            x1={source.x}
                            y1={source.y}
                            x2={target.x}
                            y2={target.y}
                            stroke="rgba(99, 102, 241, 0.2)"
                            strokeWidth="0.5"
                        />
                    );
                })}

                {/* Active Pulses */}
                {activePulses.map((pulse) => (
                    <circle
                        key={pulse.id}
                        cx={pulse.x}
                        cy={pulse.y}
                        r="2"
                        fill="none"
                        stroke="rgba(99, 102, 241, 0.8)"
                        strokeWidth="0.5"
                        className="animate-ping"
                    />
                ))}

                {/* Nodes */}
                {nodes.map((node) => (
                    <g key={node.id}>
                        {/* Glow effect for active nodes */}
                        {node.status === 'active' && (
                            <circle cx={node.x} cy={node.y} r="6" fill="rgba(99, 102, 241, 0.1)" className="animate-pulse" />
                        )}

                        {/* Node Body */}
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r="3"
                            fill={node.id === 'core' ? '#6366f1' : '#1e293b'}
                            stroke={
                                node.status === 'active' ? '#6366f1' :
                                    node.status === 'finding' ? '#ef4444' :
                                        '#475569'
                            }
                            strokeWidth="0.5"
                        />

                        {/* Label */}
                        <text
                            x={node.x}
                            y={node.y + 6}
                            textAnchor="middle"
                            fill={node.status === 'active' ? '#e2e8f0' : '#64748b'}
                            fontSize="3"
                            className="font-mono"
                        >
                            {node.label}
                        </text>
                    </g>
                ))}
            </svg>

            {/* Status Overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    Neural Link Active
                </div>
            </div>
        </div>
    );
}
