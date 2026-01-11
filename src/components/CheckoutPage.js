import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, VStack, Heading, FormControl, FormLabel, Input, Button, RadioGroup, Radio, useToast } from '@chakra-ui/react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useMutation } from '@tanstack/react-query';
import { createOrder, createPaymentIntent } from '../services/checkoutService';
import { countries } from '../data/countries';

export default function CheckoutPage() {
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        country: '',
        postal_code: '',
    });

    const toast = useToast();
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const location = useLocation();

    // Populate fields with guest information from localStorage (if available)
    useEffect(() => {
        const guestInfo = JSON.parse(localStorage.getItem('guestInfo'));
        if (guestInfo) {
            setUserInfo({
                name: guestInfo.name || '',
                email: guestInfo.email || '',
                address: guestInfo.address || '',
                city: guestInfo.city || '',
                country: guestInfo.country || '',
                postal_code: guestInfo.postal_code || '',
            });
        }
    }, []);

    // Order creation mutation
    const createOrderMutation = useMutation({
        mutationFn: async () => {
            const { productId, quantity, guestInfo } = location.state || {};
            const cartId = localStorage.getItem('cartId');
            const payload = {
                cartId,
                userInfo: guestInfo || userInfo,
                productId,
                quantity,
                paymentMethod,
            };
            return createOrder(payload);
        },
        onError: (error) => {
            console.error('Order creation failed:', error);
            toast({
                title: 'Order Creation Failed',
                description: error.message || 'Something went wrong.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
        }
    });

    // Payment intent mutation
    const createPaymentIntentMutation = useMutation({
        mutationFn: async (orderId) => {
            return createPaymentIntent({ orderId });
        },
        onError: (error) => {
            console.error('Payment Intent creation failed:', error);
            toast({
                title: 'Payment Failed',
                description: error.message || 'Something went wrong with payment.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
        }
    });

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({ ...prev, [name]: value }));
    };

    // Handle payment method selection
    const handlePaymentMethodChange = (value) => {
        setPaymentMethod(value);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!paymentMethod) {
            toast({
                title: 'Select Payment Method',
                description: 'Please select a payment method before proceeding.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
            return;
        }

        try {
            // Step 1: Create the order
            const { orderId } = await createOrderMutation.mutateAsync();

            // Step 2: If Stripe is selected, create payment intent and process payment
            if (paymentMethod === 'stripe') {
                let clientSecret;
                try {
                    clientSecret = await createPaymentIntentMutation.mutateAsync(orderId);
                } catch (err) {
                    // Extract error message from API response if possible
                    const errorMsg = err.response?.data?.error || err.message || 'Payment failed to initialize.';
                    throw new Error(errorMsg);
                }

                if (!clientSecret) {
                    throw new Error('Failed to retrieve payment client secret.');
                }

                // Confirm the payment using Stripe
                const cardElement = elements.getElement(CardElement);
                const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: userInfo.name,
                            email: userInfo.email,
                            address: {
                                line1: userInfo.address,
                                city: userInfo.city,
                                country: userInfo.country,
                                postal_code: userInfo.postal_code,
                            },
                        },
                    },
                });
                if (error) {
                    throw new Error(error.message);
                }

                if (paymentIntent && paymentIntent.status === 'succeeded') {
                    toast({
                        title: 'Payment Successful',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                }
            } else {
                // If COD, just notify user of successful order creation
                toast({
                    title: 'Order Placed',
                    description: 'Your order has been placed successfully with Cash on Delivery.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            }

            // Clear local storage
            localStorage.removeItem('orderId');
            localStorage.removeItem('guestInfo');

            // Redirect to confirmation page
            navigate(`/order-confirmation/${orderId}`);

        } catch (error) {
            toast({
                title: 'Checkout Failed',
                description: error.message || 'An error occurred during checkout.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxWidth="500px" margin="auto" padding={8}>
            <VStack spacing={6} as="form" onSubmit={handleSubmit}>
                <Heading as="h1" size="xl">Checkout</Heading>

                {/* User Information Inputs */}
                <FormControl isRequired>
                    <FormLabel htmlFor="name">Full Name</FormLabel>
                    <Input id="name" name="name" value={userInfo.name} onChange={handleInputChange} />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input id="email" name="email" type="email" value={userInfo.email} onChange={handleInputChange} />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel htmlFor="address">Address</FormLabel>
                    <Input id="address" name="address" value={userInfo.address} onChange={handleInputChange} />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel htmlFor="city">City</FormLabel>
                    <Input id="city" name="city" value={userInfo.city} onChange={handleInputChange} />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel htmlFor="country">Country</FormLabel>
                    <Box
                        as="select"
                        id="country"
                        name="country"
                        value={userInfo.country}
                        onChange={handleInputChange}
                        w="full"
                        p={2}
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        bg="white"
                    >
                        <option value="">Select a country</option>
                        {countries.map(c => (
                            <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                    </Box>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel htmlFor="postal_code">Postal Code</FormLabel>
                    <Input id="postal_code" name="postal_code" value={userInfo.postal_code} onChange={handleInputChange} />
                </FormControl>

                {/* Payment Method Selection */}
                <FormControl isRequired>
                    <FormLabel>Select Payment Method</FormLabel>
                    <RadioGroup onChange={handlePaymentMethodChange} value={paymentMethod}>
                        <Radio value="stripe">Stripe</Radio>
                        <Radio value="cod">Cash on Delivery (COD)</Radio>
                    </RadioGroup>
                </FormControl>

                {/* Stripe Card Element (only show if Stripe is selected) */}
                {paymentMethod === 'stripe' && (
                    <FormControl isRequired>
                        <FormLabel htmlFor="card-element">Credit or Debit Card</FormLabel>
                        <Box border="1px solid" borderColor="gray.200" borderRadius="md" p={3}>
                            <CardElement id="card-element" />
                        </Box>
                    </FormControl>
                )}

                {/* Pay Now Button */}
                <Button type="submit" colorScheme="blue" isLoading={loading} loadingText="Processing" width="full">
                    Pay Now
                </Button>
            </VStack>
        </Box>
    );
}
