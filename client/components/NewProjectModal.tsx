import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  X,
  Calendar,
  User,
  Package,
  DollarSign,
  Clock,
  Plus,
  Minus,
} from "lucide-react";
import type {
  Project,
  ProjectStatus,
  ProjectPriority,
  StockMaterial,
  User as UserType,
  ProjectMaterial,
} from "@shared/crm-types";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: Partial<Project>) => void;
}

// Mock data for materials and users
const mockMaterials: StockMaterial[] = [
  {
    id: "m1",
    name: "A4 Paper 80g",
    description: "Standard white A4 paper",
    category: "paper",
    currentStock: 5000,
    minStock: 500,
    maxStock: 10000,
    unit: { type: "count", name: "Sheets", abbreviation: "sh" },
    unitPrice: 0.05,
    supplier: {
      id: "s1",
      name: "Paper Supply Co",
      contactPerson: "João Silva",
      email: "joao@papersupply.pt",
      phone: "+351 912 345 678",
      address: "Rua da Indústria, 123, Lisboa",
    },
    location: "Warehouse A",
    lastRestocked: "2024-01-01T00:00:00Z",
  },
  {
    id: "m2",
    name: "Black Ink Cartridge",
    description: "High quality black ink for printers",
    category: "ink",
    currentStock: 50,
    minStock: 10,
    maxStock: 100,
    unit: { type: "count", name: "Cartridges", abbreviation: "cart" },
    unitPrice: 45.99,
    supplier: {
      id: "s2",
      name: "Ink Solutions",
      contactPerson: "Maria Santos",
      email: "maria@inksolutions.pt",
      phone: "+351 916 789 012",
      address: "Av. da República, 456, Porto",
    },
    location: "Storage Room B",
    lastRestocked: "2023-12-15T00:00:00Z",
  },
  {
    id: "m3",
    name: "Vinyl Banner Material",
    description: "Weather-resistant vinyl for outdoor banners",
    category: "vinyl",
    currentStock: 250,
    minStock: 50,
    maxStock: 500,
    unit: { type: "area", name: "Square Meters", abbreviation: "m²" },
    unitPrice: 12.5,
    supplier: {
      id: "s3",
      name: "Banner Materials Ltd",
      contactPerson: "Pedro Costa",
      email: "pedro@bannermaterials.pt",
      phone: "+351 913 456 789",
      address: "Zona Industrial, Lote 78, Coimbra",
    },
    location: "Warehouse C",
    lastRestocked: "2024-01-05T00:00:00Z",
  },
];

const mockUsers: UserType[] = [
  {
    id: "u1",
    name: "Ana Silva",
    email: "ana.silva@company.pt",
    role: "designer",
    department: "Design",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "u2",
    name: "Carlos Santos",
    email: "carlos.santos@company.pt",
    role: "printer",
    department: "Production",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "u3",
    name: "Sofia Costa",
    email: "sofia.costa@company.pt",
    role: "manager",
    department: "Management",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

const projectStates: { value: ProjectStatus; label: string }[] = [
  { value: "todo", label: "Pedido de Contacto" },
  { value: "ongoing", label: "Orçamentação" },
  { value: "pending_approval", label: "Aguardando Aprovação" },
  { value: "completed", label: "Montagem" },
  { value: "cancelled", label: "Finalizado" },
];

const priorityOptions: { value: ProjectPriority; label: string }[] = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
  { value: "urgent", label: "Urgente" },
];

export default function NewProjectModal({
  isOpen,
  onClose,
  onSubmit,
}: NewProjectModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    clientName: "",
    clientEmail: "",
    status: "todo" as ProjectStatus,
    priority: "medium" as ProjectPriority,
    startDate: "",
    estimatedEndDate: "",
    budget: 0,
    assignedUsers: [] as string[],
    materials: [] as ProjectMaterial[],
  });

  const [selectedMaterials, setSelectedMaterials] = useState<
    Array<{ materialId: string; quantity: number }>
  >([]);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUserToggle = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedUsers: prev.assignedUsers.includes(userId)
        ? prev.assignedUsers.filter((id) => id !== userId)
        : [...prev.assignedUsers, userId],
    }));
  };

  const addMaterial = () => {
    setSelectedMaterials((prev) => [
      ...prev,
      { materialId: mockMaterials[0].id, quantity: 1 },
    ]);
  };

  const removeMaterial = (index: number) => {
    setSelectedMaterials((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMaterial = (index: number, field: string, value: any) => {
    setSelectedMaterials((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const handleSubmit = () => {
    const projectMaterials: ProjectMaterial[] = selectedMaterials.map(
      (item) => {
        const material = mockMaterials.find((m) => m.id === item.materialId);
        return {
          materialId: item.materialId,
          quantity: item.quantity,
          reservedQuantity: item.quantity,
          usedQuantity: 0,
          costPerUnit: material?.unitPrice || 0,
        };
      },
    );

    const projectData: Partial<Project> = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      assignedUsers: formData.assignedUsers,
      timeline: {
        startDate: formData.startDate,
        estimatedEndDate: formData.estimatedEndDate,
        milestones: [],
      },
      budget: {
        id: `budget-${Date.now()}`,
        projectId: `project-${Date.now()}`,
        totalEstimated: formData.budget,
        totalActual: 0,
        currency: "EUR",
        items: [],
        lastUpdated: new Date().toISOString(),
      },
      materials: projectMaterials,
      attachments: [],
      createdBy: "current-user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(projectData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Novo Projeto</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nome do Projeto *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Identidade Visual Corporativa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nome do Cliente *
                  </label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) =>
                      handleInputChange("clientName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Empresa XYZ Lda"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email do Cliente
                </label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) =>
                    handleInputChange("clientEmail", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="cliente@empresa.pt"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Descrição do Projeto
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descrição detalhada do projeto..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Estado do Projeto
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {projectStates.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Prioridade
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      handleInputChange("priority", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {priorityOptions.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Orçamento (€)
                  </label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) =>
                      handleInputChange("budget", Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Cronograma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Data de Início *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Data de Conclusão Estimada *
                  </label>
                  <input
                    type="date"
                    value={formData.estimatedEndDate}
                    onChange={(e) =>
                      handleInputChange("estimatedEndDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Operadores Responsáveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {mockUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      formData.assignedUsers.includes(user.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => handleUserToggle(user.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          formData.assignedUsers.includes(user.id)
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {formData.assignedUsers.includes(user.id) && (
                          <div className="w-2 h-2 bg-white rounded-sm" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Materials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Materiais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedMaterials.map((item, index) => {
                const material = mockMaterials.find(
                  (m) => m.id === item.materialId,
                );
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border rounded-md"
                  >
                    <div className="flex-1">
                      <select
                        value={item.materialId}
                        onChange={(e) =>
                          updateMaterial(index, "materialId", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {mockMaterials.map((material) => (
                          <option key={material.id} value={material.id}>
                            {material.name} - {material.unitPrice}€/
                            {material.unit.abbreviation}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-32">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateMaterial(
                            index,
                            "quantity",
                            Number(e.target.value),
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Qtd"
                        min="1"
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      {material?.unit.abbreviation}
                    </div>
                    <div className="text-sm font-medium">
                      {((material?.unitPrice || 0) * item.quantity).toFixed(2)}€
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMaterial(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
              <Button variant="outline" onClick={addMaterial}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Material
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.title || !formData.clientName}
          >
            Criar Projeto
          </Button>
        </div>
      </div>
    </div>
  );
}
