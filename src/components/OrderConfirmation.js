import React, { useState, useEffect } from 'react';
import {
    Box, Heading, Text, Button, VStack, HStack, Divider, Badge, Stack, Spinner,
    Circle, Icon, useColorModeValue, Container, Flex
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import axios from 'axios';

const MotionBox = motion(Box);
const MotionCircle = motion(Circle);

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const bgColor = useColorModeValue('white', 'gray.800');
    const metaBg = useColorModeValue('gray.50', 'whiteAlpha.50');
    const itemBg = useColorModeValue('white', 'gray.700');
    const accentColor = '#F47D31'; // MartX Orange
    const secondaryColor = '#0A0E27'; // Dark Navy

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            fetchAuthenticatedOrderDetails(token);
        } else {
            fetchGuestOrderDetails();
        }
    }, [orderId]);

    const fetchAuthenticatedOrderDetails = async (token) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/store/orders/${orderId}/`, {
                headers: { Authorization: `JWT ${token}` }
            });
            setOrderDetails(response.data);
        } catch (error) {
            console.error('Failed to fetch authenticated order details:', error);
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const fetchGuestOrderDetails = async () => {
        try {
            const guestEmail = localStorage.getItem('guestEmail');
            const response = await axios.post('http://127.0.0.1:8000/store/guest-orders/', {
                order_id: orderId,
                email: guestEmail
            });
            setOrderDetails(response.data);
        } catch (error) {
            console.error('Failed to fetch guest order details:', error);
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'green';
            case 'pending': return 'orange';
            case 'failed': return 'red';
            default: return 'gray';
        }
    };

    if (loading) {
        return (
            <VStack minH="60vh" justify="center">
                <Spinner size="xl" thickness="4px" speed="0.65s" emptyColor="gray.200" color={accentColor} />
                <Text fontSize="lg" fontWeight="medium" color="gray.500">Curating your order details...</Text>
            </VStack>
        );
    }

    if (!orderDetails) return null;

    return (
        <Container maxW="container.md" py={12}>
            <MotionBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                bg={bgColor}
                p={{ base: 6, md: 10 }}
                borderRadius="2xl"
                boxShadow="2xl"
                position="relative"
                overflow="hidden"
            >
                {/* Decorative Gradient Top Bar */}
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    h="8px"
                    bgGradient={`linear(to-r, ${accentColor}, #FFB07F)`}
                />

                <VStack spacing={8} align="stretch">
                    {/* Success Header Animation */}
                    <VStack spacing={4}>
                        <MotionCircle
                            size="80px"
                            bg="green.500"
                            color="white"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
                        >
                            <Icon as={CheckIcon} w={10} h={10} />
                        </MotionCircle>
                        <Heading size="xl" color={secondaryColor}>Order Confirmed!</Heading>
                        <Text fontSize="lg" color="gray.500" textAlign="center">
                            Thank you for shopping with MartX. Your order is now being processed.
                        </Text>
                    </VStack>

                    {/* Order Meta Info Card */}
                    <Box
                        bg={metaBg}
                        p={6}
                        borderRadius="xl"
                    >
                        <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" spacing={4}>
                            <VStack align="start" spacing={1}>
                                <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase">Order ID</Text>
                                <Text fontWeight="bold" fontSize="lg">#{orderDetails.id}</Text>
                            </VStack>
                            <VStack align={{ base: 'start', md: 'center' }} spacing={1}>
                                <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase">Status</Text>
                                <Badge
                                    px={3} py={1} borderRadius="full" fontSize="sm"
                                    colorScheme={getStatusBadgeColor(orderDetails.payment_status)}
                                >
                                    {orderDetails.payment_status}
                                </Badge>
                            </VStack>
                            <VStack align={{ base: 'start', md: 'end' }} spacing={1}>
                                <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase">Total Amount</Text>
                                <Text fontWeight="extrabold" fontSize="2xl" color={accentColor}>
                                    Rs {orderDetails.total.toLocaleString()}
                                </Text>
                            </VStack>
                        </Stack>
                    </Box>

                    {/* Order Items List */}
                    <Box>
                        <Heading size="md" mb={6} color={secondaryColor} display="flex" alignItems="center">
                            Order Items <Badge ml={3} borderRadius="full" px={2}>{orderDetails.items.length}</Badge>
                        </Heading>
                        <VStack spacing={4} align="stretch">
                            {orderDetails.items.map((item, index) => (
                                <Flex
                                    key={index}
                                    p={4}
                                    borderWidth="1px"
                                    borderRadius="lg"
                                    bg={itemBg}
                                    justify="space-between"
                                    align="center"
                                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                                    transition="all 0.2s"
                                >
                                    <HStack spacing={4}>
                                        <Circle size="40px" bg="gray.100" color={secondaryColor} fontWeight="bold">
                                            {index + 1}
                                        </Circle>
                                        <VStack align="start" spacing={0}>
                                            <Text fontWeight="bold">{item.product.title}</Text>
                                            <Text fontSize="sm" color="gray.500">Quantity: {item.quantity}</Text>
                                        </VStack>
                                    </HStack>
                                    <Text fontWeight="bold" color={secondaryColor}>
                                        Rs {(item.quantity * item.unit_price).toLocaleString()}
                                    </Text>
                                </Flex>
                            ))}
                        </VStack>
                    </Box>

                    <Divider />

                    {/* Action Buttons */}
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                        <Button
                            leftIcon={<Icon as={ArrowForwardIcon} />}
                            bg={secondaryColor}
                            color="white"
                            _hover={{ bg: '#1a1f3c' }}
                            size="lg"
                            w="full"
                            onClick={() => navigate('/dashboard')}
                        >
                            Return to Shopping
                        </Button>
                        <Button variant="outline" size="lg" w="full" isDisabled>
                            Download Invoice
                        </Button>
                    </Stack>

                    <Text fontSize="xs" color="gray.400" textAlign="center">
                        A confirmation email has been sent to your registered address. For support, please contact help@martx.com
                    </Text>
                </VStack>
            </MotionBox>
        </Container>
    );
};

export default OrderConfirmation;
