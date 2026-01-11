import React from 'react';
import { Box, Text, VStack, Link } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaDollarSign, FaServicestack, FaInbox, FaChartBar, FaFlag, FaCog, FaBoxes, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const linkStyles = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '10px 20px',
    color: 'white',
    textAlign: 'left',
    textDecoration: 'none',
    position: 'relative',
    bg: '#0A0E23',
    transition: 'background-color 0.3s ease',
    _hover: {
      bgGradient: 'linear(to-r, #F47D31, #F78F4B)',
      color: 'white',
    },
    _active: {
      bgGradient: 'linear(to-r, #F47D31, #F78F4B)',
      color: 'white',
    },
  };

  const activeLinkStyles = {
    bgGradient: 'linear(to-r, #F47D31, #F78F4B)',
  };

  const links = [
    { to: '/MainSellerPage', label: 'Dashboard', icon: FaTachometerAlt },
    { to: '/MainSellerPage/earnings', label: 'Earnings', icon: FaDollarSign },
    { to: '/profile', label: 'Settings', icon: FaCog },
    { to: '/MainSellerPage/manage-inventory', label: 'Manage Inventory', icon: FaBoxes },
    { to: '/logout', label: 'Logout', icon: FaSignOutAlt },
  ];

  return (
    <Box
      w="250px"
      bg="#0A0E23"
      p="0"
      boxShadow="md"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="100vh"
    >
      <Box>
        <Text fontSize="xl" fontStyle={'italic'} fontWeight="bold" mb="8" textAlign="center" color="#F47D31">
          martX Seller Panel
        </Text>
        <VStack align="stretch" spacing="1">
          {links.map((link) => (
            <Link
              as={RouterLink}
              to={link.to}
              {...linkStyles}
              sx={location.pathname === link.to ? activeLinkStyles : {}}
              key={link.to}
            >
              <Box as={link.icon} mr="10px" />
              {link.label}
            </Link>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default Sidebar;
