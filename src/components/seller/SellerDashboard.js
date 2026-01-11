import React, { useState, useEffect } from 'react';
import { Box, SimpleGrid, Text, Heading, Flex, Button, Icon, Grid, GridItem, Table, Thead, Tbody, Tr, Th, Td, Badge } from '@chakra-ui/react';
import { FaDollarSign, FaShoppingCart } from 'react-icons/fa';
import MonthlyStatsBarChart from './MonthlyStatsBarChart';
import Ordersdetails from './VendorOrders'; // Corrected import
import DailySalesLineChart from './DailySalesLineChart';
import ProductPieChart from './ProductPieChart';
import { useNavigate } from 'react-router-dom';
import useVendorOrderStore from '../../stores/vendorOrderStore'; // Import store for total sales

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { orders, fetchVendorOrders } = useVendorOrderStore(); // Get orders from the store
  const [totalSales, setTotalSales] = useState(0);
  const [totalProductsSold, setTotalProductsSold] = useState(0);

  useEffect(() => {
    fetchVendorOrders();
  }, [fetchVendorOrders]);

  useEffect(() => {
    if (orders.length > 0) {
      calculateStats(orders);
    }
  }, [orders]);

  const calculateStats = (orders) => {
    let sales = 0;
    let products = 0;
    orders.forEach((order) => {
      sales += parseFloat(order.total) || 0;
      if (order.items) {
        order.items.forEach(item => {
          products += item.quantity;
        });
      }
    });
    setTotalSales(sales);
    setTotalProductsSold(products);
  };

  const handleSwitchToBuyer = () => {
    navigate('/dashboard');
  };

  const handleOrdersClick = () => {
    navigate('/vendor-orders');
  };

  return (
    <Box p="20px" flex="1" bg="#0A0E23" color="white" height="97vh" border="1px solid #E2E8F0">
      <Flex justify="flex-start" align="center" mb="20px">
        <Button colorScheme='#F47D31' _hover={{ bg: '#F47D31' }} onClick={handleSwitchToBuyer}>
          Switch to Buyer
        </Button>
      </Flex>

      {/* Total Sales and Orders Boxes */}
      <SimpleGrid columns={3} spacing="20px" mb="20px">
        <Box
          bg="white"
          p="15px"
          borderRadius="md"
          boxShadow="md"
          textAlign="center"
          borderWidth="1px"
          borderColor="gray.200"
          width="100%"
          height="150px"
          cursor="pointer"
          onClick={() => navigate('/vendorsales')}
        >
          <Icon as={FaDollarSign} w={6} h={6} color="#F47D31" mb="2" />
          <Heading size="lg" mb="2" color="#0A0E23">Total Earnings</Heading>
          <Text fontSize="l" color="#F47D31">Rs {totalSales.toFixed(2)}</Text>
        </Box>

        <Box
          bg="white"
          p="15px"
          borderRadius="md"
          boxShadow="md"
          textAlign="center"
          borderWidth="1px"
          borderColor="gray.200"
          width="100%"
          height="150px"
          cursor="pointer"
          onClick={handleOrdersClick}
        >
          <Icon as={FaShoppingCart} w={6} h={6} color="#F47D31" mb="2" />
          <Heading size="lg" mb="2" color="#0A0E23">Orders</Heading>
          <Text fontSize="xl" color="#F47D31">{orders.length}</Text>
        </Box>

        <Box
          bg="white"
          p="15px"
          borderRadius="md"
          boxShadow="md"
          textAlign="center"
          borderWidth="1px"
          borderColor="gray.200"
          width="100%"
          height="150px"
        >
          <Icon as={FaShoppingCart} w={6} h={6} color="#F47D31" mb="2" />
          <Heading size="lg" mb="2" color="#0A0E23">Total Sold</Heading>
          <Text fontSize="xl" color="#F47D31">{totalProductsSold}</Text>
        </Box>
      </SimpleGrid>

      {/* Charts Section */}
      <Grid templateColumns="2fr 1fr" gap="6">
        <GridItem>
          <Box width="690px" bg="white" p="20px" borderRadius="md" boxShadow="md">
            <Heading size="md" mb="2" color="#0A0E23">Overview Order</Heading>
            <Box height="300px" width="600px" borderRadius="md">
              <MonthlyStatsBarChart />
            </Box>
          </Box>
        </GridItem>

        <GridItem>
          <Box width="325px" height="370px" bg="white" p="20px" borderRadius="md" boxShadow="md">
            <Heading size="md" mb="4" color="#0A0E23">Product Breakdown</Heading>
            <Box mb="20px">
              <ProductPieChart />
            </Box>
          </Box>
        </GridItem>
      </Grid>

      {/* Recent Orders Section */}
      <Box mt="20px" bg="white" p="20px" borderRadius="md" boxShadow="md" color="#0A0E23">
        <Heading size="md" mb="4">Recent Orders</Heading>
        {orders.length === 0 ? (
          <Text>No orders yet.</Text>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Order ID</Th>
                  <Th>Customer</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.slice(0, 5).map((order) => (
                  <Tr key={order.id}>
                    <Td>{order.id}</Td>
                    <Td>{order.buyer_name}</Td>
                    <Td>Rs {parseFloat(order.total).toFixed(2)}</Td>
                    <Td>
                      <Badge colorScheme={order.payment_status === 'Complete' ? 'green' : 'yellow'}>
                        {order.payment_status}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SellerDashboard;
