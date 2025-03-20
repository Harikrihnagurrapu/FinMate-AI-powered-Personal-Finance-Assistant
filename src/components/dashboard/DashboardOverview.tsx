import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, DollarSign, CreditCard, Landmark, PiggyBank } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from "recharts";
import useDashboardData from "@/hooks/use-dashboard-data";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#F39C12"];

const DashboardOverview = () => {
  const {
    balanceHistory,
    expensesByCategory,
    recentTransactions,
    totalBalance,
    totalInvestment,
    totalUnrealizedPL,
    tradingPortfolio,
    loading,
    error,
  } = useDashboardData();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Overview</h2>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Balance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {totalBalance >= 0 ? (
                <span className="text-green-500 flex items-center">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  Positive balance
                </span>
              ) : (
                <span className="text-red-500 flex items-center">
                  <ArrowDownRight className="mr-1 h-4 w-4" />
                  Negative balance
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Investments Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investments</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInvestment.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +12.5% all time
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Unrealized P&L Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unrealized P&L</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalUnrealizedPL.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {totalUnrealizedPL >= 0 ? (
                <span className="text-green-500 flex items-center">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  Profit
                </span>
              ) : (
                <span className="text-red-500 flex items-center">
                  <ArrowDownRight className="mr-1 h-4 w-4" />
                  Loss
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Cash Balance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${tradingPortfolio?.cash.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Available for trading
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Balance History Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Balance History</CardTitle>
          <CardDescription>
            Your account balance trend over the past 6 months
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={balanceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
              <Area type="monotone" dataKey="balance" stroke="#0284c7" fill="#0ea5e9" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Expense Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>
            Distribution of your monthly expenses by category
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expensesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            A list of your recent expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((tx, index) => (
              <div key={index} className="flex justify-between">
                <span>{tx.description}</span>
                <span>${tx.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;