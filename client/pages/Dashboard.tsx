import { useState } from "react";
import { CRMLayout } from "@/components/layout/crm-layout";
import NewProjectModal from "@/components/NewProjectModal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderOpen,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Clock,
  CheckCircle,
  Plus,
} from "lucide-react";
import { formatCurrency, getProjectStatusColor } from "@/lib/utils";
import type { Project } from "@shared/crm-types";

// Mock data for demonstration
const dashboardStats = {
  totalProjects: 127,
  activeProjects: 18,
  completedProjectsThisMonth: 9,
  totalRevenue: 45780,
  pendingApprovals: 5,
  lowStockItems: 3,
  upcomingDeadlines: 7,
  teamUtilization: 78,
};

const recentProjects = [
  {
    id: "1",
    title: "Corporate Branding Package",
    client: "Tech Solutions Ltd",
    status: "ongoing",
    priority: "high",
    budget: 8500,
    dueDate: "2024-01-15",
    progress: 65,
  },
  {
    id: "2",
    title: "Restaurant Menu Design",
    client: "Bistro Central",
    status: "pending_approval",
    priority: "medium",
    budget: 1200,
    dueDate: "2024-01-10",
    progress: 90,
  },
  {
    id: "3",
    title: "Event Banners",
    client: "Music Festival",
    status: "todo",
    priority: "urgent",
    budget: 3200,
    dueDate: "2024-01-08",
    progress: 0,
  },
];

const lowStockItems = [
  { name: "A4 Premium Paper", current: 150, min: 500, unit: "sheets" },
  { name: "Cyan Ink Cartridge", current: 2, min: 5, unit: "units" },
  { name: "Vinyl Roll 1.5m", current: 12, min: 20, unit: "meters" },
];

export default function Dashboard() {
  return (
    <CRMLayout
      title="Dashboard"
      subtitle="Marketing & Digital Printing Department"
      actions={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      }
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.totalProjects}
            </div>
            <p className="text-xs text-muted-foreground">
              +{dashboardStats.activeProjects} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardStats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{dashboardStats.completedProjectsThisMonth} projects completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.pendingApprovals}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Team Utilization
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.teamUtilization}%
            </div>
            <p className="text-xs text-muted-foreground">Average this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Latest project updates and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium">{project.title}</h4>
                      <span
                        className={`px-2 py-1 text-xs rounded-full border ${getProjectStatusColor(project.status)}`}
                      >
                        {project.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.client} • Due{" "}
                      {new Date(project.dueDate).toLocaleDateString("pt-PT")}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {project.progress}%
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {formatCurrency(project.budget)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Stock */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Upcoming Deadlines</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {dashboardStats.upcomingDeadlines}
              </div>
              <p className="text-sm text-muted-foreground">
                Projects due in the next 7 days
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                View Calendar
              </Button>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span>Low Stock Alert</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.current} {item.unit} remaining
                      </p>
                    </div>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                      Low
                    </span>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                Manage Stock
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </CRMLayout>
  );
}
