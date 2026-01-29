'use client';

import { useEffect, useRef } from 'react';

interface Node {
    id: string;
    label: string;
    x: number;
    y: number;
    color: string;
    glowColor: string;
    size: number;
    pulseDelay: number;
}

interface Connection {
    from: string;
    to: string;
    active: boolean;
}

export default function AgenticNetwork() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const nodes: Node[] = [
        { id: 'discovery', label: 'Discovery', x: 50, y: 25, color: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.5)', size: 28, pulseDelay: 0 },
        { id: 'sqli', label: 'SQLi', x: 18, y: 55, color: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.5)', size: 20, pulseDelay: 0.5 },
        { id: 'xss', label: 'XSS', x: 42, y: 60, color: '#ef4444', glowColor: 'rgba(239, 68, 68, 0.5)', size: 20, pulseDelay: 1 },
        { id: 'idor', label: 'IDOR', x: 72, y: 50, color: '#8b5cf6', glowColor: 'rgba(139, 92, 246, 0.5)', size: 20, pulseDelay: 1.5 },
        { id: 'ssrf', label: 'SSRF', x: 85, y: 75, color: '#06b6d4', glowColor: 'rgba(6, 182, 212, 0.5)', size: 18, pulseDelay: 2 },
        { id: 'chain', label: 'Chain', x: 50, y: 88, color: '#22c55e', glowColor: 'rgba(34, 197, 94, 0.5)', size: 24, pulseDelay: 2.5 },
    ];

    const connections: Connection[] = [
        { from: 'discovery', to: 'sqli', active: true },
        { from: 'discovery', to: 'xss', active: true },
        { from: 'discovery', to: 'idor', active: true },
        { from: 'sqli', to: 'chain', active: false },
        { from: 'xss', to: 'chain', active: false },
        { from: 'idor', to: 'ssrf', active: true },
        { from: 'ssrf', to: 'chain', active: false },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const updateSize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * 2;
            canvas.height = rect.height * 2;
            ctx.scale(2, 2);
        };
        updateSize();

        let animationFrame: number;
        let time = 0;

        const draw = () => {
            const width = canvas.width / 2;
            const height = canvas.height / 2;

            ctx.clearRect(0, 0, width, height);

            // Draw connections
            connections.forEach((conn) => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return;

                const x1 = (fromNode.x / 100) * width;
                const y1 = (fromNode.y / 100) * height;
                const x2 = (toNode.x / 100) * width;
                const y2 = (toNode.y / 100) * height;

                const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
                gradient.addColorStop(0, fromNode.color + '40');
                gradient.addColorStop(1, toNode.color + '40');

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.stroke();

                if (conn.active) {
                    const progress = (time * 0.4) % 1;
                    const px = x1 + (x2 - x1) * progress;
                    const py = y1 + (y2 - y1) * progress;

                    ctx.beginPath();
                    ctx.arc(px, py, 5, 0, Math.PI * 2);
                    ctx.fillStyle = fromNode.color;
                    ctx.fill();
                }
            });

            // Draw nodes
            nodes.forEach((node) => {
                const x = (node.x / 100) * width;
                const y = (node.y / 100) * height;
                const pulseScale = 1 + Math.sin(time * 3 + node.pulseDelay) * 0.08;
                const radius = node.size * pulseScale;

                // Outer glow
                const glowGradient = ctx.createRadialGradient(x, y, radius * 0.5, x, y, radius * 2.5);
                glowGradient.addColorStop(0, node.glowColor);
                glowGradient.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.arc(x, y, radius * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = glowGradient;
                ctx.fill();

                // Node circle
                const gradient = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, 0, x, y, radius);
                gradient.addColorStop(0, node.color);
                gradient.addColorStop(1, node.color + 'dd');

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Border
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Label
                ctx.font = '600 11px system-ui, sans-serif';
                ctx.fillStyle = '#374151';
                ctx.textAlign = 'center';
                ctx.fillText(node.label, x, y + radius + 16);
            });

            time += 0.016;
            animationFrame = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    return (
        <div className="relative w-full h-[420px] glass-strong rounded-2xl overflow-hidden glow-blue">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 px-4 py-3 border-b border-gray-200/50 bg-white/60 backdrop-blur-sm flex items-center gap-2 z-10">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-gray-700 text-sm ml-2 font-medium">SekurAI Agent Network</span>
                <div className="ml-auto flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs text-green-600 font-semibold">6 Agents Active</span>
                </div>
            </div>

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                className="w-full h-full pt-12"
                style={{ display: 'block' }}
            />

            {/* Status overlays */}
            <div className="absolute bottom-4 left-4 glass rounded-lg px-3 py-2 text-xs">
                <span className="text-blue-600 font-semibold">Discovery</span>
                <span className="text-gray-500 ml-2">→ 47 endpoints</span>
            </div>

            <div className="absolute bottom-4 right-4 glass rounded-lg px-3 py-2 text-xs flex items-center gap-2">
                <span className="text-red-500 font-bold">3 CRITICAL</span>
                <span className="text-gray-400">|</span>
                <span className="text-orange-500 font-semibold">5 HIGH</span>
            </div>
        </div>
    );
}
