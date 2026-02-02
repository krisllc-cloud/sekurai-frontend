"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { missionsAPI } from "@/lib/api";

export default function NewMissionPage() {
    const { getToken } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        target_url: "",
        mission_type: "full_security_audit",
        enable_vision: false,
        aggressive_mode: false,
        include_subdomains: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = await getToken();
            if (!token) {
                throw new Error("Not authenticated");
            }

            const response = await missionsAPI.create(
                {
                    target_url: formData.target_url,
                    config: {
                        mission_type: formData.mission_type,
                        enable_vision: formData.enable_vision,
                        aggressive_mode: formData.aggressive_mode,
                        include_subdomains: formData.include_subdomains,
                    },
                },
                token
            );

            // Redirect to mission detail page
            router.push(`/dashboard/missions/${response.mission.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create mission");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <Link href="/dashboard" className="text-blue-600 text-sm hover:underline mb-4 inline-block">
                    ← Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">New Security Mission</h1>
                <p className="text-gray-500 mt-1">Launch an autonomous security assessment</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 space-y-6 shadow-sm border border-gray-200">
                {/* Target URL */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target URL <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="url"
                        required
                        placeholder="https://example.com"
                        value={formData.target_url}
                        onChange={(e) => setFormData({ ...formData, target_url: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                    <p className="text-gray-500 text-sm mt-1">
                        The web application you want to test
                    </p>
                    {loading && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                            <span>Validating target URL...</span>
                        </div>
                    )}
                </div>

                {/* Mission Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mission Type</label>
                    <select
                        value={formData.mission_type}
                        onChange={(e) => setFormData({ ...formData, mission_type: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none"
                    >
                        <option value="full_security_audit">Full Security Audit</option>
                        <option value="quick_scan">Quick Scan (Discovery Only)</option>
                        <option value="api_testing">API Testing</option>
                        <option value="authenticated_scan">Authenticated Scan</option>
                    </select>
                </div>

                {/* Options */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>

                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition">
                        <input
                            type="checkbox"
                            checked={formData.enable_vision}
                            onChange={(e) => setFormData({ ...formData, enable_vision: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                            <div className="font-medium text-gray-900">Enable AI Vision</div>
                            <div className="text-sm text-gray-500">Use GPT-4 Vision to analyze UI screenshots</div>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition">
                        <input
                            type="checkbox"
                            checked={formData.aggressive_mode}
                            onChange={(e) => setFormData({ ...formData, aggressive_mode: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                            <div className="font-medium text-gray-900">Aggressive Mode</div>
                            <div className="text-sm text-gray-500">
                                Higher request rate, more thorough testing (may trigger WAFs)
                            </div>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition">
                        <input
                            type="checkbox"
                            checked={formData.include_subdomains}
                            onChange={(e) => setFormData({ ...formData, include_subdomains: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                            <div className="font-medium text-gray-900">Include Subdomains</div>
                            <div className="text-sm text-gray-500">Test all discovered subdomains</div>
                        </div>
                    </label>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex-1"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Launching Mission...
                            </>
                        ) : (
                            "Launch Mission"
                        )}
                    </button>
                    <Link href="/dashboard" className="btn-secondary">
                        Cancel
                    </Link>
                </div>
            </form>

            {/* Info */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
                <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
                    <li>Discovery Agent maps all endpoints and technologies</li>
                    <li>Fuzzing Agents test for vulnerabilities (SQLi, XSS, etc.)</li>
                    <li>Exploitation Agents validate and chain findings</li>
                    <li>Report Agent generates comprehensive security report</li>
                </ol>
            </div>
        </div>
    );
}
