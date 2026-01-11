import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  VStack,
  Text,
  HStack,
  Collapse,
} from '@chakra-ui/react';
import { HamburgerIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import {
  AiOutlineFire,
  AiOutlineShoppingCart,
  AiOutlineUser,
  AiOutlineHome,
  AiOutlineHeart // Added Heart Icon for Wishlist 
} from 'react-icons/ai';
import { FiTrendingUp, FiPackage, FiStar, FiBell, FiLogIn, FiMail, FiPhone } from 'react-icons/fi';

const BuyerSidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isSeeAllOpen, setIsSeeAllOpen] = useState(false);

  const navigate = useNavigate();

  // Toggle categories dropdown
  const toggleCategories = () => setIsCategoriesOpen(!isCategoriesOpen);
  const toggleSeeAll = () => setIsSeeAllOpen(!isSeeAllOpen);

  return (
    <>
      {/* Icon to open the sidebar */}
      <IconButton
        icon={<HamburgerIcon />}
        onClick={onOpen}
        color="black"
        bg={'white'}
        position={'absolute'}
        top="20px"
        left="20px"
        zIndex="1000"
      />

      {/* Sidebar Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="white" color="black">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor="#000000">
            Menu
          </DrawerHeader>

          <DrawerBody>
            <VStack align="start" spacing={3}>
              {/* Home Option */}
              <HStack _hover={{ color: '#F47D31' }} cursor="pointer" w="full" py={2} onClick={() => navigate('/dashboard')}>
                <AiOutlineHome />
                <Text>Home</Text>
              </HStack>

              {/* Wishlist Option */}
              <HStack _hover={{ color: '#F47D31' }} cursor="pointer" w="full" py={2} onClick={() => navigate('/wishlist')}>
                <AiOutlineHeart />
                <Text>Wishlist</Text>
              </HStack>

              {/* Latest Products */}
              <HStack _hover={{ color: '#F47D31' }} cursor="pointer" w="full" py={2} onClick={() => { navigate('/products?sortBy=last_update'); onClose(); }}>
                <AiOutlineFire />
                <Text>Latest Products</Text>
              </HStack>

              <Box w="full" borderBottom="1px" borderColor="rgba(0, 0, 0, 0.3)" />

              {/* Shop by Categories */}
              <HStack
                onClick={toggleCategories}
                _hover={{ color: '#F47D31' }}
                cursor="pointer"
                justify="space-between"
                w="full"
              >
                <HStack>
                  <AiOutlineShoppingCart />
                  <Text>Shop by Categories</Text>
                </HStack>
                {isCategoriesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </HStack>
              <Collapse in={isCategoriesOpen}>
                <VStack align="start" pl={4}>
                  <Text _hover={{ color: '#F47D31' }} cursor="pointer" w="full" py={1} onClick={() => { navigate('/products?category=2'); onClose(); }}>
                    Electronics
                  </Text>
                  <Text _hover={{ color: '#F47D31' }} cursor="pointer" w="full" py={1} onClick={() => { navigate('/products?category=3'); onClose(); }}>
                    Fashion
                  </Text>
                  <Text _hover={{ color: '#F47D31' }} cursor="pointer" w="full" py={1} onClick={() => { navigate('/products?category=5'); onClose(); }}>
                    Home Appliances
                  </Text>
                  <HStack
                    onClick={toggleSeeAll}
                    _hover={{ color: '#F47D31' }}
                    cursor="pointer"
                    w="full"
                    py={1}
                  >
                    <Text>See All</Text>
                    {isSeeAllOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  </HStack>
                  <Collapse in={isSeeAllOpen}>
                    <VStack align="start" pl={4}>
                      <Text _hover={{ color: '#F47D31' }} cursor="pointer" w="full" py={1} onClick={() => { navigate('/products?category=4'); onClose(); }}>
                        Beauty
                      </Text>
                      <Text _hover={{ color: '#F47D31' }} cursor="pointer" w="full" py={1} onClick={() => { navigate('/products?category=6'); onClose(); }}>
                        Sports
                      </Text>
                    </VStack>
                  </Collapse>
                </VStack>
              </Collapse>

              <Box w="full" borderBottom="1px" borderColor="rgba(0, 0, 0, 0.3)" />

              {/* Other Sidebar Options */}
              <HStack _hover={{ color: '#F47D31' }} cursor="pointer" w="full" py={2} onClick={() => navigate('/vendors')}>
                <FiTrendingUp />
                <Text>Sellers</Text>
              </HStack>

              <HStack _hover={{ color: '#F47D31' }} cursor="pointer" w="full" py={2} onClick={() => navigate('/order-history')}>
                <FiPackage />
                <Text>Track Order</Text>
              </HStack>


              <HStack _hover={{ color: '#F47D31' }} cursor="pointer" w="full" py={2} onClick={() => navigate('/profile')}>
                <AiOutlineUser />
                <Text>My Account</Text>
              </HStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default BuyerSidebar;
