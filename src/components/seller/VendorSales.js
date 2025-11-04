import React, { useEffect, useState } from 'react';
import {
  Select,
  Box,
  Text,
  Spinner,
  List,
  ListItem,
  VStack,
  HStack,
  Badge,
  Flex,
  Button,
} from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import useVendorOrderStore from '../../stores/vendorOrderStore';

const VendorSales = () => {
  const { orders = [], loading, error, fetchVendorOrders } = useVendorOrderStore();
  const [totalSales, setTotalSales] = useState(0);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();
  const location = useLocation();
  const dayFilter = location.state?.day; // Get the day filter from route state

  // Calculate total sales
  const calculateSales = (orders) => {
    let total = 0;
    orders.forEach((order) => {
      total += order.total || 0;
    });
    setTotalSales(total);
  };

   // Filter orders by month and day
   const filterOrders = (orders, month, day, year) => {
    return orders.filter((order) => {
      const orderDate = new Date(order.placed_at);
      const isSameMonth = orderDate.getMonth() === month;
      const isSameYear = orderDate.getFullYear() === year;
      const isSameDay = day !== null ? orderDate.getDate() === day : true;
      return isSameMonth && isSameYear && isSameDay;
    });
  };


  useEffect(() => {
    if (orders.length === 0) {
      fetchVendorOrders(); // Fetch orders if not already fetched
    } else {
      const filtered = filterOrders(orders, selectedMonth, selectedDay, selectedYear);
      setFilteredOrders(filtered);
      calculateSales(filtered);
    }
  }, [orders, fetchVendorOrders, selectedMonth, selectedDay, selectedYear]);

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner color="#F47D31" size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Text color="red.500" textAlign="center" mt={8}>
        {error}
      </Text>
    );
  }

  return (
    <Box
      p={6}
      bg="white"
      color="gray.800"
      borderRadius="md"
      boxShadow="xl"
      maxW="600px"
      mx="auto"
      mt={8}
    >
      {/* Back Button */}
      <Button
        leftIcon={<FaArrowLeft />}
        colorScheme="blue"
        variant="outline"
        mb={4}
        onClick={() => navigate('/MainSellerPage')}
      >
        Back
      </Button>

      <VStack spacing={4} align="stretch">
        <Box textAlign="center">
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            Total Sales
          </Text>
          <Text fontSize="4xl" fontWeight="bold" color="#0A0E27">
            Rs {totalSales.toFixed(2)}
          </Text>
        </Box>

        <HStack spacing={4} justifyContent="center" mb={4}>
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
          >
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(
              (month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              )
            )}
          </Select>

          <Select
            value={selectedDay || ''}
            onChange={(e) => setSelectedDay(e.target.value ? parseInt(e.target.value, 10) : null)}
          >
            <option value="">All Days</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </Select>

          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
          >
            {[2023, 2024, 2025].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </HStack>
        <Box mt={6} bg="white" p={4} borderRadius="md" boxShadow="md">
          <Text fontSize="xl" fontWeight="bold" color="#0A0E27" mb={4}>
            Sales List
          </Text>
          {filteredOrders.length === 0 ? (
            <Text textAlign="center" color="gray.500">
              {dayFilter !== undefined ? 'No sales for the selected day.' : 'No sales available at the moment.'}
            </Text>
          ) : (
            <List spacing={3}>
              {filteredOrders.map((order) => (
                <ListItem
                  key={order.id}
                  p={4}
                  bg="white"
                  borderRadius="md"
                  boxShadow="sm"
                  _hover={{ bg: 'gray.50' }}
                  border="1px solid"
                  borderColor="#0A0E27"
                >
                  <VStack align="start" spacing={1}>
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="bold">Order ID: {order.id}</Text>
                      <Badge colorScheme="green" variant="solid">
                        {order.status || 'Completed'}
                      </Badge>
                    </HStack>
                    <Text fontSize="sm">
                      Date: {new Date(order.placed_at).toLocaleString()}
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="#0A0E27">
                      Rs {order.total?.toFixed(2) || '0.00'}
                    </Text>
                  </VStack>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default VendorSales;
