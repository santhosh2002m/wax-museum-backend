import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, AlertTriangle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";

export function DeleteCounter() {
  const [formData, setFormData] = useState({
    counterName: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { counters, deleteCounter, fetchCounters } = useData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.counterName || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Find the counter by username
    const counterToDelete = counters.find(
      (counter) => counter.username === formData.counterName
    );

    if (!counterToDelete) {
      toast({
        title: "Error",
        description: "Counter not found",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Call the deleteCounter function from DataContext
      const success = await deleteCounter(counterToDelete.id);

      if (success) {
        // Reset form on success
        setFormData({
          counterName: "",
          password: "",
        });

        // Refresh counters list
        await fetchCounters();
      }
    } catch (error) {
      console.error("Error deleting counter:", error);
      toast({
        title: "Error",
        description: "Failed to delete counter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Delete Counter
        </h2>
        <p className="text-muted-foreground">Remove a counter access account</p>
      </div>

      <Card className="shadow-lg border-destructive/30">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-xl text-destructive">
            Delete Counter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-destructive">Warning</p>
                <p className="text-sm text-destructive/80">
                  This action cannot be undone. This will permanently delete the
                  counter account and all associated data.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="counter-name">Counter Username *</Label>
              <Input
                id="counter-name"
                placeholder="Enter counter username to delete"
                value={formData.counterName}
                onChange={(e) =>
                  setFormData({ ...formData, counterName: e.target.value })
                }
                required
                disabled={loading}
                list="counters-list"
              />
              <datalist id="counters-list">
                {counters.map((counter) => (
                  <option key={counter.id} value={counter.username} />
                ))}
              </datalist>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Your Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password to confirm"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter your password to confirm this destructive action
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              variant="destructive"
              disabled={loading || !formData.counterName || !formData.password}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Counter
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
