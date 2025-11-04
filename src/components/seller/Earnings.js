import React, { useEffect, useState } from 'react';
import { Select, IconButton, Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Grid, GridItem } from '@chakra-ui/react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import useVendorOrderStore from '../../stores/vendorOrderStore';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Earnings = () => {
  const navigate = useNavigate();
  const { orders, fetchVendorOrders } = useVendorOrderStore(); // Access vendor orders from store
  const [monthlyEarnings, setMonthlyEarnings] = useState(new Array(12).fill(0)); // Initialize earnings for 12 months
  const [percentageChange, setPercentageChange] = useState(new Array(12).fill(0)); // Track percentage change for each month
  const [hoveredMonth, setHoveredMonth] = useState(new Date().getMonth()); // Track hovered month
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Set current month as default
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  // Categorize earnings by month
  const categorizeEarningsByMonth = (orders, year) => {
    const earningsByMonth = new Array(12).fill(0);

    orders
    .filter((order) => new Date(order.placed_at).getFullYear() === year) // Filter by selected year
    .forEach((order) => {
      const orderDate = new Date(order.placed_at);
      const month = orderDate.getMonth(); // Get month index (0 for Jan, 11 for Dec)
      earningsByMonth[month] += order.total;
    });

    setMonthlyEarnings(earningsByMonth);
    calculatePercentageChanges(earningsByMonth); // Calculate percentage changes after categorizing
  };

  // Calculate percentage change for each month
  const calculatePercentageChanges = (earningsByMonth) => {
    const changes = new Array(12).fill(0);

    earningsByMonth.forEach((currentMonthEarnings, index) => {
      const previousMonthEarnings = earningsByMonth[index - 1] || 0; // Handle case when it's January
      if (previousMonthEarnings > 0) {
        const change = ((currentMonthEarnings - previousMonthEarnings) / previousMonthEarnings) * 100;
        changes[index] = change.toFixed(2);
      } else {
        changes[index] = currentMonthEarnings > 0 ? 100 : 0; // Handle first month or no previous earnings
      }
    });

    setPercentageChange(changes);
  };

  // Handle bar click to navigate to Vendor Sales with selected month
  const handleBarClick = (monthIndex) => {
    setSelectedMonth(monthIndex);
    // Navigate to Vendor Sales page with the selected month as state
    navigate('/vendorsales', { state: { month: monthIndex } });
  };

  // Handle hover over bar to update percentage change text
  const handleBarHover = (monthIndex) => {
    setHoveredMonth(monthIndex);
  };

  // Fetch vendor orders on component mount and categorize earnings
  useEffect(() => {
    fetchVendorOrders();
  }, [fetchVendorOrders]);

  useEffect(() => {
    if (orders.length > 0) {
      categorizeEarningsByMonth(orders, selectedYear);
    }
  }, [orders, selectedYear]);

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Earnings (Rs)',
        data: monthlyEarnings,
        backgroundColor: '#F47D31',
        borderColor: '#0A0E23',
        borderWidth: 2,
        barThickness: 15, // Increased bar thickness for wider bars
        barPercentage: 0.8, // Adjust bar percentage for more width
        categoryPercentage: 0.5, // Adds spacing between bars
      },
    ],
  };

  // Mock pieData for demonstration
  const pieData = {
    labels: ['Product A', 'Product B', 'Product C'],
    datasets: [
      {
        label: 'Profit',
        data: [30, 50, 20],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          // Show percentage change in tooltip
          label: (context) => {
            const monthIndex = context.dataIndex;
            const percentage = percentageChange[monthIndex];
            return `Earnings: Rs ${context.raw.toFixed(2)} (${percentage}% from previous month)`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: '#FFFFFF', // White color for month names
        },
        grid: {
          color: '#505050', // Darker grid lines for x-axis
        },
        offset: true, // Adds spacing on X-axis
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5000, // Set increment to 5000
          callback: (value) => `Rs ${value}`, // Add rupee symbol to y-axis labels
          color: '#FFFFFF',
        },
        grid: {
          color: '#505050', // Darker grid lines for y-axis
        },
        grace: '10%', // Adds spacing above the highest bar
      },
    },
    onClick: (e, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        handleBarClick(index); // Handle bar click
      }
    },
    onHover: (e, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        handleBarHover(index); // Handle bar hover
      }
    },
  };

  return (
    <Box display="flex" height="100vh" bg="#0A0E23" color="white" border="2px">
      <IconButton
        aria-label="Back"
        icon={<ArrowBackIcon />}
        colorScheme="orange"
        onClick={() => navigate('/MainSellerPage')}
        mb="4"
      />

      <Box flex="1" p="20px" overflowY="auto">
        <Heading mb="20px" color="#F47D31">Earnings Analytics</Heading>
      {/* Year Selector */}
      <Select width="150px" mb="4" value={selectedYear} onChange={handleYearChange}>
          {[...Array(5)].map((_, i) => {
            const year = new Date().getFullYear() - i; // Show last 5 years
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </Select>
        <SimpleGrid columns={2} spacing={10} mb="20px">
          <Stat>
            <StatLabel>Total Earnings</StatLabel>
            <StatNumber>Rs {monthlyEarnings.reduce((a, b) => a + b, 0).toFixed(2)}</StatNumber>
            <StatHelpText>
              <StatArrow type={percentageChange[hoveredMonth] >= 0 ? 'increase' : 'decrease'} />
              {percentageChange[hoveredMonth]}% from last month
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Top Earning Category</StatLabel>
            <StatNumber>Product B</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              Rs 20,000
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Aligning Bar and Pie chart side by side */}
        <Grid templateColumns="repeat(2, 1fr)" gap={6} alignItems="center">
          <GridItem height="300px">
            <Heading size="md" mb="4">Earnings by Month</Heading>
            <Bar data={barData} options={chartOptions} />
          </GridItem>

          <GridItem height="300px">
            <Heading size="md" mb="4">Profit by Product</Heading>
            <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

export default Earnings;
