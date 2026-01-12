import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { initializeCart, addItemToCart, updateItemQuantity, removeItemFromCart } from '../services/cartService';
import useCartStore from '../stores/cartStore';
import { createOrder, createPaymentIntent } from '../services/checkoutService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
export const useCart = () => {
    const queryClient = useQueryClient();
    const cartId = useCartStore((state) => state.cartId);
    const setCart = useCartStore((state) => state.setCart);
    const addItemLocally = useCartStore((state) => state.addItemLocally);
    const updateItemLocally = useCartStore((state) => state.updateItemLocally);
    const removeItemLocally = useCartStore((state) => state.removeItemLocally);
    const navigate = useNavigate();
    // const initializeCartMutation = useMutation(initializeCart, {
    //     onSuccess: (data) => {
    //         // Store the cartId and cartItems in Zustand
    //         setCart(data.cartId, data.cartItems);
    //     },
    //     onError: (error) => {
    //         console.error('Error initializing the cart:', error);
    //     },
    // });

    // return {
    //     initializeCartMutation,
    // };



    // Fetch cart details (React Query)
    const fetchCartQuery = useQuery({
        queryKey: ['cart', cartId],
        queryFn: () => initializeCart(),
        enabled: !!cartId,  // Only fetch if cartId is set
        onSuccess: ({ cartId, cartItems }) => {
            setCart(cartId, cartItems);  // Set Zustand state after fetching cart
        },
    });

    // Mutation to add an item to the cart (React Query)
    //  const addToCartMutation = useMutation({
    //         mutationFn: async ({ productId, existingItem }) => {
    //             let currentCartId = cartId;

    //             // If cartId is null, initialize the cart first
    //             if (!currentCartId) {
    //                 const { cartId: newCartId, cartItems } = await initializeCart();
    //                 currentCartId = newCartId;
    //                 setCart(newCartId, cartItems);  // Set Zustand state after initializing the cart
    //             }

    //             // Proceed with adding the item to the cart
    //             return addItemToCart({ cartId: currentCartId, productId, existingItem });
    //         },
    //         onSuccess: (data) => {
    //             addItemLocally(data);  // Add item to Zustand state after successful addition
    //             queryClient.invalidateQueries({ queryKey: ['cart', cartId] });  // Invalidate the cart query to refetch
    //         },
    //     });

    const addToCartMutation = useMutation({
        mutationFn: async ({ productId, quantity = 1, existingItem }) => {
            let currentCartId = cartId;

            // If cartId is null, initialize the cart first
            if (!currentCartId) {
                const { cartId: newCartId, cartItems } = await initializeCart();
                currentCartId = newCartId;
                setCart(newCartId, cartItems);  // Set Zustand state after initializing the cart
            }

            // Check if productId is valid
            if (!productId) {
                throw new Error("Product ID is required");
            }

            // Proceed with adding the item to the cart
            return addItemToCart({ cartId: currentCartId, productId, quantity, existingItem });
        },
        onSuccess: (data) => {
            addItemLocally(data);  // Add item to Zustand state after successful addition
            queryClient.invalidateQueries({ queryKey: ['cart', cartId] });  // Invalidate the cart query to refetch
        },
    });


    // Mutation to update item quantity (React Query)
    const updateItemMutation = useMutation({
        mutationFn: ({ itemId, quantity }) => updateItemQuantity({ cartId, itemId, quantity }),
        onSuccess: (data) => {
            // Optionally update the local state with the updated item
            updateItemLocally(data);

            // Invalidate the cart query to refetch the cart from the backend
            queryClient.invalidateQueries({ queryKey: ['cart', cartId] });
        },
    });

    // Mutation to remove an item from the cart (React Query)
    const removeFromCartMutation = useMutation({
        mutationFn: (itemId) => removeItemFromCart({ cartId, itemId }),
        onSuccess: (_, variables) => {
            removeItemLocally(variables);  // Remove item from Zustand state after successful removal
            queryClient.invalidateQueries({ queryKey: ['cart', cartId] });  // Invalidate the cart query to refetch
        },
    });

    // Mutation for initiating checkout
    const initiateCheckoutMutation = useMutation({
        mutationFn: async (guestInfo) => {
            let currentCartId = cartId;
            let createdOrderId = localStorage.getItem('orderId'); // Check if order already exists

            // If no order is found, create a new order
            if (!createdOrderId) {
                // Step 1: Create order
                const { orderId, orderResponse } = await createOrder({ cartId: currentCartId, userInfo: guestInfo });
                createdOrderId = orderId;
                localStorage.setItem('orderId', orderId);  // Save order ID locally
            }

            // Step 2: Create payment intent
            const clientSecret = await createPaymentIntent({ orderId: createdOrderId });

            // Store client secret in localStorage for the next step
            localStorage.setItem('clientSecret', clientSecret);

            // Display success notification
            toast.success('Order created successfully! Redirecting to checkout...');

            // Step 3: Redirect to the checkout page
            navigate(`/checkout/${createdOrderId}`);
        },
        onError: (error) => {
            toast.error(`Error during checkout: ${error.message || 'Something went wrong!'}`);
            console.error('Error during checkout initiation:', error);
        },
        onSuccess: () => {
            // Invalidate the cart query to refetch the cart
            queryClient.invalidateQueries({ queryKey: ['cart', cartId] });
        },
    });


    return {
        fetchCartQuery,
        addToCartMutation,
        updateItemMutation,
        removeFromCartMutation,
        initiateCheckoutMutation,
    };
};
