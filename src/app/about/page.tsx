import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#0A0F1C] text-white selection:bg-purple-500/30 font-sans overflow-hidden">
            {/* Gradient Backgrounds similar to mockup */}
            <div className="fixed top-[-200px] right-[-100px] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[150px] pointer-events-none -z-10" />
            <div className="fixed bottom-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[150px] pointer-events-none -z-10" />

            {/* Navigation (Shared) */}
            <nav className="fixed top-0 w-full z-50 bg-[#0A0F1C]/80 backdrop-blur-md border-b border-white/5">
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
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Hero Section */}
                    <section className="mb-32 relative">
                        <h1 className="text-5xl md:text-7xl font-bold text-white/10 tracking-tighter leading-[0.9] mb-16 select-none">
                            Built by a Hacker,<br />for the Rest of Us
                        </h1>

                        <div className="flex flex-col md:flex-row gap-16 items-start">
                            {/* Founder Portrait */}
                            <div className="shrink-0 w-full md:w-[320px] aspect-[4/5] bg-gradient-to-br from-white/5 to-white/0 rounded-3xl border border-white/10 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 transition-opacity group-hover:opacity-75" />
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="https://media.licdn.com/dms/image/v2/C5603AQFEc7wOU7Q0iQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1517009020124?e=1771459200&v=beta&t=tQ7ygcNBRz_Q1XxyqpgF7YHYkd03gDyxTRTn5Z687Nw"
                                    alt="Rajesh Ivaturi - Founder"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex-1 pt-4">
                                <h2 className="text-4xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent mb-2">
                                    Rajesh Ivaturi
                                </h2>
                                <p className="text-purple-400 font-medium text-lg mb-8">Founder & Chief Security Architect</p>

                                <div className="prose prose-invert prose-lg text-gray-400 leading-relaxed font-light">
                                    <p className="mb-6">
                                        After a decade of high-stakes Layer 7 penetration testing engagements at Fortune 500 banks to critical healthcare infrastructure—I witnessed a troubling pattern: million-dollar security budgets producing checkbox reports full of theoretical findings that never got fixed.
                                    </p>
                                    <p>
                                        SekurAI was born from frustration with that system. I built what I wished existed: an autonomous offensive intelligence engine that thinks like a veteran pentester but executes at machine speed. Real exploitation. Real proof. Real results.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Content Sections */}
                    <section className="grid md:grid-cols-2 gap-16 mb-24">
                        <div className="bg-white/5 rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors">
                            <span className="text-xs font-bold text-purple-400 uppercase tracking-[0.2em] mb-6 block">The Problem</span>
                            <h3 className="text-3xl font-bold text-white mb-6">Security is Broken</h3>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                Enterprise security budgets dominate the market, yet most of that spend goes to "checkbox security"—compliance-driven testing that produces theoretical findings no one acts on. Meanwhile, SMBs and indie developers are left with two bad options: cheap automated scanners that miss everything real, or enterprise consultants they can't afford.
                            </p>
                        </div>
                        <div className="bg-white/5 rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors">
                            <span className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em] mb-6 block">The Mission</span>
                            <h3 className="text-3xl font-bold text-white mb-6">Democratize Elite Security</h3>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                We're making the same rigorous, proof-driven testing that protects billion-dollar companies accessible to everyone. Our autonomous agents don't just find vulnerabilities—they prove them, with full exploitation chains and transparent evidence that security teams can reproduce in minutes.
                            </p>
                        </div>
                    </section>

                    {/* Philosophy Quote */}
                    <section className="mb-32">
                        <div className="bg-gradient-to-r from-purple-900/10 to-cyan-900/10 border-l-4 border-purple-500 p-8 md:p-12 rounded-r-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <svg className="w-32 h-32 text-purple-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.0171 16H9.01714C7.91257 16 7.01714 16.8954 7.01714 18V21H14.017ZM21 21L21 18C21 16.8954 20.1046 16 19 16H15.9999C14.8954 16 13.9999 16.8954 13.9999 18V21H21ZM7 21L7 18C7 16.8954 6.10457 16 5 16H2.00002C0.89545 16 1.95705e-05 16.8954 1.95705e-05 18V21H7Z" /></svg>
                            </div>
                            <blockquote className="text-2xl md:text-3xl font-medium text-white/90 italic leading-relaxed relative z-10">
                                "No theoretical findings. If the agent can't prove it with a working exploit, it's not a vulnerability—it's speculation. Every finding in SekurAI comes with <span className="text-purple-400">forensic evidence</span>: the exact request, the exact response, and a one-click reproduction path."
                            </blockquote>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="text-center pb-20">
                        <Link
                            href="/sign-up"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-bold rounded-xl text-lg hover:scale-105 transition-all shadow-lg shadow-purple-500/25 group"
                        >
                            Start Your First Mission
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </Link>
                    </section>
                </div>
            </main>
        </div>
    );
}
