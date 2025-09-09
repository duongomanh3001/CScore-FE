"use client";

import { useState, useEffect } from "react";
import { HealthService } from "@/services/health.service";

export default function BackendStatus() {
  const [status, setStatus] = useState<{
    isAvailable: boolean;
    baseUrl: string;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const backendStatus = await HealthService.getBackendStatus();
        setStatus(backendStatus);
      } catch (error) {
        setStatus({
          isAvailable: false,
          baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8086',
          message: 'Error checking backend status',
        });
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
          <span className="text-sm text-slate-600">Checking backend status...</span>
        </div>
      </div>
    );
  }

  if (!status) return null;

  return (
    <div className={`border rounded-lg p-4 mb-6 ${
      status.isAvailable 
        ? 'bg-green-50 border-green-200' 
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-3 h-3 rounded-full ${
          status.isAvailable ? 'bg-green-500' : 'bg-red-500'
        }`}></div>
        <span className={`font-medium text-sm ${
          status.isAvailable ? 'text-green-700' : 'text-red-700'
        }`}>
          Backend Status
        </span>
      </div>
      <p className={`text-sm ${
        status.isAvailable ? 'text-green-600' : 'text-red-600'
      }`}>
        {status.message}
      </p>
      <p className="text-xs text-slate-500 mt-1">
        Backend URL: {status.baseUrl}
      </p>
      {!status.isAvailable && (
        <div className="mt-2 text-sm text-red-600">
          <p>To start the backend:</p>
          <ol className="list-decimal list-inside mt-1 text-xs">
            <li>Navigate to the cscore-backend directory</li>
            <li>Run: <code className="bg-red-100 px-1 rounded">mvn spring-boot:run</code></li>
            <li>Or run: <code className="bg-red-100 px-1 rounded">./mvnw spring-boot:run</code></li>
          </ol>
        </div>
      )}
    </div>
  );
}
