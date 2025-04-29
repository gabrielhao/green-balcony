'use client';

export default function TestEnvPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <div className="bg-gray-100 p-4 rounded">
        <pre>
          {JSON.stringify({
            NEXT_PUBLIC_AZURE_STORAGE_SAS_TOKEN: process.env.NEXT_PUBLIC_AZURE_STORAGE_SAS_TOKEN,
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
} 