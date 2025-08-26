import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Award, Search, Edit, Trash2 } from "lucide-react";

interface GuideData {
  id: number;
  name: string;
  number: string;
  vehicleType: string;
  score: number;
}

export function GuideScore() {
  const [searchFilter, setSearchFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [guides] = useState<GuideData[]>([
    {
      id: 1,
      name: "Rahman",
      number: "9019296034",
      vehicleType: "guide",
      score: 646,
    },
    {
      id: 704,
      name: "loki",
      number: "9380320892",
      vehicleType: "big car",
      score: 548,
    },
    {
      id: 192,
      name: "sathish",
      number: "9141352476",
      vehicleType: "tt",
      score: 502,
    },
    {
      id: 459,
      name: "babu",
      number: "9901225482",
      vehicleType: "tt",
      score: 436,
    },
    {
      id: 1632,
      name: "rohith",
      number: "7676911516",
      vehicleType: "big car",
      score: 410,
    },
    {
      id: 506,
      name: "anif",
      number: "9740280814",
      vehicleType: "guide",
      score: 410,
    },
    {
      id: 239,
      name: "sallem",
      number: "9986635586",
      vehicleType: "guide",
      score: 399,
    },
    {
      id: 326,
      name: "maaz",
      number: "7019990255",
      vehicleType: "car",
      score: 394,
    },
    {
      id: 53,
      name: "santhosh",
      number: "9880400535",
      vehicleType: "auto",
      score: 388,
    },
    {
      id: 1079,
      name: "Arjun",
      number: "8861844325",
      vehicleType: "big car",
      score: 388,
    },
    {
      id: 1333,
      name: "Anis",
      number: "9901269631",
      vehicleType: "guide",
      score: 376,
    },
    {
      id: 892,
      name: "inayak",
      number: "9845814929",
      vehicleType: "guide",
      score: 370,
    },
    {
      id: 420,
      name: "nagesh",
      number: "9686808094",
      vehicleType: "auto",
      score: 360,
    },
    {
      id: 236,
      name: "kumar",
      number: "8867109592",
      vehicleType: "auto",
      score: 346,
    },
    {
      id: 230,
      name: "manju",
      number: "9380733996",
      vehicleType: "auto",
      score: 344,
    },
  ]);

  const getScoreColor = (score: number) => {
    if (score >= 500) return "bg-success text-success-foreground";
    if (score >= 400) return "bg-gold text-gold-foreground";
    return "bg-muted text-muted-foreground";
  };

  const filteredGuides = guides.filter((guide) => {
    const matchesSearch =
      guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.number.includes(searchQuery);
    const matchesFilter =
      searchFilter === "All" || guide.vehicleType === searchFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Guide Score</h2>
        <p className="text-muted-foreground">
          Monitor and manage guide performance metrics
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Guide Performance Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select value={searchFilter} onValueChange={setSearchFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="guide">Guide</SelectItem>
                <SelectItem value="big car">Big Car</SelectItem>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="tt">TT</SelectItem>
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
              <strong>Fetched Vehicle:</strong> null
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left p-4 font-semibold bg-primary text-primary-foreground">
                    ID
                  </th>
                  <th className="text-left p-4 font-semibold bg-primary text-primary-foreground">
                    GUIDE NAME
                  </th>
                  <th className="text-left p-4 font-semibold bg-primary text-primary-foreground">
                    GUIDE NUMBER
                  </th>
                  <th className="text-left p-4 font-semibold bg-primary text-primary-foreground">
                    VEHICLE TYPE
                  </th>
                  <th className="text-left p-4 font-semibold bg-primary text-primary-foreground">
                    GUIDE SCORE
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
                {filteredGuides.map((guide, index) => (
                  <tr
                    key={guide.id}
                    className={
                      index % 2 === 0 ? "bg-muted/30" : "bg-background"
                    }
                  >
                    <td className="p-4 font-medium">{guide.id}</td>
                    <td className="p-4 font-medium capitalize">{guide.name}</td>
                    <td className="p-4 text-muted-foreground">
                      {guide.number}
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="capitalize">
                        {guide.vehicleType}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getScoreColor(guide.score)}>
                        {guide.score}
                      </Badge>
                    </td>
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
