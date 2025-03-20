import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BalanceHistory {
  name: string; // Month name (e.g., "Jan", "Feb")
  income: number; // Total income for the month
  expenses: number; // Total expenses for the month
  balance: number; // Balance for the month (income - expenses)
}

interface ExpenseCategory {
  name: string; // Category name (e.g., "Housing", "Food")
  value: number; // Total expenses for this category
}

interface RecentTransaction {
  date: string; // Transaction date
  description: string; // Transaction description
  category: string; // Transaction category
  amount: number; // Transaction amount
}

interface PortfolioHolding {
  symbol: string;
  shares: number;
  purchase_price: number;
  current_price: number | null;
}

interface TradingPosition {
  symbol: string;
  quantity: number;
  market_value: number;
  unrealized_pl: number;
}

interface TradingPortfolio {
  cash: number;
  equity: number;
}

const useDashboardData = () => {
  const [balanceHistory, setBalanceHistory] = useState<BalanceHistory[]>([]);
  const [expensesByCategory, setExpensesByCategory] = useState<ExpenseCategory[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [portfolioHoldings, setPortfolioHoldings] = useState<PortfolioHolding[]>([]);
  const [tradingPositions, setTradingPositions] = useState<TradingPosition[]>([]);
  const [tradingPortfolio, setTradingPortfolio] = useState<TradingPortfolio | null>(null);
  const [totalBalance, setTotalBalance] = useState<number>(0); // Total balance (income - expenses)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all expenses
        const { data: expenses, error: expensesError } = await supabase
          .from("expenses")
          .select("*");

        if (expensesError) throw expensesError;

        // Aggregate balance history (monthly balances)
        const balanceData = expenses.reduce((acc, expense) => {
          const month = new Date(expense.date).toLocaleString("default", { month: "short" });
          if (!acc[month]) {
            acc[month] = { name: month, income: 0, expenses: 0, balance: 0 };
          }
          if (expense.amount > 0) {
            acc[month].income += expense.amount; // Add to income
          } else {
            acc[month].expenses += Math.abs(expense.amount); // Add to expenses
          }
          acc[month].balance = acc[month].income - acc[month].expenses; // Calculate balance
          return acc;
        }, {} as Record<string, BalanceHistory>);

        setBalanceHistory(Object.values(balanceData));

        // Calculate total balance (income - expenses)
        const totalIncome = Object.values(balanceData).reduce(
          (acc, month) => acc + month.income,
          0
        );
        const totalExpenses = Object.values(balanceData).reduce(
          (acc, month) => acc + month.expenses,
          0
        );
        const totalBalance = totalIncome - totalExpenses;
        setTotalBalance(totalBalance);

        // Aggregate expenses by category
        const categoryData = expenses.reduce((acc, expense) => {
          const category = expense.category;
          if (!acc[category]) {
            acc[category] = { name: category, value: 0 };
          }
          acc[category].value += Math.abs(expense.amount); // Only include expenses (negative amounts)
          return acc;
        }, {} as Record<string, ExpenseCategory>);

        setExpensesByCategory(Object.values(categoryData));

        // Fetch recent transactions (last 5 expenses)
        const recentTx = expenses
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5)
          .map((tx) => ({
            date: tx.date,
            description: tx.description || tx.category,
            category: tx.category,
            amount: tx.amount,
          }));

        setRecentTransactions(recentTx);

        // Fetch portfolio holdings
        const { data: holdings, error: holdingsError } = await supabase
          .from("portfolio_holdings")
          .select("*");

        if (holdingsError) throw holdingsError;
        setPortfolioHoldings(holdings);

        // Fetch trading positions
        const { data: positions, error: positionsError } = await supabase
          .from("trading_positions")
          .select("*");

        if (positionsError) throw positionsError;
        setTradingPositions(positions);

        // Fetch trading portfolio
        const { data: portfolio, error: portfolioError } = await supabase
          .from("trading_portfolios")
          .select("*")
          .single();

        if (portfolioError) throw portfolioError;
        setTradingPortfolio(portfolio);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate total investment value
  const totalInvestment = portfolioHoldings.reduce(
    (acc, holding) => acc + (holding.current_price || 0) * holding.shares,
    0
  );

  // Calculate total unrealized P&L
  const totalUnrealizedPL = tradingPositions.reduce(
    (acc, position) => acc + position.unrealized_pl,
    0
  );

  return {
    balanceHistory,
    expensesByCategory,
    recentTransactions,
    totalBalance,
    totalInvestment,
    totalUnrealizedPL,
    tradingPortfolio,
    loading,
    error,
  };
};

export default useDashboardData;