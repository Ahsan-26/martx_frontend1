// import React, { useState, useEffect } from 'react';
// import { Icon } from '@chakra-ui/react';
// import { FaHeart } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import api from '../services/authInterceptor';

// function LikeProduct({ productId }) {
//     const [liked, setLiked] = useState(false);

//     useEffect(() => {
//         const fetchLikedStatus = async () => {
//             try {
//                 // Fetch the user's wishlist by calling the API
//                 const response = await api.get('http://127.0.0.1:8000/wishlist/');  // Assuming this returns the user's wishlist
//                 const wishlist = response.data; // Array of products in the wishlist

//                 // Check if the current productId is in the wishlist
//                 const isLiked = wishlist.some((product) => product.id === productId);

//                 // Set the liked state based on whether the product is in the wishlist
//                 setLiked(isLiked);
//             } catch (error) {
//                 console.error('Failed to fetch liked status:', error);
//                 toast.error('Unable to load wishlist. Please try again later.');
//             }
//         };

//         fetchLikedStatus();
//     }, [productId]);  // Re-run whenever the productId changes
//     const handleLikeToggle = async () => {
//         try {
//             const response = await api.post(`http://127.0.0.1:8000/like-product/${productId}/`);
//             if (response.data.status === 'liked') {
//                 setLiked(true);
//                 toast.success('Product added to wishlist!');
//             } else if (response.data.status === 'unliked') {
//                 setLiked(false);
//                 toast.info('Product removed from wishlist.');
//             }
//         } catch (error) {
//             if (error.response && error.response.status === 401) {
//                 toast.error('Kindly Login to add product to wishlist.');
//             } else {
//                 toast.error('Failed to update wishlist. Please try again.');
//             }
//         }
//     };

//     return (
//         <Icon
//             as={FaHeart}
//             color={liked ? 'red.500' : 'gray.300'}
//             boxSize={6}
//             cursor="pointer"
//             onClick={(e) => {
//                 e.stopPropagation(); // Prevent triggering product card click
//                 handleLikeToggle();
//             }}
//         />
//     );
// }

// export default LikeProduct;

import React, { useState, useEffect } from 'react';
import { Icon } from '@chakra-ui/react';
import { FaHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../services/authInterceptor';

function LikeProduct({ productId }) {
    const [liked, setLiked] = useState(false);

    // Fetch the user's wishlist and check if the product is liked
    useEffect(() => {
        const fetchLikedStatus = async () => {
            try {
                // Fetch the user's wishlist by calling the API
                const response = await api.get('http://127.0.0.1:8000/wishlist/');  // Assuming this returns the user's wishlist
                const wishlist = response.data; // Array of products in the wishlist

                // Check if the current productId is in the wishlist
                const isLiked = wishlist.some((product) => product.id === productId);

                // Set the liked state based on whether the product is in the wishlist
                setLiked(isLiked);
            } catch (error) {
                console.error('Failed to fetch liked status:', error);
                toast.error('Unable to load wishlist. Please try again later.');
            }
        };

        fetchLikedStatus();
    }, [productId]);  // Re-run whenever the productId changes

    // Handle like/unlike toggle by adding/removing from wishlist
    const handleLikeToggle = async () => {
        try {
            const response = await api.post(`http://127.0.0.1:8000/like-product/${productId}/`);  // POST request to toggle like/unlike
            if (response?.data?.status === 'liked') {
                setLiked(true);
                toast.success('Product added to wishlist!');
            } else if (response?.data?.status === 'unliked') {
                setLiked(false);
                toast.info('Product removed from wishlist.');
            } else {
                console.warn('Unexpected response structure during toggle:', response.data);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error('Kindly Login to add product to wishlist.');
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
        />
    );
}

export default LikeProduct;
