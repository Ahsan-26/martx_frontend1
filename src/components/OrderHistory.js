import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Box,
    Text,
    VStack,
    Spinner,
    Button,
    Heading,
    Flex,
    Badge,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Icon,
    Container,
    Card,
    CardBody,
    Divider
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaExternalLinkAlt, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import api from '../services/authInterceptor';  // Axios instance for authenticated requests

// Function to fetch orders
const fetchOrders = async (url = '/store/orders/') => {
    const response = await api.get(url);
    return response.data;
};

const OrderHistory = () => {
    const navigate = useNavigate();
    const [currentUrl, setCurrentUrl] = React.useState('/store/orders/');

    const { data: orderData, status } = useQuery({
        queryKey: ['orders', currentUrl],
        queryFn: () => fetchOrders(currentUrl),
        keepPreviousData: true
    });

    const orders = orderData?.results || [];
    const pagination = {
        next: orderData?.next,
        previous: orderData?.previous
    };

    const getStatusColor = (paymentStatus) => {
        switch (paymentStatus) {
            case 'C': return 'green'; // Complete
            case 'P': return 'orange'; // Pending
            case 'F': return 'red'; // Failed
            default: return 'gray';
        }
    };

    const getStatusText = (paymentStatus) => {
        switch (paymentStatus) {
            case 'C': return 'Complete';
            case 'P': return 'Pending';
            case 'F': return 'Failed';
            default: return 'Unknown';
        }
    };

    const getStatusIcon = (paymentStatus) => {
        switch (paymentStatus) {
            case 'C': return FaCheckCircle;
            case 'P': return FaClock;
            case 'F': return FaTimesCircle;
            default: return FaBox;
        }
    };

    if (status === 'loading') {
        return (
            <Flex justify="center" align="center" minHeight="60vh">
                <Spinner size="xl" color="#F47D31" thickness="4px" />
            </Flex>
        );
    }

    if (status === 'error') {
        return (
            <Flex justify="center" align="center" minHeight="60vh">
                <Text color="red.500" fontSize="xl" fontWeight="bold">Failed to load orders. Please try again later.</Text>
            </Flex>
        );
    }

    return (
        <Box bg="#F7F9FC" minHeight="100vh" py={10}>
            <Container maxW="1200px">
                <VStack spacing={8} align="stretch">
                    <Flex justify="space-between" align="center">
                        <Box>
                            <Heading as="h1" size="xl" color="#0A0E27" mb={2}>Order History</Heading>
                            <Text color="gray.600">Track and manage your recent purchases</Text>
                        </Box>
                        <Icon as={FaBox} w={10} h={10} color="#F47D31" />
                    </Flex>

                    {(!Array.isArray(orders) || orders.length === 0) ? (
                        <Card variant="outline" borderRadius="xl" borderStyle="dashed" bg="transparent">
                            <CardBody py={20}>
                                <VStack spacing={4}>
                                    <Icon as={FaBox} w={16} h={16} color="gray.300" />
                                    <Text fontSize="xl" fontWeight="medium" color="gray.500">No orders found yet.</Text>
                                    <Button
                                        colorScheme="orange"
                                        bg="#F47D31"
                                        _hover={{ bg: "#e36625" }}
                                        onClick={() => navigate('/products')}
                                    >
                                        Start Shopping
                                    </Button>
                                </VStack>
                            </CardBody>
                        </Card>
                    ) : (
                        <Card boxShadow="xl" borderRadius="2xl" overflow="hidden" border="1px" borderColor="gray.100">
                            <Table variant="simple">
                                <Thead bg="#0A0E27">
                                    <Tr>
                                        <Th color="white" py={5}>Order ID</Th>
                                        <Th color="white" py={5}>Placed At</Th>
                                        <Th color="white" py={5}>Status</Th>
                                        <Th color="white" py={5} isNumeric>Total Amount</Th>
                                        <Th color="white" py={5} textAlign="center">Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {orders.map((order) => (
                                        <Tr key={order.id} _hover={{ bg: "gray.50" }} transition="0.2s">
                                            <Td fontWeight="bold" color="#0A0E27">#{order.id}</Td>
                                            <Td color="gray.600">
                                                {new Date(order.placed_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </Td>
                                            <Td>
                                                <Badge
                                                    px={3}
                                                    py={1}
                                                    borderRadius="full"
                                                    colorScheme={getStatusColor(order.payment_status)}
                                                    display="flex"
                                                    alignItems="center"
                                                    width="fit-content"
                                                    gap={2}
                                                >
                                                    <Icon as={getStatusIcon(order.payment_status)} />
                                                    {getStatusText(order.payment_status)}
                                                </Badge>
                                            </Td>
                                            <Td isNumeric fontWeight="bold" color="#0A0E27">
                                                Rs {order.total.toFixed(2)}
                                            </Td>
                                            <Td textAlign="center">
                                                <Button
                                                    leftIcon={<FaExternalLinkAlt />}
                                                    size="sm"
                                                    colorScheme="orange"
                                                    variant="ghost"
                                                    _hover={{ bg: "#FFF4EF", color: "#F47D31" }}
                                                    onClick={() => navigate(`/order-confirmation/${order.id}`)}
                                                >
                                                    View Details
                                                </Button>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>

                            {/* Pagination Controls */}
                            {(pagination.next || pagination.previous) && (
                                <Flex justify="center" p={4} bg="gray.50" borderTop="1px" borderColor="gray.100" gap={4}>
                                    <Button
                                        size="sm"
                                        onClick={() => setCurrentUrl(pagination.previous)}
                                        isDisabled={!pagination.previous}
                                        variant="outline"
                                        bg="white"
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => setCurrentUrl(pagination.next)}
                                        isDisabled={!pagination.next}
                                        bg="#F47D31"
                                        color="white"
                                        _hover={{ bg: "#e36625" }}
                                    >
                                        Next
                                    </Button>
                                </Flex>
                            )}
                        </Card>
                    )}
                </VStack>
            </Container>
        </Box>
    );
};

export default OrderHistory;
