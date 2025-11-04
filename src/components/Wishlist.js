import React from 'react';
import { Box, Grid, Image, Text, Button, Flex, Icon, Spinner } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCart } from '../hooks/useCart'; // Custom hook for cart operations
import useCartStore from '../stores/cartStore'; // Zustand store for cart state
import LikeProduct from './LikeProduct';

function Wishlist() {
    const [recommendedProducts, setRecommendedProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const { addToCartMutation } = useCart(); // Cart operations
    const navigate = useNavigate(); // For navigation
    const cartItems = useCartStore((state) => state.cartItems); // Current cart items

    // Fetch recommended products
    React.useEffect(() => {
        const fetchRecommendedProducts = async () => {
            // Retrieve the access token from localStorage
            const token = localStorage.getItem('accessToken'); 
    
            if (!token) {
                setError('User is not authenticated.');
                setLoading(false);
                return;
            }
    
            try {
                // Make the API request with Authorization header containing the access token
                const { data } = await axios.get('http://127.0.0.1:8000/wishlist/', {
                    headers: {
                        Authorization: `JWT ${token}`,  // Include the token in the request header
                    },
                });
    
                setRecommendedProducts(data || []);
            } catch (err) {
                // Handle error if the request fails
                setError(err.response?.data?.detail || 'Failed to load recommended products. Please try again.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchRecommendedProducts();
    }, []);
    

    // Handle adding a product to the cart
    const handleAddToCart = (product) => {
        const existingItem = cartItems.find(item => item.product.id === product.id);

        if (existingItem) {
            toast.info(`"${product.title}" is already in the cart!`);
        } else {
            addToCartMutation.mutate({ productId: product.id }, {
                onSuccess: () => {
                    toast.success(`"${product.title}" has been added to your cart!`);
                },
                onError: () => {
                    toast.error('Failed to add item to cart. Please try again.');
                }
            });
        }
    };

    // Navigate to product details
    const handleCardClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    // Display loading spinner while fetching products
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Spinner size="xl" />
            </Box>
        );
    }

    // Display error message if there's an error
    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Text color="red.500">{error}</Text>
            </Box>
        );
    }

    // If no products are found
    if (!recommendedProducts || recommendedProducts.length === 0) {
        return <Text>No products in wishlist! Like Some!</Text>;
    }

    return (
        <Box p={4} mt={8}>
            <Text fontSize="2xl" mb={4} fontWeight="bold">My Wishlist</Text>
            <Grid templateColumns="repeat(auto-fill, minmax(240px, 1fr))" gap={6}>
                {recommendedProducts.map((product) => (
                    <Box
                        key={product.id}
                        p={4}
                        border="1px solid #e2e8f0"
                        borderRadius="md"
                        onClick={() => handleCardClick(product.id)}
                        _hover={{ boxShadow: "lg", transform: "translateY(-5px)" }}
                        transition="transform 0.3s ease"
                    >
                        <Box position="relative">
  <Box position="absolute" right={0} marginLeft={30}>
    <LikeProduct productId={product.id} />
  </Box>
</Box>
 
                        <Box
                            height="200px"
                            width="100%"
                            overflow="hidden"
                            mb={4}
                            borderRadius="md"
                            bg="gray.100"
                        >
                            {product.images && product.images.length > 0 ? (
                                <Image
                                    src={product.images[0].image}
                                    alt={product.title}
                                    width="100%"
                                    height="100%"
                                    objectFit="cover"
                                    transition="transform 0.3s"
                                    _hover={{ transform: "scale(1.05)" }}
                                />
                                
                            ) : (
                                <Box height="100%" display="flex" alignItems="center" justifyContent="center">
                                    <Text>No Image Available</Text>
                                </Box>
                                
                            )}
                        </Box>

                        <Text fontWeight="bold" mb={1} noOfLines={1} minHeight="24px">
                            {product.title}
                        </Text>
                       

                        <Text fontSize="sm" color="gray.600" mb={2} noOfLines={3} minHeight="60px">
                            {product.description || ' '}
                        </Text>

                        <Flex mb={4} minHeight="24px">
                            {[...Array(5)].map((_, i) => (
                                <Icon
                                    key={i}
                                    as={FaStar}
                                    color={i < product.average_rating ? "orange.400" : "gray.300"}
                                    boxSize={4}
                                />
                            ))}
                        </Flex>

                        <Text fontWeight="bold" fontSize="lg" mb={4} minHeight="24px">
                            {product.unit_price ? `Rs ${product.unit_price.toFixed(2)}` : 'N/A'}
                        </Text>

                        <Button
                            bgGradient="linear(to-b,  #132063, #0A0E23)"
                            color="white"
                            _hover={{ bgGradient: "linear(to-b,  orange.200, orange.600)", boxShadow: "md" }}
                            size="sm"
                            width="full"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                            }}
                        >
                            Add to Cart
                        </Button>
                    </Box>
                ))}
            </Grid>
        </Box>
    );
}

export default Wishlist;
