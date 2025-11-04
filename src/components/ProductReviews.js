import React from 'react';
import { Box, Text, Flex, HStack, Icon, Divider } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import ReviewCard from './ReviewCard';  // Import individual review component

const ProductReviews = () => {
    return (
        <Box p={4} maxW="1200px" mx="auto">
            <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="2xl" fontWeight="bold">Reviews (4.8)</Text>
                <HStack>
                    {[...Array(5)].map((_, i) => (
                        <Icon key={i} as={FaStar} color="orange.400" />
                    ))}
                    <Text>(128 Reviews)</Text>
                </HStack>
            </Flex>
            <Divider my={4} />

            <ReviewCard />
            
        </Box>
    );
};

export default ProductReviews;
