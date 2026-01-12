import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/store';

// Initialize the cart by fetching or creating a new cart
// export const initializeCart = async () => {
//     let storedCartId = localStorage.getItem('cartId');

//     // Create a new cart if none exists
//     if (!storedCartId) {
//         const { data: newCart } = await axios.post(`${API_BASE_URL}/carts/`);
//         storedCartId = newCart.id;
//         localStorage.setItem('cartId', storedCartId);
//     }

//     // Fetch the cart details
//     const { data: cartDetails } = await axios.get(`${API_BASE_URL}/carts/${storedCartId}/`);

//     // Fetch full product details for items if needed
//     const updatedCartItems = await Promise.all(
//         cartDetails.items.map(async (item) => {
//             if (item.product_id && !item.product) {
//                 const { data: product } = await axios.get(`${API_BASE_URL}/products/${item.product_id}/`);
//                 return { ...item, product };
//             }
//             return item;
//         })
//     );

//     return { cartId: storedCartId, cartItems: updatedCartItems };
// };

export const initializeCart = async () => {
    let storedCartId = localStorage.getItem('cartId');

    try {
        // If no cartId exists in localStorage, create a new cart
        if (!storedCartId) {
            const { data: newCart } = await axios.post(`${API_BASE_URL}/carts/`);
            storedCartId = newCart.id;
            localStorage.setItem('cartId', storedCartId);
        }

        // Try to fetch the existing cart details
        const { data: cartDetails } = await axios.get(`${API_BASE_URL}/carts/${storedCartId}/`);

        // Fetch full product details for items if needed
        const updatedCartItems = await Promise.all(
            cartDetails.items.map(async (item) => {
                if (item.product_id && !item.product) {
                    const { data: product } = await axios.get(`${API_BASE_URL}/products/${item.product_id}/`);
                    return { ...item, product };
                }
                return item;
            })
        );

        return { cartId: storedCartId, cartItems: updatedCartItems };

    } catch (error) {
        console.error('Error fetching the cart:', error);

        // Handle 404 or 400 errors (cart not found or backend reset)
        if (error.response && (error.response.status === 404 || error.response.status === 400)) {
            console.log('Cart not found or invalid. Creating a new cart...');

            // Create a new cart if the previous cart is not found
            const { data: newCart } = await axios.post(`${API_BASE_URL}/carts/`);
            storedCartId = newCart.id;
            localStorage.setItem('cartId', storedCartId);

            // Return the new cart details
            return { cartId: storedCartId, cartItems: [] }; // Empty cart
        }

        // Re-throw the error for any other cases
        throw new Error('Failed to initialize the cart.');
    }
};


// Add an item to the cart (or increase quantity if it exists)
export const addItemToCart = async ({ cartId, productId, quantity = 1 }) => {
    // Fetch the current cart to check if the item already exists
    const { data: cartDetails } = await axios.get(`${API_BASE_URL}/carts/${cartId}/`);

    // Check if the product is already in the cart
    const existingItem = cartDetails.items.find((item) => item.product.id === productId);

    if (existingItem) {
        // If the item exists, update its quantity
        const { data: updatedItem } = await axios.patch(
            `${API_BASE_URL}/carts/${cartId}/items/${existingItem.id}/`,
            { quantity: existingItem.quantity + quantity }
        );
        return updatedItem;
    } else {
        // Add a new item to the cart if it doesn't exist
        const { data: newItem } = await axios.post(`${API_BASE_URL}/carts/${cartId}/items/`, {
            product_id: productId,
            quantity: quantity,
        });

        // Fetch full product details (if not already included in the item)
        const { data: productDetails } = await axios.get(`${API_BASE_URL}/products/${productId}/`);
        return { ...newItem, product: productDetails };
    }
};

// Update the quantity of an item in the cart
export const updateItemQuantity = async ({ cartId, itemId, quantity }) => {
    // Ensure the correct itemId and cartId are being passed

    if (!cartId || !itemId || quantity < 1) {
        throw new Error('Invalid cart or item information');
    }

    console.log('cartId:', cartId, 'itemId:', itemId, 'quantity:', quantity);
    const { data: updatedItem } = await axios.patch(`${API_BASE_URL}/carts/${cartId}/items/${itemId}/`, { quantity });
    console.log('updatedItem:', updatedItem);
    return updatedItem;
};

// Remove an item from the cart
export const removeItemFromCart = async ({ cartId, itemId }) => {
    await axios.delete(`${API_BASE_URL}/carts/${cartId}/items/${itemId}/`);
};
