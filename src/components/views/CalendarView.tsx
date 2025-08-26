import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Search } from "lucide-react";

export function CalendarView() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    // Search functionality would be implemented here
    console.log("Searching from", startDate, "to", endDate);
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
            <Button onClick={handleSearch} className="w-full">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">
                Total Sales
              </p>
              <p className="text-2xl font-bold text-foreground">0</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">
                Total Amount
              </p>
              <p className="text-2xl font-bold text-foreground">₹0</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <th className="text-left p-3 font-semibold">Total Paid</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan={7}
                    className="text-center p-8 text-muted-foreground"
                  >
                    No data available. Please select a date range and search.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
