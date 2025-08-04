import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Calendar,
  Clock,
  Users,
  Search,
  Edit,
  Trash2,
  Eye,
  ArrowRight,
  Target,
  CheckCircle2,
  AlertCircle,
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

const statusConfig = {
  todo: {
    title: 'To Do',
    color: 'bg-blue-50 border-blue-200',
    headerColor: 'bg-blue-100 text-blue-800',
    cardColor: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    icon: Target
  },
  'in-progress': {
    title: 'In Progress',
    color: 'bg-yellow-50 border-yellow-200',
    headerColor: 'bg-yellow-100 text-yellow-800',
    cardColor: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    icon: Clock
  },
  review: {
    title: 'Review',
    color: 'bg-purple-50 border-purple-200',
    headerColor: 'bg-purple-100 text-purple-800',
    cardColor: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    icon: Eye
  },
  done: {
    title: 'Done',
    color: 'bg-green-50 border-green-200',
    headerColor: 'bg-green-100 text-green-800',
    cardColor: 'bg-green-50 border-green-200 hover:bg-green-100',
    icon: CheckCircle2
  },
  overdue: {
    title: 'Overdue',
    color: 'bg-red-50 border-red-200',
    headerColor: 'bg-red-100 text-red-800',
    cardColor: 'bg-red-50 border-red-200 hover:bg-red-100',
    icon: AlertCircle
  }
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-600 border-gray-200',
  medium: 'bg-orange-100 text-orange-600 border-orange-200',
  high: 'bg-red-100 text-red-600 border-red-200'
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
  { name: 'Firebase', unitCost: 25.00, unit: 'service', type: 'Service' },
  { name: 'Redux', unitCost: 0.00, unit: 'library', type: 'Library' },
  { name: 'Migration Scripts', unitCost: 50.00, unit: 'scripts', type: 'Tool' },
  { name: 'MongoDB', unitCost: 150.00, unit: 'instance', type: 'Software' },
  { name: 'AWS S3', unitCost: 30.00, unit: 'service', type: 'Service' },
  { name: 'Mailchimp API', unitCost: 20.00, unit: 'service', type: 'Service' },
  { name: 'Google Analytics', unitCost: 0.00, unit: 'license', type: 'License' },
  { name: 'Docker', unitCost: 0.00, unit: 'platform', type: 'Platform' },
  { name: 'Elasticsearch', unitCost: 80.00, unit: 'service', type: 'Service' },
  { name: 'Express.js', unitCost: 0.00, unit: 'framework', type: 'Framework' },
  { name: 'Java Spring Boot', unitCost: 0.00, unit: 'framework', type: 'Framework' },
  { name: 'Kubernetes', unitCost: 100.00, unit: 'platform', type: 'Platform' },
  { name: 'Apache Kafka', unitCost: 75.00, unit: 'service', type: 'Service' },
  { name: 'COBOL Legacy Code', unitCost: 500.00, unit: 'scripts', type: 'Tool' },
  { name: 'Migration Tools', unitCost: 200.00, unit: 'scripts', type: 'Tool' },
  { name: 'Power BI', unitCost: 50.00, unit: 'license', type: 'Software' },
  { name: 'Apache Spark', unitCost: 120.00, unit: 'platform', type: 'Platform' },
  { name: 'AWS Redshift', unitCost: 250.00, unit: 'service', type: 'Service' },
  { name: 'D3.js', unitCost: 0.00, unit: 'library', type: 'Library' },
  { name: 'React Charts', unitCost: 0.00, unit: 'library', type: 'Library' },
  { name: 'MQTT', unitCost: 15.00, unit: 'service', type: 'Service' },
  { name: 'InfluxDB', unitCost: 60.00, unit: 'service', type: 'Service' },
  { name: 'Grafana', unitCost: 30.00, unit: 'service', type: 'Service' },
  { name: 'AWS IoT Core', unitCost: 40.00, unit: 'service', type: 'Service' },
  { name: 'Node.js', unitCost: 0.00, unit: 'runtime', type: 'Platform' }
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

export default function Pipeline() {
  const [draggedProject, setDraggedProject] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Website Redesign',
      description: 'Complete overhaul of company website with modern UI/UX design and improved user experience',
      status: 'in-progress',
      startDate: new Date(2024, 11, 15),
      endDate: new Date(2025, 0, 30), // Future date to avoid overdue
      team: ['Alice Johnson', 'Bob Smith', 'Charlie Brown'],
      priority: 'high',
      materials: [
        { id: '1', type: 'Design Tool', name: 'Figma', quantity: 1, unit: 'license', hasArea: false },
        { id: '2', type: 'Framework', name: 'React', quantity: 1, unit: 'library', hasArea: false },
        { id: '3', type: 'Material', name: 'Vinyl Banner', quantity: 2, unit: 'piece', hasArea: true, width: 3, height: 2, areaUnit: 'm²' },
        { id: '4', type: 'CSS Framework', name: 'Tailwind CSS', quantity: 1, unit: 'library', hasArea: false },
        { id: '5', type: 'Material', name: 'Adhesive Vinyl', quantity: 1, unit: 'roll', hasArea: true, width: 150, height: 500, areaUnit: 'cm²' }
      ],
      personInCharge: 'Alice Johnson',
      progress: 65
    },
    {
      id: '2',
      title: 'Mobile App Development',
      description: 'Build native mobile app for iOS and Android with React Native and backend integration',
      status: 'todo',
      startDate: new Date(2025, 0, 5),
      endDate: new Date(2025, 2, 15),
      team: ['Diana Prince', 'Eve Wilson'],
      priority: 'medium',
      materials: [
        { id: '1', type: 'Framework', name: 'React Native', quantity: 1, unit: 'framework' },
        { id: '2', type: 'Platform', name: 'Expo', quantity: 1, unit: 'platform' },
        { id: '3', type: 'Backend Service', name: 'Firebase', quantity: 1, unit: 'service' },
        { id: '4', type: 'State Management', name: 'Redux', quantity: 1, unit: 'library' }
      ],
      personInCharge: 'Diana Prince',
      progress: 0
    },
    {
      id: '3',
      title: 'Database Migration',
      description: 'Migrate legacy database to modern cloud solution with improved performance and security',
      status: 'done',
      startDate: new Date(2024, 11, 1),
      endDate: new Date(2025, 0, 20), // Future date to avoid overdue
      team: ['Frank Miller', 'Grace Hopper'],
      priority: 'high',
      materials: [
        { id: '1', type: 'Database', name: 'PostgreSQL', quantity: 1, unit: 'instance' },
        { id: '2', type: 'Cloud Service', name: 'AWS RDS', quantity: 1, unit: 'service' },
        { id: '3', type: 'Tool', name: 'Migration Scripts', quantity: 5, unit: 'scripts' },
        { id: '4', type: 'Tool', name: 'Docker', quantity: 1, unit: 'platform' }
      ],
      personInCharge: 'Frank Miller',
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
        { id: '1', type: 'Framework', name: 'Next.js', quantity: 1, unit: 'framework' },
        { id: '2', type: 'Service', name: 'Stripe API', quantity: 1, unit: 'service' },
        { id: '3', type: 'Database', name: 'MongoDB', quantity: 1, unit: 'instance' },
        { id: '4', type: 'Platform', name: 'AWS S3', quantity: 1, unit: 'service' }
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
        { id: '1', type: 'Service', name: 'Mailchimp API', quantity: 1, unit: 'service' },
        { id: '2', type: 'Tool', name: 'Google Analytics', quantity: 1, unit: 'license' },
        { id: '3', type: 'Framework', name: 'React', quantity: 1, unit: 'library' }
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
        { id: '1', type: 'Tool', name: 'OWASP ZAP', quantity: 1, unit: 'license', hasArea: false, unitCost: 0.00, totalCost: 0.00 },
        { id: '2', type: 'Tool', name: 'Burp Suite', quantity: 1, unit: 'license', hasArea: false, unitCost: 399.00, totalCost: 399.00 }
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
        { id: '1', type: 'Service', name: 'Zendesk API', quantity: 1, unit: 'service', hasArea: false, unitCost: 49.00, totalCost: 49.00 },
        { id: '2', type: 'Library', name: 'Socket.io', quantity: 1, unit: 'library', hasArea: false, unitCost: 0.00, totalCost: 0.00 }
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
      endDate: new Date(2025, 1, 15), // Future date to avoid overdue
      team: ['Robert Wilson', 'Jennifer Lee', 'Carlos Mendez'],
      priority: 'high',
      materials: [
        { id: '1', type: 'Framework', name: 'Java Spring Boot', quantity: 1, unit: 'framework', hasArea: false, unitCost: 0.00, totalCost: 0.00 },
        { id: '2', type: 'Platform', name: 'Docker', quantity: 1, unit: 'platform', hasArea: false, unitCost: 0.00, totalCost: 0.00 }
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
        { id: '1', type: 'Tool', name: 'Tableau', quantity: 1, unit: 'license', hasArea: false, unitCost: 70.00, totalCost: 70.00 },
        { id: '2', type: 'Language', name: 'Python', quantity: 1, unit: 'language', hasArea: false, unitCost: 0.00, totalCost: 0.00 }
      ],
      personInCharge: 'Anna Chen',
      progress: 100
    },
    {
      id: '10',
      title: 'IoT Device Management System',
      description: 'Centralized management system for IoT devices with monitoring, updates, and configuration management',
      status: 'review',
      startDate: new Date(2024, 11, 1),
      endDate: new Date(2025, 2, 15), // Future date to avoid overdue
      team: ['Kevin Park', 'Lisa Zhang', 'Ahmed Hassan', 'Sophie Miller'],
      priority: 'low',
      materials: [
        { id: '1', type: 'Hardware', name: 'Arduino', quantity: 10, unit: 'piece', hasArea: false, unitCost: 25.00, totalCost: 250.00 },
        { id: '2', type: 'Hardware', name: 'Raspberry Pi', quantity: 5, unit: 'piece', hasArea: false, unitCost: 75.00, totalCost: 375.00 }
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
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [materialSuggestions, setMaterialSuggestions] = useState<{[key: string]: string[]}>({});
  const [activeMaterialInput, setActiveMaterialInput] = useState<string | null>(null);

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

  // Check for overdue projects on component mount and daily
  useEffect(() => {
    const checkOverdueProjects = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      setProjects(prev => prev.map(project => {
        const endDate = new Date(project.endDate);
        endDate.setHours(0, 0, 0, 0);

        // Mark as overdue if past deadline and not completed
        if (endDate < today && project.status !== 'done' && project.status !== 'overdue') {
          return { ...project, status: 'overdue' as Project['status'] };
        }
        return project;
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

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.team.some(member => member.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getProjectsByStatus = (status: Project['status']) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updatedProjects = filteredProjects.map(project => {
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
    });

    // Update the main projects state if any changes were made
    const hasChanges = updatedProjects.some((updated, index) =>
      updated.status !== filteredProjects[index].status
    );

    if (hasChanges) {
      setProjects(prev => {
        return prev.map(project => {
          const updated = updatedProjects.find(u => u.id === project.id);
          return updated || project;
        });
      });
    }

    return updatedProjects.filter(project => project.status === status);
  };

  const moveProject = (projectId: string, newStatus: Project['status']) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, status: newStatus }
        : project
    ));
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setIsViewDialogOpen(false);
  };

  const openViewDialog = (project: Project) => {
    setSelectedProject(project);
    setIsViewDialogOpen(true);
  };

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

  const addProject = () => {
    console.log('Pipeline addProject called with:', newProject);

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

      console.log('Creating project in pipeline:', project);
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
      console.log('Project added successfully to pipeline');
    } catch (error) {
      console.error('Error creating project in pipeline:', error);
      alert('Error creating project. Please try again.');
    }
  };

  const getProgressPercentage = (project: Project) => {
    return project.progress;
  };

  const getDaysRemaining = (endDate: Date) => {
    const today = new Date();
    const diff = endDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    setDraggedProject(projectId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Project['status']) => {
    e.preventDefault();
    if (draggedProject) {
      moveProject(draggedProject, targetStatus);
      setDraggedProject(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedProject(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Project Pipeline</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Track project progress through workflow stages</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects, team members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>

              <div className="hidden sm:block w-px h-6 bg-border"></div>

              <AppHeader />

              <Link to="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Calendar View
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
                        {newProject.materials.map((material, index) => (
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

      {/* Pipeline Board */}
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
          {Object.entries(statusConfig).map(([status, config]) => {
            const statusProjects = getProjectsByStatus(status as Project['status']);
            const IconComponent = config.icon;
            
            return (
              <div key={status} className="flex flex-col">
                {/* Column Header */}
                <div className={`${config.headerColor} rounded-lg p-4 mb-4 border`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5" />
                      <h2 className="font-semibold">{config.title}</h2>
                    </div>
                    <Badge variant="secondary" className="bg-white/50">
                      {statusProjects.length}
                    </Badge>
                  </div>
                </div>

                {/* Project Cards */}
                <div
                  className="space-y-4 flex-1 min-h-[200px]"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, status as Project['status'])}
                >
                  {statusProjects.map(project => {
                    const daysRemaining = getDaysRemaining(project.endDate);
                    const progress = getProgressPercentage(project);
                    const isOverdue = daysRemaining < 0 && project.status !== 'done';
                    
                    return (
                      <Card
                        key={project.id}
                        draggable
                        className={`${config.cardColor} transition-all duration-200 cursor-grab active:cursor-grabbing transform hover:scale-[1.02] hover:shadow-md ${
                          draggedProject === project.id ? 'opacity-50 scale-95' : ''
                        }`}
                        onClick={() => openViewDialog(project)}
                        onDragStart={(e) => handleDragStart(e, project.id)}
                        onDragEnd={handleDragEnd}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-sm font-semibold line-clamp-2">
                              {project.title}
                            </CardTitle>
                            <Badge 
                              variant="outline" 
                              className={`${priorityColors[project.priority]} text-xs ml-2 flex-shrink-0`}
                            >
                              {project.priority}
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-3">
                          <p className="text-xs text-muted-foreground line-clamp-3">
                            {project.description}
                          </p>
                          
                          {/* Progress Bar */}
                          {project.status !== 'done' && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{Math.round(progress)}%</span>
                              </div>
                              <div className="w-full bg-background rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    project.status === 'todo' ? 'bg-blue-400' :
                                    project.status === 'in-progress' ? 'bg-yellow-400' :
                                    project.status === 'review' ? 'bg-purple-400' :
                                    'bg-green-400'
                                  }`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                          
                          {/* Team & Deadline */}
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span>{project.team.length} members</span>
                            </div>
                            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`}>
                              <Clock className="h-3 w-3" />
                              <span>
                                {isOverdue 
                                  ? `${Math.abs(daysRemaining)}d overdue`
                                  : project.status === 'done'
                                  ? 'Completed'
                                  : `${daysRemaining}d left`
                                }
                              </span>
                            </div>
                          </div>
                          
                          {/* Team Avatars */}
                          <div className="flex items-center gap-1">
                            {project.team.slice(0, 3).map((member, index) => (
                              <div
                                key={index}
                                className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary border-2 border-background"
                                title={member}
                              >
                                {member.split(' ').map(n => n[0]).join('')}
                              </div>
                            ))}
                            {project.team.length > 3 && (
                              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground border-2 border-background">
                                +{project.team.length - 3}
                              </div>
                            )}
                          </div>

                          {/* Cost Display */}
                          <div className="px-3 py-2 bg-primary/5 rounded-lg border border-primary/20">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-medium text-primary">Estimated Cost:</span>
                              <span className="font-bold text-primary">${calculateProjectCost(project.materials).toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex gap-1">
                              {status !== 'done' && status !== 'overdue' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const nextStatus =
                                      status === 'todo' ? 'in-progress' :
                                      status === 'in-progress' ? 'review' :
                                      'done';
                                    moveProject(project.id, nextStatus);
                                  }}
                                >
                                  Move →
                                </Button>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openViewDialog(project);
                                }}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {/* Empty State */}
                  {statusProjects.length === 0 && (
                    <div
                      className={`${config.color} border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        draggedProject ? 'border-primary bg-primary/5' : ''
                      }`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, status as Project['status'])}
                    >
                      <IconComponent className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {draggedProject ? `Drop to move to ${config.title.toLowerCase()}` : `No projects in ${config.title.toLowerCase()}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
                  <Badge 
                    variant="outline" 
                    className={`${statusConfig[selectedProject.status].headerColor} border-0`}
                  >
                    {statusConfig[selectedProject.status].title}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
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
                    <h4 className="font-medium text-sm mb-2">Progress</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${getProgressPercentage(selectedProject)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{Math.round(getProgressPercentage(selectedProject))}%</span>
                    </div>
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

                <div>
                  <h4 className="font-medium text-sm mb-3">Team Members</h4>
                  <div className="space-y-2">
                    {selectedProject.team.map((member, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-muted rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                          {member.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm">{member}</span>
                      </div>
                    ))}
                  </div>
                </div>

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
                    <Button variant="outline">
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
