import React, { useEffect, useState } from 'react';
import {
    Box,
    Heading,
    Spinner,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Select,
    IconButton,
    Text,
    Flex,
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    List,
    ListItem,
    useToast,
} from '@chakra-ui/react';
import { CheckIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import useVendorOrderStore from '../../stores/vendorOrderStore';
import { jsPDF } from 'jspdf'; // Import jsPDF

const Ordersdetails = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Access location state
    const { orders, loading, fetchVendorOrders, updateOrderStatus } = useVendorOrderStore();
    const [selectedStatus, setSelectedStatus] = useState({});
    const [selectedOrder, setSelectedOrder] = useState(null); // Track selected order for popover
    const [filteredOrders, setFilteredOrders] = useState([]);
    const toast = useToast();
    const token = localStorage.getItem('access_token');
    const selectedMonth = location.state?.month; // Get selected month from state (if any)

    useEffect(() => {
        const fetchOrders = async () => {
            await fetchVendorOrders(token);
            const initialStatuses = {};
            orders.forEach(order => {
                initialStatuses[order.id] = order.payment_status;
            });
            setSelectedStatus(initialStatuses);
        };

        fetchOrders();
    }, [fetchVendorOrders, token]);

    // Filter orders by selected month (if provided)
    useEffect(() => {
        if (selectedMonth !== undefined) {
            const filtered = orders.filter(order => {
                const orderMonth = new Date(order.placed_at).getMonth();
                return orderMonth === selectedMonth;
            });
            setFilteredOrders(filtered);
        } else {
            setFilteredOrders(orders); // Show all orders if no month is selected
        }
    }, [orders, selectedMonth]);

    const handleStatusChange = (orderId, value) => {
        setSelectedStatus((prevStatus) => ({ ...prevStatus, [orderId]: value }));
    };

    const handleUpdateStatus = async (orderId, e) => {
        e.stopPropagation(); // Prevent row click
        const status = selectedStatus[orderId];
        if (!status) {
            toast({
                title: 'Error',
                description: 'Please select a status before updating',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
            return;
        }

        await updateOrderStatus(orderId, status, token);
        toast({
            title: 'Success',
            description: 'Order status updated successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'yellow.400';
            case 'Complete':
                return 'green.400';
            case 'Failed':
                return 'red.400';
            default:
                return 'gray.400';
        }
    };

    const generatePDFReceipt = (order) => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text('Order Receipt', 20, 20);

        doc.setFontSize(12);
        doc.text(`Order ID: ${order.id}`, 20, 40);
        doc.text(`Customer: ${order.buyer_name} (${order.buyer_email})`, 20, 50);
        doc.text(`Placed At: ${new Date(order.placed_at).toLocaleString()}`, 20, 60);
        doc.text(`Total Items: ${order.items.length}`, 20, 70);
        doc.text(`Total Amount: Rs ${parseFloat(order.total).toFixed(2)}`, 20, 80);

        doc.text('Items:', 20, 100);
        order.items.forEach((item, index) => {
            const yPos = 110 + index * 10;
            doc.text(`- ${item.product_title} (Qty: ${item.quantity}, Unit Price: Rs ${item.unit_price})`, 20, yPos);
        });

        // Save PDF
        doc.save(`Order_${order.id}_Receipt.pdf`);
    };

    if (loading) {
        return <Spinner size="xl" />;
    }

    return (
        <Box width="100%" mx="auto" p="4" bg="#0A0E23" color="white">
            <IconButton
                aria-label="Back"
                icon={<ArrowBackIcon />}
                colorScheme="orange"
                onClick={() => navigate('/MainSellerPage')}
                mb="4"
            />

            <Heading as="h2" size="lg" textAlign="center" mb="6" color="#F47D31">
                Vendor Orders {selectedMonth !== undefined ? `(Month: ${selectedMonth + 1})` : ''}
            </Heading>

            <Table variant="simple" size="sm" colorScheme="blue">
                <Thead>
                    <Tr>
                        <Th color="white">Order ID</Th>
                        <Th color="white">Customer</Th>
                        <Th color="white">Placed At</Th>
                        <Th color="white">Items</Th>
                        <Th color="white">Status</Th>
                        <Th color="white">Update Status</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {filteredOrders.map((order) => (
                        <Tr key={order.id}>
                            <Td>{order.id}</Td>
                            <Td>{order.buyer_name}</Td>
                            <Td>{new Date(order.placed_at).toLocaleString()}</Td>
                            <Td>
                                <Popover>
                                    <PopoverTrigger>
                                        <Button
                                            colorScheme="orange"
                                            size="sm"
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            {order.items.length} Items
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent color="black" bg="white" p="4">
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverHeader fontWeight="bold">
                                            Order Details
                                        </PopoverHeader>
                                        <PopoverBody>
                                            <Text><strong>Order ID:</strong> {order.id}</Text>
                                            <Text><strong>Customer:</strong> {order.buyer_name} ({order.buyer_email})</Text>
                                            <Text><strong>Placed At:</strong> {new Date(order.placed_at).toLocaleString()}</Text>
                                            <Text><strong>Total Items:</strong> {order.items.length}</Text>
                                            <Text><strong>Total Amount:</strong> Rs {parseFloat(order.total).toFixed(2)}</Text>

                                            <List spacing={2} mt={4}>
                                                {order.items.map((item, index) => (
                                                    <ListItem key={index}>
                                                        <Text><strong>Product:</strong> {item.product_title}</Text>
                                                        <Text><strong>Quantity:</strong> {item.quantity}</Text>
                                                        <Text><strong>Unit Price:</strong> Rs {item.unit_price}</Text>
                                                    </ListItem>
                                                ))}
                                            </List>

                                            <Button
                                                mt="4"
                                                bg="#0A0E23"
                                                color="white"
                                                width="full"
                                                _hover={{ bg: 'rgba(10, 14, 35, 0.8)' }}
                                                onClick={() => generatePDFReceipt(order)}
                                            >
                                                Download Receipt
                                            </Button>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>
                            </Td>
                            <Td>
                                <Text color={getStatusColor(order.payment_status)}>
                                    {order.payment_status}
                                </Text>
                            </Td>
                            <Td>
                                <Flex alignItems="center">
                                    <Select
                                        placeholder="Select status"
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        value={selectedStatus[order.id] || ''}
                                        size="sm"
                                        bg="white"
                                        color="black"
                                        mb="2"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Complete">Complete</option>
                                        <option value="Failed">Failed</option>
                                    </Select>

                                    <IconButton
                                        aria-label="Done"
                                        icon={<CheckIcon />}
                                        colorScheme="orange"
                                        onClick={(e) => handleUpdateStatus(order.id, e)}
                                        size="sm"
                                        ml="2"
                                    />
                                </Flex>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default Ordersdetails;
