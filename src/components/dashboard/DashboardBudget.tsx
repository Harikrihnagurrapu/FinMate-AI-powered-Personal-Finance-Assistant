import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import useBudgetData from "@/hooks/use-budget-data";
import {
  Home,
  ShoppingCart,
  Car,
  Utensils,
  Ticket,
  Monitor,
  CircleDollarSign,
  Globe,
  Pizza,
  FileText, // Example icon for Bills
  HeartPulse, // Example icon for Healthcare
  BookOpen, // Example icon for Education
  ShoppingBag, // Example icon for Shopping
  Film, // Alternative icon for Entertainment
  HelpCircle, // Alternative icon for Other
} from "lucide-react";

// Map icon names to their corresponding JSX elements
const iconMap = {
  Home: <Home className="h-4 w-4" />,
  ShoppingCart: <ShoppingCart className="h-4 w-4" />,
  Car: <Car className="h-4 w-4" />,
  Utensils: <Utensils className="h-4 w-4" />,
  Ticket: <Ticket className="h-4 w-4" />,
  Monitor: <Monitor className="h-4 w-4" />,
  CircleDollarSign: <CircleDollarSign className="h-4 w-4" />,
  Globe: <Globe className="h-4 w-4" />, // Travel
  Pizza: <Pizza className="h-4 w-4" />, // Food
  FileText: <FileText className="h-4 w-4" />, // Bills
  HeartPulse: <HeartPulse className="h-4 w-4" />, // Healthcare
  BookOpen: <BookOpen className="h-4 w-4" />, // Education
  ShoppingBag: <ShoppingBag className="h-4 w-4" />, // Shopping
  Film: <Film className="h-4 w-4" />, // Entertainment
  HelpCircle: <HelpCircle className="h-4 w-4" />, // Other
};


const DashboardBudget = () => {
  const {
    budgetData,
    totalBudget,
    totalSpent,
    percentSpent,
    loading,
    error,
  } = useBudgetData();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Prepare data for pie chart
  const pieChartData = budgetData.map((item) => ({
    name: item.category,
    value: item.spent,
    color: item.color,
  }));

  console.log("Pie Chart Data:", pieChartData); // Debugging
  console.log("Budget Data:", budgetData);
  return (
    <div className="space-y-6">
      {/* Budget Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Total Budget Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">For this month</p>
          </CardContent>
        </Card>

        {/* Spent So Far Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spent So Far</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {totalSpent <= totalBudget
                ? `${(totalBudget - totalSpent).toFixed(2)} remaining`
                : `${(totalSpent - totalBudget).toFixed(2)} over budget`}
            </p>
          </CardContent>
        </Card>

        {/* Budget Progress Card */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Progress</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {percentSpent}% of total budget used
              </span>
              <span className="text-sm font-medium">
                ${totalSpent.toFixed(2)} / ${totalBudget.toFixed(2)}
              </span>
            </div>
            <Progress value={percentSpent} className="h-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              {Math.round((new Date().getDate() / 30) * 100)}% through the month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Breakdown and Pie Chart */}
      <div className="grid gap-4 md:grid-cols-7">
        {/* Budget Breakdown Card */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Budget Breakdown</CardTitle>
            <CardDescription>
              Track your spending against your budget for each category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {budgetData.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        {React.cloneElement(iconMap[item.icon], { style: { color: item.color } })}
                      </div>
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="text-sm">
                      ${item.spent.toFixed(2)} / ${item.budget.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={(item.spent / item.budget) * 100}
                      className="h-2"
                      style={{
                        backgroundColor: `${item.color}20`,
                        "--progress-color": item.color,
                      } as React.CSSProperties}
                    />
                    <span className="text-sm text-muted-foreground min-w-[40px] text-right">
                      {Math.round((item.spent / item.budget) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Spending Distribution Card */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Spending Distribution</CardTitle>
            <CardDescription>
              Breakdown of your spending by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {pieChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, "Spent"]} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Budget Recommendations Card */}
      <Card>
        <CardHeader>
          <CardTitle>AI Budget Recommendations</CardTitle>
          <CardDescription>
            Personalized suggestions to help you manage your finances better
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Recommendations here... */}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardBudget;