// Force dynamic to prevent build-time prerender errors
export const dynamic = "force-dynamic";

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a0f1a]">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                <p className="text-gray-400 mb-8">Page not found</p>
                <a href="/dashboard" className="btn-primary">
                    Go to Dashboard
                </a>
            </div>
        </div>
    );
}
