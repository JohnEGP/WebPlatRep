import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  MoreHorizontal,
  Filter,
  Search,
  Edit,
  Trash2,
  Eye,
  ArrowRight,
  Package
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';

interface Material {
  id: string;
  type: string;
  name: string;
  quantity: number;
  unit: string;
  // Area/dimension fields for materials like vinyl
  hasArea?: boolean;
  width?: number;
  height?: number;
  areaUnit?: string; // m², cm², ft², etc.
  // Cost calculation
  unitCost?: number;
  totalCost?: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'overdue';
  startDate: Date;
  endDate: Date;
  team: string[];
  priority: 'low' | 'medium' | 'high';
  materials: Material[];
  personInCharge: string;
  totalCost?: number;
  progress: number; // 0-100 percentage of actual completion
}

const statusColors = {
  todo: 'bg-blue-100 text-blue-800 border-blue-200',
  'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  review: 'bg-purple-100 text-purple-800 border-purple-200',
  done: 'bg-green-100 text-green-800 border-green-200',
  overdue: 'bg-red-100 text-red-800 border-red-200'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-orange-100 text-orange-600',
  high: 'bg-red-100 text-red-600'
};

// Mock stock database for cost calculation
const stockDatabase = [
  { name: 'Vinyl Banner', unitCost: 45.99, unit: 'piece', type: 'Material' },
  { name: 'Vinyl Banner Material', unitCost: 45.99, unit: 'roll', type: 'Material' },
  { name: 'Adhesive Vinyl', unitCost: 32.50, unit: 'roll', type: 'Material' },
  { name: 'Figma', unitCost: 15.00, unit: 'license', type: 'Software' },
  { name: 'React', unitCost: 0.00, unit: 'library', type: 'Library' },
  { name: 'React Native', unitCost: 0.00, unit: 'framework', type: 'Framework' },
  { name: 'Expo', unitCost: 0.00, unit: 'platform', type: 'Platform' },
  { name: 'PostgreSQL', unitCost: 200.00, unit: 'instance', type: 'Software' },
  { name: 'AWS RDS', unitCost: 150.00, unit: 'service', type: 'Service' },
  { name: 'Next.js', unitCost: 0.00, unit: 'framework', type: 'Framework' },
  { name: 'Stripe API', unitCost: 25.00, unit: 'service', type: 'Service' },
  { name: 'Mailchimp API', unitCost: 20.00, unit: 'service', type: 'Service' },
  { name: 'Google Analytics', unitCost: 0.00, unit: 'license', type: 'License' },
  { name: 'OWASP ZAP', unitCost: 0.00, unit: 'license', type: 'Tool' },
  { name: 'Burp Suite', unitCost: 399.00, unit: 'license', type: 'Tool' },
  { name: 'Zendesk API', unitCost: 49.00, unit: 'service', type: 'Service' },
  { name: 'Socket.io', unitCost: 0.00, unit: 'library', type: 'Library' },
  { name: 'Java Spring Boot', unitCost: 0.00, unit: 'framework', type: 'Framework' },
  { name: 'Docker', unitCost: 0.00, unit: 'platform', type: 'Platform' },
  { name: 'Tableau', unitCost: 70.00, unit: 'license', type: 'Software' },
  { name: 'Python', unitCost: 0.00, unit: 'language', type: 'Software' },
  { name: 'Arduino', unitCost: 25.00, unit: 'piece', type: 'Hardware' },
  { name: 'Raspberry Pi', unitCost: 75.00, unit: 'piece', type: 'Hardware' }
];

// Cost calculation functions
const getCostForMaterial = (material: Material): number => {
  const stockItem = stockDatabase.find(item =>
    item.name.toLowerCase() === material.name.toLowerCase() &&
    item.unit === material.unit
  );

  if (!stockItem) return 0;

  let quantity = material.quantity;

  // For area-based materials, calculate total area as quantity
  if (material.hasArea && material.width && material.height) {
    const areaPerUnit = material.width * material.height;
    quantity = areaPerUnit * material.quantity;
  }

  return stockItem.unitCost * quantity;
};

const calculateProjectCost = (materials: Material[]): number => {
  return materials.reduce((total, material) => {
    return total + getCostForMaterial(material);
  }, 0);
};

// Get material suggestions from stock database
const getMaterialSuggestions = (input: string, materialType?: string): string[] => {
  let filteredItems = stockDatabase;

  // Filter by type if specified
  if (materialType) {
    filteredItems = stockDatabase.filter(item => item.type === materialType);
  }

  if (!input || input.length < 1) {
    // Show all materials of the selected type when nothing is typed
    return filteredItems
      .map(item => item.name)
      .slice(0, 10); // Limit to 10 suggestions
  }

  return filteredItems
    .filter(item => item.name.toLowerCase().includes(input.toLowerCase()))
    .map(item => item.name)
    .slice(0, 10); // Limit to 10 suggestions
};

