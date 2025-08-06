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
  Plus,
  Filter,
  Search,
  Calendar,
  User,
  DollarSign,
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import {
  formatCurrency,
  getProjectStatusColor,
  getPriorityColor,
  formatDate,
  calculateProjectProgress,
} from "@/lib/utils";
import type {
  Project,
  ProjectStatus,
  ProjectPriority,
} from "@shared/crm-types";

// Mock data
const mockProjects: Project[] = [
  {
    id: "1",
    title: "Corporate Branding Package",
    description:
      "Complete brand identity including logo, business cards, letterhead, and brand guidelines",
    status: "ongoing",
    priority: "high",
    clientName: "Tech Solutions Ltd",
    clientEmail: "contact@techsolutions.com",
    assignedUsers: ["user1", "user2"],
    budget: {
      id: "b1",
      projectId: "1",
      totalEstimated: 8500,
      totalActual: 5200,
      currency: "EUR",
      items: [],
      lastUpdated: new Date().toISOString(),
    },
    timeline: {
      startDate: "2024-01-01",
      estimatedEndDate: "2024-01-15",
      milestones: [
        {
          id: "m1",
          title: "Logo Design",
          description: "Initial logo concepts",
          dueDate: "2024-01-05",
          completed: true,
          completedAt: "2024-01-04",
        },
        {
          id: "m2",
          title: "Brand Guidelines",
          description: "Complete brand book",
          dueDate: "2024-01-10",
          completed: true,
        },
        {
          id: "m3",
          title: "Print Materials",
          description: "Business cards and letterhead",
          dueDate: "2024-01-15",
          completed: false,
        },
      ],
    },
    materials: [],
    attachments: [],
    createdBy: "user1",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-07T15:30:00Z",
  },
  {
    id: "2",
    title: "Restaurant Menu Design",
    description: "Design and print new restaurant menus for seasonal update",
    status: "pending_approval",
    priority: "medium",
    clientName: "Bistro Central",
    clientEmail: "info@bistrocentral.pt",
    assignedUsers: ["user3"],
    budget: {
      id: "b2",
      projectId: "2",
      totalEstimated: 1200,
      totalActual: 1180,
      currency: "EUR",
      items: [],
      lastUpdated: new Date().toISOString(),
    },
    timeline: {
      startDate: "2023-12-20",
      estimatedEndDate: "2024-01-10",
      milestones: [
        {
          id: "m4",
          title: "Design Concepts",
          description: "Initial menu layouts",
          dueDate: "2023-12-25",
          completed: true,
          completedAt: "2023-12-24",
        },
        {
          id: "m5",
          title: "Client Review",
          description: "Present designs to client",
          dueDate: "2024-01-05",
          completed: true,
          completedAt: "2024-01-03",
        },
        {
          id: "m6",
          title: "Final Production",
          description: "Print final menus",
          dueDate: "2024-01-10",
          completed: false,
        },
      ],
    },
    materials: [],
    attachments: [],
    createdBy: "user3",
    createdAt: "2023-12-20T09:00:00Z",
    updatedAt: "2024-01-05T11:15:00Z",
  },
  {
    id: "3",
    title: "Event Banners",
    description: "Large format banners for upcoming music festival",
    status: "todo",
    priority: "urgent",
    clientName: "Music Festival",
    clientEmail: "production@musicfest.com",
    assignedUsers: ["user2", "user4"],
    budget: {
      id: "b3",
      projectId: "3",
      totalEstimated: 3200,
      totalActual: 0,
      currency: "EUR",
      items: [],
      lastUpdated: new Date().toISOString(),
    },
    timeline: {
      startDate: "2024-01-08",
      estimatedEndDate: "2024-01-12",
      milestones: [
        {
          id: "m7",
          title: "Design Phase",
          description: "Create banner designs",
          dueDate: "2024-01-09",
          completed: false,
        },
        {
          id: "m8",
          title: "Client Approval",
          description: "Get approval for designs",
          dueDate: "2024-01-10",
          completed: false,
        },
        {
          id: "m9",
          title: "Production",
          description: "Print and deliver banners",
          dueDate: "2024-01-12",
          completed: false,
        },
      ],
    },
    materials: [],
    attachments: [],
    createdBy: "user2",
    createdAt: "2024-01-07T14:00:00Z",
    updatedAt: "2024-01-07T14:00:00Z",
  },
];

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "ongoing", label: "On Going" },
  { value: "pending_approval", label: "Pending Approval" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const priorityOptions: { value: ProjectPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">(
    "all",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const handleNewProject = (projectData: Partial<Project>) => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      ...projectData,
    } as Project;

    setProjects(prev => [newProject, ...prev]);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <CRMLayout
      title="Projects"
      subtitle={`Managing ${projects.length} projects across all stages`}
      actions={
        <Button onClick={() => setIsNewProjectModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      }
    >
      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects, clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as ProjectStatus | "all")
            }
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Statuses</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const progress = calculateProjectProgress(project);
          const isOverdue =
            new Date(project.timeline.estimatedEndDate) < new Date() &&
            project.status !== "completed";

          return (
            <Card
              key={project.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {project.clientName}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full border ${getProjectStatusColor(project.status)}`}
                  >
                    {project.status.replace("_", " ")}
                  </span>
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full ${getPriorityColor(project.priority)}`}
                    />
                    <span className="ml-1 text-xs text-muted-foreground capitalize">
                      {project.priority}
                    </span>
                  </div>
                  {isOverdue && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                      Overdue
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(project.timeline.estimatedEndDate)}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>{formatCurrency(project.budget.totalEstimated)}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <User className="h-4 w-4 mr-1" />
                    <span>{project.assignedUsers.length} assigned</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{project.timeline.milestones.length} milestones</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No projects found matching your criteria.
          </p>
          <Button className="mt-4" onClick={() => setIsNewProjectModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Project
          </Button>
        </div>
      )}

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onSubmit={handleNewProject}
      />
    </CRMLayout>
  );
}
