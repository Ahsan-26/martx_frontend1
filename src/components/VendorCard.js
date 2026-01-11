import React, { useEffect } from 'react';
import {
    Box,
    Text,
    Flex,
    Button,
    Avatar,
    CircularProgress,
    CircularProgressLabel,
    VStack,
    HStack,
    Icon,
    Grid,
    GridItem,
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import useVendorStore from '../stores/vendorStore';
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook

const VendorCard = () => {
    const fetchVendors = useVendorStore((state) => state.fetchVendors); // Fetching vendors from Zustand store
    const vendors = useVendorStore((state) => state.vendors);
    const loading = useVendorStore((state) => state.loading);
    const error = useVendorStore((state) => state.error);
    const navigate = useNavigate();
    useEffect(() => {
        fetchVendors(); // Fetch vendors when the component mounts
    }, [fetchVendors]);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error}</Text>;

    return (
        <>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>Top Rated Seller's</Text>

            {/* Grid Layout to make the cards responsive */}
            <Grid
                templateColumns={{ base: "1fr", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }}
                gap={4}
                padding={4}
                justifyContent="center"
            >
                {vendors.map((vendor) => (
                    <GridItem key={vendor.id}>
                        <Box
                            p={4}
                            maxWidth="280px"  // Narrowed card width
                            borderWidth="1px"
                            borderRadius="xl"
                            overflow="hidden"
                            boxShadow="lg"
                            bgGradient="linear(to-r, #132063, #0A0E23)"
                            color="white"
                            position="relative"
                            _hover={{ boxShadow: "2xl", transform: "translateY(-5px)" }}
                            transition="transform 0.3s ease"
                        >
                            {/* Circular Rating Badge */}
                            <Flex justifyContent="flex-end">
                                <CircularProgress value={vendor.average_rating * 20} color="orange.400" size="45px" thickness="6px">
                                    <CircularProgressLabel fontSize="lg" color="orange.400">
                                        {vendor.average_rating.toFixed(1)}
                                    </CircularProgressLabel>
                                </CircularProgress>
                            </Flex>

                            {/* Avatar and Company Name */}
                            <VStack spacing={4} align="center" mt={-8}>
                                <Avatar
                                    size="2xl"
                                    name={vendor.name || 'companyName'}
                                    src={vendor.images}
                                    borderColor="orange.400"
                                    borderWidth={2}
                                    boxSize={{ base: "80px", md: "100px" }}  // Adjust size responsively
                                />
                                <Text fontSize="xl" fontWeight="bold" color="orange.200">
                                    {vendor.shop_name || vendor.name || 'Vendor'}
                                </Text>
                            </VStack>

                            {/* Top-Rated Label and Stars */}
                            <Box mt={4} textAlign="center">
                                <Text fontSize="md" fontWeight="bold" color="orange.300">
                                    {vendor.average_rating >= 4.5 ? 'TOP-RATED' : 'SELLER'}
                                </Text>
                                <HStack justify="center" mt={2}>
                                    {[...Array(5)].map((_, i) => (
                                        <Icon
                                            key={i}
                                            as={FaStar}
                                            color={i < Math.round(vendor.average_rating) ? "orange.400" : "gray.500"}
                                            boxSize={4}
                                        />
                                    ))}
                                </HStack>
                            </Box>

                            {/* Other Details */}
                            <Box mt={4} textAlign="center">
                                <Text fontSize="sm" color="gray.300" noOfLines={2}>
                                    {vendor.shop_description || 'No description available'}
                                </Text>
                            </Box>

                            {/* Visit Button */}
                            <Flex justify="center" mt={6}>
                                <Button
                                    colorScheme="orange"
                                    bg="orange.400"
                                    color="white"
                                    borderRadius="full"
                                    onClick={() => navigate(`/vendors/${vendor.id}/products`)}  // Navigate to vendor's product page
                                    _hover={{ bg: "orange.500" }}
                                >
                                    Visit Vendor
                                </Button>
                            </Flex>

                            {/* Bottom Right Design Element */}
                            <Box position="absolute" bottom={2} right={2}>
                                <Box
                                    width="40px"
                                    height="2px"
                                    bg="orange.400"
                                    mb="2px"
                                />
                                <Box
                                    width="30px"
                                    height="2px"
                                    bg="orange.200"
                                />
                            </Box>
                        </Box>
                    </GridItem>
                ))}
            </Grid>
        </>
    );
};

export default VendorCard;
