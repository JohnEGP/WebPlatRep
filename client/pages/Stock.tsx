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
  AlertTriangle,
  Package,
  TrendingDown,
  TrendingUp,
  MoreHorizontal,
  Edit,
  Eye,
  BarChart3,
  Truck,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type {
  StockMaterial,
  MaterialCategory,
  MeasurementUnit,
  Supplier,
} from "@shared/crm-types";

// Mock data for measurement units
const measurementUnits: MeasurementUnit[] = [
  {
    type: "area",
    name: "Square Meters",
    abbreviation: "m²",
    baseConversion: 1,
  },
  {
    type: "area",
    name: "Square Centimeters",
    abbreviation: "cm²",
    baseConversion: 0.0001,
  },
  { type: "length", name: "Meters", abbreviation: "m", baseConversion: 1 },
  {
    type: "length",
    name: "Centimeters",
    abbreviation: "cm",
    baseConversion: 0.01,
  },
  {
    type: "length",
    name: "Millimeters",
    abbreviation: "mm",
    baseConversion: 0.001,
  },
  { type: "weight", name: "Kilograms", abbreviation: "kg", baseConversion: 1 },
  { type: "weight", name: "Grams", abbreviation: "g", baseConversion: 0.001 },
  { type: "volume", name: "Liters", abbreviation: "L", baseConversion: 1 },
  {
    type: "volume",
    name: "Milliliters",
    abbreviation: "mL",
    baseConversion: 0.001,
  },
  { type: "count", name: "Units", abbreviation: "pcs", baseConversion: 1 },
  { type: "count", name: "Sheets", abbreviation: "sheets", baseConversion: 1 },
  { type: "count", name: "Rolls", abbreviation: "rolls", baseConversion: 1 },
];

// Mock suppliers
const suppliers: Supplier[] = [
  {
    id: "s1",
    name: "Paper Solutions Ltd",
    contactPerson: "Ana Silva",
    email: "ana@papersolutions.pt",
    phone: "+351 213 456 789",
    address: "Rua das Industrias, 123, Lisboa",
  },
  {
    id: "s2",
    name: "Ink Masters",
    contactPerson: "João Santos",
    email: "joao@inkmasters.pt",
    phone: "+351 218 765 432",
    address: "Avenida da Tecnologia, 45, Porto",
  },
  {
    id: "s3",
    name: "Vinyl Pro",
    contactPerson: "Maria Costa",
    email: "maria@vinylpro.pt",
    phone: "+351 215 987 654",
    address: "Estrada dos Materiais, 67, Coimbra",
  },
];

// Mock stock materials
const mockStockMaterials: StockMaterial[] = [
  {
    id: "m1",
    name: "A4 Premium Paper",
    description: "High-quality white paper for professional printing",
    category: "paper",
    currentStock: 2500,
    minStock: 500,
    maxStock: 5000,
    unit: measurementUnits.find((u) => u.abbreviation === "sheets")!,
    unitPrice: 0.05,
    supplier: suppliers[0],
    location: "Warehouse A - Shelf 1",
    lastRestocked: "2024-01-01T10:00:00Z",
  },
  {
    id: "m2",
    name: "Cyan Ink Cartridge HP",
    description: "Original HP cyan ink cartridge for large format printers",
    category: "ink",
    currentStock: 3,
    minStock: 5,
    maxStock: 20,
    unit: measurementUnits.find((u) => u.abbreviation === "pcs")!,
    unitPrice: 85.5,
    supplier: suppliers[1],
    location: "Storage Room B - Cabinet 2",
    lastRestocked: "2023-12-15T14:30:00Z",
  },
  {
    id: "m3",
    name: "Vinyl Roll White 1.5m",
    description: "White adhesive vinyl roll, 1.5m width for outdoor signage",
    category: "vinyl",
    currentStock: 180,
    minStock: 50,
    maxStock: 300,
    unit: measurementUnits.find((u) => u.abbreviation === "m")!,
    unitPrice: 12.3,
    supplier: suppliers[2],
    location: "Warehouse A - Roll Storage",
    lastRestocked: "2024-01-05T09:15:00Z",
  },
  {
    id: "m4",
    name: "Canvas Premium 280gsm",
    description: "Premium canvas for fine art printing, 280gsm weight",
    category: "fabric",
    currentStock: 15.5,
    minStock: 20,
    maxStock: 100,
    unit: measurementUnits.find((u) => u.abbreviation === "m²")!,
    unitPrice: 28.9,
    supplier: suppliers[0],
    location: "Climate Controlled Storage",
    lastRestocked: "2023-12-20T11:45:00Z",
  },
  {
    id: "m5",
    name: "Acrylic Sheet 3mm Clear",
    description: "Clear acrylic sheets for signage and displays",
    category: "plastic",
    currentStock: 45,
    minStock: 10,
    maxStock: 80,
    unit: measurementUnits.find((u) => u.abbreviation === "pcs")!,
    unitPrice: 15.75,
    supplier: suppliers[2],
    location: "Warehouse B - Flat Storage",
    lastRestocked: "2024-01-03T16:20:00Z",
  },
  {
    id: "m6",
    name: "Magenta Toner",
    description: "Magenta toner cartridge for color laser printers",
    category: "ink",
    currentStock: 1,
    minStock: 3,
    maxStock: 15,
    unit: measurementUnits.find((u) => u.abbreviation === "pcs")!,
    unitPrice: 92.4,
    supplier: suppliers[1],
    location: "Storage Room B - Cabinet 1",
    lastRestocked: "2023-11-28T13:10:00Z",
  },
];

