// User Management Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole =
  | "admin"
  | "manager"
  | "designer"
  | "printer"
  | "sales"
  | "viewer";

// Project Management Types
export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  clientName: string;
  clientEmail: string;
  assignedUsers: string[]; // User IDs
  budget: Budget;
  timeline: ProjectTimeline;
  materials: ProjectMaterial[];
  attachments: Attachment[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export type ProjectStatus =
  | "todo"
  | "ongoing"
  | "pending_approval"
  | "completed"
  | "cancelled";
export type ProjectPriority = "low" | "medium" | "high" | "urgent";

export interface ProjectTimeline {
  startDate: string;
  estimatedEndDate: string;
  actualEndDate?: string;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
}

// Budget Management Types
export interface Budget {
  id: string;
  projectId: string;
  totalEstimated: number;
  totalActual: number;
  currency: string;
  items: BudgetItem[];
  lastUpdated: string;
}

export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  description: string;
  estimatedCost: number;
  actualCost: number;
  quantity: number;
  unit: string;
  materialId?: string; // Reference to stock material
}

export type BudgetCategory =
  | "design"
  | "printing"
  | "materials"
  | "labor"
  | "equipment"
  | "other";

// Stock Management Types
export interface StockMaterial {
  id: string;
  name: string;
  description: string;
  category: MaterialCategory;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: MeasurementUnit;
  unitPrice: number;
  supplier: Supplier;
  location: string;
  lastRestocked: string;
  expiryDate?: string;
}

export type MaterialCategory =
  | "paper"
  | "ink"
  | "vinyl"
  | "fabric"
  | "plastic"
  | "metal"
  | "tools"
  | "other";

export interface MeasurementUnit {
  type: UnitType;
  name: string;
  abbreviation: string;
  baseConversion?: number; // For converting to base unit
}

export type UnitType = "area" | "length" | "volume" | "weight" | "count";

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}

export interface ProjectMaterial {
  materialId: string;
  quantity: number;
  reservedQuantity: number;
  usedQuantity: number;
  costPerUnit: number;
}

// Calendar and Timeline Types
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  startDate: string;
  endDate: string;
  allDay: boolean;
  projectId?: string;
  userId?: string;
  reminder?: string;
  color: string;
}

export type EventType =
  | "project_deadline"
  | "meeting"
  | "production"
  | "delivery"
  | "approval"
  | "other";

// File Management Types
export interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
  thumbnailUrl?: string;
}

// API Response Types
export interface CRMApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter and Search Types
export interface ProjectFilters {
  status?: ProjectStatus[];
  priority?: ProjectPriority[];
  assignedUsers?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  clientName?: string;
}

export interface StockFilters {
  category?: MaterialCategory[];
  lowStock?: boolean;
  supplier?: string[];
  location?: string[];
}

// Dashboard Types
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjectsThisMonth: number;
  totalRevenue: number;
  pendingApprovals: number;
  lowStockItems: number;
  upcomingDeadlines: number;
  teamUtilization: number;
}

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export type NotificationType =
  | "project_update"
  | "deadline_reminder"
  | "approval_request"
  | "stock_alert"
  | "budget_alert"
  | "system";
