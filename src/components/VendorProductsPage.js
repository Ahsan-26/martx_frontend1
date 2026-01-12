import React from 'react';
import { useParams } from 'react-router-dom';
import ProductListing from './ProductListing';
import Navbar from './Navbar';
import Footer from './Footer'
import axios from 'axios';
import { Box, Heading, Text, Flex, VStack, HStack, Icon } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import BackButton from './BackButton';
const VendorProductsPage = () => {
    const { vendorId } = useParams();
    const [vendor, setVendor] = React.useState(null);

    React.useEffect(() => {
        const fetchVendor = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/store/vendors/${vendorId}/`);
                setVendor(response.data);
            } catch (error) {
                console.error("Error fetching vendor:", error);
            }
        };
        fetchVendor();
    }, [vendorId]);

    return (
        <>
            <Navbar />
            <Box maxW="1200px" mx="auto" p={4}>
                <BackButton />

                {vendor && (
                    <Box mb={8} p={6} borderWidth="1px" borderRadius="lg" bg="gray.50">
                        <Heading size="lg" mb={2}>{vendor.shop_name}</Heading>
                        <Text color="gray.600" mb={4}>{vendor.shop_description}</Text>

                        {vendor.vendor_stats && (
                            <Flex justify="space-between" align="center" wrap="wrap">
                                <VStack align="start" mr={8}>
                                    <Text fontSize="4xl" fontWeight="bold">{vendor.average_rating.toFixed(1)}</Text>
                                    <HStack>
                                        {[...Array(5)].map((_, i) => (
                                            <Icon
                                                key={i}
                                                as={FaStar}
                                                color={i < Math.round(vendor.average_rating) ? "orange.400" : "gray.300"}
                                            />
                                        ))}
                                    </HStack>
                                    <Text fontSize="sm" color="gray.500">{vendor.vendor_stats.total_reviews} Reviews</Text>
                                </VStack>

                                <VStack w={["100%", "50%"]} spacing={2}>
                                    {['positive', 'neutral', 'negative'].map((sent) => {
                                        const pct = vendor.vendor_stats.sentiment_percentages[sent];
                                        const color = sent === 'positive' ? 'green' : sent === 'negative' ? 'red' : 'yellow';
                                        return (
                                            <Flex key={sent} w="100%" align="center">
                                                <Text w="70px" fontSize="sm" textTransform="capitalize">{sent}</Text>
                                                <Box w="100%" h="8px" bg="gray.200" borderRadius="full" mx={2}>
                                                    <Box h="100%" w={`${pct}%`} bg={`${color}.400`} borderRadius="full" />
                                                </Box>
                                                <Text w="40px" fontSize="sm">{pct}%</Text>
                                            </Flex>
                                        );
                                    })}
                                </VStack>
                            </Flex>
                        )}
                    </Box>
                )}

                <ProductListing vendorId={vendorId} />
            </Box>
            <Footer />
        </>
    );
};

export default VendorProductsPage;