const categoryOptions: { value: MaterialCategory; label: string }[] = [
  { value: "paper", label: "Paper" },
  { value: "ink", label: "Ink & Toner" },
  { value: "vinyl", label: "Vinyl" },
  { value: "fabric", label: "Fabric" },
  { value: "plastic", label: "Plastic" },
  { value: "metal", label: "Metal" },
  { value: "tools", label: "Tools" },
  { value: "other", label: "Other" },
];

export default function Stock() {
  const [materials] = useState<StockMaterial[]>(mockStockMaterials);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    MaterialCategory | "all"
  >("all");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out">("all");

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || material.category === categoryFilter;
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && material.currentStock <= material.minStock) ||
      (stockFilter === "out" && material.currentStock === 0);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const lowStockCount = materials.filter(
    (m) => m.currentStock <= m.minStock && m.currentStock > 0,
  ).length;
  const outOfStockCount = materials.filter((m) => m.currentStock === 0).length;
  const totalValue = materials.reduce(
    (sum, m) => sum + m.currentStock * m.unitPrice,
    0,
  );

  const getStockStatus = (
    material: StockMaterial,
  ): { status: string; color: string } => {
    if (material.currentStock === 0) {
      return {
        status: "Out of Stock",
        color: "bg-red-100 text-red-800 border-red-200",
      };
    } else if (material.currentStock <= material.minStock) {
      return {
        status: "Low Stock",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    } else if (material.currentStock >= material.maxStock * 0.8) {
      return {
        status: "Well Stocked",
        color: "bg-green-100 text-green-800 border-green-200",
      };
    } else {
      return {
        status: "Normal",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      };
    }
  };

  const getStockPercentage = (material: StockMaterial): number => {
    return Math.min(100, (material.currentStock / material.maxStock) * 100);
  };

  const getCategoryIcon = (category: MaterialCategory) => {
    switch (category) {
      case "paper":
        return "📄";
      case "ink":
        return "🖨️";
      case "vinyl":
        return "🎯";
      case "fabric":
        return "🧵";
      case "plastic":
        return "🔲";
      case "metal":
        return "⚡";
      case "tools":
        return "🔧";
      default:
        return "📦";
    }
  };

  return (
    <CRMLayout
      title="Stock Management"
      subtitle={`Managing ${materials.length} different materials across multiple measurement units`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline">
            <Truck className="h-4 w-4 mr-2" />
            Restock Orders
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Material
          </Button>
        </div>
      }
    >
      {/* Stock Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Materials
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {new Set(materials.map((m) => m.category)).size} categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Alert
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {lowStockCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Items below minimum stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {outOfStockCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate restocking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Stock Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current inventory value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search materials, suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value as MaterialCategory | "all")
            }
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Categories</option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) =>
              setStockFilter(e.target.value as "all" | "low" | "out")
            }
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Stock Levels</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>

          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced
          </Button>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => {
          const stockStatus = getStockStatus(material);
          const stockPercentage = getStockPercentage(material);

          return (
            <Card
              key={material.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">
                      {getCategoryIcon(material.category)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{material.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {material.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full border ${stockStatus.color}`}
                  >
                    {stockStatus.status}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {material.category}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stock Level */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Stock Level</span>
                    <span className="font-medium">
                      {material.currentStock} {material.unit.abbreviation}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        stockPercentage <= 20
                          ? "bg-red-500"
                          : stockPercentage <= 40
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${stockPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Min: {material.minStock}</span>
                    <span>Max: {material.maxStock}</span>
                  </div>
                </div>

                {/* Material Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Unit Price</p>
                    <p className="font-medium">
                      {formatCurrency(material.unitPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Value</p>
                    <p className="font-medium">
                      {formatCurrency(
                        material.currentStock * material.unitPrice,
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Supplier</p>
                    <p className="font-medium truncate">
                      {material.supplier.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium truncate">{material.location}</p>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Last restocked: {formatDate(material.lastRestocked)}
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
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No materials found matching your criteria.
          </p>
          <Button className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add New Material
          </Button>
        </div>
      )}
    </CRMLayout>
  );
}