export default function Index() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Website Redesign',
      description: 'Complete overhaul of company website with modern UI/UX',
      status: 'in-progress',
      startDate: new Date(2024, 11, 15),
      endDate: new Date(2025, 0, 30), // Future date to avoid overdue
      team: ['Alice', 'Bob', 'Charlie'],
      priority: 'high',
      materials: [
        { id: '1', type: 'Design Tool', name: 'Figma', quantity: 1, unit: 'license', hasArea: false, unitCost: 15.00, totalCost: 15.00 },
        { id: '2', type: 'Framework', name: 'React', quantity: 1, unit: 'library', hasArea: false, unitCost: 0.00, totalCost: 0.00 }
      ],
      personInCharge: 'Alice',
      progress: 65
    },
    {
      id: '2',
      title: 'Mobile App Development',
      description: 'Build native mobile app for iOS and Android',
      status: 'todo',
      startDate: new Date(2025, 0, 5),
      endDate: new Date(2025, 2, 15),
      team: ['Diana', 'Eve'],
      priority: 'medium',
      materials: [
        { id: '1', type: 'Framework', name: 'React Native', quantity: 1, unit: 'framework', hasArea: false, unitCost: 0.00, totalCost: 0.00 },
        { id: '2', type: 'Platform', name: 'Expo', quantity: 1, unit: 'platform', hasArea: false, unitCost: 0.00, totalCost: 0.00 }
      ],
      personInCharge: 'Diana',
      progress: 0
    },
    {
      id: '3',
      title: 'Database Migration',
      description: 'Migrate legacy database to modern cloud solution',
      status: 'done',
      startDate: new Date(2024, 11, 1),
      endDate: new Date(2025, 0, 20), // Future date to avoid overdue
      team: ['Frank', 'Grace'],
      priority: 'high',
      materials: [
        { id: '1', type: 'Database', name: 'PostgreSQL', quantity: 1, unit: 'instance', hasArea: false, unitCost: 200.00, totalCost: 200.00 },
        { id: '2', type: 'Cloud Service', name: 'AWS RDS', quantity: 1, unit: 'service', hasArea: false, unitCost: 150.00, totalCost: 150.00 }
      ],
      personInCharge: 'Frank',
      progress: 100
    },
    {
      id: '4',
      title: 'E-Commerce Platform Development',
      description: 'Full-stack e-commerce platform with payment integration, inventory management, and customer portal',
      status: 'todo',
      startDate: new Date(2025, 1, 1),
      endDate: new Date(2025, 3, 15),
      team: ['Sarah Johnson', 'Mike Chen', 'Emma Wilson', 'James Rodriguez', 'Lisa Park'],
      priority: 'high',
      materials: [
        { id: '1', type: 'Framework', name: 'Next.js', quantity: 1, unit: 'framework', hasArea: false },
        { id: '2', type: 'Service', name: 'Stripe API', quantity: 1, unit: 'service', hasArea: false }
      ],
      personInCharge: 'Sarah Johnson',
      progress: 0
    },
    {
      id: '5',
      title: 'Marketing Campaign Automation',
      description: 'Automated email marketing system with customer segmentation, A/B testing, and analytics dashboard',
      status: 'todo',
      startDate: new Date(2024, 10, 15),
      endDate: new Date(2025, 0, 25), // Future date to avoid overdue
      team: ['Tom Martinez', 'Rachel Green'],
      priority: 'medium',
      materials: [
        { id: '1', type: 'Service', name: 'Mailchimp API', quantity: 1, unit: 'service', hasArea: false },
        { id: '2', type: 'Tool', name: 'Google Analytics', quantity: 1, unit: 'license', hasArea: false }
      ],
      personInCharge: 'Tom Martinez',
      progress: 0
    },
    {
      id: '6',
      title: 'Security Audit & Compliance',
      description: 'Comprehensive security audit, penetration testing, and GDPR compliance implementation',
      status: 'done',
      startDate: new Date(2024, 9, 1),
      endDate: new Date(2024, 10, 30),
      team: ['Alex Thompson'],
      priority: 'high',
      materials: [
        { id: '1', type: 'Tool', name: 'OWASP ZAP', quantity: 1, unit: 'license', hasArea: false },
        { id: '2', type: 'Tool', name: 'Burp Suite', quantity: 1, unit: 'license', hasArea: false }
      ],
      personInCharge: 'Alex Thompson',
      progress: 100
    },
    {
      id: '7',
      title: 'Customer Support Portal',
      description: 'Self-service customer support portal with ticketing system, knowledge base, and live chat',
      status: 'in-progress',
      startDate: new Date(2024, 11, 1),
      endDate: new Date(2025, 1, 15),
      team: ['Nina Patel', 'David Kim', 'Maria Santos'],
      priority: 'medium',
      materials: [
        { id: '1', type: 'Service', name: 'Zendesk API', quantity: 1, unit: 'service', hasArea: false },
        { id: '2', type: 'Library', name: 'Socket.io', quantity: 1, unit: 'library', hasArea: false }
      ],
      personInCharge: 'Nina Patel',
      progress: 45
    },
    {
      id: '8',
      title: 'Legacy System Migration',
      description: 'Migration of legacy COBOL systems to modern microservices architecture',
      status: 'in-progress',
      startDate: new Date(2024, 8, 1),
      endDate: new Date(2024, 10, 15), // Past deadline - will become overdue
      team: ['Robert Wilson', 'Jennifer Lee', 'Carlos Mendez'],
      priority: 'high',
      materials: [
        { id: '1', type: 'Framework', name: 'Java Spring Boot', quantity: 1, unit: 'framework', hasArea: false },
        { id: '2', type: 'Platform', name: 'Docker', quantity: 1, unit: 'platform', hasArea: false }
      ],
      personInCharge: 'Robert Wilson',
      progress: 30
    },
    {
      id: '9',
      title: 'Data Analytics Dashboard',
      description: 'Real-time business intelligence dashboard with data visualization and reporting capabilities',
      status: 'done',
      startDate: new Date(2024, 9, 10),
      endDate: new Date(2024, 11, 1),
      team: ['Anna Chen', 'Marcus Johnson'],
      priority: 'low',
      materials: [
        { id: '1', type: 'Tool', name: 'Tableau', quantity: 1, unit: 'license', hasArea: false },
        { id: '2', type: 'Language', name: 'Python', quantity: 1, unit: 'language', hasArea: false }
      ],
      personInCharge: 'Anna Chen',
      progress: 100
    },
    {
      id: '10',
      title: 'IoT Device Management System',
      description: 'Centralized management system for IoT devices with monitoring, updates, and configuration management',
      status: 'review',
      startDate: new Date(2024, 7, 1),
      endDate: new Date(2024, 9, 15), // Past deadline - will become overdue
      team: ['Kevin Park', 'Lisa Zhang', 'Ahmed Hassan', 'Sophie Miller'],
      priority: 'low',
      materials: [
        { id: '1', type: 'Hardware', name: 'Arduino', quantity: 10, unit: 'piece', hasArea: false },
        { id: '2', type: 'Hardware', name: 'Raspberry Pi', quantity: 5, unit: 'piece', hasArea: false }
      ],
      personInCharge: 'Kevin Park',
      progress: 85
    },
    {
      id: '11',
      title: 'Cloud Infrastructure Setup',
      description: 'Setup scalable cloud infrastructure with auto-scaling, load balancing, and monitoring',
      status: 'todo',
      startDate: new Date(2025, 1, 1),
      endDate: new Date(2025, 3, 30),
      team: ['Michael Torres', 'Jennifer Walsh'],
      priority: 'high',
      materials: [
        { id: '1', type: 'Cloud Service', name: 'AWS RDS', quantity: 2, unit: 'service', hasArea: false, unitCost: 150.00, totalCost: 300.00 },
        { id: '2', type: 'Platform', name: 'Docker', quantity: 1, unit: 'platform', hasArea: false, unitCost: 0.00, totalCost: 0.00 }
      ],
      personInCharge: 'Michael Torres',
      progress: 0
    },
    {
      id: '12',
      title: 'API Documentation Portal',
      description: 'Interactive API documentation portal with code examples and testing capabilities',
      status: 'todo',
      startDate: new Date(2025, 2, 1),
      endDate: new Date(2025, 4, 15),
      team: ['Sophie Chen', 'Daniel Rodriguez'],
      priority: 'medium',
      materials: [
        { id: '1', type: 'Framework', name: 'React', quantity: 1, unit: 'library', hasArea: false, unitCost: 0.00, totalCost: 0.00 },
        { id: '2', type: 'Tool', name: 'Figma', quantity: 1, unit: 'license', hasArea: false, unitCost: 15.00, totalCost: 15.00 }
      ],
      personInCharge: 'Sophie Chen',
      progress: 0
    },
    {
      id: '13',
      title: 'Inventory Management System',
      description: 'Real-time inventory tracking system with barcode scanning and automated reordering',
      status: 'in-progress',
      startDate: new Date(2024, 11, 10),
      endDate: new Date(2025, 2, 28),
      team: ['Carlos Mendoza', 'Lisa Wang', 'Ahmed Hassan'],
      priority: 'high',
      materials: [
        { id: '1', type: 'Database', name: 'MongoDB', quantity: 1, unit: 'instance', hasArea: false, unitCost: 150.00, totalCost: 150.00 },
        { id: '2', type: 'Framework', name: 'Next.js', quantity: 1, unit: 'framework', hasArea: false, unitCost: 0.00, totalCost: 0.00 }
      ],
      personInCharge: 'Carlos Mendoza',
      progress: 55
    },
    {
      id: '14',
      title: 'Employee Training Platform',
      description: 'Online learning platform with video content, quizzes, and progress tracking for employee training',
      status: 'in-progress',
      startDate: new Date(2024, 10, 20),
      endDate: new Date(2025, 1, 28),
      team: ['Rachel Kim', 'Brian Foster', 'Elena Morales'],
      priority: 'medium',
      materials: [
        { id: '1', type: 'Service', name: 'AWS S3', quantity: 1, unit: 'service', hasArea: false, unitCost: 30.00, totalCost: 30.00 },
        { id: '2', type: 'Framework', name: 'React', quantity: 1, unit: 'library', hasArea: false, unitCost: 0.00, totalCost: 0.00 }
      ],
      personInCharge: 'Rachel Kim',
      progress: 40
    },
    {
      id: '15',
      title: 'Payment Gateway Integration',
      description: 'Secure payment processing system with multiple payment methods and fraud detection',
      status: 'review',
      startDate: new Date(2024, 9, 15),
      endDate: new Date(2025, 0, 31),
      team: ['Jason Park', 'Maria Santos'],
      priority: 'high',
      materials: [
        { id: '1', type: 'Service', name: 'Stripe API', quantity: 1, unit: 'service', hasArea: false, unitCost: 25.00, totalCost: 25.00 },
        { id: '2', type: 'Tool', name: 'Burp Suite', quantity: 1, unit: 'license', hasArea: false, unitCost: 399.00, totalCost: 399.00 }
      ],
      personInCharge: 'Jason Park',
      progress: 90
    },
    {
      id: '16',
      title: 'Digital Signage System',
      description: 'Content management system for digital displays with scheduling and remote management capabilities',
      status: 'review',
      startDate: new Date(2024, 10, 1),
      endDate: new Date(2025, 1, 15),
      team: ['Antonio Silva', 'Maya Patel', 'Kevin Zhang'],
      priority: 'medium',
      materials: [
        { id: '1', type: 'Material', name: 'Vinyl Banner', quantity: 5, unit: 'piece', hasArea: true, width: 2, height: 3, areaUnit: 'm²', unitCost: 45.99, totalCost: 229.95 },
        { id: '2', type: 'Hardware', name: 'Raspberry Pi', quantity: 3, unit: 'piece', hasArea: false, unitCost: 75.00, totalCost: 225.00 }
      ],
      personInCharge: 'Antonio Silva',
      progress: 75
    }
  ]);
  
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    status: 'todo' as Project['status'],
    startDate: '',
    endDate: '',
    team: '',
    priority: 'medium' as Project['priority'],
    materials: [] as Material[],
    personInCharge: '',
    progress: 0
  });

  const addMaterial = () => {
    const newMaterial: Material = {
      id: Date.now().toString(),
      type: 'Tool',
      name: '',
      quantity: 1,
      unit: 'item',
      hasArea: false,
      width: 0,
      height: 0,
      areaUnit: 'm²',
      unitCost: 0,
      totalCost: 0
    };
    setNewProject(prev => ({
      ...prev,
      materials: [...prev.materials, newMaterial]
    }));
  };

  const updateMaterial = (id: string, field: keyof Material, value: string | number) => {
    setNewProject(prev => {
      const updatedMaterials = prev.materials.map(material => {
        if (material.id === id) {
          const updatedMaterial = { ...material, [field]: value };

          // Handle material name autocomplete
          if (field === 'name' && typeof value === 'string') {
            const suggestions = getMaterialSuggestions(value, updatedMaterial.type);
            setMaterialSuggestions(prev => ({ ...prev, [id]: suggestions }));

            // Auto-fill unit from stock database if exact match
            const stockItem = stockDatabase.find(item =>
              item.name.toLowerCase() === value.toLowerCase()
            );
            if (stockItem) {
              updatedMaterial.unit = stockItem.unit;
            }
          }

          // Handle material type change - update suggestions
          if (field === 'type') {
            const suggestions = getMaterialSuggestions(updatedMaterial.name, value as string);
            setMaterialSuggestions(prev => ({ ...prev, [id]: suggestions }));
          }

          // Recalculate cost when material changes
          updatedMaterial.unitCost = stockDatabase.find(item =>
            item.name.toLowerCase() === updatedMaterial.name.toLowerCase() &&
            item.unit === updatedMaterial.unit
          )?.unitCost || 0;
          updatedMaterial.totalCost = getCostForMaterial(updatedMaterial);
          return updatedMaterial;
        }
        return material;
      });

      return {
        ...prev,
        materials: updatedMaterials
      };
    });
  };

  const removeMaterial = (id: string) => {
    setNewProject(prev => ({
      ...prev,
      materials: prev.materials.filter(material => material.id !== id)
    }));
  };

  const selectMaterial = (materialId: string, materialName: string) => {
    // Find stock item to auto-fill details
    const stockItem = stockDatabase.find(item =>
      item.name.toLowerCase() === materialName.toLowerCase()
    );

    updateMaterial(materialId, 'name', materialName);
    if (stockItem) {
      updateMaterial(materialId, 'unit', stockItem.unit);
    }

    // Clear suggestions and hide dropdown
    setMaterialSuggestions(prev => ({ ...prev, [materialId]: [] }));
    setActiveMaterialInput(null);
  };
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [materialSuggestions, setMaterialSuggestions] = useState<{[key: string]: string[]}>({});
  const [activeMaterialInput, setActiveMaterialInput] = useState<string | null>(null);

  // Check for overdue projects on component mount and daily
  useEffect(() => {
    const checkOverdueProjects = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      setProjects(prev => prev.map(project => {
        const startDate = new Date(project.startDate);
        const endDate = new Date(project.endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        let newStatus: Project['status'];

        // Determine status based on progress and dates
        if (project.progress >= 100) {
          newStatus = 'done'; // Completed = 100% progress
        } else if (project.progress === 0) {
          newStatus = 'todo'; // To Do = 0% progress
        } else if (project.progress >= 1 && project.progress <= 99) {
          // If progress is between 1% and 99%, project is In Progress
          newStatus = ['in-progress', 'review'].includes(project.status) ? project.status : 'in-progress';
        } else if (endDate < today) {
          newStatus = 'overdue'; // Overdue = not 100% progress but time is overdue
        } else {
          newStatus = 'todo'; // Default fallback
        }

        return { ...project, status: newStatus };
      }));
    };

    // Check immediately
    checkOverdueProjects();

    // Check daily at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      checkOverdueProjects();
      // Then check every 24 hours
      const intervalId = setInterval(checkOverdueProjects, 24 * 60 * 60 * 1000);
      return () => clearInterval(intervalId);
    }, msUntilMidnight);

    return () => clearTimeout(timeoutId);
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const selectDate = (selectedDate: Date) => {
    setCurrentDate(selectedDate);
    setIsDatePickerOpen(false);
  };

  const renderMiniCalendar = () => {
    const today = new Date();
    const miniCalendarDate = new Date(currentDate);
    const year = miniCalendarDate.getFullYear();
    const month = miniCalendarDate.getMonth();
    const daysInMonth = getDaysInMonth(miniCalendarDate);
    const firstDay = getFirstDayOfMonth(miniCalendarDate);

    return (
      <div className="w-64 p-2">
        {/* Mini Calendar Header */}
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newDate = new Date(miniCalendarDate);
              newDate.setMonth(month - 1);
              setCurrentDate(newDate);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-semibold text-sm">
            {monthNames[month]} {year}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newDate = new Date(miniCalendarDate);
              newDate.setMonth(month + 1);
              setCurrentDate(newDate);
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div key={index} className="text-center text-xs font-medium text-muted-foreground p-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} className="h-8"></div>
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const date = i + 1;
            const fullDate = new Date(year, month, date);
            const isToday = today.toDateString() === fullDate.toDateString();
            const isSelected = currentDate.toDateString() === fullDate.toDateString();

            return (
              <Button
                key={date}
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 text-xs hover:bg-accent ${
                  isToday ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
                } ${
                  isSelected ? 'ring-2 ring-primary ring-offset-1' : ''
                }`}
                onClick={() => selectDate(fullDate)}
              >
                {date}
              </Button>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="flex justify-between mt-3 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => selectDate(new Date())}
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDatePickerOpen(false)}
          >
            Close
          </Button>
        </div>
      </div>
    );
  };

  const getProjectsForDate = (date: number) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
    return projects.filter(project => {
      const start = new Date(project.startDate);
      const end = new Date(project.endDate);
      return targetDate >= start && targetDate <= end;
    });
  };

  const getProgressPercentage = (project: Project) => {
    return project.progress;
  };

  const addProject = () => {
    console.log('addProject called with:', newProject);

    // Check which required fields are missing
    const missingFields = [];
    if (!newProject.title) missingFields.push('title');
    if (!newProject.startDate) missingFields.push('startDate');
    if (!newProject.endDate) missingFields.push('endDate');
    if (!newProject.personInCharge) missingFields.push('personInCharge');

    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      alert(`Please fill in the required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const project: Project = {
        id: Date.now().toString(),
        title: newProject.title,
        description: newProject.description,
        status: newProject.status,
        startDate: new Date(newProject.startDate),
        endDate: new Date(newProject.endDate),
        team: newProject.team.split(',').map(t => t.trim()).filter(t => t),
        priority: newProject.priority,
        materials: newProject.materials,
        personInCharge: newProject.personInCharge,
        progress: newProject.progress
      };

      console.log('Creating project:', project);
      setProjects(prev => [...prev, project]);
      setNewProject({
        title: '',
        description: '',
        status: 'todo',
        startDate: '',
        endDate: '',
        team: '',
        priority: 'medium',
        materials: [],
        personInCharge: '',
        progress: 0
      });
      setIsDialogOpen(false);
      console.log('Project added successfully');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project. Please try again.');
    }
  };

  const editProject = () => {
    if (!editingProject || !newProject.title || !newProject.startDate || !newProject.endDate || !newProject.personInCharge) return;

    const updatedProject: Project = {
      ...editingProject,
      title: newProject.title,
      description: newProject.description,
      status: newProject.status,
      startDate: new Date(newProject.startDate),
      endDate: new Date(newProject.endDate),
      team: newProject.team.split(',').map(t => t.trim()).filter(t => t),
      priority: newProject.priority,
      materials: newProject.materials,
      personInCharge: newProject.personInCharge
    };

    setProjects(prev => prev.map(p => p.id === editingProject.id ? updatedProject : p));
    setEditingProject(null);
    setNewProject({
      title: '',
      description: '',
      status: 'todo',
      startDate: '',
      endDate: '',
      team: '',
      priority: 'medium',
      materials: [],
      personInCharge: '',
      progress: 0
    });
    setIsDialogOpen(false);
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setIsViewDialogOpen(false);
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
    setNewProject({
      title: project.title,
      description: project.description,
      status: project.status,
      startDate: project.startDate.toISOString().split('T')[0],
      endDate: project.endDate.toISOString().split('T')[0],
      team: project.team.join(', '),
      priority: project.priority,
      materials: project.materials,
      personInCharge: project.personInCharge
    });
    setIsDialogOpen(true);
  };

  const openViewDialog = (project: Project) => {
    setSelectedProject(project);
    setIsViewDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProject(null);
    setNewProject({
      title: '',
      description: '',
      status: 'todo',
      startDate: '',
      endDate: '',
      team: '',
      priority: 'medium',
      materials: [],
      personInCharge: '',
      progress: 0
    });
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Project Calendar</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Manage your projects and deadlines</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>

              <div className="hidden sm:block w-px h-6 bg-border"></div>

              <AppHeader />

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
                <option value="overdue">Overdue</option>
              </select>

              <Link to="/pipeline">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Pipeline View
                </Button>
              </Link>

              <Link to="/material-stock">
                <Button variant="outline" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Material Stock
                </Button>
              </Link>

              <Link to="/user-management">
                <Button variant="outline" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Users
                </Button>
              </Link>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-sm font-medium">Project Title</label>
                      <Input
                        value={newProject.title}
                        onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter project title"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-sm font-medium">Description</label>
                      <Input
                        value={newProject.description}
                        onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter project description"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Start Date</label>
                      <Input
                        type="date"
                        value={newProject.startDate}
                        onChange={(e) => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">End Date</label>
                      <Input
                        type="date"
                        value={newProject.endDate}
                        onChange={(e) => setNewProject(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <select
                        value={newProject.status}
                        onChange={(e) => setNewProject(prev => ({ ...prev, status: e.target.value as Project['status'] }))}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <select
                        value={newProject.priority}
                        onChange={(e) => setNewProject(prev => ({ ...prev, priority: e.target.value as Project['priority'] }))}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Person in Charge *</label>
                      <Input
                        value={newProject.personInCharge}
                        onChange={(e) => setNewProject(prev => ({ ...prev, personInCharge: e.target.value }))}
                        placeholder="Enter person responsible for this project"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Team Members</label>
                      <Input
                        value={newProject.team}
                        onChange={(e) => setNewProject(prev => ({ ...prev, team: e.target.value }))}
                        placeholder="Enter team members (comma separated)"
                      />
                    </div>

                    <div className="col-span-2">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium">Materials & Resources</label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addMaterial}
                          className="flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          Add Material
                        </Button>
                      </div>

                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {(newProject.materials || []).map((material, index) => (
                          <div key={material.id} className="p-3 border rounded-lg space-y-3">
                            {/* First Row: Basic Info */}
                            <div className="grid grid-cols-12 gap-2">
                              <div className="col-span-3">
                                <label className="text-xs text-muted-foreground">Type</label>
                                <select
                                  value={material.type}
                                  onChange={(e) => updateMaterial(material.id, 'type', e.target.value)}
                                  className="w-full px-2 py-1 text-xs border border-input bg-background rounded"
                                >
                                  <option value="Tool">Tool</option>
                                  <option value="Software">Software</option>
                                  <option value="Hardware">Hardware</option>
                                  <option value="Service">Service</option>
                                  <option value="Material">Material</option>
                                  <option value="Equipment">Equipment</option>
                                  <option value="License">License</option>
                                  <option value="Framework">Framework</option>
                                  <option value="Library">Library</option>
                                  <option value="Platform">Platform</option>
                                </select>
                              </div>

                              <div className="col-span-4 relative">
                                <label className="text-xs text-muted-foreground">Name</label>
                                <Input
                                  value={material.name}
                                  onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                                  onFocus={() => {
                                    setActiveMaterialInput(material.id);
                                    // Load suggestions when focused, even if empty
                                    const suggestions = getMaterialSuggestions(material.name, material.type);
                                    setMaterialSuggestions(prev => ({ ...prev, [material.id]: suggestions }));
                                  }}
                                  onBlur={() => {
                                    // Delay hiding suggestions to allow click on suggestion
                                    setTimeout(() => setActiveMaterialInput(null), 200);
                                  }}
                                  placeholder="Click to see all materials or start typing..."
                                  className="text-xs h-8"
                                />

                                {/* Autocomplete Dropdown */}
                                {activeMaterialInput === material.id && materialSuggestions[material.id]?.length > 0 && (
                                  <div className="absolute top-full left-0 right-0 z-50 bg-white border border-input rounded-md shadow-lg max-h-40 overflow-y-auto">
                                    {materialSuggestions[material.id].map((suggestion, suggestionIndex) => (
                                      <div
                                        key={suggestionIndex}
                                        className="px-3 py-2 text-xs hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
                                        onClick={() => selectMaterial(material.id, suggestion)}
                                      >
                                        {suggestion}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="col-span-2">
                                <label className="text-xs text-muted-foreground">Quantity</label>
                                <Input
                                  type="number"
                                  value={material.quantity}
                                  onChange={(e) => updateMaterial(material.id, 'quantity', parseInt(e.target.value) || 0)}
                                  min="0"
                                  className="text-xs h-8"
                                />
                              </div>

                              <div className="col-span-2">
                                <label className="text-xs text-muted-foreground">Unit</label>
                                <select
                                  value={material.unit}
                                  onChange={(e) => updateMaterial(material.id, 'unit', e.target.value)}
                                  className="w-full px-2 py-1 text-xs border border-input bg-background rounded"
                                >
                                  <option value="item">item</option>
                                  <option value="piece">piece</option>
                                  <option value="roll">roll</option>
                                  <option value="sheet">sheet</option>
                                  <option value="license">license</option>
                                  <option value="hour">hour</option>
                                  <option value="day">day</option>
                                  <option value="month">month</option>
                                  <option value="year">year</option>
                                  <option value="kg">kg</option>
                                  <option value="meter">meter</option>
                                  <option value="unit">unit</option>
                                  <option value="service">service</option>
                                </select>
                              </div>

                              <div className="col-span-1 flex items-end">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeMaterial(material.id)}
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Area Toggle and Dimensions */}
                            <div className="border-t pt-2">
                              <div className="flex items-center gap-2 mb-2">
                                <input
                                  type="checkbox"
                                  id={`area-${material.id}`}
                                  checked={material.hasArea || false}
                                  onChange={(e) => updateMaterial(material.id, 'hasArea', e.target.checked)}
                                  className="h-3 w-3 rounded border-gray-300"
                                />
                                <label htmlFor={`area-${material.id}`} className="text-xs text-muted-foreground">
                                  Has area/dimensions (for vinyl, fabric, etc.)
                                </label>
                              </div>

                              {material.hasArea && (
                                <div className="grid grid-cols-6 gap-2">
                                  <div className="col-span-2">
                                    <label className="text-xs text-muted-foreground">Width</label>
                                    <Input
                                      type="number"
                                      value={material.width || 0}
                                      onChange={(e) => updateMaterial(material.id, 'width', parseFloat(e.target.value) || 0)}
                                      min="0"
                                      step="0.1"
                                      placeholder="0.0"
                                      className="text-xs h-8"
                                    />
                                  </div>

                                  <div className="col-span-2">
                                    <label className="text-xs text-muted-foreground">Height</label>
                                    <Input
                                      type="number"
                                      value={material.height || 0}
                                      onChange={(e) => updateMaterial(material.id, 'height', parseFloat(e.target.value) || 0)}
                                      min="0"
                                      step="0.1"
                                      placeholder="0.0"
                                      className="text-xs h-8"
                                    />
                                  </div>

                                  <div className="col-span-2">
                                    <label className="text-xs text-muted-foreground">Area Unit</label>
                                    <select
                                      value={material.areaUnit || 'm²'}
                                      onChange={(e) => updateMaterial(material.id, 'areaUnit', e.target.value)}
                                      className="w-full px-2 py-1 text-xs border border-input bg-background rounded"
                                    >
                                      <option value="m²">m² (square meters)</option>
                                      <option value="cm²">cm² (square centimeters)</option>
                                      <option value="ft²">ft² (square feet)</option>
                                      <option value="in²">in² (square inches)</option>
                                      <option value="mm²">mm² (square millimeters)</option>
                                    </select>
                                  </div>
                                </div>
                              )}

                              {material.hasArea && material.width && material.height && (
                                <div className="mt-2 p-2 bg-muted rounded text-xs">
                                  <span className="font-medium">Total Area: </span>
                                  <span className="text-primary font-semibold">
                                    {(material.width * material.height).toFixed(2)} {material.areaUnit}
                                    {material.quantity > 1 && (
                                      <span> × {material.quantity} = {((material.width * material.height) * material.quantity).toFixed(2)} {material.areaUnit}</span>
                                    )}
                                  </span>
                                </div>
                              )}

                              {/* Cost Display */}
                              <div className="mt-2 p-2 bg-primary/5 rounded text-xs border">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-primary">Unit Cost:</span>
                                  <span className="font-semibold text-primary">
                                    ${(stockDatabase.find(item =>
                                      item.name.toLowerCase() === material.name.toLowerCase() &&
                                      item.unit === material.unit
                                    )?.unitCost || 0).toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-primary">Total Cost:</span>
                                  <span className="font-bold text-primary text-sm">
                                    ${getCostForMaterial(material).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {newProject.materials.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            No materials added yet. Click "Add Material" to get started.
                          </div>
                        )}
                      </div>

                      {/* Project Total Cost */}
                      {newProject.materials.length > 0 && (
                        <div className="mt-4 p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-primary">Project Total Cost:</span>
                            <span className="text-2xl font-bold text-primary">
                              ${calculateProjectCost(newProject.materials).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addProject}>
                      Create Project
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="xl:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Calendar className="h-4 w-4" />
                          Select Date
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        {renderMiniCalendar()}
                      </PopoverContent>
                    </Popover>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <div key={day} className="p-2 text-center text-xs sm:text-sm font-medium text-muted-foreground">
                      <span className="hidden sm:inline">{day}</span>
                      <span className="sm:hidden">{day.slice(0, 1)}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }, (_, i) => (
                    <div key={`empty-${i}`} className="h-16 sm:h-24 p-1"></div>
                  ))}

                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const date = i + 1;
                    const dayProjects = getProjectsForDate(date);
                    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), date).toDateString();

                    return (
                      <div
                        key={date}
                        className={`h-16 sm:h-24 p-1 border border-border rounded-lg hover:bg-accent/50 transition-colors ${
                          isToday ? 'bg-primary/10 border-primary' : ''
                        }`}
                      >
                        <div className={`text-xs sm:text-sm font-medium mb-1 ${isToday ? 'text-primary' : 'text-foreground'}`}>
                          {date}
                        </div>
                        <div className="space-y-0.5 sm:space-y-1">
                          {dayProjects.slice(0, 2).map(project => (
                            <div
                              key={project.id}
                              className={`text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded text-center truncate ${statusColors[project.status]}`}
                              title={project.title}
                            >
                              <span className="hidden sm:inline">{project.title}</span>
                              <span className="sm:hidden">{project.title.slice(0, 6)}...</span>
                            </div>
                          ))}
                          {dayProjects.length > 2 && (
                            <div className="text-xs text-muted-foreground text-center">
                              +{dayProjects.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project List */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredProjects.filter(project => project.status !== 'done').slice(0, 5).map(project => (
                  <div key={project.id} className="p-3 border border-border rounded-lg space-y-2 hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-sm cursor-pointer hover:text-primary" onClick={() => openViewDialog(project)}>
                        {project.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={statusColors[project.status]}>
                          {project.status}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-accent"
                            onClick={() => openViewDialog(project)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-accent"
                            onClick={() => openEditDialog(project)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => deleteProject(project.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {project.endDate.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={priorityColors[project.priority]}>
                          {project.priority}
                        </Badge>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {project.team.length}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">Estimated Cost:</span>
                        <span className="font-bold text-primary">
                          ${calculateProjectCost(project.materials).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{projects.length}</div>
                    <div className="text-xs text-muted-foreground">Total Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {projects.filter(p => p.status === 'done').length}
                    </div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {Object.entries(statusColors).map(([status, colorClass]) => {
                    const count = projects.filter(p => p.status === status).length;
                    const percentage = projects.length > 0 ? (count / projects.length) * 100 : 0;
                    
                    return (
                      <div key={status} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="capitalize">{status.replace('-', ' ')}</span>
                          <span>{count}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${colorClass.split(' ')[0]}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Project View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  {selectedProject.title}
                  <Badge variant="outline" className={statusColors[selectedProject.status]}>
                    {selectedProject.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Start Date</h4>
                    <p className="text-sm text-muted-foreground">{selectedProject.startDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">End Date</h4>
                    <p className="text-sm text-muted-foreground">{selectedProject.endDate.toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Priority</h4>
                    <Badge variant="outline" className={priorityColors[selectedProject.priority]}>
                      {selectedProject.priority}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">Team Size</h4>
                    <p className="text-sm text-muted-foreground">{selectedProject.team.length} members</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Person in Charge</h4>
                  <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {selectedProject.personInCharge.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{selectedProject.personInCharge}</p>
                      <p className="text-xs text-muted-foreground">Project Manager</p>
                    </div>
                  </div>
                </div>

                {selectedProject.team.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Team Members</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.team.map((member, index) => (
                        <Badge key={index} variant="secondary">
                          {member}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProject.materials.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-3">Materials & Resources</h4>
                    <div className="space-y-3">
                      {selectedProject.materials.map((material, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{material.name}</span>
                                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                  {material.type}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {material.quantity} {material.unit}{material.quantity !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>

                          {material.hasArea && material.width && material.height && (
                            <div className="ml-5 p-2 bg-background rounded border text-xs">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="text-muted-foreground">Dimensions:</span>
                                  <div className="font-medium">
                                    {material.width} × {material.height} {material.areaUnit?.replace('²', '')}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Area per unit:</span>
                                  <div className="font-medium text-primary">
                                    {(material.width * material.height).toFixed(2)} {material.areaUnit}
                                  </div>
                                </div>
                              </div>
                              {material.quantity > 1 && (
                                <div className="mt-2 pt-2 border-t">
                                  <span className="text-muted-foreground">Total area:</span>
                                  <div className="font-semibold text-primary">
                                    {((material.width * material.height) * material.quantity).toFixed(2)} {material.areaUnit}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Cost Summary */}
                <div>
                  <h4 className="font-medium text-sm mb-3">Cost Breakdown</h4>
                  <div className="space-y-2">
                    {selectedProject.materials.map((material, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded text-sm">
                        <span>{material.name} ({material.quantity} {material.unit})</span>
                        <span className="font-medium">${getCostForMaterial(material).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20 font-semibold">
                      <span className="text-primary">Total Project Cost:</span>
                      <span className="text-lg text-primary">${calculateProjectCost(selectedProject.materials).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Duration: {Math.ceil((selectedProject.endDate.getTime() - selectedProject.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => openEditDialog(selectedProject)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => deleteProject(selectedProject.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
