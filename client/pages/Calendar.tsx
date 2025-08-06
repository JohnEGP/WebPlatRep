import { useState } from "react";
import { CRMLayout } from "@/components/layout/crm-layout";
import DatePicker from "@/components/DatePicker";
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
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  Filter,
  List,
  Grid,
} from "lucide-react";
import { formatDate, formatDateTime, getProjectStatusColor } from "@/lib/utils";
import type { CalendarEvent, Project } from "@shared/crm-types";

// Mock data
const mockEvents: CalendarEvent[] = [
  {
    id: "e1",
    title: "Corporate Branding - Final Presentation",
    description: "Present final brand package to Tech Solutions Ltd",
    type: "meeting",
    startDate: "2024-01-15T14:00:00Z",
    endDate: "2024-01-15T16:00:00Z",
    allDay: false,
    projectId: "1",
    color: "#3B82F6",
  },
  {
    id: "e2",
    title: "Restaurant Menu - Delivery Deadline",
    description: "Final delivery of printed menus to Bistro Central",
    type: "project_deadline",
    startDate: "2024-01-10T00:00:00Z",
    endDate: "2024-01-10T23:59:59Z",
    allDay: true,
    projectId: "2",
    color: "#F59E0B",
  },
  {
    id: "e3",
    title: "Event Banners - Production Start",
    description: "Begin production of music festival banners",
    type: "production",
    startDate: "2024-01-09T09:00:00Z",
    endDate: "2024-01-09T17:00:00Z",
    allDay: false,
    projectId: "3",
    color: "#EF4444",
  },
  {
    id: "e4",
    title: "Team Weekly Standup",
    description: "Weekly team coordination meeting",
    type: "meeting",
    startDate: "2024-01-08T10:00:00Z",
    endDate: "2024-01-08T11:00:00Z",
    allDay: false,
    color: "#10B981",
  },
  {
    id: "e5",
    title: "Client Meeting - New Project Briefing",
    description: "Initial briefing for upcoming corporate website project",
    type: "meeting",
    startDate: "2024-01-12T15:30:00Z",
    endDate: "2024-01-12T16:30:00Z",
    allDay: false,
    color: "#8B5CF6",
  },
];

const mockProjects: Partial<Project>[] = [
  {
    id: "1",
    title: "Corporate Branding Package",
    status: "ongoing",
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
  },
  {
    id: "2",
    title: "Restaurant Menu Design",
    status: "pending_approval",
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
  },
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "timeline">(
    "month",
  );
  const [events] = useState<CalendarEvent[]>(mockEvents);
  const [projects] = useState<Partial<Project>[]>(mockProjects);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerPosition, setDatePickerPosition] = useState({ x: 0, y: 0 });

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Generate calendar days for current month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentYear, currentMonth, day));
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(
      new Date(currentYear, currentMonth + (direction === "next" ? 1 : -1), 1),
    );
  };

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return <User className="h-3 w-3" />;
      case "project_deadline":
        return <CalendarIcon className="h-3 w-3" />;
      case "production":
        return <MapPin className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const renderMonthView = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">
              {currentDate.toLocaleDateString("pt-PT", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={index} className="h-24" />;
            }

            const dayEvents = getEventsForDay(date);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`h-24 p-1 border rounded-md bg-card hover:bg-accent transition-colors ${
                  isToday ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div
                  className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : "text-foreground"}`}
                >
                  {date.getDate()}
                </div>
                <div className="space-y-1 overflow-hidden">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded truncate text-white"
                      style={{ backgroundColor: event.color }}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  const renderTimelineView = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
          <CardDescription>
            Visual timeline of all active projects and milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="relative">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{project.title}</h4>
                      <span
                        className={`px-2 py-1 text-xs rounded-full border ${getProjectStatusColor(project.status!)}`}
                      >
                        {project.status?.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(project.timeline!.startDate)} -{" "}
                      {formatDate(project.timeline!.estimatedEndDate)}
                    </p>

                    {/* Milestones */}
                    <div className="mt-4 ml-6 space-y-2">
                      {project.timeline!.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="flex items-center space-x-3"
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${milestone.completed ? "bg-green-500" : "bg-gray-300"}`}
                          />
                          <div className="flex-1">
                            <p
                              className={`text-sm ${milestone.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                            >
                              {milestone.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Due: {formatDate(milestone.dueDate)}
                              {milestone.completed &&
                                milestone.completedAt &&
                                ` • Completed: ${formatDate(milestone.completedAt)}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute left-2 top-6 bottom-0 w-px bg-border" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <CRMLayout
      title="Calendar"
      subtitle="Project timeline and scheduling overview"
      actions={
        <div className="flex gap-2">
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("month")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4 mr-1" />
              Month
            </Button>
            <Button
              variant={viewMode === "timeline" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("timeline")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4 mr-1" />
              Timeline
            </Button>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>
      }
    >
      {viewMode === "month" && renderMonthView()}
      {viewMode === "timeline" && renderTimelineView()}

      {/* Upcoming Events Sidebar */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events
                .filter((event) => {
                  const eventDate = new Date(event.startDate);
                  const now = new Date();
                  const weekFromNow = new Date(
                    now.getTime() + 7 * 24 * 60 * 60 * 1000,
                  );
                  return eventDate >= now && eventDate <= weekFromNow;
                })
                .sort(
                  (a, b) =>
                    new Date(a.startDate).getTime() -
                    new Date(b.startDate).getTime(),
                )
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start space-x-3 p-3 border rounded-md"
                  >
                    <div
                      className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        {getEventTypeIcon(event.type)}
                        <span className="text-xs text-muted-foreground">
                          {event.allDay
                            ? formatDate(event.startDate)
                            : formatDateTime(event.startDate)}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </CRMLayout>
  );
}
