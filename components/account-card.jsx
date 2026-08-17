"use client";

import { updateDefaultAccount } from "@/actions/accounts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;
  const [isPending, startTransition] = useTransition();

  const handleDefaultChange = async () => {
    // Prevent default and stop propagation are handled in the onClick wrapper
    // since onCheckedChange only passes a boolean value.

    if (isDefault) {
      toast.warning("You need at least 1 default account");
      return; // Don't allow toggling off the default account directly
    }

    startTransition(async () => {
      try {
        const result = await updateDefaultAccount(id);
        if (result?.success) {
          toast.success("Default account updated successfully");
        } else {
          toast.error(result?.error || "Failed to update default account");
        }
      } catch (error) {
        toast.error("Failed to update default account");
      }
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow group relative">
      <Link href={`/account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium capitalize">
            {name}
          </CardTitle>
          <Switch
            checked={isDefault}
            onCheckedChange={handleDefaultChange}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            disabled={isPending}
          />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground capitalize mb-4">
            {type.toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground pt-4">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-rose-500" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
