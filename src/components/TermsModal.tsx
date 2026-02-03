"use client";

import { useState, useEffect, useRef } from "react";

interface TermsModalProps {
    isOpen: boolean;
    onAccept: () => void;
    onDecline: () => void;
}

export default function TermsModal({ isOpen, onAccept, onDecline }: TermsModalProps) {
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
    const [isAccepting, setIsAccepting] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setHasScrolledToBottom(false);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleScroll = () => {
        if (contentRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
            // Consider scrolled to bottom when within 50px of the end
            if (scrollTop + clientHeight >= scrollHeight - 50) {
                setHasScrolledToBottom(true);
            }
        }
    };

    const handleAccept = async () => {
        setIsAccepting(true);
        // Store acceptance in localStorage
        localStorage.setItem("terms_accepted", new Date().toISOString());
        onAccept();
        setIsAccepting(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0d1220] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-cyan-500/10">
                    <h2 className="text-2xl font-bold text-white">Terms of Service</h2>
                    <p className="text-sm text-gray-400 mt-1">Please read and accept before launching your mission</p>
                </div>

                {/* Scrollable Content */}
                <div
                    ref={contentRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto px-8 py-6 space-y-8 text-gray-300 text-sm leading-relaxed"
                >
                    {/* Section 1 */}
                    <section>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <span className="text-purple-400">1.</span> Authorization Requirements
                        </h3>
                        <p className="mb-3">
                            You must have <span className="text-purple-400 font-semibold">explicit authorization</span> to perform security testing on any target system. This includes:
                        </p>
                        <ul className="space-y-1 ml-4 text-gray-400">
                            <li>→ Written permission from the domain owner</li>
                            <li>→ Proof of ownership if testing your own systems</li>
                            <li>→ Explicit contractual agreements for third-party testing</li>
                            <li>→ Compliance with all applicable local, state, and federal laws</li>
                        </ul>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <span className="text-purple-400">2.</span> Prohibited Activities
                        </h3>
                        <p className="mb-3">
                            You may <span className="text-red-400 font-semibold">NOT</span> use SekurAI to:
                        </p>
                        <ul className="space-y-1 ml-4 text-gray-400">
                            <li className="text-red-400/80">✗ Test systems you do not own or have explicit permission to test</li>
                            <li className="text-red-400/80">✗ Cause damage, disruption, or unauthorized access to systems</li>
                            <li className="text-red-400/80">✗ Violate computer fraud laws (CFAA, Computer Misuse Act, etc.)</li>
                            <li className="text-red-400/80">✗ Breach any third-party terms of service</li>
                        </ul>
                    </section>

                    {/* Section 3 - Liability */}
                    <section className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <span className="text-purple-400">3.</span> Liability Disclaimer
                        </h3>
                        <p className="mb-3">
                            SekurAI provides security testing services <span className="font-semibold">"AS IS"</span> without warranties. We are <span className="text-red-400 font-semibold">NOT LIABLE</span> for:
                        </p>
                        <ul className="space-y-1 ml-4 text-gray-400 text-xs">
                            <li>• Any damages, data loss, or service disruption caused by testing</li>
                            <li>• Unauthorized testing of third-party systems</li>
                            <li>• Legal consequences arising from unauthorized security testing</li>
                            <li>• False positives, false negatives, or incomplete vulnerability detection</li>
                            <li>• Financial losses, business interruption, or reputational harm</li>
                        </ul>
                        <p className="mt-3 text-xs text-gray-500">
                            You accept full responsibility and assume all risks. By using SekurAI, you indemnify and hold harmless SekurAI, its officers, employees, and affiliates.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <span className="text-purple-400">4.</span> Testing Impacts
                        </h3>
                        <p className="mb-3">Security testing may cause:</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                <h4 className="font-semibold text-yellow-400 text-xs mb-1">Test Data</h4>
                                <p className="text-xs text-gray-500">May create test accounts or database entries</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                <h4 className="font-semibold text-yellow-400 text-xs mb-1">Performance</h4>
                                <p className="text-xs text-gray-500">High request volumes may slow your app</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                <h4 className="font-semibold text-yellow-400 text-xs mb-1">Security Alerts</h4>
                                <p className="text-xs text-gray-500">May trigger WAFs or IDS systems</p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                <h4 className="font-semibold text-yellow-400 text-xs mb-1">Log Noise</h4>
                                <p className="text-xs text-gray-500">Testing generates significant logs</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <span className="text-purple-400">5.</span> Legal Compliance
                        </h3>
                        <p className="mb-3">Unauthorized security testing may violate:</p>
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-2 text-xs">
                            <div className="flex gap-3">
                                <span className="font-semibold text-cyan-400 w-24">USA</span>
                                <span className="text-gray-400">Computer Fraud and Abuse Act (CFAA)</span>
                            </div>
                            <div className="flex gap-3">
                                <span className="font-semibold text-cyan-400 w-24">UK</span>
                                <span className="text-gray-400">Computer Misuse Act 1990</span>
                            </div>
                            <div className="flex gap-3">
                                <span className="font-semibold text-cyan-400 w-24">EU</span>
                                <span className="text-gray-400">GDPR, NIS Directive</span>
                            </div>
                        </div>
                    </section>

                    {/* Sections 6-8 */}
                    <section>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <span className="text-purple-400">6.</span> Data and Privacy
                        </h3>
                        <p className="text-gray-400">
                            We collect and store mission data, findings, and authentication tokens for providing security testing services. Your data is encrypted at rest and in transit.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <span className="text-purple-400">7.</span> Termination
                        </h3>
                        <p className="text-gray-400">
                            We reserve the right to terminate or suspend your account at any time for violations of these Terms of Service.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <span className="text-purple-400">8.</span> Contact
                        </h3>
                        <p className="text-gray-400">
                            Questions? Contact us at <a href="mailto:legal@sekurai.ai" className="text-purple-400 hover:underline">legal@sekurai.ai</a>
                        </p>
                    </section>

                    {/* Scroll indicator */}
                    {!hasScrolledToBottom && (
                        <div className="text-center text-gray-500 text-xs py-4 animate-bounce">
                            ↓ Scroll to continue ↓
                        </div>
                    )}
                </div>

                {/* Footer with buttons */}
                <div className="px-8 py-5 border-t border-white/10 bg-[#0a0e18] flex items-center justify-between gap-4">
                    <button
                        onClick={onDecline}
                        className="px-6 py-3 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleAccept}
                        disabled={!hasScrolledToBottom || isAccepting}
                        className={`px-8 py-3 text-sm font-bold rounded-xl transition-all ${hasScrolledToBottom
                                ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:scale-105 shadow-lg shadow-purple-500/25"
                                : "bg-gray-700 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        {isAccepting ? "Accepting..." : hasScrolledToBottom ? "I Accept the Terms" : "Scroll to Accept"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Helper hook to check if terms have been accepted
export function useTermsAccepted() {
    const [accepted, setAccepted] = useState<boolean | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("terms_accepted");
        setAccepted(!!stored);
    }, []);

    return accepted;
}
