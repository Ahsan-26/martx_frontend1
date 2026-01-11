import axios from 'axios';
import api from './authInterceptor';  // For authenticated API calls
import { toast } from 'react-toastify';
const API_BASE_URL = 'http://127.0.0.1:8000';

// Create an order (for authenticated or guest users)
// export const createOrder = async ({ cartId, userInfo = null }) => {
//     const accessToken = localStorage.getItem('accessToken');  // Check for user token
//     const refreshToken = localStorage.getItem('refreshToken');  // Token for refresh
//     let createdOrderId = null;
//     let orderResponse = null;

//     try {
//         // If the user is authenticated
//         if (accessToken) {
//             console.log("cart id drom checkoutService",cartId)
//             try {
//                 // Create order for authenticated user
//                 orderResponse = await api.post(`${API_BASE_URL}/store/orders/`, {
//                     cart_id: cartId,

//                 });
//                 createdOrderId = orderResponse.data.id;
//             } catch (error) {
//                 // Handle token expiration
//                 if (error.response && error.response.status === 401 && refreshToken) {
//                     const tokenResponse = await api.post(`${API_BASE_URL}/auth/refresh-token/`, {
//                         refresh_token: refreshToken,
//                     });
//                     const newAccessToken = tokenResponse.data.accessToken;
//                     localStorage.setItem('accessToken', newAccessToken);

//                     // Retry order creation with new token
//                     orderResponse = await api.post(`${API_BASE_URL}/store/orders/`, {
//                         cart_id: cartId,
//                     });
//                     createdOrderId = orderResponse.data.id;
//                 } else {
//                     throw new Error('Failed to create order for authenticated user.');
//                 }
//             }
//         } else {
//             // Create order for guest user
//             orderResponse = await axios.post(`${API_BASE_URL}/store/orders/`, {
//                 ...userInfo,  // Guest user details
//                 cart_id: cartId,
//             });
//             createdOrderId = orderResponse.data.id;
//         }
//         // Display success notification
//         toast.success('Order created successfully!');

//         return { orderId: createdOrderId, orderResponse: orderResponse.data };  // Return the orderId and the order response

//     } catch (error) {
//         console.error('Order creation error:', error.message || error);
//         // Display error notification
//         toast.error('Failed to create order. Please try again later.');
//         throw new Error('Failed to create order. Please try again later.');
//     }
// };

// export const createOrder = async ({ cartId = null, userInfo = null, productId = null, quantity = 1 }) => {
//     const accessToken = localStorage.getItem('accessToken');  // Check for user token
//     const refreshToken = localStorage.getItem('refreshToken');  // Token for refresh
//     let createdOrderId = null;
//     let orderResponse = null;

//     if (!cartId && !productId) {
//         // If neither cartId nor productId is provided, throw an error
//         toast.error('Cart or product information is required to create an order.');
//         throw new Error('Cart or product information is required.');
//     }

//     try {
//         // Authenticated User Flow
//         if (accessToken) {
//             try {
//                 // Determine whether we are handling cart checkout or "Buy Now" (for a single product)
//                 const payload = productId
//                     ? { product_id: productId, quantity }  // For Buy Now
//                     : { cart_id: cartId };  // For cart-based checkout

//                 // Create order for authenticated user
//                 orderResponse = await api.post(`${API_BASE_URL}/store/orders/`, payload);
//                 createdOrderId = orderResponse.data.id;
//             } catch (error) {
//                 // Handle token expiration
//                 if (error.response && error.response.status === 401 && refreshToken) {
//                     const tokenResponse = await api.post(`${API_BASE_URL}/auth/refresh-token/`, {
//                         refresh_token: refreshToken,
//                     });
//                     const newAccessToken = tokenResponse.data.accessToken;
//                     localStorage.setItem('accessToken', newAccessToken);

//                     // Retry order creation with the new token
//                     const payload = productId
//                         ? { product_id: productId, quantity }
//                         : { cart_id: cartId };

//                     orderResponse = await api.post(`${API_BASE_URL}/store/orders/`, payload);
//                     createdOrderId = orderResponse.data.id;
//                 } else {
//                     throw new Error('Failed to create order for authenticated user.');
//                 }
//             }
//         } else {
//             // Guest User Flow
//             if (!userInfo || !userInfo.name || !userInfo.email || !userInfo.address || !userInfo.city || !userInfo.country || !userInfo.postal_code) {
//                 toast.error('Guest user information is incomplete.');
//                 throw new Error('Guest user information is incomplete.');
//             }

