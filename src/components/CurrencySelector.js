import React, { useState, useEffect } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  useToast,
  Spinner,
  Box
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import axios from 'axios';

const CurrencySelector = () => {
  const [rates, setRates] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchRates = async () => {
    setLoading(true);
    try {
      // In production, use the actual backend URL or environment variable. 
      // Assuming proxy is at localhost:8000 for local dev matching the backend port.
      const response = await axios.get('http://127.0.0.1:8000/currency/rates/');
      if (response.data && response.data.rates) {
        setRates(response.data.rates);
        // Ensure USD is in the list or set to base
      }
    } catch (error) {
      console.error("Failed to fetch rates", error);
      // Silent fail or simple toast if critical
      // toast({
      //   title: "Currency Error",
      //   description: "Could not load exchange rates.",
      //   status: "warning",
      //   duration: 3000,
      //   isClosable: true,
      // });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    // Future: Persist to localStorage or global store (Zustand)
    localStorage.setItem('martx_currency', currency);
  };

  // Common currencies to display neatly
  const displayCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'PKR', 'INR'];
  
  // Filter available rates based on display list + whatever comes from API
  const availableCurrencies = Object.keys(rates).filter(c => displayCurrencies.includes(c));
  
  // If API fails or loads, ensure at least USD is there
  const finalCurrencies = availableCurrencies.length > 0 ? availableCurrencies : displayCurrencies;

  return (
    <Menu>
      <MenuButton 
        as={Button} 
        rightIcon={<ChevronDownIcon />} 
        variant="ghost" 
        color="#0A0E27" 
        _hover={{ bg: "gray.100" }}
        size="sm"
        isLoading={loading}
      >
        {selectedCurrency}
      </MenuButton>
      <MenuList zIndex={999}> 
        {finalCurrencies.map((currency) => (
          <MenuItem 
            key={currency} 
            onClick={() => handleCurrencyChange(currency)}
            fontWeight={selectedCurrency === currency ? "bold" : "normal"}
            color="#0A0E27"
          >
            <Box as="span" mr="2" fontSize="lg">
              {/* Simple flag mapping or just code */}
              {currency === 'USD' && '🇺🇸'}
              {currency === 'EUR' && '🇪🇺'}
              {currency === 'GBP' && '🇬🇧'}
              {currency === 'CAD' && '🇨🇦'}
              {currency === 'AUD' && '🇦🇺'}
              {currency === 'PKR' && '🇵🇰'}
              {currency === 'INR' && '🇮🇳'}
            </Box>
            {currency}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default CurrencySelector;
