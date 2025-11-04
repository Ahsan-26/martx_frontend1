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
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';

const ReviewCard = () => {
    const { id } = useParams(); 
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(false);
   
    // Fetch reviews from the API
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/store/products/${id}/reviews/`);
                setReviews(response.data); // Assume the API returns a list of reviews
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };
        fetchReviews();
    }, [id]);

    // Handle review submission
    const handleReviewSubmit = async () => {
        if (!newReview.name || !newReview.description) {
            alert('Please provide a name and a description for the review.');
            return;
        }

        setLoading(true);

        try {
            await axios.post(`http://127.0.0.1:8000/store/products/${id}/reviews/`, newReview);
            setReviews((prev) => [...prev, newReview]); // Update local state for instant feedback
            setNewReview({ name: '', description: '' }); // Reset the form
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Text fontSize="xl" fontWeight="bold" mb={4}>Reviews</Text>

            {/* Existing Reviews */}
            {reviews.length > 0 ? (
                reviews.map((review, index) => (
                    <Box key={index} p={4} borderWidth="1px" borderRadius="lg" mb={4}>
                        <Flex alignItems="center" mb={4}>
                            <Avatar size="md" name={review.name} src="https://via.placeholder.com/50" mr={4} />
                            <Box>
                                <Text fontWeight="bold">{review.name || "Anonymous"}</Text>
                            </Box>
                        </Flex>
                        <Text color="gray.700">{review.description || "No description provided."}</Text>
                    </Box>
                ))
            ) : (
                <Text>No reviews available for this product.</Text>
            )}

            {/* Add Review Section */}
            <Box mt={6} p={4} borderWidth="1px" borderRadius="lg">
                <Text fontSize="lg" fontWeight="bold" mb={4}>Leave a Review</Text>
                <VStack spacing={3} align="stretch">
                    <Input
                        width={'15%'}
                        placeholder="Your Name"
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    />
                    <Textarea
                    width={'20%'}
                        placeholder="Write your review..."
                        value={newReview.description}
                        onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
                    />
                    <Button
                         bgGradient="linear(to-b, orange.200, orange.600)"
                        onClick={handleReviewSubmit}
                        isLoading={loading}
                         color="white"
                         width="12%"
                    >
                        Submit Review
                    </Button>
                </VStack>
            </Box>
        </Box>
    );
};

export default ReviewCard;
