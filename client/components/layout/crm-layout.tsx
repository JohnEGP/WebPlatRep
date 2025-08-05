import { Sidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface CRMLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function CRMLayout({
  children,
  title,
  subtitle,
  actions,
  className,
}: CRMLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {title && (
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-80 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  3
                </span>
              </Button>

              {/* User Menu */}
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>

              {/* Actions */}
              {actions && (
                <div className="flex items-center space-x-2">{actions}</div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={cn("flex-1 overflow-auto p-6", className)}>
          {children}
        </main>
      </div>
    </div>
  );
}
