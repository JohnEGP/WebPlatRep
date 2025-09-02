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
          fetch("/api/demo"),
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
        <img
          loading="lazy"
          srcSet="https://cdn.builder.io/api/v1/image/assets/38a994ba860d47469e4b5a1051199f61/cfc22ffc6a76499382384c9d72c2a7cf?width=100 100w, https://cdn.builder.io/api/v1/image/assets/38a994ba860d47469e4b5a1051199f61/cfc22ffc6a76499382384c9d72c2a7cf?width=200 200w, https://cdn.builder.io/api/v1/image/assets/38a994ba860d47469e4b5a1051199f61/cfc22ffc6a76499382384c9d72c2a7cf?width=400 400w, https://cdn.builder.io/api/v1/image/assets/38a994ba860d47469e4b5a1051199f61/cfc22ffc6a76499382384c9d72c2a7cf?width=800 800w, https://cdn.builder.io/api/v1/image/assets/38a994ba860d47469e4b5a1051199f61/cfc22ffc6a76499382384c9d72c2a7cf?width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/38a994ba860d47469e4b5a1051199f61/cfc22ffc6a76499382384c9d72c2a7cf?width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/38a994ba860d47469e4b5a1051199f61/cfc22ffc6a76499382384c9d72c2a7cf?width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/38a994ba860d47469e4b5a1051199f61/cfc22ffc6a76499382384c9d72c2a7cf?width=800"
          src="https://cdn.builder.io/api/v1/image/assets/38a994ba860d47469e4b5a1051199f61/cfc22ffc6a76499382384c9d72c2a7cf?width=800"
          alt="Company logo"
          style={{
            aspectRatio: "3.72",
            objectFit: "cover",
            objectPosition: "center",
            width: "100%",
            marginTop: "20px",
            minHeight: "20px",
            minWidth: "20px",
            overflow: "hidden",
            maxWidth: "470px",
          }}
        />
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
                  Status:{" "}
                  <span className="text-green-500">{pingData.status}</span>
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
            PrintCRM - Marketing & Digital Printing Management
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Welcome to your comprehensive CRM system for marketing and digital
              printing operations!
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="font-semibold text-card-foreground mb-2">
                  🎯 Project Management
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Track projects through multiple status stages</li>
                  <li>Comprehensive timeline and milestone tracking</li>
                  <li>Team assignment and collaboration tools</li>
                  <li>Client communication management</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground mb-2">
                  💰 Dynamic Budget Management
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Real-time budget tracking and updates</li>
                  <li>Cost breakdown by category</li>
                  <li>Material cost integration</li>
                  <li>Profit margin analysis</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground mb-2">
                  📦 Smart Stock Management
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Multi-unit inventory tracking</li>
                  <li>Automatic low stock alerts</li>
                  <li>Supplier management</li>
                  <li>Material usage analytics</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground mb-2">
                  📅 Advanced Calendar System
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Project deadline visualization</li>
                  <li>Timeline view with milestones</li>
                  <li>Team scheduling</li>
                  <li>Production planning</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t">
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Access CRM Dashboard →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
