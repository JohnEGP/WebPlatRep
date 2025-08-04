import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Users, 
  Search,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  Building
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: Date;
  lastLogin: Date;
  avatar?: string;
  permissions: string[];
}

const userRoles = [
  'Admin',
  'Project Manager',
  'Designer',
  'Developer',
  'Client',
  'Viewer'
];

const departments = [
  'Management',
  'Design',
  'Development',
  'Marketing',
  'Sales',
  'Support',
  'Operations'
];

const permissions = [
  'View Projects',
  'Create Projects',
  'Edit Projects',
  'Delete Projects',
  'Manage Users',
  'Manage Stock',
  'View Reports',
  'Admin Access'
];

const rolePermissions = {
  'Admin': ['View Projects', 'Create Projects', 'Edit Projects', 'Delete Projects', 'Manage Users', 'Manage Stock', 'View Reports', 'Admin Access'],
  'Project Manager': ['View Projects', 'Create Projects', 'Edit Projects', 'Delete Projects', 'View Reports'],
  'Designer': ['View Projects', 'Create Projects', 'Edit Projects'],
  'Developer': ['View Projects', 'Create Projects', 'Edit Projects'],
  'Client': ['View Projects'],
  'Viewer': ['View Projects']
};

const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@company.com',
      phone: '+1 (555) 123-4567',
      role: 'Admin',
      department: 'Management',
      status: 'active',
      joinDate: new Date(2023, 0, 15),
      lastLogin: new Date(2024, 11, 20),
      permissions: rolePermissions['Admin']
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@company.com',
      phone: '+1 (555) 234-5678',
      role: 'Project Manager',
      department: 'Operations',
      status: 'active',
      joinDate: new Date(2023, 2, 10),
      lastLogin: new Date(2024, 11, 19),
      permissions: rolePermissions['Project Manager']
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Chen',
      email: 'mike.chen@company.com',
      phone: '+1 (555) 345-6789',
      role: 'Designer',
      department: 'Design',
      status: 'active',
      joinDate: new Date(2023, 5, 20),
      lastLogin: new Date(2024, 11, 18),
      permissions: rolePermissions['Designer']
    },
    {
      id: '4',
      firstName: 'Emma',
      lastName: 'Wilson',
      email: 'emma.w@company.com',
      phone: '+1 (555) 456-7890',
      role: 'Developer',
      department: 'Development',
      status: 'active',
      joinDate: new Date(2023, 8, 5),
      lastLogin: new Date(2024, 11, 17),
      permissions: rolePermissions['Developer']
    },
    {
      id: '5',
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@client.com',
      phone: '+1 (555) 567-8901',
      role: 'Client',
      department: 'External',
      status: 'pending',
      joinDate: new Date(2024, 11, 15),
      lastLogin: new Date(2024, 11, 15),
      permissions: rolePermissions['Client']
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Viewer',
    department: 'Operations',
    status: 'active' as User['status']
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const addUser = () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email) return;
    
    const user: User = {
      id: Date.now().toString(),
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      department: newUser.department,
      status: newUser.status,
      joinDate: new Date(),
      lastLogin: new Date(),
      permissions: rolePermissions[newUser.role] || []
    };
    
    setUsers(prev => [...prev, user]);
    resetForm();
    setIsDialogOpen(false);
  };

  const updateUser = () => {
    if (!editingUser || !newUser.firstName || !newUser.lastName || !newUser.email) return;
    
    const updatedUser: User = {
      ...editingUser,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      department: newUser.department,
      status: newUser.status,
      permissions: rolePermissions[newUser.role] || []
    };
    
    setUsers(prev => prev.map(user => user.id === editingUser.id ? updatedUser : user));
    resetForm();
    setEditingUser(null);
    setIsDialogOpen(false);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setNewUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
      status: user.status
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'Viewer',
      department: 'Operations',
      status: 'active'
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getActiveUsersCount = () => {
    return users.filter(user => user.status === 'active').length;
  };

  const getPendingUsersCount = () => {
    return users.filter(user => user.status === 'pending').length;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">User Management</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Manage users, roles, and permissions</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>
              
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Roles</option>
                {userRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>

              <Link to="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Calendar
                </Button>
              </Link>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2" onClick={resetForm}>
                    <Plus className="h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">First Name *</label>
                      <Input
                        value={newUser.firstName}
                        onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="John"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Last Name *</label>
                      <Input
                        value={newUser.lastName}
                        onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Smith"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="text-sm font-medium">Email *</label>
                      <Input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="john.smith@company.com"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <Input
                        value={newUser.phone}
                        onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Role</label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        {userRoles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Department</label>
                      <select
                        value={newUser.department}
                        onChange={(e) => setNewUser(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <select
                        value={newUser.status}
                        onChange={(e) => setNewUser(prev => ({ ...prev, status: e.target.value as User['status'] }))}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>

                    {/* Permissions Preview */}
                    <div className="col-span-2 border-t pt-4">
                      <label className="text-sm font-medium mb-2 block">Role Permissions</label>
                      <div className="flex flex-wrap gap-2">
                        {rolePermissions[newUser.role]?.map(permission => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={editingUser ? updateUser : addUser}>
                      {editingUser ? 'Update User' : 'Add User'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{getActiveUsersCount()}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <UserX className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{getPendingUsersCount()}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departments.length}</div>
              <p className="text-xs text-muted-foreground">Active departments</p>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
                        <Badge variant="outline" className={statusColors[user.status]}>
                          {user.status}
                        </Badge>
                        <Badge variant="secondary">{user.role}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Building className="h-3 w-3" />
                          {user.department}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Joined: {user.joinDate.toLocaleDateString()}</span>
                        <span>Last Login: {user.lastLogin.toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {user.permissions.slice(0, 3).map(permission => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                        {user.permissions.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleUserStatus(user.id)}
                      className={user.status === 'active' ? 'text-red-600 hover:text-red-600' : 'text-green-600 hover:text-green-600'}
                    >
                      {user.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No users found</p>
                  <p className="text-sm">Add your first user to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
