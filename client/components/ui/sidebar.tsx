import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  Calendar,
  FolderOpen,
  Users,
  Package,
  DollarSign,
  BarChart3,
  Settings,
  Home,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  className?: string;
}

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: FolderOpen, label: "Projects", href: "/projects" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: Users, label: "Users", href: "/users" },
  { icon: Package, label: "Stock", href: "/stock" },
  { icon: DollarSign, label: "Budgets", href: "/budgets" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className="flex items-center">
          {!isCollapsed ? (
            <img
              loading="lazy"
              srcSet="https://cdn.builder.io/o/assets%2F38a994ba860d47469e4b5a1051199f61%2Fcfc22ffc6a76499382384c9d72c2a7cf?alt=media&token=26c2ede3-e87c-44fc-b6c2-b19b5390f331&apiKey=38a994ba860d47469e4b5a1051199f61&width=100 100w, https://cdn.builder.io/o/assets%2F38a994ba860d47469e4b5a1051199f61%2Fcfc22ffc6a76499382384c9d72c2a7cf?alt=media&token=26c2ede3-e87c-44fc-b6c2-b19b5390f331&apiKey=38a994ba860d47469e4b5a1051199f61&width=200 200w, https://cdn.builder.io/o/assets%2F38a994ba860d47469e4b5a1051199f61%2Fcfc22ffc6a76499382384c9d72c2a7cf?alt=media&token=26c2ede3-e87c-44fc-b6c2-b19b5390f331&apiKey=38a994ba860d47469e4b5a1051199f61&width=400 400w, https://cdn.builder.io/o/assets%2F38a994ba860d47469e4b5a1051199f61%2Fcfc22ffc6a76499382384c9d72c2a7cf?alt=media&token=26c2ede3-e87c-44fc-b6c2-b19b5390f331&apiKey=38a994ba860d47469e4b5a1051199f61&width=800 800w, https://cdn.builder.io/o/assets%2F38a994ba860d47469e4b5a1051199f61%2Fcfc22ffc6a76499382384c9d72c2a7cf?alt=media&token=26c2ede3-e87c-44fc-b6c2-b19b5390f331&apiKey=38a994ba860d47469e4b5a1051199f61&width=1200 1200w, https://cdn.builder.io/o/assets%2F38a994ba860d47469e4b5a1051199f61%2Fcfc22ffc6a76499382384c9d72c2a7cf?alt=media&token=26c2ede3-e87c-44fc-b6c2-b19b5390f331&apiKey=38a994ba860d47469e4b5a1051199f61&width=1600 1600w, https://cdn.builder.io/o/assets%2F38a994ba860d47469e4b5a1051199f61%2Fcfc22ffc6a76499382384c9d72c2a7cf?alt=media&token=26c2ede3-e87c-44fc-b6c2-b19b5390f331&apiKey=38a994ba860d47469e4b5a1051199f61&width=2000 2000w, https://cdn.builder.io/o/assets%2F38a994ba860d47469e4b5a1051199f61%2Fcfc22ffc6a76499382384c9d72c2a7cf?alt=media&token=26c2ede3-e87c-44fc-b6c2-b19b5390f331&apiKey=38a994ba860d47469e4b5a1051199f61"
              src="https://cdn.builder.io/o/assets%2F38a994ba860d47469e4b5a1051199f61%2Fcfc22ffc6a76499382384c9d72c2a7cf?alt=media&token=26c2ede3-e87c-44fc-b6c2-b19b5390f331&apiKey=38a994ba860d47469e4b5a1051199f61"
              alt="Company logo"
              className="h-8 w-auto max-w-[180px] object-contain"
            />
          ) : (
            <img
              loading="lazy"
              src="https://cdn.builder.io/o/assets%2F38a994ba860d47469e4b5a1051199f61%2Fcfc22ffc6a76499382384c9d72c2a7cf?alt=media&token=26c2ede3-e87c-44fc-b6c2-b19b5390f331&apiKey=38a994ba860d47469e4b5a1051199f61"
              alt="Logo"
              className="h-6 w-6 object-contain"
            />
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} to={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent",
                  isCollapsed && "px-2",
                  isActive &&
                    "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">{item.label}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-sidebar-primary-foreground">
              JP
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                João Paixão
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                Administrator
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
