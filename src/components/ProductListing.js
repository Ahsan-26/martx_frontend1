import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import {
    Box, Grid, Image, Text, Button, Flex, Icon, Spinner, Input, Select, VStack, HStack, IconButton
} from '@chakra-ui/react';
import { FaStar, FaBoxOpen } from 'react-icons/fa';
import { useCart } from '../hooks/useCart';  // Custom hook for cart operations
import { toast } from 'react-toastify';
import useCartStore from '../stores/cartStore';  // Zustand store for cart state
import useSearchStore from '../stores/useSearchStore';  // Zustand store for search state
import useFilterStore from '../stores/useFilterStore';
import useCategoryStore from '../stores/CategoryStore'; // Import the category store// Zustand store for filter state
import axios from 'axios';
import debounce from 'lodash.debounce';  // Debouncing utility
import LikeProduct from './LikeProduct';
function ProductListing({ vendorId }) {
    const { addToCartMutation } = useCart();  // Use cart operations from Zustand store and React Query
    const navigate = useNavigate();  // For navigation
    const location = useLocation(); // Use useLocation to read state
    const cartItems = useCartStore((state) => state.cartItems);  // Access current cart items from Zustand store
    const { categories, fetchCategories, loading: loadingCategories } = useCategoryStore();
    // Fetching data from search and filter stores
    const { query, setQuery } = useSearchStore();
    const { collectionId, minPrice, maxPrice, sortBy, setCollectionId, setMinPrice, setMaxPrice, setSortBy } = useFilterStore();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ next: null, previous: null });

    const [searchParams] = useSearchParams();
    const urlCategoryId = searchParams.get('category');

    // Fetch categories once on mount
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Sync URL categoryId with FilterStore's collectionId
    useEffect(() => {
        if (urlCategoryId) {
            setCollectionId(urlCategoryId);
        }
    }, [urlCategoryId, setCollectionId]);

    // Main fetch effect
    useEffect(() => {
        const fetchAll = async () => {
            if (query) {
                debouncedSearch(query);
            } else {
                await fetchProducts();
            }
        };

        fetchAll();

        return () => {
            debouncedSearch.cancel();
        };
    }, [query, collectionId, minPrice, maxPrice, sortBy, vendorId, urlCategoryId]);

    // Consolidated Fetch function
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const params = {
                search: query,
                collection_id: collectionId || urlCategoryId,
                unit_price__gt: minPrice,
                unit_price__lt: maxPrice,
                ordering: sortBy,
                vendor_id: vendorId
            };

            const { data } = await axios.get(`http://127.0.0.1:8000/store/products/`, { params });
            setProducts(data.results || []);
            setPagination({ next: data.next, previous: data.previous });
            setError(null);
        } catch (error) {
            console.error('Fetch error:', error);
            setError('Failed to load products.');
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(
        debounce(async (searchTerm) => {
            fetchProducts();
        }, 800),
        [collectionId, minPrice, maxPrice, sortBy, vendorId, urlCategoryId]
    );

    const handleCardClick = (productId) => {
        navigate(`/product/${productId}`);
    };

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

    const handlePagination = async (url) => {
        try {
            setLoading(true);
            const { data } = await axios.get(url);
            setProducts(data.results || []);
            setPagination({ next: data.next, previous: data.previous });
        } catch (error) {
            setError('Failed to load products.');
        } finally {
            setLoading(false);
        }
    };

    // If no products are found
    if (!products || products.length === 0) {
        return (
            <Box textAlign="center" py={10}>
                <Icon as={FaBoxOpen} w={20} h={20} color="gray.400" mb={4} />
                <Text fontSize="lg" mb={4}>No products available.</Text>
                <Text color="gray.500" mb={6}>Try adjusting your search or filters to find more results.</Text>
                <Button colorScheme="blue" onClick={() => {
                    setQuery('');
                    setCollectionId('');
                    setMinPrice('');
                    setMaxPrice('');
                    setSortBy('');
                    navigate('/products', { replace: true }); // Clear search params
                    fetchProducts(); // Manually trigger after clear
                }}>Clear Filters</Button>
            </Box>
        );
    }

    // Render the product list
    return (

        <Box p={4} mt={0}>
            <Text fontSize="2xl" mb={4} fontWeight="bold">
                {vendorId ? 'Vendor Products' : collectionId ? categories.find(c => c.id == collectionId)?.title : 'Featured Products'}
            </Text>

            {/* Horizontal Search, Sorting, and Filters */}
            <HStack mb={6} gap={4} alignItems="center" justifyContent="space-between" flexWrap="wrap">
                <Input
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    width={{ base: "100%", sm: "250px" }}
                    borderColor="orange.400"
                />
                <Select
                    placeholder={loadingCategories ? "Loading..." : "Select Collection"}
                    value={collectionId}
                    onChange={(e) => setCollectionId(e.target.value)}
                    width={{ base: "100%", sm: "200px" }}
                    borderColor="orange.400"
                >
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.title}
                        </option>
                    ))}
                </Select>

                {/* Min and Max Price Input Fields */}
                <Input
                    placeholder="Min Price"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    onBlur={fetchProducts}  // Trigger fetch when user leaves the field
                    width="100px"
                    borderColor="orange.400"
                />
                <Input
                    placeholder="Max Price"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    onBlur={fetchProducts}  // Trigger fetch when user leaves the field
                    width="100px"
                    borderColor="orange.400"
                />

                <Select
                    placeholder="Sort By"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    width={{ base: "100%", sm: "200px" }}
                    borderColor="orange.400"
                >
                    <option value="unit_price">Price (Low to High)</option>
                    <option value="-unit_price">Price (High to Low)</option>
                    <option value="last_update">Newest</option>
                    <option value="-last_update">Oldest</option>
                </Select>
            </HStack>

            {/* Product List */}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <Spinner size="xl" color="orange.500" />
                </Box>
            ) : (!products || products.length === 0) ? (
                <Box textAlign="center" py={10}>
                    <Icon as={FaBoxOpen} w={20} h={20} color="gray.400" mb={4} />
                    <Text fontSize="lg" mb={4}>No products available.</Text>
                    <Text color="gray.500" mb={6}>Try adjusting your search or filters to find more results.</Text>
                    <Button colorScheme="blue" onClick={() => {
                        setQuery('');
                        setCollectionId('');
                        setMinPrice('');
                        setMaxPrice('');
                        setSortBy('');

                    }}>Clear Filters</Button>
                </Box>
            ) : (
                <Grid templateColumns="repeat(auto-fill, minmax(240px, 1fr))" gap={6}>
                    {products.map((product) => (

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

                            <Box height="200px" width="100%" overflow="hidden" mb={4} borderRadius="md" bg="gray.100">
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

                            <Box
                                key={product.id}
                                position="relative"
                                p={4}
                                border="1px solid #e2e8f0"
                                borderRadius="md"
                            >

                                {/* Other product details */}
                            </Box>

                            <Text fontWeight="bold" mb={1} noOfLines={1}>
                                {product.title}
                            </Text>

                            <Text fontSize="sm" color="gray.600" mb={2} noOfLines={3} minHeight="60px">
                                {product.description || 'No description available.'}
                            </Text>

                            <Flex mb={4}>
                                {[...Array(5)].map((_, i) => (
                                    <Icon key={i} as={FaStar} color={i < product.average_rating ? "orange.400" : "gray.300"} boxSize={4} />
                                ))}
                            </Flex>

                            <Text fontWeight="bold" fontSize="lg" mb={4}>
                                {product.unit_price ? `Rs ${product.unit_price.toFixed(2)}` : 'N/A'}
                            </Text>

                            <Button
                                bgGradient="linear(to-b, #132063, #0A0E23)"
                                color="white"
                                _hover={{ bgGradient: "linear(to-b, orange.200, orange.600)", boxShadow: "md" }}
                                size="sm"
                                width="full"
                                onClick={(e) => {
                                    e.stopPropagation();  // Prevent navigating to the product page
                                    handleAddToCart(product);
                                }}
                            >
                                Add to Cart
                            </Button>
                        </Box>
                    ))}
                </Grid>
            )}

            {/* Pagination Controls */}
            <Flex justifyContent="center" mt={8}>
                <Button
                    isDisabled={!pagination.previous}
                    onClick={() => handlePagination(pagination.previous)}
                    mr={4}
                >
                    Previous
                </Button>
                <Button
                    isDisabled={!pagination.next}
                    onClick={() => handlePagination(pagination.next)}
                >
                    Next
                </Button>
            </Flex>
        </Box>
    );
}

export default ProductListing;
