import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Ticket,
  Plus,
  Edit,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth to access user role

interface TicketData {
  id: number;
  price: number;
  ticket_type: string;
  show_name: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TicketFormProps {
  formData: {
    price: string;
    ticket_type: string;
    show_name: string;
    category: string;
  };
  handleInputChange: (field: string, value: string) => void;
  actionLoading: boolean;
  categoryOptions: string[];
  priceInputRef?: React.RefObject<HTMLInputElement>;
}

const TicketForm = ({
  formData,
  handleInputChange,
  actionLoading,
  categoryOptions,
  priceInputRef,
}: TicketFormProps) => (
  <div className="grid gap-4 py-4">
    <div className="grid gap-2">
      <Label htmlFor="price" className="text-sm font-medium">
        Ticket Price (₹)
      </Label>
      <Input
        id="price"
        type="number"
        placeholder="Enter price"
        value={formData.price}
        onChange={(e) => handleInputChange("price", e.target.value)}
        className="w-full"
        disabled={actionLoading}
        ref={priceInputRef}
      />
    </div>
    <div className="grid gap-2">
      <Label htmlFor="ticket_type" className="text-sm font-medium">
        Dropdown Name
      </Label>
      <Input
        id="ticket_type"
        placeholder="Enter dropdown name"
        value={formData.ticket_type}
        onChange={(e) => handleInputChange("ticket_type", e.target.value)}
        className="w-full"
        disabled={actionLoading}
      />
    </div>
    <div className="grid gap-2">
      <Label htmlFor="show_name" className="text-sm font-medium">
        Show Name
      </Label>
      <Input
        id="show_name"
        placeholder="Enter show name"
        value={formData.show_name}
        onChange={(e) => handleInputChange("show_name", e.target.value)}
        className="w-full"
        disabled={actionLoading}
      />
    </div>
    <div className="grid gap-2">
      <Label htmlFor="category" className="text-sm font-medium">
        Category
      </Label>
      <Select
        value={formData.category}
        onValueChange={(value) => handleInputChange("category", value)}
        disabled={actionLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categoryOptions.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);

export function TicketDetails() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketData | null>(null);
  const [formData, setFormData] = useState({
    price: "",
    ticket_type: "",
    show_name: "",
    category: "Adult",
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const priceInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const { tickets, fetchTickets, addTicket, updateTicket, deleteTicket } =
    useData();
  const { user } = useAuth(); // Get user from AuthContext to check role

  const isAdmin = user?.role === "admin"; // Check if user is admin

  const categoryOptions = ["Adult", "Child", "Senior", "Group", "Other"];

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets =
    tickets?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil((tickets?.length || 0) / itemsPerPage);

  // Fetch tickets on component mount
  useEffect(() => {
    loadTickets();
  }, []);

  // Focus the price input when edit modal opens
  useEffect(() => {
    if (isEditModalOpen && priceInputRef.current) {
      priceInputRef.current.focus();
    }
  }, [isEditModalOpen]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      await fetchTickets();
    } catch (error) {
      toast({
        title: "Error loading tickets",
        description: "Failed to fetch tickets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      price: "",
      ticket_type: "",
      show_name: "",
      category: "Adult",
    });
  };

  const handleAddTicket = async () => {
    if (
      !formData.price ||
      !formData.ticket_type ||
      !formData.show_name ||
      !formData.category
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);

    try {
      const ticketData = {
        price: parseInt(formData.price),
        ticket_type: formData.ticket_type,
        show_name: formData.show_name,
        category: formData.category,
      };

      const success = await addTicket(ticketData);

      if (success) {
        resetForm();
        setIsAddModalOpen(false);
        await loadTickets(); // Refresh the list

        toast({
          title: "Success",
          description: "Ticket added successfully",
        });
      }
    } catch (error) {
      console.error("Error adding ticket:", error);
      toast({
        title: "Error",
        description: "Failed to add ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditTicket = (ticket: TicketData) => {
    setEditingTicket(ticket);
    setFormData({
      price: ticket.price.toString(),
      ticket_type: ticket.ticket_type,
      show_name: ticket.show_name,
      category: ticket.category,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateTicket = async () => {
    if (
      !editingTicket ||
      !formData.price ||
      !formData.ticket_type ||
      !formData.show_name ||
      !formData.category
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);

    try {
      const ticketData = {
        price: parseInt(formData.price),
        ticket_type: formData.ticket_type,
        show_name: formData.show_name,
        category: formData.category,
      };

      const success = await updateTicket(editingTicket.id, ticketData);

      if (success) {
        resetForm();
        setIsEditModalOpen(false);
        setEditingTicket(null);
        await loadTickets(); // Refresh the list

        toast({
          title: "Success",
          description: "Ticket updated successfully",
        });
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to update ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTicket = async (id: number) => {
    setActionLoading(true);

    try {
      const success = await deleteTicket(id);

      if (success) {
        await loadTickets(); // Refresh the list
        // Reset to first page if we're on a page that no longer exists
        if (currentPage > totalPages - 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }

        toast({
          title: "Success",
          description: "Ticket deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast({
        title: "Error",
        description: "Failed to delete ticket. Please try again.",
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

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Ticket Details
          </h2>
          <p className="text-muted-foreground">
            Manage ticket prices and show configurations
          </p>
        </div>

        {/* Add New Ticket Modal - Only visible for admins */}
        {isAdmin && (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="flex items-center gap-2">
                    <Ticket className="w-5 h-5" />
                    Add New Ticket
                  </DialogTitle>
                </div>
              </DialogHeader>
              <TicketForm
                formData={formData}
                handleInputChange={handleInputChange}
                actionLoading={actionLoading}
                categoryOptions={categoryOptions}
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
                  onClick={handleAddTicket}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Ticket"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Edit Ticket Modal - Only accessible for admins */}
      {isAdmin && (
        <Dialog
          open={isEditModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsEditModalOpen(false);
              resetForm();
              setEditingTicket(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Edit Ticket
                </DialogTitle>
              </div>
            </DialogHeader>
            <TicketForm
              formData={formData}
              handleInputChange={handleInputChange}
              actionLoading={actionLoading}
              categoryOptions={categoryOptions}
              priceInputRef={priceInputRef}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false);
                  resetForm();
                  setEditingTicket(null);
                }}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateTicket}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Ticket"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Card className="shadow-lg">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Ticket className="w-5 h-5" />
            Ticket Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2">Loading tickets...</span>
            </div>
          ) : tickets && tickets.length > 0 ? (
            <>
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
                        TICKET PRICE
                      </th>
                      <th className="text-left p-4 font-semibold bg-slate-700 text-white">
                        DROPDOWN NAME
                      </th>
                      <th className="text-left p-4 font-semibold bg-slate-700 text-white">
                        SHOW NAME
                      </th>
                      <th className="text-left p-4 font-semibold bg-slate-700 text-white">
                        CATEGORY
                      </th>
                      {isAdmin && (
                        <th className="text-center p-4 font-semibold bg-slate-700 text-white">
                          ACTIONS
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentTickets.map((ticket, index) => (
                      <tr
                        key={ticket.id}
                        className={index % 2 === 0 ? "bg-slate-50" : "bg-white"}
                      >
                        <td className="p-4 font-medium">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="p-4 font-medium">{ticket.id}</td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className="font-semibold text-green-700 border-green-300"
                          >
                            ₹{ticket.price}
                          </Badge>
                        </td>
                        <td className="p-4 text-slate-600">
                          {ticket.ticket_type}
                        </td>
                        <td className="p-4 font-medium">{ticket.show_name}</td>
                        <td className="p-4">
                          <Badge variant="secondary">{ticket.category}</Badge>
                        </td>
                        {isAdmin && (
                          <td className="p-4 text-center">
                            <div className="flex justify-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditTicket(ticket)}
                                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                                disabled={actionLoading}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteTicket(ticket.id)}
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
                    ))}
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
            </>
          ) : (
            <div className="flex justify-center items-center p-8">
              <p className="text-muted-foreground">No tickets found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
