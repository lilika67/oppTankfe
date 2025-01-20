import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { Line, Doughnut } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    accounts: [],
  });
  const [transactionHistory, setTransactionHistory] = useState({
    labels: [],
    datasets: [
      {
        label: "Income",
        data: [],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Expense",
        data: [],
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  });
  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categorySpending, setCategorySpending] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [accountsRes, transactionsRes] = await Promise.all([
          axios.get("https://eric-wallet-bn.onrender.com/api/accounts"),
          axios.get("https://eric-wallet-bn.onrender.com/api/transactions"),
        ]);

        // Calculate summary
        const accounts = accountsRes.data || [];
        const transactions = transactionsRes.data || [];

        const totalBalance = accounts.reduce(
          (sum, acc) => sum + (acc.balance || 0),
          0
        );

        const totalIncome = transactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + (t.amount || 0), 0);

        const totalExpense = transactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + (t.amount || 0), 0);

        setSummary({
          totalBalance,
          totalIncome,
          totalExpense,
          accounts,
        });

        // Process transaction history for line chart
        if (transactions.length > 0) {
          const history = processTransactionHistory(transactions);
          setTransactionHistory(history);
        }

        // Process category data for doughnut chart
        if (transactions.length > 0) {
          const categories = processCategoryData(transactions);
          setCategoryData(categories);
        }

        fetchRecentTransactions();
        fetchCategorySpending();
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const processTransactionHistory = (transactions) => {
    if (!transactions || transactions.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: "Income",
            data: [],
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
          {
            label: "Expense",
            data: [],
            borderColor: "rgb(255, 99, 132)",
            tension: 0.1,
          },
        ],
      };
    }

    // Group transactions by date and calculate daily totals
    const dailyTotals = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { income: 0, expense: 0 };
      }
      if (transaction.type === "income") {
        acc[date].income += transaction.amount || 0;
      } else {
        acc[date].expense += transaction.amount || 0;
      }
      return acc;
    }, {});

    return {
      labels: Object.keys(dailyTotals),
      datasets: [
        {
          label: "Income",
          data: Object.values(dailyTotals).map((d) => d.income),
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
        {
          label: "Expense",
          data: Object.values(dailyTotals).map((d) => d.expense),
          borderColor: "rgb(255, 99, 132)",
          tension: 0.1,
        },
      ],
    };
  };

  const processCategoryData = (transactions) => {
    if (!transactions || transactions.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      };
    }

    const categoryTotals = transactions.reduce((acc, transaction) => {
      const categoryName = transaction.category?.name || "Uncategorized";
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += transaction.amount || 0;
      return acc;
    }, {});

    return {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
        },
      ],
    };
  };

  const fetchRecentTransactions = async () => {
    try {
      const response = await axios.get(
        "https://eric-wallet-bn.onrender.com/api/transactions/recent"
      );
      setRecentTransactions(response.data);
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
    }
  };

  const fetchCategorySpending = async () => {
    try {
      const response = await axios.get(
        "https://eric-wallet-bn.onrender.com/api/transactions/category-spending"
      );
      const data = response.data;

      setCategorySpending({
        labels: data.map((item) => item.category.name),
        datasets: [
          {
            data: data.map((item) => Math.abs(item.total)),
            backgroundColor: data.map(
              (item) =>
                item.category.color ||
                "#" + Math.floor(Math.random() * 16777215).toString(16)
            ),
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching category spending:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatAmount = (amount, currency) => {
    return `${currency} ${Math.abs(amount).toFixed(2)}`;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Balance
              </Typography>
              <Typography variant="h4">
                ${summary.totalBalance.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Income
              </Typography>
              <Typography variant="h4" color="success.main">
                ${summary.totalIncome.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Expenses
              </Typography>
              <Typography variant="h4" color="error.main">
                ${summary.totalExpense.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Transaction History
            </Typography>
            <Box sx={{ height: 300 }}>
              {transactionHistory.labels.length > 0 ? (
                <Line
                  data={transactionHistory}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              ) : (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <Typography color="textSecondary">
                    No transaction data available
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Spending by Category
            </Typography>
            <Box sx={{ height: 300 }}>
              {categoryData.labels.length > 0 ? (
                <Doughnut
                  data={categoryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              ) : (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <Typography color="textSecondary">
                    No category data available
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Account List */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Accounts Overview
            </Typography>
            <Grid container spacing={2}>
              {summary.accounts && summary.accounts.length > 0 ? (
                summary.accounts.map((account) => (
                  <Grid item xs={12} sm={6} md={4} key={account._id}>
                    <Card>
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          {account.name}
                        </Typography>
                        <Typography variant="h6">
                          ${(account.balance || 0).toFixed(2)}
                        </Typography>
                        <Typography color="textSecondary">
                          {account.type}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography color="textSecondary" align="center">
                    No accounts available
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.category.name}
                          size="small"
                          sx={{
                            bgcolor: transaction.category.color,
                            color: "#fff",
                          }}
                        />
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color:
                            transaction.type === "expense"
                              ? "error.main"
                              : "success.main",
                        }}
                      >
                        {formatAmount(
                          transaction.amount,
                          transaction.account.currency
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {recentTransactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography color="text.secondary">
                          No recent transactions
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
