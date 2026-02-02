"use client";

export default function ValuePropsSection() {
    return (
        <section className="py-24 px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                    Democratizing Security
                </h2>
                <p className="text-xl text-gray-400 mb-20 max-w-2xl mx-auto leading-relaxed">
                    Every developer deserves world-class security testing.<br />
                    Not just those with six-figure budgets.
                </p>

                <div className="flex flex-wrap justify-center gap-x-20 gap-y-12">
                    {/* Minutes */}
                    <div className="text-center group">
                        <div className="relative mb-4">
                            <div className="text-6xl font-black bg-gradient-to-b from-purple-400 to-purple-400/20 bg-clip-text text-transparent">
                                ⚡
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">Minutes</h3>
                        <p className="text-sm text-gray-500">vs weeks of waiting</p>
                    </div>

                    {/* 90%+ Savings */}
                    <div className="text-center group">
                        <div className="relative mb-4">
                            <div className="text-6xl font-black bg-gradient-to-b from-cyan-400 to-cyan-400/20 bg-clip-text text-transparent">
                                90%+
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">Savings</h3>
                        <p className="text-sm text-gray-500">vs traditional pentests</p>
                    </div>

                    {/* Zero */}
                    <div className="text-center group">
                        <div className="relative mb-4">
                            <div className="text-6xl font-black bg-gradient-to-b from-blue-400 to-blue-400/20 bg-clip-text text-transparent">
                                0
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">Scheduling</h3>
                        <p className="text-sm text-gray-500">headaches</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
