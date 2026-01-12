import React from 'react';
import {
    Box,
    Grid,
    Text,
    Spinner,
    VStack,
    Heading,
    Container,
    Button,
    Flex,
    Icon,
    HStack
} from '@chakra-ui/react';
import { FaHeart, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../services/authInterceptor';
import { toast } from 'react-toastify';
import { useCart } from '../hooks/useCart';
import Navbar from './Navbar';
import useCartStore from '../stores/cartStore';
import ProductCard from './ProductCard';

function Wishlist() {
    const [wishlistItems, setWishlistItems] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const { addToCartMutation } = useCart();
    const navigate = useNavigate();
    const cartItems = useCartStore((state) => state.cartItems);

    // Fetch wishlist products
    React.useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const { data } = await api.get('http://127.0.0.1:8000/wishlist/');
                console.log('Wishlist API response:', data);
                setWishlistItems(data || []);
            } catch (err) {
                console.error('Wishlist fetch error:', err);
                setError(err.response?.data?.detail || 'Failed to load wishlist.');
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    const handleAddToCart = (product) => {
        const existingItem = cartItems.find(item => item.product.id === product.id);

        if (existingItem) {
            toast.info(`"${product.title}" is already in the cart!`);
        } else {
            addToCartMutation.mutate({ productId: product.id }, {
                onSuccess: () => {
                    toast.success(`"${product.title}" added to cart!`);
                }
            });
        }
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" minH="60vh">
                <Spinner size="xl" color="orange.500" thickness="4px" />
            </Flex>
        );
    }

    if (error) {
        return (
            <Container maxW="container.md" py={20}>
                <VStack spacing={4} textAlign="center">
                    <Text color="red.500" fontSize="lg">{error}</Text>
                    <Button onClick={() => window.location.reload()} variant="outline" borderColor="orange.400">
                        Try Again
                    </Button>
                </VStack>
            </Container>
        );
    }

    if (!wishlistItems || wishlistItems.length === 0) {
        return (
            <>
                <Navbar />
                <Container maxW="container.xl" py={20}>
                    <VStack spacing={6} textAlign="center" py={10}>
                        <Icon as={FaHeart} boxSize={20} color="gray.200" />
                        <Heading size="lg" color="gray.700">Your wishlist is empty</Heading>
                        <Text color="gray.500">Save items you like to review them later.</Text>
                        <Button
                            leftIcon={<FaShoppingBag />}
                            bgGradient="linear(to-r, #132063, #0A0E23)"
                            color="white"
                            size="lg"
                            _hover={{ bg: "#F47D31" }}
                            onClick={() => navigate('/products')}
                        >
                            Browse Products
                        </Button>
                    </VStack>
                </Container>
            </>
        );
    }

    return (
        <>
            {/* Navbar at the top */}
            <Navbar />

            <Container maxW="container.xl" py={8} mt={4}>
                {/* Professional Navigation Header */}
                <Box mb={8}>
                    <HStack spacing={4} mb={4} flexWrap="wrap">
                        {/* Back Button */}
                        <Button
                            leftIcon={<FaArrowLeft />}
                            variant="outline"
                            borderColor="gray.300"
                            color="gray.700"
                            _hover={{ bg: "gray.50", borderColor: "gray.400" }}
                            onClick={() => navigate(-1)}
                            size="md"
                        >
                            Back
                        </Button>

                        <Box flex="1" />

                        {/* Continue Shopping Button */}
                        <Button
                            leftIcon={<FaShoppingBag />}
                            bgGradient="linear(to-r, #132063, #0A0E23)"
                            color="white"
                            _hover={{ bgGradient: "linear(to-r, #F47D31, orange.400)", transform: "translateY(-2px)" }}
                            transition="all 0.2s"
                            onClick={() => navigate('/products')}
                            size="md"
                            boxShadow="md"
                        >
                            Continue Shopping
                        </Button>
                    </HStack>

                    {/* Title Section */}
                    <VStack align="start" spacing={1}>
                        <Heading size="xl" bgGradient="linear(to-r, #132063, #0A0E23)" bgClip="text">
                            My Wishlist
                        </Heading>
                        <Text color="gray.500" fontWeight="medium">
                            You have {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                        </Text>
                    </VStack>
                </Box>

                {/* Product Grid using unified ProductCard component */}
                <Grid templateColumns="repeat(auto-fill, minmax(240px, 1fr))" gap={6}>
                    {wishlistItems.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                            showLike={true}
                        />
                    ))}
                </Grid>
            </Container>
        </>
    );
}

export default Wishlist;
