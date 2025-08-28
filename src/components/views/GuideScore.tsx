import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Search,
  Edit,
  Trash2,
  Plus,
  Loader2,
  Star,
  TrendingUp,
  Users,
  Car,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth to access user role

interface GuideData {
  id: number;
  name: string;
  number: string;
  vehicle_type: string;
  score: number;
  createdAt?: string;
  updatedAt?: string;
}

interface GuideFormProps {
  formData: {
    name: string;
    number: string;
    vehicle_type: string;
    score: string;
  };
  handleInputChange: (field: string, value: string) => void;
  actionLoading: boolean;
  vehicleOptions: string[];
  nameInputRef?: React.RefObject<HTMLInputElement>;
  isEdit?: boolean;
}

const GuideForm = ({
  formData,
  handleInputChange,
  actionLoading,
  vehicleOptions,
  nameInputRef,
  isEdit = false,
}: GuideFormProps) => (
  <div className="grid gap-6 py-4">
    <div className="grid gap-3">
      <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
        Guide Name <span className="text-red-500">*</span>
      </Label>
      <Input
        id="name"
        placeholder="Enter guide name"
        value={formData.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        className="w-full border-2 focus:border-blue-500 transition-colors"
        disabled={actionLoading}
        ref={nameInputRef}
      />
    </div>

    <div className="grid gap-3">
      <Label htmlFor="number" className="text-sm font-semibold text-gray-700">
        Guide Number <span className="text-red-500">*</span>
      </Label>
      <Input
        id="number"
        placeholder="Enter guide number"
        value={formData.number}
        onChange={(e) => handleInputChange("number", e.target.value)}
        className="w-full border-2 focus:border-blue-500 transition-colors"
        disabled={actionLoading}
      />
    </div>

    <div className="grid gap-3">
      <Label
        htmlFor="vehicle_type"
        className="text-sm font-semibold text-gray-700"
      >
        Vehicle Type <span className="text-red-500">*</span>
      </Label>
      <Select
        value={formData.vehicle_type}
        onValueChange={(value) => handleInputChange("vehicle_type", value)}
        disabled={actionLoading}
      >
        <SelectTrigger className="border-2 focus:border-blue-500">
          <SelectValue placeholder="Select vehicle type" />
        </SelectTrigger>
        <SelectContent>
          {vehicleOptions.map((vehicle) => (
            <SelectItem key={vehicle} value={vehicle}>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                {vehicle.charAt(0).toUpperCase() + vehicle.slice(1)}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="grid gap-3">
      <Label htmlFor="score" className="text-sm font-semibold text-gray-700">
        Guide Score <span className="text-red-500">*</span>
      </Label>
      <Input
        id="score"
        type="number"
        placeholder="Enter score (0-1000)"
        value={formData.score}
        onChange={(e) => handleInputChange("score", e.target.value)}
        className="w-full border-2 focus:border-blue-500 transition-colors"
        disabled={actionLoading}
        min="0"
        max="1000"
      />
    </div>
  </div>
);

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </CardContent>
  </Card>
);

export function GuideScore() {
  const [searchFilter, setSearchFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<GuideData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    vehicle_type: "",
    score: "",
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const { guides, fetchGuides, addGuide, updateGuide, deleteGuide } = useData();
  const { user } = useAuth(); // Get user from AuthContext to check role

  const isAdmin = user?.role === "admin"; // Check if user is admin

  const vehicleOptions = ["guide", "big car", "car", "auto", "tt"];

  // Fetch guides on component mount
  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    setLoading(true);
    try {
      await fetchGuides();
    } catch (error) {
      toast({
        title: "Failed to load guides",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Focus the name input when edit modal opens
  useEffect(() => {
    if (isEditModalOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditModalOpen]);

  const getScoreColor = (score: number) => {
    if (score >= 800)
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (score >= 600) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 400) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (score >= 200) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 800) return "Excellent";
    if (score >= 600) return "Good";
    if (score >= 400) return "Average";
    if (score >= 200) return "Below Average";
    return "Poor";
  };

  const filteredGuides = guides.filter((guide) => {
    const matchesSearch =
      guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.number.includes(searchQuery);
    const matchesFilter =
      searchFilter === "All" || guide.vehicle_type === searchFilter;
    return matchesSearch && matchesFilter;
  });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGuides = filteredGuides.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGuides.length / itemsPerPage);

  // Calculate statistics
  const totalGuides = guides.length;
  const averageScore =
    guides.length > 0
      ? Math.round(
          guides.reduce((sum, guide) => sum + guide.score, 0) / guides.length
        )
      : 0;
  const topPerformers = guides.filter((guide) => guide.score >= 600).length;

  const resetForm = () => {
    setFormData({
      name: "",
      number: "",
      vehicle_type: "",
      score: "",
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Guide name is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.number.trim()) {
      toast({
        title: "Validation Error",
        description: "Guide number is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.vehicle_type) {
      toast({
        title: "Validation Error",
        description: "Vehicle type is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.score || isNaN(Number(formData.score))) {
      toast({
        title: "Validation Error",
        description: "Valid score is required",
        variant: "destructive",
      });
      return false;
    }
    const score = Number(formData.score);
    if (score < 0 || score > 1000) {
      toast({
        title: "Validation Error",
        description: "Score must be between 0 and 1000",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleAddGuide = async () => {
    if (!validateForm()) return;

    setActionLoading(true);

    try {
      const success = await addGuide({
        name: formData.name,
        number: formData.number,
        vehicle_type: formData.vehicle_type,
        score: Number(formData.score),
      });

      if (success) {
        resetForm();
        setIsAddModalOpen(false);
        toast({
          title: "Success! 🎉",
          description: "Guide added successfully",
        });
      }
    } catch (error) {
      console.error("Error adding guide:", error);
      toast({
        title: "Error",
        description: "Failed to add guide. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditGuide = (guide: GuideData) => {
    setEditingGuide(guide);
    setFormData({
      name: guide.name,
      number: guide.number,
      vehicle_type: guide.vehicle_type,
      score: guide.score.toString(),
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateGuide = async () => {
    if (!validateForm() || !editingGuide) return;

    setActionLoading(true);

    try {
      const success = await updateGuide(editingGuide.id, {
        name: formData.name,
        number: formData.number,
        vehicle_type: formData.vehicle_type,
        score: Number(formData.score),
      });

      if (success) {
        resetForm();
        setIsEditModalOpen(false);
        setEditingGuide(null);
        toast({
          title: "Success! ✨",
          description: "Guide updated successfully",
        });
      }
    } catch (error) {
      console.error("Error updating guide:", error);
      toast({
        title: "Error",
        description: "Failed to update guide. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteGuide = async (id: number, name: string) => {
    setActionLoading(true);

    try {
      const success = await deleteGuide(id);
      if (success) {
        toast({
          title: "Success! 🗑️",
          description: "Guide deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting guide:", error);
      toast({
        title: "Error",
        description: "Failed to delete guide. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleAddModalOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading guides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Guide Score
          </h2>
          <p className="text-muted-foreground">
            Monitor and manage guide performance metrics
          </p>
        </div>

        {/* Add New Guide Modal - Only visible for admins */}
        {isAdmin && (
          <Dialog
            open={isAddModalOpen}
            onOpenChange={(open) => {
              if (!open) {
                setIsAddModalOpen(false);
                resetForm();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleAddModalOpen}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Guide
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Add New Guide
                </DialogTitle>
              </DialogHeader>
              <GuideForm
                formData={formData}
                handleInputChange={handleInputChange}
                actionLoading={actionLoading}
                vehicleOptions={vehicleOptions}
              />
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddGuide}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Guide"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Guides"
          value={totalGuides}
          icon={Users}
          color="text-blue-600"
        />
        <StatCard
          title="Average Score"
          value={averageScore}
          icon={TrendingUp}
          color="text-green-600"
        />
        <StatCard
          title="Top Performers"
          value={topPerformers}
          icon={Star}
          color="text-yellow-600"
        />
      </div>

      {/* Edit Guide Modal - Only accessible for admins */}
      {isAdmin && (
        <Dialog
          open={isEditModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsEditModalOpen(false);
              resetForm();
              setEditingGuide(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Edit Guide
              </DialogTitle>
            </DialogHeader>
            <GuideForm
              formData={formData}
              handleInputChange={handleInputChange}
              actionLoading={actionLoading}
              vehicleOptions={vehicleOptions}
              nameInputRef={nameInputRef}
              isEdit={true}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false);
                  resetForm();
                  setEditingGuide(null);
                }}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateGuide}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Guide"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Main Content Card */}
      <Card className="shadow-lg">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Award className="w-5 h-5" />
            Guide Performance Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select value={searchFilter} onValueChange={setSearchFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                {vehicleOptions.map((vehicle) => (
                  <SelectItem key={vehicle} value={vehicle}>
                    {vehicle.charAt(0).toUpperCase() + vehicle.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search for guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Find
            </Button>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg mb-6">
            <p className="text-sm text-muted-foreground">
              <strong>Fetched Vehicle:</strong>{" "}
              {searchFilter === "All" ? "All" : searchFilter}
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left p-4 font-semibold bg-slate-700 text-white">
                    S.No
                  </th>
                  <th className="text-left p-4 font-semibold bg-slate-700 text-white">
                    ID
                  </th>
                  <th className="text-left p-4 font-semibold bg-slate-700 text-white">
                    GUIDE NAME
                  </th>
                  <th className="text-left p-4 font-semibold bg-slate-700 text-white">
                    GUIDE NUMBER
                  </th>
                  <th className="text-left p-4 font-semibold bg-slate-700 text-white">
                    VEHICLE TYPE
                  </th>
                  <th className="text-left p-4 font-semibold bg-slate-700 text-white">
                    GUIDE SCORE
                  </th>
                  {isAdmin && (
                    <th className="text-center p-4 font-semibold bg-slate-700 text-white">
                      ACTIONS
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentGuides.length > 0 ? (
                  currentGuides.map((guide, index) => (
                    <tr
                      key={guide.id}
                      className={index % 2 === 0 ? "bg-slate-50" : "bg-white"}
                    >
                      <td className="p-4 font-medium">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="p-4 font-medium">{guide.id}</td>
                      <td className="p-4 font-medium capitalize">
                        {guide.name}
                      </td>
                      <td className="p-4 text-slate-600">{guide.number}</td>
                      <td className="p-4">
                        <Badge variant="secondary" className="capitalize">
                          {guide.vehicle_type}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <Badge
                            className={`${getScoreColor(
                              guide.score
                            )} font-semibold`}
                          >
                            {guide.score}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {getScoreLabel(guide.score)}
                          </span>
                        </div>
                      </td>
                      {isAdmin && (
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditGuide(guide);
                              }}
                              className="border-blue-300 text-blue-600 hover:bg-blue-50"
                              disabled={actionLoading}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteGuide(guide.id, guide.name);
                              }}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={actionLoading}
                            >
                              {actionLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={isAdmin ? 7 : 6}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No guides found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center p-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="mr-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => paginate(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-2"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
