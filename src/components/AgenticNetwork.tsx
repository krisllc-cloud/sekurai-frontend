'use client';

import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: string;
    size: number;
}

interface Node {
    id: string;
    label: string;
    x: number;
    y: number;
    color: string;
    size: number;
    pulsePhase: number;
    orbitAngle: number;
}

interface Connection {
    from: string;
    to: string;
    particles: { progress: number; speed: number }[];
}

export default function AgenticNetwork() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size with retina support
        const updateSize = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        };
        updateSize();

        // Nodes configuration
        const nodes: Node[] = [
            { id: 'core', label: 'SekurAI Core', x: 50, y: 50, color: '#3b82f6', size: 35, pulsePhase: 0, orbitAngle: 0 },
            { id: 'discovery', label: 'Discovery', x: 25, y: 30, color: '#06b6d4', size: 22, pulsePhase: 1, orbitAngle: 0 },
            { id: 'sqli', label: 'SQLi', x: 75, y: 25, color: '#f59e0b', size: 20, pulsePhase: 2, orbitAngle: 0 },
            { id: 'xss', label: 'XSS', x: 82, y: 55, color: '#ef4444', size: 20, pulsePhase: 3, orbitAngle: 0 },
            { id: 'idor', label: 'IDOR', x: 70, y: 80, color: '#8b5cf6', size: 18, pulsePhase: 4, orbitAngle: 0 },
            { id: 'ssrf', label: 'SSRF', x: 30, y: 75, color: '#10b981', size: 18, pulsePhase: 5, orbitAngle: 0 },
        ];

        // Connections with flowing particles
        const connections: Connection[] = [
            { from: 'core', to: 'discovery', particles: [{ progress: 0, speed: 0.008 }, { progress: 0.5, speed: 0.006 }] },
            { from: 'core', to: 'sqli', particles: [{ progress: 0.3, speed: 0.007 }] },
            { from: 'core', to: 'xss', particles: [{ progress: 0.6, speed: 0.009 }] },
            { from: 'core', to: 'idor', particles: [{ progress: 0.2, speed: 0.006 }] },
            { from: 'core', to: 'ssrf', particles: [{ progress: 0.8, speed: 0.007 }] },
            { from: 'discovery', to: 'sqli', particles: [{ progress: 0.4, speed: 0.005 }] },
            { from: 'discovery', to: 'xss', particles: [{ progress: 0.1, speed: 0.004 }] },
        ];

        // Background particles for ambient effect
        const bgParticles: Particle[] = [];
        for (let i = 0; i < 30; i++) {
            bgParticles.push({
                x: Math.random() * 100,
                y: Math.random() * 100,
                vx: (Math.random() - 0.5) * 0.1,
                vy: (Math.random() - 0.5) * 0.1,
                life: Math.random() * 100,
                maxLife: 100 + Math.random() * 100,
                color: ['#3b82f6', '#06b6d4', '#8b5cf6'][Math.floor(Math.random() * 3)],
                size: 1 + Math.random() * 2,
            });
        }

        let animationFrame: number;
        let time = 0;

        const draw = () => {
            const width = canvas.width / (window.devicePixelRatio || 1);
            const height = canvas.height / (window.devicePixelRatio || 1);

            // Clear with subtle gradient
            const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
            bgGradient.addColorStop(0, 'rgba(248, 250, 252, 1)');
            bgGradient.addColorStop(1, 'rgba(241, 245, 249, 1)');
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);

            // Draw ambient particles
            bgParticles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.life += 1;

                if (p.life > p.maxLife || p.x < 0 || p.x > 100 || p.y < 0 || p.y > 100) {
                    p.x = Math.random() * 100;
                    p.y = Math.random() * 100;
                    p.life = 0;
                }

                const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.3;
                const px = (p.x / 100) * width;
                const py = (p.y / 100) * height;

                ctx.beginPath();
                ctx.arc(px, py, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
                ctx.fill();
            });

            // Draw connections with glowing effect
            connections.forEach((conn) => {
                const fromNode = nodes.find(n => n.id === conn.from);
                const toNode = nodes.find(n => n.id === conn.to);
                if (!fromNode || !toNode) return;

                const x1 = (fromNode.x / 100) * width;
                const y1 = (fromNode.y / 100) * height;
                const x2 = (toNode.x / 100) * width;
                const y2 = (toNode.y / 100) * height;

                // Glowing line
                for (let i = 3; i >= 0; i--) {
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 - i * 0.02})`;
                    ctx.lineWidth = 1 + i * 2;
                    ctx.stroke();
                }

                // Core line
                const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
                gradient.addColorStop(0, fromNode.color + '80');
                gradient.addColorStop(1, toNode.color + '80');
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.stroke();

                // Animated particles along connection
                conn.particles.forEach((particle) => {
                    particle.progress += particle.speed;
                    if (particle.progress > 1) particle.progress = 0;

                    const px = x1 + (x2 - x1) * particle.progress;
                    const py = y1 + (y2 - y1) * particle.progress;

                    // Particle glow
                    const glow = ctx.createRadialGradient(px, py, 0, px, py, 12);
                    glow.addColorStop(0, fromNode.color);
                    glow.addColorStop(0.5, fromNode.color + '40');
                    glow.addColorStop(1, 'transparent');
                    ctx.beginPath();
                    ctx.arc(px, py, 12, 0, Math.PI * 2);
                    ctx.fillStyle = glow;
                    ctx.fill();

                    // Particle core
                    ctx.beginPath();
                    ctx.arc(px, py, 4, 0, Math.PI * 2);
                    ctx.fillStyle = '#ffffff';
                    ctx.fill();
                });
            });

            // Draw nodes with enhanced effects
            nodes.forEach((node) => {
                const x = (node.x / 100) * width;
                const y = (node.y / 100) * height;

                // Pulse animation
                const pulse = 1 + Math.sin(time * 2 + node.pulsePhase) * 0.1;
                const radius = node.size * pulse;

                // Outer glow rings
                for (let i = 4; i >= 0; i--) {
                    const alpha = 0.15 - i * 0.03;
                    const ringRadius = radius + i * 8;
                    ctx.beginPath();
                    ctx.arc(x, y, ringRadius, 0, Math.PI * 2);
                    ctx.fillStyle = node.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
                    ctx.fill();
                }

                // Rotating orbit ring for core node
                if (node.id === 'core') {
                    node.orbitAngle += 0.02;
                    ctx.beginPath();
                    ctx.arc(x, y, radius + 20, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([5, 10]);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // Orbiting dot
                    const orbitX = x + Math.cos(node.orbitAngle) * (radius + 20);
                    const orbitY = y + Math.sin(node.orbitAngle) * (radius + 20);
                    ctx.beginPath();
                    ctx.arc(orbitX, orbitY, 4, 0, Math.PI * 2);
                    ctx.fillStyle = '#3b82f6';
                    ctx.fill();
                }

                // Main node gradient
                const nodeGradient = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, 0, x, y, radius);
                nodeGradient.addColorStop(0, '#ffffff');
                nodeGradient.addColorStop(0.3, node.color);
                nodeGradient.addColorStop(1, node.color + 'cc');

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fillStyle = nodeGradient;
                ctx.fill();

                // Highlight arc
                ctx.beginPath();
                ctx.arc(x, y, radius - 2, -Math.PI * 0.3, Math.PI * 0.3);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Label with shadow
                ctx.font = '600 11px system-ui, -apple-system, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#64748b';
                ctx.fillText(node.label, x, y + radius + 18);
            });

            time += 0.016;
            animationFrame = requestAnimationFrame(draw);
        };

        draw();

        window.addEventListener('resize', updateSize);
        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener('resize', updateSize);
        };
    }, []);

    return (
        <div className="relative w-full h-[450px] rounded-3xl overflow-hidden" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(241,245,249,0.95) 100%)',
            boxShadow: '0 25px 80px rgba(59, 130, 246, 0.15), 0 10px 30px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255,255,255,1)',
            border: '1px solid rgba(226, 232, 240, 0.8)'
        }}>
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 px-5 py-4 flex items-center justify-between z-10" style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)'
            }}>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-400 to-red-500 shadow-sm"></div>
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-sm"></div>
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-green-500 shadow-sm"></div>
                    <span className="text-gray-600 text-sm ml-3 font-medium">Agent Network</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
                    border: '1px solid rgba(34, 197, 94, 0.2)'
                }}>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs text-green-600 font-semibold">6 Active</span>
                </div>
            </div>

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ display: 'block' }}
            />

            {/* Bottom status bar */}
            <div className="absolute bottom-0 left-0 right-0 px-5 py-4 flex items-center justify-between z-10" style={{
                background: 'linear-gradient(0deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)'
            }}>
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-full text-xs font-medium" style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        color: '#2563eb'
                    }}>
                        47 Endpoints
                    </div>
                    <div className="px-3 py-1.5 rounded-full text-xs font-medium" style={{
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        color: '#7c3aed'
                    }}>
                        12 Attack Chains
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#dc2626'
                    }}>
                        3 CRITICAL
                    </span>
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(249, 115, 22, 0.05) 100%)',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                        color: '#ea580c'
                    }}>
                        5 HIGH
                    </span>
                </div>
            </div>
        </div>
    );
}
