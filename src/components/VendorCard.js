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
    Badge,
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import useVendorStore from '../stores/vendorStore';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';

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

    // Sort vendors by average_rating in descending order
    const sortedVendors = [...vendors].sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));

    const settings = {
        dots: true,
        infinite: sortedVendors.length > 4,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 3,
                    infinite: sortedVendors.length > 3,
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    infinite: sortedVendors.length > 2,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    infinite: sortedVendors.length > 1,
                }
            }
        ]
    };

    return (
        <Box p={4} mt={8} overflow="hidden">
            <Text fontSize="2xl" fontWeight="bold" mb={6} borderLeft="4px solid orange.400" pl={4}>
                Top Sellers
            </Text>

            <Box mx={-2}>
                <Slider {...settings}>
                    {sortedVendors.map((vendor) => (
                        <Box key={vendor.id} px={2} pb={6}>
                            <Box
                                p={5}
                                borderWidth="1px"
                                borderRadius="2xl"
                                overflow="hidden"
                                boxShadow="xl"
                                bgGradient="linear(to-br, #132063, #0A0E23)"
                                color="white"
                                position="relative"
                                _hover={{ boxShadow: "2xl", transform: "translateY(-8px)" }}
                                transition="all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                                minH="380px"
                                display="flex"
                                flexDirection="column"
                                justifyContent="space-between"
                            >
                                {/* Circular Rating Badge */}
                                <Flex justifyContent="flex-end" position="absolute" top={4} right={4}>
                                    <CircularProgress
                                        value={(vendor.average_rating || 0) * 20}
                                        color="orange.400"
                                        size="50px"
                                        thickness="8px"
                                        trackColor="whiteAlpha.200"
                                    >
                                        <CircularProgressLabel fontSize="sm" fontWeight="bold" color="orange.400">
                                            {(vendor.average_rating || 0.0).toFixed(1)}
                                        </CircularProgressLabel>
                                    </CircularProgress>
                                </Flex>

                                {/* Avatar and Company Name */}
                                <VStack spacing={4} align="center" mt={4}>
                                    <Avatar
                                        size="xl"
                                        name={vendor.shop_name || vendor.name}
                                        src={vendor.images && vendor.images.length > 0 ? vendor.images[0].image : null}
                                        borderColor="orange.400"
                                        borderWidth={3}
                                        boxShadow="0 0 15px rgba(251, 146, 60, 0.3)"
                                    />
                                    <VStack spacing={1}>
                                        <Text fontSize="lg" fontWeight="bold" color="white" textAlign="center" noOfLines={1}>
                                            {vendor.shop_name || vendor.name}
                                        </Text>
                                        <Badge colorScheme="orange" variant="subtle" borderRadius="full" px={3}>
                                            {vendor.average_rating >= 4.5 ? 'PREMIUM' : 'VERIFIED'}
                                        </Badge>
                                    </VStack>
                                </VStack>

                                {/* Top-Rated Label and Stars */}
                                <Box mt={4}>
                                    <HStack justify="center" spacing={1}>
                                        {[...Array(5)].map((_, i) => (
                                            <Icon
                                                key={i}
                                                as={FaStar}
                                                color={i < Math.round(vendor.average_rating || 0) ? "orange.400" : "whiteAlpha.300"}
                                                boxSize={3.5}
                                            />
                                        ))}
                                    </HStack>
                                    <Text mt={3} fontSize="xs" color="gray.400" textAlign="center" noOfLines={2} px={2}>
                                        {vendor.shop_description || 'Reliable seller quality products.'}
                                    </Text>
                                </Box>

                                {/* Visit Button */}
                                <Button
                                    mt={6}
                                    colorScheme="orange"
                                    bg="orange.400"
                                    _hover={{ bg: "orange.500", shadow: "lg" }}
                                    color="white"
                                    borderRadius="xl"
                                    size="md"
                                    w="full"
                                    onClick={() => navigate(`/vendors/${vendor.id}/products`)}
                                    boxShadow="md"
                                >
                                    View Store
                                </Button>

                                {/* Subtle background design */}
                                <Box
                                    position="absolute"
                                    bottom={-5}
                                    left={-5}
                                    w="60px"
                                    h="60px"
                                    bg="whiteAlpha.100"
                                    borderRadius="full"
                                    filter="blur(20px)"
                                />
                            </Box>
                        </Box>
                    ))}
                </Slider>
            </Box>

            <style jsx global>{`
                .slick-dots li button:before {
                    color: orange !important;
                }
                .slick-dots li.slick-active button:before {
                    color: #F47D31 !important;
                }
                .slick-list {
                    margin: 0 -10px;
                }
            `}</style>
        </Box>
    );
};

export default VendorCard;
