import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AddCounter() {
  const [formData, setFormData] = useState({
    counterName: "admin",
    password: "",
    confirmPassword: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "New counter added successfully",
    });

    setFormData({
      counterName: "admin",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Add New Counter
        </h2>
        <p className="text-muted-foreground">
          Create a new counter access account
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <Card className="shadow-card">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-success" />
            </div>
            <CardTitle className="text-xl text-success">
              Add New Counter
            </CardTitle>
          </CardHeader>
          <CardContent>
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

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-success hover:bg-success/90"
              >
                <User className="w-4 h-4 mr-2" />
                Add Counter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
