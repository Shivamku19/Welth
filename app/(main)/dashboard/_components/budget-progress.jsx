"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X } from "lucide-react";
import { updateBudget } from "@/actions/budget";
import { toast } from "sonner";

export function BudgetProgress({ initialBudget, currentExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialBudget?.amount) {
      setNewBudget(initialBudget.amount.toString());
    }
  }, [initialBudget]);

  const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateBudget(amount);
      if (result.success) {
        toast.success("Budget updated successfully");
        setIsEditing(false);
      } else {
        toast.error(result.error || "Failed to update budget");
      }
    } catch (error) {
      toast.error("Failed to update budget");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1 flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium">
              Monthly Budget (Default Account)
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-32 h-8"
                    placeholder="Amount"
                    disabled={isLoading}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleUpdateBudget}
                    disabled={isLoading}
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ) : (
                <>
                  <CardDescription>
                    {initialBudget
                      ? `₹${currentExpenses.toFixed(
                          2
                        )} of ₹${initialBudget.amount.toFixed(2)} spent`
                      : "No budget set"}
                  </CardDescription>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {initialBudget && (
          <div className="space-y-2 mt-4">
            <Progress
              value={percentUsed > 100 ? 100 : percentUsed}
              className={`h-2 ${
                percentUsed >= 90
                  ? "[&>div>div]:bg-red-500"
                  : percentUsed >= 75
                  ? "[&>div>div]:bg-yellow-500"
                  : "[&>div>div]:bg-green-500"
              }`}
            />
            <p className="text-xs text-muted-foreground text-right">
              {percentUsed.toFixed(1)}% used
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
