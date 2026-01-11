import React, { useEffect, useState } from 'react';
import { Box, Button, Heading, Text, VStack, useToast, Spinner, Container } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ActivationPage = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [status, setStatus] = useState('activating'); // 'activating', 'success', 'error'

    useEffect(() => {
        const activateAccount = async () => {
            if (!uid || !token) {
                setStatus('error');
                return;
            }

            try {
                await axios.post('http://127.0.0.1:8000/auth/users/activation/', { uid, token });
                setStatus('success');
                toast({
                    title: "Account Activated",
                    description: "You can now log in.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } catch (error) {
                console.error("Activation error:", error);
                setStatus('error');
                toast({
                    title: "Activation Failed",
                    description: "The link may be invalid or expired.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        activateAccount();
    }, [uid, token, toast]);

    return (
        <Container maxW="container.md" centerContent py={20}>
            <Box p={8} boxShadow="lg" borderRadius="md" bg="white" w="full" textAlign="center">
                {status === 'activating' && (
                    <VStack spacing={4}>
                        <Heading size="lg">Activating Account...</Heading>
                        <Spinner size="xl" color="#F47D31" />
                        <Text>Please wait while we verify your email.</Text>
                    </VStack>
                )}

                {status === 'success' && (
                    <VStack spacing={4}>
                        <Heading size="lg" color="green.500">Activation Successful!</Heading>
                        <Text>Your account has been verified. You can now log in.</Text>
                        <Button
                            colorScheme="blue"
                            bg="#F47D31"
                            _hover={{ bg: "#E06C20" }}
                            onClick={() => navigate('/auth')}
                        >
                            Go to Login
                        </Button>
                    </VStack>
                )}

                {status === 'error' && (
                    <VStack spacing={4}>
                        <Heading size="lg" color="red.500">Activation Failed</Heading>
                        <Text>Something went wrong. The link might be invalid or expired.</Text>
                        <Button
                            colorScheme="blue"
                            bg="#0A0E27"
                            _hover={{ bg: "#0A0E27" }}
                            onClick={() => navigate('/auth')}
                        >
                            Back to Signup
                        </Button>
                    </VStack>
                )}
            </Box>
        </Container>
    );
};

export default ActivationPage;
