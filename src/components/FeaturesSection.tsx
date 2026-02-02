"use client";

export default function FeaturesSection() {
    return (
        <section className="py-20 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Autonomous Intelligence
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Dynamic Agents */}
                    <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
                        <div className="w-14 h-14 mb-6 rounded-lg bg-purple-100 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Dynamic Agents
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Automatically detect your application's business logic and target
                            high-value flows, adapting their strategy in real-time.
                        </p>
                    </div>

                    {/* Adaptive Payloads */}
                    <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
                        <div className="w-14 h-14 mb-6 rounded-lg bg-cyan-100 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-cyan-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Adaptive Payloads
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Intelligently craft payloads to evade WAFs and bypass filters,
                            continuously learning from each response.
                        </p>
                    </div>

                    {/* Real-Time Agents */}
                    <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow">
                        <div className="w-14 h-14 mb-6 rounded-lg bg-blue-100 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Real-Time Testing
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Watch as agents discover, test, and validate vulnerabilities
                            live—no waiting for batch jobs or scheduled scans.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
