"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-medium mb-6">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
}
