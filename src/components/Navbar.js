import React, { useState, useRef } from 'react';
import { Box, Badge, Flex, IconButton, Image, useDisclosure, useToast } from '@chakra-ui/react';
import { FaShoppingCart, FaUser } from 'react-icons/fa'; // Import icons
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../hooks/useCheckout';
import CartDrawer from './CartDrawer';
import GuestCheckoutModal from './GuestCheckoutModal';
import useCartStore from '../stores/cartStore'; // Zustand store for cart state
import SearchBar from './SearchBar';
import ProfilePopover from './ProfilePopover'; // Import the updated popover
import BuyerSidebar from '../pages/BuyerSidebar';
import CurrencySelector from './CurrencySelector';
function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure(); // For Cart Drawer
    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure(); // For Guest Checkout Modal

    const cartItems = useCartStore((state) => state.cartItems); // Zustand to get cart items
    const [guestInfo, setGuestInfo] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        country: '',
        postal_code: '',
    });

    const toast = useToast();
    const navigate = useNavigate();
    const profileButtonRef = useRef(); // Create a ref for the profile button
    const [isProfilePopoverOpen, setIsProfilePopoverOpen] = useState(false);

    const { mutate: initiateCheckoutMutation, isLoading: checkoutLoading } = useCheckout();

    const handleGuestCheckout = () => {
        if (!guestInfo.name || !guestInfo.email || !guestInfo.address || !guestInfo.city || !guestInfo.postal_code) {
            toast({
                title: 'Missing Information',
                description: 'Please fill in all the required fields.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        // initiateCheckoutMutation({ cartId: localStorage.getItem('cartId'), guestInfo });
        onModalClose();
    };

    const initiateCheckout = () => {
        const cartId = localStorage.getItem('cartId');
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            // initiateCheckoutMutation({ cartId, guestInfo: {} });
        } else {
            onModalOpen();
        }
    };


    // Navigate to home on logo click
    const handleLogoClick = () => {
        navigate('/dashboard');
    };

    return (
        <Box boxShadow='md' as="nav" bg="#FFFFFF" p={4} borderBottom="4px" borderColor="#0A0E27" mb={0} position="sticky" top="0" zIndex="1000">
            <Flex align="center" justify="space-between" maxW="1200px" mx="auto" flexWrap="wrap">
                <BuyerSidebar />
                {/* Logo */}
                <Box display="flex" alignItems="center" mb={{ base: 2, md: 0 }} onClick={handleLogoClick} ml={'50px'}>
                    <Image src="/martxxx.png" alt="Logo" height="40px" />
                </Box>

                {/* SearchBar Component */}
                <Box flex="1" mx="4">
                    <SearchBar /> {/* Adding SearchBar between the logo and cart icon */}
                </Box>

                {/* Cart & Profile Icons */}
                <Flex align="center">
                    {/* Profile Icon */}
                    <IconButton
                        ref={profileButtonRef} // Set the ref here
                        icon={<FaUser />}
                        aria-label="Profile"
                        variant="ghost"
                        size="lg"
                        color="#0A0E27"
                        onClick={() => setIsProfilePopoverOpen(!isProfilePopoverOpen)} // Always toggle
                        ml={4}
                    />
                    {/* Profile Popover */}
                    {isProfilePopoverOpen && (
                        <ProfilePopover
                            isOpen={isProfilePopoverOpen}
                            onClose={() => setIsProfilePopoverOpen(false)}
                            profileButtonRef={profileButtonRef}
                        />
                    )}

                    {/* Cart Icon */}
                    <Flex align="center" position="relative">
                        <IconButton
                            icon={<FaShoppingCart />}
                            aria-label="Shopping Cart"
                            variant="ghost"
                            size="lg"
                            color="#0A0E27"
                            onClick={onOpen} // Opens the cart drawer
                            position="relative"
                        />
                        {cartItems.length > 0 && (
                            <Badge
                                position="absolute"
                                top="0"
                                right="0"
                                bg="#F47D31"
                                color="white"
                                borderRadius="full"
                                fontSize="0.675em"
                            >
                                {cartItems.length}
                            </Badge>
                        )}
                    </Flex>
                </Flex>
            </Flex>

            {/* Cart Drawer */}
            <CartDrawer
                isOpen={isOpen}
                onClose={onClose}
                cartItems={cartItems}
                initiateCheckout={initiateCheckout}
                loading={checkoutLoading}
            />

            {/* Guest Checkout Modal */}
            <GuestCheckoutModal
                isModalOpen={isModalOpen}
                onModalClose={onModalClose}
                guestInfo={guestInfo}
                setGuestInfo={setGuestInfo}
                handleGuestCheckout={handleGuestCheckout}
            />
        </Box>
    );
}

export default Navbar;
