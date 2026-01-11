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
      categorizeEarnings(orders, selectedYear);
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

  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }]
  });
  const [topProduct, setTopProduct] = useState({ name: '-', earnings: 0 });

  // Categorize earnings by month and product
  const categorizeEarnings = (orders, year) => {
    const earningsByMonth = new Array(12).fill(0);
    const productEarnings = {};

    orders.forEach((order) => {
      const orderDate = new Date(order.placed_at);
      if (orderDate.getFullYear() === year) {
        const month = orderDate.getMonth();
        earningsByMonth[month] += parseFloat(order.total); // Ensure total is number

        // Aggregate by product (assuming order.items exists and has product title)
        if (order.items) {
          order.items.forEach(item => {
            const pName = item.product_title || `Product ${item.id}`;
            const pTotal = parseFloat(item.unit_price) * item.quantity;
            if (productEarnings[pName]) {
              productEarnings[pName] += pTotal;
            } else {
              productEarnings[pName] = pTotal;
            }
          });
        }
      }
    });

    setMonthlyEarnings(earningsByMonth);
    calculatePercentageChanges(earningsByMonth);

    // Prepare Pie Data (Top 5 Products)
    const sortedProducts = Object.entries(productEarnings).sort((a, b) => b[1] - a[1]);
    const top5 = sortedProducts.slice(0, 5);

    setPieData({
      labels: top5.map(p => p[0]),
      datasets: [{
        label: 'Earnings',
        data: top5.map(p => p[1]),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      }]
    });

    if (sortedProducts.length > 0) {
      setTopProduct({ name: sortedProducts[0][0], earnings: sortedProducts[0][1] });
    } else {
      setTopProduct({ name: '-', earnings: 0 });
    }
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
            <StatLabel>Top Earning Product</StatLabel>
            <StatNumber>{topProduct.name}</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              Rs {topProduct.earnings.toFixed(2)}
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
