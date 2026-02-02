import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#0A0F1C] text-white">
            {/* Navigation (Shared) */}
            <nav className="fixed top-0 w-full z-50 bg-[#0A0F1C]/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src="/logo-icon.png"
                            alt="SekürAI"
                            width={36}
                            height={36}
                            className="w-9 h-9"
                        />
                        <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500 tracking-tight">
                            SekürAI
                        </span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
                        <Link href="/" className="hover:text-white transition">Home</Link>
                        <Link href="/docs" className="hover:text-white transition">Docs</Link>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        We build autonomous agents to secure the internet.
                    </h1>

                    <div className="prose prose-invert prose-lg max-w-none">
                        <p className="text-xl text-gray-400 leading-relaxed mb-12">
                            Security teams are outnumbered 100 to 1. Traditional pentesting is slow, expensive, and snapshot-based.
                            We believe the future of security is <span className="text-purple-400 font-medium">agentic, continuous, and autonomous</span>.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 my-16">
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <h3 className="text-2xl font-bold mb-4 text-cyan-400">Speed</h3>
                                <p className="text-gray-400">
                                    Why wait weeks for a report? Our agents start testing the moment you ship code.
                                </p>
                            </div>
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <h3 className="text-2xl font-bold mb-4 text-purple-400">Precision</h3>
                                <p className="text-gray-400">
                                    AI-driven logic combines human intuition with machine scale to find complex business logic flaws.
                                </p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                        <p className="text-gray-400 mb-8">
                            To democratize world-class offensive security. We are building the "digital immune system" for the modern web,
                            empowering every developer to ship secure code without needing a PhD in cybersecurity.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
