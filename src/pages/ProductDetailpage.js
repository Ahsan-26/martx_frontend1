import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Grid, GridItem, Spinner, Text } from '@chakra-ui/react';
import useStore from '../stores/store';
import ProductImageCarousel from '../components/ProductImageCarousel ';
import ProductInfo from '../components/ProductInfo';
import ProductReviews from '../components/ProductReviews';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ProductListing from '../components/FeatureProducts';
import SimilarProducts from '../components/SimilarProducts';
import BackButton from '../components/BackButton';

const ProductPage = () => {
    const { id } = useParams(); // Get the product ID from the route
    const { initializeCart } = useStore();  // Initialize cart using Zustand
    const [product, setProduct] = useState(null); // Store product details
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch product details when the component mounts or when the product ID changes
    useEffect(() => {
        // initializeCart(); // Initialize the cart state

        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/store/products/${id}/`);
                setProduct(response.data);
            } catch (error) {
                setError('Failed to fetch product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, initializeCart]);

    if (loading) return <Spinner />;
    if (error) return <Text color="red.500">{error}</Text>;

    return (
        <>
            <Navbar />

            <Box maxW={{ base: "100%", lg: "1200px" }} mx="auto" px={10} pt={4}>
                <BackButton />
            </Box>

            {/* Main Product Layout */}
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8} p={10} maxW={{ base: "100%", lg: "1200px" }} mx="auto">
                <GridItem>
                    <ProductImageCarousel images={product.images} /> {/* Pass product images */}
                </GridItem>
                <GridItem>
                    <ProductInfo product={product} /> {/* Pass product info */}
                </GridItem>
            </Grid>

            {/* Reviews Section */}
            <ProductReviews reviews={product.reviews} id={product.id} />  {/* Pass product reviews */}
            <SimilarProducts />
            <Footer />
        </>
    );
};

export default ProductPage;
