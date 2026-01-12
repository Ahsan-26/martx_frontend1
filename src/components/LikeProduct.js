import React, { useEffect } from 'react';
import { Icon } from '@chakra-ui/react';
import { FaHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../services/authInterceptor';
import useWishlistStore from '../stores/wishlistStore';

/**
 * LikeProduct - Optimized wishlist heart icon
 * 
 * PERFORMANCE FIX:
 * - Previously: Each LikeProduct instance fetched the ENTIRE wishlist (20+ API calls per page)
 * - Now: Uses a global wishlist store that caches data for 1 minute
 * - Result: Only 1 API call per page load, regardless of how many products are shown
 */
function LikeProduct({ productId }) {
    const {
        isLiked,
        addToWishlist,
        removeFromWishlist,
        fetchWishlist
    } = useWishlistStore();

    // Fetch wishlist on mount (only if cache is stale)
    useEffect(() => {
        fetchWishlist(); // This will check cache and only fetch if needed
    }, [fetchWishlist]);

    const liked = isLiked(productId);

    const handleLikeToggle = async () => {
        try {
            // Optimistic update: Update UI immediately
            if (liked) {
                removeFromWishlist(productId);
            } else {
                addToWishlist(productId);
            }

            // Send request to backend
            const response = await api.post(`http://127.0.0.1:8000/like-product/${productId}/`);

            if (response?.data?.status === 'liked') {
                toast.success('Added to wishlist!');
                // Ensure the store is updated (in case optimistic update was wrong)
                addToWishlist(productId);
            } else if (response?.data?.status === 'unliked') {
                toast.info('Removed from wishlist.');
                removeFromWishlist(productId);
            }
        } catch (error) {
            // Revert optimistic update on error
            if (liked) {
                addToWishlist(productId);
            } else {
                removeFromWishlist(productId);
            }

            if (error.response?.status === 401) {
                toast.error('Please login to save items to your wishlist.');
            } else {
                console.error('Failed to update wishlist:', error);
                toast.error('Failed to update wishlist. Please try again.');
            }
        }
    };

    return (
        <Icon
            as={FaHeart}
            color={liked ? 'red.500' : 'gray.300'}
            boxSize={6}
            cursor="pointer"
            onClick={(e) => {
                e.stopPropagation(); // Prevent triggering product card click
                handleLikeToggle();
            }}
            transition="all 0.2s"
            _hover={{ transform: 'scale(1.1)' }}
        />
    );
}

export default LikeProduct;
