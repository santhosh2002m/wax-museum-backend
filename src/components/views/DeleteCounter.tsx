import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function DeleteCounter() {
  const [formData, setFormData] = useState({
    counterName: "admin",
    password: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast({
      title: "Success",
      description: "Counter deleted successfully",
    });

    setFormData({
      counterName: "admin",
      password: "",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Delete Counter
        </h2>
        <p className="text-muted-foreground">Remove a counter access account</p>
      </div>

      <div className="max-w-md mx-auto">
        <Card className="shadow-card border-destructive/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-xl text-destructive">
              Delete Counter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">
                    Warning
                  </p>
                  <p className="text-sm text-destructive/80">
                    This action cannot be undone. This will permanently delete
                    the counter account.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="counter-name">Counter Name</Label>
                <Input
                  id="counter-name"
                  value={formData.counterName}
                  onChange={(e) =>
                    setFormData({ ...formData, counterName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>

              <Button type="submit" className="w-full" variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Counter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
