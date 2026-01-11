import React, { useState, useEffect } from 'react';
import {
  Box, Button, Flex, Text, Heading, VStack, IconButton, useColorModeValue, useToast, Center
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';
import useAuthStore from '../stores/authStore';
import ProfilePreview from './ProfilePopover';
import OTPForm from './OTPForm';

const AuthComponent = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [emailForOTP, setEmailForOTP] = useState('');
  const [loading, setLoading] = useState(true);
  const bgColor = useColorModeValue('white', 'gray.800');
  const messageBg = '#0A0E27';
  const { user, fetchUser } = useUserStore();
  const { login, signup, verifyOtp, resendOtp } = useAuthStore(); // Use store actions
  const navigate = useNavigate();
  const toast = useToast(); // Import useToast
  const animationDuration = 0.7;

  useEffect(() => {
    const token = localStorage.getItem('accessToken'); // Check accessToken, not authToken
    if (token) {
      fetchUser(token);
    }
    setLoading(false);
  }, [fetchUser]);

  const handleLoginSubmit = async (values, setErrors) => {
    try {
      const success = await login(values);
      if (success) {
        toast({
          title: "Login Successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate('/dashboard');
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: "Please check your credentials.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
    } catch (error) {
      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'object' && !Array.isArray(data)) {
          const fieldErrors = {};
          Object.keys(data).forEach(key => {
            fieldErrors[key] = Array.isArray(data[key]) ? data[key].join(' ') : data[key];
          });
          setErrors(fieldErrors);
          return false;
        }
      }
      return false;
    }
  };

  const handleSignupSubmit = async (values, setErrors) => {
    try {
      const success = await signup(values);
      if (success) {
        toast({
          title: "Verify Your Email",
          description: "A 6-digit code has been sent to your email.",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
        setEmailForOTP(values.email);
        setShowOTP(true);
      }
    } catch (error) {
      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'object' && !Array.isArray(data)) {
          // Map backend fields to Formik fields
          const fieldErrors = {};
          Object.keys(data).forEach(key => {
            fieldErrors[key] = Array.isArray(data[key]) ? data[key].join(' ') : data[key];
          });
          setErrors(fieldErrors);

          // Optionally show a general toast if there are many errors
          toast({
            title: "Signup Failed",
            description: "Please correct the highlighted errors.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          return;
        }
      }

      toast({
        title: "Signup Failed",
        description: "Something went wrong. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleOTPSubmit = async (otpCode) => {
    try {
      const success = await verifyOtp(emailForOTP, otpCode);
      if (success) {
        toast({
          title: "Account Activated",
          description: "Verification successful. Welcome to MartX!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Invalid or expired OTP.";
      toast({
        title: "Verification Failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOtp(emailForOTP);
      toast({
        title: "Code Resent",
        description: "A new OTP has been sent to your email.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to resend Code",
        description: "Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (user) {
    // If user is already logged in, redirect to dashboard (or show profile)
    // navigate('/dashboard'); 
    // return null;
    // Or keep existing behavior if intended, but typically auth page redirects away if logged in
    // checks if already present
    return <ProfilePreview user={user} />;
  }

  return (
    <Flex
      h="100vh"
      align="center"
      justify="center"
      bg={bgColor}
      position="relative"
      overflow="hidden"
    >
      {/* Form Side - Sliding from left to right */}
      <Box
        position="absolute"
        top={0}
        bottom={0}
        left={isLogin ? '0' : '50%'}
        right={isLogin ? '50%' : '0'}
        bg={bgColor}
        zIndex={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        transition={`all ${animationDuration}s ease`}
      >
        {/* Login Form */}
        <Box
          w="50%"
          p={8}
          borderRadius={8}
          display={isLogin && !showOTP ? 'block' : 'none'}
        >
          <LoginForm onSubmit={handleLoginSubmit} />
        </Box>

        {/* Signup Form */}
        <Box
          w="50%"
          p={8}
          borderRadius={8}
          display={!isLogin && !showOTP ? 'block' : 'none'}
        >
          <SignupForm onSubmit={handleSignupSubmit} />
        </Box>

        {/* OTP Form */}
        <Box
          w="50%"
          p={8}
          borderRadius={8}
          display={showOTP ? 'block' : 'none'}
        >
          <OTPForm onSubmit={handleOTPSubmit} email={emailForOTP} onResend={handleResendOTP} />
          <Center mt={2}>
            <Button variant="link" size="sm" onClick={() => setShowOTP(false)} color="gray.500">
              Back to Signup
            </Button>
          </Center>
        </Box>
      </Box>

      {/* Message Side - Sliding from right to left */}
      <Box
        position="absolute"
        top={0}
        bottom={0}
        left={isLogin ? '50%' : '0'}
        right={isLogin ? '0' : '50%'}
        bg={messageBg}
        zIndex={1}
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
        transition={`all ${animationDuration}s ease`}
      >
        <VStack spacing={4} textAlign="center">
          <Heading mb={4} fontSize="3xl">
            {isLogin ? 'Hello, New User!' : 'Welcome Back!'}
          </Heading>
          <Text fontSize="lg">
            {isLogin
              ? "Don't have an account? Click below to sign up!"
              : 'Already have an account? Log in now!'}
          </Text>
          <Button
            size="lg"
            variant="outline"
            borderColor="#F47D31"
            color="#F47D31"
            borderRadius="full"
            onClick={() => setIsLogin(!isLogin)}
            _hover={{ bg: '#F47D31', color: 'white' }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </Button>
        </VStack>
      </Box>

      {/* Back Button */}

      <IconButton
        icon={<ArrowBackIcon />}
        position="absolute"
        top="20px" // Adjusted spacing from top
        left="20px" // Adjusted spacing from left
        backgroundColor={isLogin ? '#0A0E27' : '#F47D31'} // Background color based on current screen
        onClick={() => navigate('/dashboard')} // Navigate back to a previous page or home
        color="white" // Text color remains white
        zIndex={2} // Ensure it stays on top of the sliding elements
      />

    </Flex>
  );
};

export default AuthComponent;
