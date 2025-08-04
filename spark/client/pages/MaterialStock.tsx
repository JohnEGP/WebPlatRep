import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Package, 
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';

interface StockItem {
  id: string;
  name: string;
  type: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  unitCost: number;
  supplier: string;
  lastRestocked: Date;
  location: string;
  // Area-based materials
  hasArea?: boolean;
  width?: number;
  height?: number;
  areaUnit?: string;
}

const stockCategories = [
  'Vinyl & Signage',
  'Hardware',
  'Software',
  'Tools & Equipment',
  'Raw Materials',
  'Office Supplies',
  'Electronics',
  'Consumables'
];

const stockStatuses = {
  'In Stock': 'bg-green-100 text-green-800 border-green-200',
  'Low Stock': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Out of Stock': 'bg-red-100 text-red-800 border-red-200',
  'Overstocked': 'bg-blue-100 text-blue-800 border-blue-200'
};

export default function MaterialStock() {
  const [stockItems, setStockItems] = useState<StockItem[]>([
    {
      id: '1',
      name: 'Vinyl Banner Material',
      type: 'Material',
      category: 'Vinyl & Signage',
      currentStock: 25,
      minimumStock: 10,
      unit: 'roll',
      unitCost: 45.99,
      supplier: 'SignPro Materials',
      lastRestocked: new Date(2024, 11, 1),
      location: 'Warehouse A-1',
      hasArea: true,
      width: 150,
      height: 300,
      areaUnit: 'cm²'
    },
    {
      id: '2',
      name: 'Adhesive Vinyl',
      type: 'Material',
      category: 'Vinyl & Signage',
      currentStock: 8,
      minimumStock: 15,
      unit: 'roll',
      unitCost: 32.50,
      supplier: 'VinylWorld',
      lastRestocked: new Date(2024, 10, 15),
      location: 'Warehouse A-2',
      hasArea: true,
      width: 100,
      height: 500,
      areaUnit: 'cm²'
    },
    {
      id: '3',
      name: 'Industrial Printer',
      type: 'Equipment',
      category: 'Tools & Equipment',
      currentStock: 2,
      minimumStock: 1,
      unit: 'unit',
      unitCost: 2500.00,
      supplier: 'TechEquip Pro',
      lastRestocked: new Date(2024, 9, 20),
      location: 'Workshop B',
      hasArea: false
    },
    {
      id: '4',
      name: 'Design Software License',
      type: 'Software',
      category: 'Software',
      currentStock: 10,
      minimumStock: 5,
      unit: 'license',
      unitCost: 299.99,
      supplier: 'Adobe Systems',
      lastRestocked: new Date(2024, 11, 10),
      location: 'Digital Assets',
      hasArea: false
    },
    {
      id: '5',
      name: 'Aluminum Sheets',
      type: 'Material',
      category: 'Raw Materials',
      currentStock: 0,
      minimumStock: 20,
      unit: 'sheet',
      unitCost: 85.00,
      supplier: 'MetalWorks Inc',
      lastRestocked: new Date(2024, 10, 5),
      location: 'Warehouse C-1',
      hasArea: true,
      width: 120,
      height: 240,
      areaUnit: 'cm²'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [newItem, setNewItem] = useState({
    name: '',
    type: 'Material',
    category: 'Vinyl & Signage',
    currentStock: 0,
    minimumStock: 0,
    unit: 'piece',
    unitCost: 0,
    supplier: '',
    location: '',
    hasArea: false,
    width: 0,
    height: 0,
    areaUnit: 'm²'
  });

  const getStockStatus = (item: StockItem) => {
    if (item.currentStock === 0) return 'Out of Stock';
    if (item.currentStock <= item.minimumStock) return 'Low Stock';
    if (item.currentStock > item.minimumStock * 3) return 'Overstocked';
    return 'In Stock';
  };

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    // Primary sort by type
    if (a.type !== b.type) {
      return a.type.localeCompare(b.type);
    }
    // Secondary sort by name within same type
    return a.name.localeCompare(b.name);
  });

  const addStockItem = () => {
    if (!newItem.name || !newItem.supplier) return;
    
    const item: StockItem = {
      id: Date.now().toString(),
      name: newItem.name,
      type: newItem.type,
      category: newItem.category,
      currentStock: newItem.currentStock,
      minimumStock: newItem.minimumStock,
      unit: newItem.unit,
      unitCost: newItem.unitCost,
      supplier: newItem.supplier,
      lastRestocked: new Date(),
      location: newItem.location,
      hasArea: newItem.hasArea,
      width: newItem.width,
      height: newItem.height,
      areaUnit: newItem.areaUnit
    };
    
    setStockItems(prev => [...prev, item]);
    resetForm();
    setIsDialogOpen(false);
  };

  const updateStockItem = () => {
    if (!editingItem || !newItem.name || !newItem.supplier) return;
    
    const updatedItem: StockItem = {
      ...editingItem,
      name: newItem.name,
      type: newItem.type,
      category: newItem.category,
      currentStock: newItem.currentStock,
      minimumStock: newItem.minimumStock,
      unit: newItem.unit,
      unitCost: newItem.unitCost,
      supplier: newItem.supplier,
      location: newItem.location,
      hasArea: newItem.hasArea,
      width: newItem.width,
      height: newItem.height,
      areaUnit: newItem.areaUnit
    };
    
    setStockItems(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
    resetForm();
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const deleteStockItem = (id: string) => {
    setStockItems(prev => prev.filter(item => item.id !== id));
  };

  const openEditDialog = (item: StockItem) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      type: item.type,
      category: item.category,
      currentStock: item.currentStock,
      minimumStock: item.minimumStock,
      unit: item.unit,
      unitCost: item.unitCost,
      supplier: item.supplier,
      location: item.location,
      hasArea: item.hasArea || false,
      width: item.width || 0,
      height: item.height || 0,
      areaUnit: item.areaUnit || 'm²'
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setNewItem({
      name: '',
      type: 'Material',
      category: 'Vinyl & Signage',
      currentStock: 0,
      minimumStock: 0,
      unit: 'piece',
      unitCost: 0,
      supplier: '',
      location: '',
      hasArea: false,
      width: 0,
      height: 0,
      areaUnit: 'm²'
    });
  };

  const getTotalValue = () => {
    return stockItems.reduce((total, item) => total + (item.currentStock * item.unitCost), 0);
  };

  const getLowStockCount = () => {
    return stockItems.filter(item => item.currentStock <= item.minimumStock).length;
  };

  const getOutOfStockCount = () => {
    return stockItems.filter(item => item.currentStock === 0).length;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Material Stock</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Manage inventory and track material stock levels</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search materials, suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                {stockCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <div className="hidden sm:block w-px h-6 bg-border"></div>

              <AppHeader />

              <Link to="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Calendar
                </Button>
              </Link>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2" onClick={resetForm}>
                    <Plus className="h-4 w-4" />
                    Add Stock Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingItem ? 'Edit Stock Item' : 'Add New Stock Item'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-sm font-medium">Item Name *</label>
                      <Input
                        value={newItem.name}
                        onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Vinyl Banner Material"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <select
                        value={newItem.type}
                        onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        <option value="Material">Material</option>
                        <option value="Tool">Tool</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Software">Software</option>
                        <option value="Consumable">Consumable</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <select
                        value={newItem.category}
                        onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        {stockCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Current Stock</label>
                      <Input
                        type="number"
                        value={newItem.currentStock}
                        onChange={(e) => setNewItem(prev => ({ ...prev, currentStock: parseInt(e.target.value) || 0 }))}
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Minimum Stock</label>
                      <Input
                        type="number"
                        value={newItem.minimumStock}
                        onChange={(e) => setNewItem(prev => ({ ...prev, minimumStock: parseInt(e.target.value) || 0 }))}
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Unit</label>
                      <select
                        value={newItem.unit}
                        onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        <option value="piece">piece</option>
                        <option value="roll">roll</option>
                        <option value="sheet">sheet</option>
                        <option value="license">license</option>
                        <option value="unit">unit</option>
                        <option value="kg">kg</option>
                        <option value="meter">meter</option>
                        <option value="liter">liter</option>
                        <option value="box">box</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Unit Cost ($)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newItem.unitCost}
                        onChange={(e) => setNewItem(prev => ({ ...prev, unitCost: parseFloat(e.target.value) || 0 }))}
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Supplier *</label>
                      <Input
                        value={newItem.supplier}
                        onChange={(e) => setNewItem(prev => ({ ...prev, supplier: e.target.value }))}
                        placeholder="Supplier name"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <Input
                        value={newItem.location}
                        onChange={(e) => setNewItem(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Storage location"
                      />
                    </div>

                    {/* Area/Dimension Section */}
                    <div className="col-span-2 border-t pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="checkbox"
                          id="has-area"
                          checked={newItem.hasArea}
                          onChange={(e) => setNewItem(prev => ({ ...prev, hasArea: e.target.checked }))}
                          className="h-3 w-3 rounded border-gray-300"
                        />
                        <label htmlFor="has-area" className="text-sm font-medium">
                          Has dimensions (for area-based materials)
                        </label>
                      </div>

                      {newItem.hasArea && (
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="text-sm text-muted-foreground">Width</label>
                            <Input
                              type="number"
                              value={newItem.width}
                              onChange={(e) => setNewItem(prev => ({ ...prev, width: parseFloat(e.target.value) || 0 }))}
                              step="0.1"
                              min="0"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Height</label>
                            <Input
                              type="number"
                              value={newItem.height}
                              onChange={(e) => setNewItem(prev => ({ ...prev, height: parseFloat(e.target.value) || 0 }))}
                              step="0.1"
                              min="0"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-muted-foreground">Area Unit</label>
                            <select
                              value={newItem.areaUnit}
                              onChange={(e) => setNewItem(prev => ({ ...prev, areaUnit: e.target.value }))}
                              className="w-full px-2 py-1 text-sm border border-input bg-background rounded"
                            >
                              <option value="m²">m²</option>
                              <option value="cm²">cm²</option>
                              <option value="ft²">ft²</option>
                              <option value="in²">in²</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-6">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={editingItem ? updateStockItem : addStockItem}>
                      {editingItem ? 'Update Item' : 'Add Item'}
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
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockItems.length}</div>
              <p className="text-xs text-muted-foreground">Unique stock items</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${getTotalValue().toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Current inventory value</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{getLowStockCount()}</div>
              <p className="text-xs text-muted-foreground">Items need restocking</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{getOutOfStockCount()}</div>
              <p className="text-xs text-muted-foreground">Items unavailable</p>
            </CardContent>
          </Card>
        </div>

        {/* Stock Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredItems.map(item => {
                const status = getStockStatus(item);
                return (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{item.name}</h3>
                        <Badge variant="outline" className={stockStatuses[status]}>
                          {status}
                        </Badge>
                        <Badge variant="secondary">{item.category}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Stock:</span> {item.currentStock} {item.unit}
                          {item.currentStock <= item.minimumStock && (
                            <span className="text-yellow-600 ml-1">(Min: {item.minimumStock})</span>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">Unit Cost:</span> ${item.unitCost}
                        </div>
                        <div>
                          <span className="font-medium">Supplier:</span> {item.supplier}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {item.location}
                        </div>
                      </div>

                      {item.hasArea && item.width && item.height && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Dimensions:</span> {item.width} × {item.height} {item.areaUnit?.replace('²', '')} 
                          <span className="ml-2">({(item.width * item.height).toFixed(2)} {item.areaUnit} per {item.unit})</span>
                        </div>
                      )}
                      
                      <div className="text-sm">
                        <span className="font-medium">Total Value:</span> ${(item.currentStock * item.unitCost).toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteStockItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              {filteredItems.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No stock items found</p>
                  <p className="text-sm">Add your first stock item to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
