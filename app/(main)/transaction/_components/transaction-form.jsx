"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { ReceiptScanner } from "./recipt-scanner";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import useFetch from "@/hooks/use-fetch";
import { cn } from "@/lib/utils";

export function AddTransactionForm({ accounts, categories, editMode = false, initialData = null }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: editMode && initialData
      ? {
          type: initialData.type,
          amount: initialData.amount.toString(),
          description: initialData.description,
          accountId: initialData.accountId,
          date: new Date(initialData.date),
          category: initialData.category,
          isRecurring: initialData.isRecurring || false,
          recurringInterval: initialData.recurringInterval || "MONTHLY",
        }
      : {
          type: "EXPENSE",
          amount: "",
          description: "",
          accountId: accounts.find((ac) => ac.isDefault)?.id || accounts?.[0]?.id || "",
          date: new Date(),
          category: "",
          isRecurring: false,
          recurringInterval: "MONTHLY",
        },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");
  const accountId = watch("accountId");
  const category = watch("category");
  const recurringInterval = watch("recurringInterval");

  const onSubmit = (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };
    if (editMode) {
      transactionFn(initialData.id, formData);
    } else {
      transactionFn(formData);
    }
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(editMode ? "Transaction updated successfully" : "Transaction created successfully");
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, reset, router, editMode]);

  const filteredCategories = categories.filter(
    (cat) => cat.type === type
  );

  const selectedAccount = accounts.find((a) => a.id === accountId);
  const selectedCategory = filteredCategories.find((c) => c.id === category);

  const handleScanComplete = (scannedData) => {
    if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      if (scannedData.category) {
        setValue("category", scannedData.category);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Receipt Scanner */}
      {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}

      {/* Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <Select
          value={type}
          onValueChange={(value) => {
            setValue("type", value);
            setValue("category", "");
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type">
              {type === "EXPENSE" ? "Expense" : type === "INCOME" ? "Income" : "Select type"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXPENSE">Expense</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      {/* Amount and Account */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 min-w-0">
          <label className="text-sm font-medium">Amount</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("amount")}
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-2 min-w-0">
          <label className="text-sm font-medium">Account</label>
          <Select
            value={accountId || ""}
            onValueChange={(value) => setValue("accountId", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select account">
                {selectedAccount
                  ? `${selectedAccount.name} ($${parseFloat(selectedAccount.balance).toFixed(2)})`
                  : "Select account"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} (${parseFloat(account.balance).toFixed(2)})
                </SelectItem>
              ))}
              <CreateAccountDrawer>
                <Button
                  variant="ghost"
                  className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                >
                  Create Account
                </Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
          {errors.accountId && (
            <p className="text-sm text-red-500">{errors.accountId.message}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select
          value={category || ""}
          onValueChange={(value) => setValue("category", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category">
              {selectedCategory ? selectedCategory.name : "Select category"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? format(date, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </Button>
            }
          />
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => setValue("date", date)}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-sm text-red-500">{errors.date.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input placeholder="Enter description" {...register("description")} />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Recurring Transaction */}
      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <label className="text-base font-medium">Recurring Transaction</label>
          <div className="text-sm text-muted-foreground">
            Set up a recurring schedule for this transaction
          </div>
        </div>
        <Switch
          checked={isRecurring}
          onCheckedChange={(checked) => setValue("isRecurring", checked)}
        />
      </div>

      {/* Recurring Interval */}
      {isRecurring && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Recurring Interval</label>
          <Select
            value={recurringInterval || "MONTHLY"}
            onValueChange={(value) => setValue("recurringInterval", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select interval">
                {recurringInterval
                  ? recurringInterval.charAt(0) +
                    recurringInterval.slice(1).toLowerCase()
                  : "Monthly"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {errors.recurringInterval && (
            <p className="text-sm text-red-500">
              {errors.recurringInterval.message}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 pt-2">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-full"
          disabled={transactionLoading}
        >
          {transactionLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editMode ? "Updating..." : "Creating..."}
            </>
          ) : editMode ? (
            "Update Transaction"
          ) : (
            "Create Transaction"
          )}
        </Button>
      </div>
    </form>
  );
}

export default AddTransactionForm;

