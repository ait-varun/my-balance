"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Trash2, Pencil, Check, X, Plus } from "lucide-react";
import { useSession } from "next-auth/react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema for form validation
const formSchema = z.object({
  month: z.string().min(3, "Month is required"),
  startingBalance: z.number().min(0),
  salary: z.number().min(0),
  emi: z.number().min(0),
  expenses: z.number().min(0),
  savings: z.number().min(0),
});

interface AccountEntry {
  month: string;
  startingBalance: number;
  salary: number;
  emi: number;
  expenses: number;
  savings: number;
  totalSaved: number;
  closingBalance: number;
}

export default function AccountTracker() {
  const [accountData, setAccountData] = useState<AccountEntry[]>([]);
  const [totalSaved, setTotalSaved] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const { data: session } = useSession();

  console.log("User session:", session);

  // Add to your component
  useEffect(() => {
    const savedData = localStorage.getItem("accountData");
    if (savedData) setAccountData(JSON.parse(savedData));
  }, []);

  useEffect(() => {
    localStorage.setItem("accountData", JSON.stringify(accountData));
  }, [accountData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      month: "",
      startingBalance: 0,
      salary: 0,
      emi: 0,
      expenses: 0,
      savings: 0,
    },
  });

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedData = localStorage.getItem("accountData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setAccountData(parsedData);
      setTotalSaved(
        parsedData.reduce(
          (acc: number, curr: AccountEntry) => acc + curr.savings,
          0
        )
      );
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("accountData", JSON.stringify(accountData));
  }, [accountData]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!session || !session.user?.email) {
      console.error("User not authenticated");
      return;
    }
  
    const newEntry = {
      ...values,
      closingBalance:
        values.startingBalance + values.salary - values.emi - values.expenses - values.savings,
      totalSaved: totalSaved + values.savings,
    };
  
    const response = await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEntry),
    });
  
    if (response.ok) {
      const updatedEntries = await fetch("/api/account").then((res) => res.json());
      setAccountData(updatedEntries);
    } else {
      console.error("Failed to save entry");
    }
  };
  

  //handle Edit
  const handleEdit = (index: number) => {
    const entry = accountData[index];
    form.reset({
      month: entry.month,
      startingBalance: entry.startingBalance,
      salary: entry.salary,
      emi: entry.emi,
      expenses: entry.expenses,
      savings: entry.savings,
    });
    setEditingIndex(index);
  };

  const handleCancelEdit = () => {
    // Reset form with default values
    form.reset({
      month: "",
      startingBalance: 0,
      salary: 0,
      emi: 0,
      expenses: 0,
      savings: 0,
    });
    setEditingIndex(null);
  };

  // Delete entry function
  const handleDelete = (index: number) => {
    const updatedData = accountData.filter((_, i) => i !== index);
    setAccountData(updatedData);
    setTotalSaved(updatedData.reduce((acc, curr) => acc + curr.savings, 0));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="pe-6 space-y-8">
      <h1 className="text-3xl font-bold">Account Tracker</h1>

      <div className="flex flex-col md:flex-row gap-4">
        {" "}
        {/* Add Entry Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 max-w-xs p-6 border rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., May 2025" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startingBalance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starting Balance</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EMI</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expenses</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="savings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Savings</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingIndex !== null ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {editingIndex !== null ? "Update Entry" : "Add Entry"}
              </Button>

              {editingIndex !== null && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancelEdit}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
        {/* Data Table */}
        <Table className="border rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Starting Balance</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>EMI</TableHead>
              <TableHead>Expenses</TableHead>
              <TableHead>Savings</TableHead>
              <TableHead>Total Saved</TableHead>
              <TableHead>Closing Balance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accountData.map((entry, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{entry.month}</TableCell>
                <TableCell>{formatCurrency(entry.startingBalance)}</TableCell>
                <TableCell className="text-green-600">
                  +{formatCurrency(entry.salary)}
                </TableCell>
                <TableCell className="text-red-600">
                  -{formatCurrency(entry.emi)}
                </TableCell>
                <TableCell className="text-red-600">
                  -{formatCurrency(entry.expenses)}
                </TableCell>
                <TableCell className="text-blue-600">
                  -{formatCurrency(entry.savings)}
                </TableCell>
                <TableCell className="text-green-600">
                  {formatCurrency(entry.totalSaved)}
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(entry.closingBalance)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(index)}>
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
