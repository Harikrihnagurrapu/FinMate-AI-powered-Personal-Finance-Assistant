import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BudgetData {
  category: string;
  spent: number;
  budget: number;
  icon: string; // Change to string (icon name/key)
  color: string;
}

const useBudgetData = () => {
  const [budgetData, setBudgetData] = useState<BudgetData[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [percentSpent, setPercentSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case "Housing":
        return "Home";
      case "Groceries":
        return "ShoppingCart";
      case "Transportation":
        return "Car";
      case "Dining Out":
        return "Utensils";
      case "Entertainment":
        return "Film"; // Updated to Film icon
      case "Utilities":
        return "Monitor";
      case "Travel":
        return "Globe"; // Icon for Travel
      case "Food":
        return "Pizza"; // Icon for Food
      case "Bills":
        return "FileText"; // Icon for Bills
      case "Healthcare":
        return "HeartPulse"; // Icon for Healthcare
      case "Education":
        return "BookOpen"; // Icon for Education
      case "Shopping":
        return "ShoppingBag"; // Icon for Shopping
      case "Other":
        return "HelpCircle"; // Icon for Other
      default:
        return "CircleDollarSign";
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "Food":
        return "#FF6384";
      case "Bills":
        return "#36A2EB";
      case "Travel":
        return "#FFCE56";
      case "Entertainment":
        return "#4BC0C0";
      case "Shopping":
        return "#9966FF";
      case "Other":
        return "#FF9F40";
      case "Housing":
        return "#41B883";
      case "Transportation":
        return "#E46651";
      case "Healthcare":
        return "#00D8FF";
      case "Education":
        return "#DD1B16";
      default:
        return "#999999";
    }
  };

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        // Fetch expenses and budget alerts from Supabase
        const { data: expenses, error: expensesError } = await supabase
          .from("expenses")
          .select("*");

        const { data: budgetAlerts, error: alertsError } = await supabase
          .from("budget_alerts")
          .select("*");

        if (expensesError || alertsError) {
          throw expensesError || alertsError;
        }

        // Aggregate expenses by category
        const aggregatedData = expenses.reduce((acc, expense) => {
          const category = expense.category;
          if (!acc[category]) {
            acc[category] = {
              category,
              spent: 0,
              budget: 0,
            };
          }
          acc[category].spent += expense.amount;

          // Find the budget for this category
          const budgetAlert = budgetAlerts.find(
            (alert) => alert.category === category
          );
          acc[category].budget = budgetAlert ? budgetAlert.limit_amount : 0;

          return acc;
        }, {} as Record<string, { category: string; spent: number; budget: number }>);

        console.log("Aggregated Data:", aggregatedData); // Debugging

        // Map the aggregated data to the required format
        const mappedData = Object.values(aggregatedData).map((item) => ({
          category: item.category,
          spent: item.spent,
          budget: item.budget,
          icon: getCategoryIcon(item.category), // Return icon name as string
          color: getCategoryColor(item.category),
        }));

        console.log("Mapped Data:", mappedData); // Debugging

        setBudgetData(mappedData);

        // Calculate totals
        const totalBudget = mappedData.reduce((acc, item) => acc + item.budget, 0);
        const totalSpent = mappedData.reduce((acc, item) => acc + item.spent, 0);
        const percentSpent = Math.round((totalSpent / totalBudget) * 100);

        setTotalBudget(totalBudget);
        setTotalSpent(totalSpent);
        setPercentSpent(percentSpent);
      } catch (error) {
        console.error("Error fetching data:", error); // Debugging
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, []);

  return {
    budgetData,
    totalBudget,
    totalSpent,
    percentSpent,
    loading,
    error,
  };
};

export default useBudgetData;