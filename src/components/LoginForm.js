import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box, Button, Image, FormControl, Input, InputGroup, InputRightElement, Text, useColorModeValue, Heading, Center
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import useAuthStore from '../stores/authStore'; // Import Zustand store

// Validation Schema using Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password is too short - should be 8 chars minimum.').required('Password is required'),
});

const LoginForm = ({ onSubmit }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const { error } = useAuthStore(); // Access Zustand store state

  // Password Input with integrated Show/Hide functionality
  const PasswordInput = () => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    return (
      <InputGroup size="md">
        <Field
          as={Input}
          pr="4.5rem" // Right padding to make space for the button
          name="password"
          type={show ? 'text' : 'password'}
          placeholder="Password"
          focusBorderColor="blue.500"
          variant="flushed"
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleClick}>
            {show ? <ViewOffIcon /> : <ViewIcon />}
          </Button>
        </InputRightElement>
      </InputGroup>
    );
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        const credentials = {
          email: values.email,
          password: values.password,
        };

        const success = await onSubmit(credentials, setErrors);

        setSubmitting(false);
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form>
          <Box
            p={8}
            maxWidth="400px"
            // borderWidth={1}
            borderRadius={8}
            // boxShadow="lg"
            bg={bgColor}
            m="auto"
            mt={4}
          >
            <Center mb={6}>
              <Box display="flex" alignItems="center" mb={{ base: 2, md: 0 }} >
                <Image src="/martxSlogan.png" alt="Logo" height="70px" />
              </Box>
            </Center>
            <Center>
              <Heading as="h2" size="lg" mb={6} color="#0A0E27">
                Sign in
              </Heading>
            </Center>

            <FormControl id="email" isInvalid={errors.email && touched.email}>
              <Field
                as={Input}
                name="email"
                type="email"
                variant="flushed"
                focusBorderColor="blue.500"
                placeholder="Email"
              />
              {errors.email && touched.email && <Text color="red.500">{errors.email}</Text>}
            </FormControl>

            <FormControl id="password" mt={4} isInvalid={errors.password && touched.password}>
              <PasswordInput />
              {errors.password && touched.password && <Text color="red.500">{errors.password}</Text>}
            </FormControl>

            {error && <Text color="red.500" mt={2}>{error}</Text>}

            <Center>
              <Button
                mt={6}
                bgGradient="linear(to-b, #303064, #0A0E27)" // Gradient from light at the top to dark at the bottom
                color="white"
                _hover={{
                  bgGradient: "linear(to-b, #112C50, #0A0E27)", // Slightly lighter gradient on hover
                }}
                isLoading={isSubmitting}
                loadingText="Submitting"
                type="submit"
                width="50%" // Adjust the button width here
                borderRadius="md"
              >
                Login
              </Button>
            </Center>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
