import React from 'react';
import { Button } from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

/**
 * Reusable Back Button Component
 * Uses browser history to navigate back one step
 */
function BackButton({ label = "Back", size = "sm", mb = 4, ...props }) {
    const navigate = useNavigate();

    return (
        <Button
            leftIcon={<FaArrowLeft />}
            variant="outline"
            borderColor="gray.300"
            color="gray.700"
            _hover={{ bg: "gray.50", borderColor: "gray.400" }}
            onClick={() => navigate(-1)}
            size={size}
            mb={mb}
            {...props}
        >
            {label}
        </Button>
    );
}

export default BackButton;
