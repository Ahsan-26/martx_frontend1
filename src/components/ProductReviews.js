import React from 'react';
import { Box } from '@chakra-ui/react';
import ReviewCard from './ReviewCard';  // Import individual review component

const ProductReviews = () => {
    return (
        <Box p={4} maxW="1200px" mx="auto">
            <ReviewCard />
        </Box>
    );
};

export default ProductReviews;
