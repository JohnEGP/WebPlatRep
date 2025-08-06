import { useState } from "react";
import { CRMLayout } from "@/components/layout/crm-layout";
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
  Search,
  Filter,
  User,
  Mail,
  Calendar,
  Edit,
  Trash2,
  MoreHorizontal,
  X,
} from "lucide-react";
import type { User as UserType, UserRole } from "@shared/crm-types";

// Mock users data
const mockUsers: UserType[] = [
  {
    id: "u1",
    name: "Ana Silva",
    email: "ana.silva@company.pt",
    role: "designer",
    department: "Design",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5f1?w=150&h=150&fit=crop&crop=face",
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "u2",
    name: "Carlos Santos",
    email: "carlos.santos@company.pt",
    role: "printer",
    department: "Production",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    createdAt: "2023-02-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "u3",
    name: "Sofia Costa",
    email: "sofia.costa@company.pt",
    role: "manager",
    department: "Management",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "u4",
    name: "João Peixoto",
    email: "joao.peixoto@company.pt",
    role: "sales",
    department: "Sales",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    createdAt: "2023-03-10T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "u5",
    name: "Mariana Oliveira",
    email: "mariana.oliveira@company.pt",
    role: "admin",
    department: "IT",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

const roleLabels: Record<UserRole, string> = {
  admin: "Administrador",
  manager: "Gestor",
  designer: "Designer",
  printer: "Operador de Impressão",
  sales: "Vendas",
  viewer: "Visualizador",
};

const roleColors: Record<UserRole, string> = {
  admin: "bg-red-100 text-red-800",
  manager: "bg-blue-100 text-blue-800",
  designer: "bg-purple-100 text-purple-800",
  printer: "bg-green-100 text-green-800",
  sales: "bg-yellow-100 text-yellow-800",
  viewer: "bg-gray-100 text-gray-800",
};

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: Partial<UserType>) => void;
  user?: UserType | null;
}

function UserModal({ isOpen, onClose, onSubmit, user }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "viewer" as UserRole,
    department: user?.department || "",
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
    setFormData({ name: "", email: "", role: "viewer", department: "" });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {user ? "Editar Utilizador" : "Novo Utilizador"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nome Completo *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: João Silva"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="joao.silva@empresa.pt"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Função *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(roleLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Departamento</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Design, Produção, Vendas"
            />
          </div>
        </div>

        <div className="p-6 border-t flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.email}
          >
            {user ? "Atualizar" : "Criar"} Utilizador
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState<UserType[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = (userData: Partial<UserType>) => {
    const newUser: UserType = {
      id: `user-${Date.now()}`,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as UserType;
    
    setUsers(prev => [newUser, ...prev]);
  };

  const handleEditUser = (userData: Partial<UserType>) => {
    if (!editingUser) return;
    
    setUsers(prev => 
      prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...userData, updatedAt: new Date().toISOString() }
          : user
      )
    );
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Tem certeza que deseja remover este utilizador?")) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const openEditModal = (user: UserType) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-PT", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <CRMLayout
      title="Gestão de Utilizadores"
      subtitle={`Gerir ${users.length} utilizadores do sistema`}
      actions={
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Utilizador
        </Button>
      }
    >
      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Pesquisar utilizadores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | "all")}
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Todas as Funções</option>
            {Object.entries(roleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Mais Filtros
          </Button>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <CardDescription>{user.department}</CardDescription>
                  </div>
                </div>
                <div className="relative group">
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                  <div className="absolute right-0 top-8 hidden group-hover:block bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button
                      onClick={() => openEditModal(user)}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Remover</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <span className={`px-2 py-1 text-xs rounded-full ${roleColors[user.role]}`}>
                  {roleLabels[user.role]}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{user.email}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Criado em {formatDate(user.createdAt)}</span>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => openEditModal(user)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar Utilizador
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Nenhum utilizador encontrado com os critérios de pesquisa.
          </p>
          <Button className="mt-4" onClick={openCreateModal}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Utilizador
          </Button>
        </div>
      )}

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={editingUser ? handleEditUser : handleCreateUser}
        user={editingUser}
      />
    </CRMLayout>
  );
}
