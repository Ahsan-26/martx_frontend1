import React from 'react';
import {
    Box,
    Image,
    Text,
    Button,
    Flex,
    Icon,
    VStack
} from '@chakra-ui/react';
import { FaStar, FaShoppingBag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LikeProduct from './LikeProduct';

/**
 * ProductCard - Unified product card component
 * Used across: ProductListing, Wishlist, Dashboard
 * 
 * IMPORTANT: This component expects product data with this exact structure:
 * {
 *   id: number,
 *   title: string,
 *   description: string,
 *   unit_price: number,
 *   average_rating: number,
 *   vendor: string | null,
 *   images: [{id: number, image: string (absolute URL)}]  // <-- CRITICAL: images must be an array
 * }
 */
function ProductCard({ product, onAddToCart, showLike = true }) {
    const navigate = useNavigate();

    // Defensive check: Ensure product.images exists and has items
    const hasImages = product?.images && Array.isArray(product.images) && product.images.length > 0;
    const imageUrl = hasImages ? product.images[0].image : null;

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    const handleAddToCartClick = (e) => {
        e.stopPropagation(); // Prevent card click
        if (onAddToCart) {
            onAddToCart(product);
        }
    };

    return (
        <Box
            p={4}
            border="1px solid #e2e8f0"
            borderRadius="md"
            onClick={handleCardClick}
            _hover={{ boxShadow: "lg", transform: "translateY(-5px)" }}
            transition="transform 0.3s ease"
            cursor="pointer"
            role="group"
        >
            {/* Like Button - Top Right */}
            {showLike && (
                <Box position="relative" mb={2}>
                    <Box position="absolute" right={0} zIndex={2}>
                        <LikeProduct productId={product.id} />
                    </Box>
                </Box>
            )}

            {/* Product Image */}
            <Box height="200px" width="100%" overflow="hidden" mb={4} borderRadius="md" bg="gray.100">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={product.title || 'Product image'}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        transition="transform 0.3s"
                        _groupHover={{ transform: "scale(1.05)" }}
                        onError={(e) => {
                            console.error(`Failed to load image for product ${product.id}:`, imageUrl);
                            e.target.style.display = 'none';
                        }}
                    />
                ) : (
                    <Flex height="100%" alignItems="center" justifyContent="center">
                        <Text color="gray.400">No Image Available</Text>
                    </Flex>
                )}
            </Box>

            {/* Product Details */}
            <VStack align="start" spacing={2} mb={4}>
                <Text fontWeight="bold" fontSize="md" noOfLines={1} color="#0A0E23">
                    {product.title}
                </Text>

                <Text fontSize="sm" color="gray.600" noOfLines={3} minHeight="60px">
                    {product.description || 'No description available.'}
                </Text>

                {/* Rating */}
                <Flex alignItems="center">
                    {[...Array(5)].map((_, i) => (
                        <Icon
                            key={i}
                            as={FaStar}
                            color={i < (product.average_rating || 0) ? "orange.400" : "gray.300"}
                            boxSize={4}
                        />
                    ))}
                </Flex>

                {/* Price */}
                <Text fontWeight="bold" fontSize="lg" color="#0A0E23">
                    {product.unit_price != null ? `Rs ${product.unit_price.toFixed(2)}` : 'N/A'}
                </Text>
            </VStack>

            {/* Add to Cart Button */}
            {onAddToCart && (
                <Button
                    bgGradient="linear(to-b, #132063, #0A0E23)"
                    color="white"
                    _hover={{ bgGradient: "linear(to-b, orange.200, orange.600)", boxShadow: "md" }}
                    size="sm"
                    width="full"
                    leftIcon={<FaShoppingBag />}
                    onClick={handleAddToCartClick}
                >
                    Add to Cart
                </Button>
            )}
        </Box>
    );
}

export default ProductCard;
