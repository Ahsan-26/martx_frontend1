import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
    Box, Center, Button, Image, FormControl, Input, Heading, FormErrorMessage, useColorModeValue, Text
} from '@chakra-ui/react';

const OTPForm = ({ onSubmit, email, onResend }) => {
    const bgColor = useColorModeValue('white', 'gray.700');

    return (
        <Formik
            initialValues={{ otp_code: '' }}
            validate={values => {
                const errors = {};
                if (!values.otp_code) errors.otp_code = 'OTP code is required';
                else if (values.otp_code.length !== 6) errors.otp_code = 'OTP must be 6 digits';
                return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
                await onSubmit(values.otp_code);
                setSubmitting(false);
            }}
        >
            {({ isSubmitting }) => (
                <Form>
                    <Box
                        p={8}
                        maxWidth="400px"
                        borderRadius={8}
                        bg={bgColor}
                        m="auto"
                        mt={10}
                    >
                        <Center mb={6}>
                            <Box display="flex" alignItems="center">
                                <Image src="/martxSlogan.png" alt="Logo" height="70px" />
                            </Box>
                        </Center>
                        <Heading as="h2" textAlign="center" mb={2} color="#0A0E27">
                            Verify OTP
                        </Heading>
                        <Text textAlign="center" mb={6} fontSize="sm">
                            Enter the 6-digit code sent to <b>{email}</b>
                        </Text>

                        <FormControl id="otp_code" mb={4}>
                            <Field
                                as={Input}
                                name="otp_code"
                                placeholder="Enter 6-digit OTP"
                                variant="flushed"
                                focusBorderColor="#0A0E27"
                                textAlign="center"
                                letterSpacing="0.5rem"
                                fontSize="xl"
                                maxLength={6}
                            />
                            <FormErrorMessage>
                                <ErrorMessage name="otp_code" />
                            </FormErrorMessage>
                        </FormControl>

                        <center>
                            <Button
                                mt={6}
                                bgGradient="linear(to-b, #303064, #0A0E27)"
                                color="white"
                                _hover={{
                                    bgGradient: "linear(to-b, #112C50, #0A0E27)",
                                }}
                                isLoading={isSubmitting}
                                loadingText="Verifying"
                                type="submit"
                                width="70%"
                                borderRadius="md"
                                variant="solid"
                            >
                                Verify & Activate
                            </Button>
                        </center>

                        <Center mt={4}>
                            <Button variant="link" size="sm" onClick={onResend} color="#F47D31">
                                Resend Code
                            </Button>
                        </Center>
                    </Box>
                </Form>
            )}
        </Formik>
    );
};

export default OTPForm;
