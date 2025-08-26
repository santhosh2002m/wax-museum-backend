import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ticket, Plus, Edit, Trash2 } from "lucide-react";

interface TicketData {
  id: number;
  price: number;
  dropdownName: string;
  showName: string;
}

export function TicketDetails() {
  const [tickets] = useState<TicketData[]>([
    { id: 33, price: 100, dropdownName: "combo", showName: "Combo" },
    { id: 38, price: 60, dropdownName: "wax museum", showName: "Wax Museum" },
    {
      id: 39,
      price: 60,
      dropdownName: "horror house",
      showName: "Horror House",
    },
    { id: 40, price: 90, dropdownName: "90 combo", showName: "90 combo" },
    { id: 41, price: 80, dropdownName: "80 combo", showName: "80 combo" },
    { id: 42, price: 70, dropdownName: "70 combo", showName: "70 combo" },
    { id: 43, price: 60, dropdownName: "60 combo", showName: "60 combo" },
    { id: 44, price: 100, dropdownName: "bike ride", showName: "bike ride" },
    { id: 46, price: 100, dropdownName: "Bowling", showName: "Bowling" },
    { id: 47, price: 30, dropdownName: "kids games", showName: "kids games" },
    { id: 48, price: 100, dropdownName: "Archery", showName: "Archery" },
    { id: 49, price: 100, dropdownName: "Bull ride", showName: "Bull ride" },
    {
      id: 50,
      price: 30,
      dropdownName: "30 h.h or wax",
      showName: "30 h.h or wax",
    },
    { id: 51, price: 50, dropdownName: "50 combo", showName: "50 combo" },
    { id: 52, price: 100, dropdownName: "roller", showName: "roller" },
    {
      id: 53,
      price: 40,
      dropdownName: "40 horror or wax",
      showName: "40 horror or wax",
    },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Ticket Details
          </h2>
          <p className="text-muted-foreground">
            Manage ticket prices and show configurations
          </p>
        </div>
        <Button className="bg-success hover:bg-success/90">
          <Plus className="w-4 h-4 mr-2" />
          Add New Ticket
        </Button>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="w-5 h-5" />
            Ticket Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left p-4 font-semibold bg-primary text-primary-foreground">
                    ID
                  </th>
                  <th className="text-left p-4 font-semibold bg-primary text-primary-foreground">
                    TICKET PRICE
                  </th>
                  <th className="text-left p-4 font-semibold bg-primary text-primary-foreground">
                    DROPDOWN NAME
                  </th>
                  <th className="text-left p-4 font-semibold bg-primary text-primary-foreground">
                    TICKET SHOW NAME/DB DATA
                  </th>
                  <th className="text-center p-4 font-semibold bg-primary text-primary-foreground">
                    DELETE
                  </th>
                  <th className="text-center p-4 font-semibold bg-primary text-primary-foreground">
                    EDIT
                  </th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, index) => (
                  <tr
                    key={ticket.id}
                    className={
                      index % 2 === 0 ? "bg-muted/30" : "bg-background"
                    }
                  >
                    <td className="p-4 font-medium">{ticket.id}</td>
                    <td className="p-4">
                      <Badge variant="outline" className="font-semibold">
                        ₹{ticket.price}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {ticket.dropdownName}
                    </td>
                    <td className="p-4 font-medium">{ticket.showName}</td>
                    <td className="p-4 text-center">
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                    <td className="p-4 text-center">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
