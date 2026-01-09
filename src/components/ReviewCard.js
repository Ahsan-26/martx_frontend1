import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Text,
    Flex,
    Avatar,
    Icon,
    HStack,
    Button,
    Textarea,
    Input,
    VStack,
    Badge,
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';

const ReviewCard = () => {
    const { id } = useParams();
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]); // For filtering
    const [productStats, setProductStats] = useState(null); // For analytics
    const [newReview, setNewReview] = useState({ name: '', description: '', rating: 0 }); // Added rating
    const [hover, setHover] = useState(null); // For star hover effect
    const [filter, setFilter] = useState('all'); // Filter state
    const [loading, setLoading] = useState(false);

    // Fetch reviews and product stats
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Reviews
                const reviewsRes = await axios.get(`http://127.0.0.1:8000/store/products/${id}/reviews/`);
                setReviews(reviewsRes.data);
                setFilteredReviews(reviewsRes.data);

                // Fetch Product Stats (using the product detail endpoint)
                const productRes = await axios.get(`http://127.0.0.1:8000/store/products/${id}/`);
                setProductStats(productRes.data.reviews_breakdown);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [id]);

    // Handle filtering
    useEffect(() => {
        if (filter === 'all') {
            setFilteredReviews(reviews);
        } else {
            setFilteredReviews(reviews.filter(r => r.sentiment === filter));
        }
    }, [filter, reviews]);

    const handleReviewSubmit = async () => {
        if (!newReview.name || !newReview.description) {
            alert('Please provide a name and a description for the review.');
            return;
        }
        if (newReview.rating === 0) {
            alert('Please select a star rating.');
            return;
        }

        setLoading(true);

        try {
            await axios.post(`http://127.0.0.1:8000/store/products/${id}/reviews/`, newReview);

            // Re-fetch to update stats and list
            const reviewsRes = await axios.get(`http://127.0.0.1:8000/store/products/${id}/reviews/`);
            setReviews(reviewsRes.data);

            const productRes = await axios.get(`http://127.0.0.1:8000/store/products/${id}/`);
            setProductStats(productRes.data.reviews_breakdown);

            setNewReview({ name: '', description: '', rating: 0 }); // Reset form
            setHover(null);
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Text fontSize="xl" fontWeight="bold" mb={4}>Reviews</Text>

            {/* Analytics Section */}
            {productStats && (
                <Box mb={6} p={4} borderWidth="1px" borderRadius="lg" bg="gray.50">
                    <Flex justify="space-between" align="center" mb={4}>
                        <VStack align="start">
                            <Text fontSize="4xl" fontWeight="bold">{productStats.average_rating.toFixed(1)}</Text>
                            <HStack>
                                {[...Array(5)].map((_, i) => (
                                    <Icon
                                        key={i}
                                        as={FaStar}
                                        color={i < Math.round(productStats.average_rating) ? "orange.400" : "gray.300"}
                                    />
                                ))}
                            </HStack>
                            <Text fontSize="sm" color="gray.500">{productStats.total_reviews} Reviews</Text>
                        </VStack>

                        <VStack w="60%" spacing={2}>
                            {['positive', 'neutral', 'negative'].map((sent) => {
                                const pct = productStats.sentiment_percentages[sent];
                                const color = sent === 'positive' ? 'green' : sent === 'negative' ? 'red' : 'yellow';
                                return (
                                    <Flex key={sent} w="100%" align="center">
                                        <Text w="70px" fontSize="sm" textTransform="capitalize">{sent}</Text>
                                        <Box w="100%" h="8px" bg="gray.200" borderRadius="full" mx={2}>
                                            <Box h="100%" w={`${pct}%`} bg={`${color}.400`} borderRadius="full" transition="width 0.5s" />
                                        </Box>
                                        <Text w="40px" fontSize="sm">{pct}%</Text>
                                    </Flex>
                                );
                            })}
                        </VStack>
                    </Flex>

                    {/* Filters */}
                    <HStack spacing={2}>
                        {['all', 'positive', 'neutral', 'negative'].map((f) => (
                            <Button
                                key={f}
                                size="sm"
                                colorScheme={filter === f ? 'blue' : 'gray'}
                                onClick={() => setFilter(f)}
                                textTransform="capitalize"
                            >
                                {f}
                            </Button>
                        ))}
                    </HStack>
                </Box>
            )}

            <Text fontSize="xl" fontWeight="bold" mb={4}>Reviews</Text>

            {/* Reviews List */}
            {filteredReviews.length > 0 ? (
                filteredReviews.map((review, index) => (
                    <Box key={index} p={4} borderWidth="1px" borderRadius="lg" mb={4}>
                        <Flex alignItems="center" mb={2}>
                            <Avatar size="sm" name={review.name} src="https://via.placeholder.com/50" mr={4} />
                            <Box>
                                <HStack>
                                    <Text fontWeight="bold">{review.name || "Anonymous"}</Text>
                                    {review.sentiment && (
                                        <Badge
                                            colorScheme={
                                                review.sentiment === 'positive' ? 'green' :
                                                    review.sentiment === 'negative' ? 'red' : 'yellow'
                                            }
                                        >
                                            {review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1)}
                                        </Badge>
                                    )}
                                </HStack>
                                {/* Display Review Rating */}
                                <HStack spacing={1}>
                                    {[...Array(5)].map((_, i) => (
                                        <Icon
                                            key={i}
                                            as={FaStar}
                                            color={i < review.rating ? "orange.400" : "gray.300"}
                                            w={3} h={3}
                                        />
                                    ))}
                                </HStack>
                            </Box>
                        </Flex>
                        <Text color="gray.700">{review.description || "No description provided."}</Text>
                    </Box>
                ))
            ) : (
                <Text>No reviews found matching your criteria.</Text>
            )}

            {/* Add Review Section */}
            <Box mt={6} p={4} borderWidth="1px" borderRadius="lg">
                <Text fontSize="lg" fontWeight="bold" mb={4}>Leave a Review</Text>
                <VStack spacing={3} align="stretch">
                    {/* Star Rating Input */}
                    <HStack spacing={1}>
                        {[...Array(5)].map((_, i) => {
                            const ratingValue = i + 1;
                            return (
                                <Icon
                                    key={i}
                                    as={FaStar}
                                    color={ratingValue <= (hover || newReview.rating) ? "orange.400" : "gray.300"}
                                    w={6} h={6}
                                    cursor="pointer"
                                    onMouseEnter={() => setHover(ratingValue)}
                                    onMouseLeave={() => setHover(null)}
                                    onClick={() => setNewReview({ ...newReview, rating: ratingValue })}
                                />
                            );
                        })}
                        <Text ml={2} fontSize="sm" color="gray.500">
                            {newReview.rating > 0 ? `${newReview.rating} Stars` : "Select a rating"}
                        </Text>
                    </HStack>

                    <Input
                        placeholder="Your Name"
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    />
                    <Textarea
                        placeholder="Write your review..."
                        value={newReview.description}
                        onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
                    />
                    <Button
                        bgGradient="linear(to-b, orange.200, orange.600)"
                        onClick={handleReviewSubmit}
                        isLoading={loading}
                        color="white"
                    >
                        Submit Review
                    </Button>
                </VStack>
            </Box>
        </Box>
    );
};

export default ReviewCard;
