"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AccountChart({ transactions }) {
  const [dateRange, setDateRange] = useState("1M");

  const chartData = useMemo(() => {
    const today = new Date();
    const days = dateRange === "7D" ? 7 : dateRange === "1M" ? 30 : dateRange === "3M" ? 90 : 180;
    const startDate = startOfDay(subDays(today, days - 1));

    // Filter transactions
    const filtered = transactions.filter((t) => new Date(t.date) >= startDate);

    // Group by date
    const grouped = filtered.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
      if (transaction.type === "INCOME") {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
      }
      return acc;
    }, {});

    // Create array with all dates in range
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = format(subDays(today, i), "MMM dd");
      data.push(grouped[date] || { date, income: 0, expense: 0 });
    }

    return data;
  }, [transactions, dateRange]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-base font-normal">Transaction Overview</CardTitle>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7D">Last 7 Days</SelectItem>
            <SelectItem value="1M">Last 1 Month</SelectItem>
            <SelectItem value="3M">Last 3 Months</SelectItem>
            <SelectItem value="6M">Last 6 Months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                formatter={(value) => [`₹${value}`]}
                contentStyle={{ borderRadius: '8px' }}
              />
              <Legend />
              <Bar 
                dataKey="income" 
                name="Income"
                fill="#10b981" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="expense" 
                name="Expense"
                fill="#f43f5e" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
