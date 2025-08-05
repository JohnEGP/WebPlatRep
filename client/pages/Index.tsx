import { useEffect, useState } from "react";
import { DemoResponse, PingResponse } from "@shared/api";

export default function Index() {
  const [pingData, setPingData] = useState<PingResponse | null>(null);
  const [demoData, setDemoData] = useState<DemoResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pingRes, demoRes] = await Promise.all([
          fetch("/api/ping"),
          fetch("/api/demo")
        ]);
        
        const ping: PingResponse = await pingRes.json();
        const demo: DemoResponse = await demoRes.json();
        
        setPingData(ping);
        setDemoData(demo);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Fusion Starter App
        </h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold text-card-foreground mb-4">
              Ping API
            </h2>
            {pingData ? (
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Status: <span className="text-green-500">{pingData.status}</span>
                </p>
                <p className="text-muted-foreground">
                  Timestamp: {new Date(pingData.timestamp).toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-destructive">Failed to load ping data</p>
            )}
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold text-card-foreground mb-4">
              Demo API
            </h2>
            {demoData ? (
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Message: {demoData.message}
                </p>
                <p className="text-muted-foreground">
                  Timestamp: {new Date(demoData.timestamp).toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-destructive">Failed to load demo data</p>
            )}
          </div>
        </div>

        <div className="mt-8 bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold text-card-foreground mb-4">
            Getting Started
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Welcome to your Fusion Starter application! This template includes:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>React 18 with TypeScript</li>
              <li>React Router 6 for SPA routing</li>
              <li>Express server with API endpoints</li>
              <li>TailwindCSS for styling</li>
              <li>Radix UI components</li>
              <li>Shared types between client and server</li>
            </ul>
            <p>
              Check the <code className="bg-muted px-2 py-1 rounded">AGENTS.md</code> file for more information about the project structure and how to add new features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