//             const payload = productId
//                 ? { product_id: productId, quantity, ...userInfo }  // For guest "Buy Now"
//                 : { cart_id: cartId, ...userInfo };  // For guest cart checkout

//             orderResponse = await axios.post(`${API_BASE_URL}/store/orders/`, payload);
//             createdOrderId = orderResponse.data.id;
//         }

//         // Display success notification
//         toast.success('Order created successfully!');
//         return { orderId: createdOrderId, orderResponse: orderResponse.data };

//     } catch (error) {
//         console.error('Order creation error:', error.message || error);
//         toast.error('Failed to create order. Please try again later.');
//         throw new Error('Failed to create order. Please try again later.');
//     }
// };

export const createOrder = async ({ cartId = null, userInfo = null, productId = null, quantity = 1, paymentMethod }) => {
    const accessToken = localStorage.getItem('accessToken');  // Check for user token
    const refreshToken = localStorage.getItem('refreshToken');  // Token for refresh
    let createdOrderId = null;
    let orderResponse = null;
    console.log("Selected Payment Method:", paymentMethod);
    if (!cartId && !productId) {
        toast.error('Cart or product information is required to create an order.');
        throw new Error('Cart or product information is required.');
    }

    try {
        // Authenticated User Flow
        if (accessToken) {
            try {
                const payload = productId
                    ? { product_id: productId, quantity, payment_method: paymentMethod }  // Added paymentMethod here
                    : { cart_id: cartId, payment_method: paymentMethod };  // Added paymentMethod here

                // Create order for authenticated user
                orderResponse = await api.post(`${API_BASE_URL}/store/orders/`, payload);
                createdOrderId = orderResponse.data.id;
            } catch (error) {
                // Handle token expiration
                if (error.response && error.response.status === 401 && refreshToken) {
                    const tokenResponse = await api.post(`${API_BASE_URL}/auth/refresh-token/`, {
                        refresh_token: refreshToken,
                    });
                    const newAccessToken = tokenResponse.data.accessToken;
                    localStorage.setItem('accessToken', newAccessToken);

                    // Retry order creation with the new token
                    const payload = productId
                        ? { product_id: productId, quantity, payment_method: paymentMethod }  // Added paymentMethod here
                        : { cart_id: cartId, payment_method: paymentMethod };  // Added paymentMethod here

                    orderResponse = await api.post(`${API_BASE_URL}/store/orders/`, payload);
                    createdOrderId = orderResponse.data.id;
                } else {
                    throw new Error('Failed to create order for authenticated user.');
                }
            }
        } else {
            // Guest User Flow
            if (!userInfo || !userInfo.name || !userInfo.email || !userInfo.address || !userInfo.city || !userInfo.country || !userInfo.postal_code) {
                toast.error('Guest user information is incomplete.');
                throw new Error('Guest user information is incomplete.');
            }


            const payload = productId
                ? { product_id: productId, quantity, payment_method: paymentMethod, ...userInfo }  // Added paymentMethod here
                : { cart_id: cartId, payment_method: paymentMethod, ...userInfo };  // Added paymentMethod here

            console.log("Payment Method", paymentMethod)
            orderResponse = await axios.post(`${API_BASE_URL}/store/orders/`, payload);
            createdOrderId = orderResponse.data.id;
        }

        // Cache the orderId in localStorage to prevent duplicate orders
        localStorage.setItem('orderId', createdOrderId);

        toast.success('Order created successfully!');
        return { orderId: createdOrderId, orderResponse: orderResponse.data };

    } catch (error) {
        console.error('Order creation error:', error.message || error);
        toast.error('Failed to create order. Please try again later.');
        throw new Error('Failed to create order. Please try again later.');
    }
};

// Create payment intent (Stripe or any other payment gateway)
export const createPaymentIntent = async ({ orderId }) => {
    console.log('order id from checkout service', orderId)
    try {
        const response = await axios.post(`${API_BASE_URL}/create-payment-intent/`, {
            order_id: orderId,
        });

        // Display success notification
        toast.success('Payment intent created successfully!');

        return response.data.clientSecret;
    } catch (error) {
        console.error('Payment Intent Error:', error);
        // Display error notification
        toast.error('Failed to create payment intent. Please try again later.');
        throw new Error('Failed to create payment intent.');
    }
};
