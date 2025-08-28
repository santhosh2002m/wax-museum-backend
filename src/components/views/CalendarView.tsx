import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Search, Pencil, Trash2 } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth to access user role
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

export function CalendarView() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    totalSales: 0,
    totalAmount: "₹0",
    transactions: [],
  });
  const [editTransaction, setEditTransaction] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    adult_count: 0,
    child_count: 0,
    category: "",
    show_name: "",
    total_paid: "",
    date: "",
  });

  const { fetchCalendarData, updateTransaction, deleteTransaction } = useData();
  const { user } = useAuth(); // Get user from AuthContext to check role

  const isAdmin = user?.role === "admin"; // Check if user is admin

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Invalid Input",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await fetchCalendarData(startDate, endDate);
      if (result) {
        setData({
          totalSales: result.totalSales || 0,
          totalAmount: result.totalAmount || "₹0",
          transactions: result.transactions || [],
        });
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transaction: any) => {
    setEditTransaction(transaction);
    setEditForm({
      adult_count: transaction.adult,
      child_count: transaction.child,
      category: transaction.category,
      show_name: transaction.showName,
      total_paid: transaction.totalPaid.replace("₹", "").replace(".00", ""),
      date: transaction.date,
    });
  };

  const handleEditSubmit = async () => {
    if (!editTransaction) return;

    try {
      const success = await updateTransaction(editTransaction.id, {
        adult_count: parseInt(String(editForm.adult_count)) || 0,
        child_count: parseInt(String(editForm.child_count)) || 0,
        category: editForm.category,
        show_name: editForm.show_name,
        total_paid: parseFloat(editForm.total_paid) || 0,
        date: editForm.date,
      });

      if (success) {
        await handleSearch(); // Refresh the data
        setEditTransaction(null);
        toast({
          title: "Success",
          description: "Transaction updated successfully",
        });
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        title: "Error",
        description: "Failed to update transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const success = await deleteTransaction(id);
      if (success) {
        await handleSearch(); // Refresh the data
        toast({
          title: "Success",
          description: "Transaction deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Error",
        description: "Failed to delete transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Calendar View
        </h2>
        <p className="text-muted-foreground">
          Search and filter data by date range
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Select Date Range
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="w-full"
              disabled={loading}
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Sales
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {data.totalSales}
                </p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Amount
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {data.totalAmount}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              {[1, 2, 3, 4, 5].map((item) => (
                <Skeleton key={item} className="h-12 w-full" />
              ))}
            </div>
          ) : data.transactions.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              {startDate && endDate
                ? "No transactions found for the selected date range."
                : "Please select a date range and search."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">S.No</th>
                    <th className="text-left p-3 font-semibold">Invoice No</th>
                    <th className="text-left p-3 font-semibold">Date</th>
                    <th className="text-left p-3 font-semibold">Show Name</th>
                    <th className="text-left p-3 font-semibold">Counter</th>
                    <th className="text-left p-3 font-semibold">Adult</th>
                    <th className="text-left p-3 font-semibold">Child</th>
                    <th className="text-left p-3 font-semibold">Total Paid</th>
                    {isAdmin && (
                      <th className="text-left p-3 font-semibold">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data.transactions.map((transaction: any) => (
                    <tr
                      key={transaction.id}
                      className="border-b hover:bg-muted/50"
                    >
                      <td className="p-3">{transaction.sNo}</td>
                      <td className="p-3">{transaction.invoiceNo}</td>
                      <td className="p-3">{transaction.date}</td>
                      <td className="p-3">{transaction.showName}</td>
                      <td className="p-3">{transaction.counter}</td>
                      <td className="p-3">{transaction.adult}</td>
                      <td className="p-3">{transaction.child}</td>
                      <td className="p-3 font-semibold">
                        {transaction.totalPaid}
                      </td>
                      {isAdmin && (
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(transaction)}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Transaction</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-adult">
                                      Adult Count
                                    </Label>
                                    <Input
                                      id="edit-adult"
                                      type="number"
                                      value={editForm.adult_count}
                                      onChange={(e) =>
                                        setEditForm({
                                          ...editForm,
                                          adult_count:
                                            parseInt(e.target.value) || 0,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-child">
                                      Child Count
                                    </Label>
                                    <Input
                                      id="edit-child"
                                      type="number"
                                      value={editForm.child_count}
                                      onChange={(e) =>
                                        setEditForm({
                                          ...editForm,
                                          child_count:
                                            parseInt(e.target.value) || 0,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-category">
                                      Category
                                    </Label>
                                    <Input
                                      id="edit-category"
                                      value={editForm.category}
                                      onChange={(e) =>
                                        setEditForm({
                                          ...editForm,
                                          category: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-showName">
                                      Show Name
                                    </Label>
                                    <Input
                                      id="edit-showName"
                                      value={editForm.show_name}
                                      onChange={(e) =>
                                        setEditForm({
                                          ...editForm,
                                          show_name: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-totalPaid">
                                      Total Paid
                                    </Label>
                                    <Input
                                      id="edit-totalPaid"
                                      type="number"
                                      step="0.01"
                                      value={editForm.total_paid}
                                      onChange={(e) =>
                                        setEditForm({
                                          ...editForm,
                                          total_paid: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-date">Date</Label>
                                    <Input
                                      id="edit-date"
                                      type="date"
                                      value={editForm.date}
                                      onChange={(e) =>
                                        setEditForm({
                                          ...editForm,
                                          date: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                </div>
                                <Button onClick={handleEditSubmit}>
                                  Save Changes
                                </Button>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(transaction.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
