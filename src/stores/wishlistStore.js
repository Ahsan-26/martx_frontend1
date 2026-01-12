import { create } from 'zustand';
import api from '../services/authInterceptor';

/**
 * Wishlist Store - Global state for wishlist management
 * 
 * This prevents the LikeProduct component from fetching the entire
 * wishlist for EACH product on the page (which was causing 20+ API calls)
 * 
 * Instead, we fetch once and cache the result.
 */
const useWishlistStore = create((set, get) => ({
    wishlistItems: [],  // Array of product IDs that are in the wishlist
    loading: false,
    lastFetched: null,  // Timestamp of last fetch
    CACHE_DURATION: 60000,  // Cache for 1 minute (60 seconds)

    // Fetch wishlist from API and cache it
    fetchWishlist: async (force = false) => {
        const { lastFetched, CACHE_DURATION, loading } = get();
        const now = Date.now();

        // Don't fetch if already loading
        if (loading) return;

        // Don't fetch if cache is still valid (unless forced)
        if (!force && lastFetched && (now - lastFetched) < CACHE_DURATION) {
            return;
        }

        set({ loading: true });

        try {
            const response = await api.get('http://127.0.0.1:8000/wishlist/');
            const wishlist = response.data || [];

            // Extract just the product IDs for efficient lookup
            const productIds = wishlist.map(product => product.id);

            set({
                wishlistItems: productIds,
                loading: false,
                lastFetched: now
            });
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
            set({ loading: false });
        }
    },

    // Check if a product is in the wishlist (O(n) lookup, but n is typically small)
    isLiked: (productId) => {
        const { wishlistItems } = get();
        return wishlistItems.includes(productId);
    },

    // Add a product to the wishlist (optimistic update)
    addToWishlist: (productId) => {
        const { wishlistItems } = get();
        if (!wishlistItems.includes(productId)) {
            set({ wishlistItems: [...wishlistItems, productId] });
        }
    },

    // Remove a product from the wishlist (optimistic update)
    removeFromWishlist: (productId) => {
        const { wishlistItems } = get();
        set({ wishlistItems: wishlistItems.filter(id => id !== productId) });
    },

    // Clear the cache (useful after logout)
    clearWishlist: () => {
        set({ wishlistItems: [], lastFetched: null });
    }
}));

export default useWishlistStore;
