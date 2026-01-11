import React from 'react';
import Slider from 'react-slick';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Banner() {
    const navigate = useNavigate();
    const MotionBox = motion(Box);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
    };

    const slides = [
        {
            image: "/banner-imgs/banner1.jpeg",
            heading: "Summer Spectacular!",
            text: "Up to 50% off on all beachwear. Dive into savings today!",
            button: "Shop the Sale",
            collectionId: 8, // Books & Stationery (as requested)
        },
        {
            image: "/banner-imgs/banner2.jpeg",
            heading: "Just In: Fresh Finds",
            text: "Explore the latest trends in fashion and tech.",
            button: "See What's New",
            collectionId: 3, // Fashion
        },
        {
            image: "/banner-imgs/banner3.jpeg",
            heading: "Mega Savings Event!",
            text: "Exclusive deals on best-selling products. Limited time only!",
            button: "Grab the Deals",
            collectionId: 3, // Fashion
        },
    ];

    const handleButtonClick = (collectionId) => {
        navigate(`/products?category=${collectionId}`);
    };

    return (
        <Box mt="0" pt="0"> {/* Removed margin and padding to align perfectly with the navbar */}
            <Slider {...settings}>
                {slides.map((slide, index) => (
                    <Box key={index}>
                        <Box
                            as="section"
                            bgImage={`url(${slide.image})`}
                            bgSize="cover"
                            bgPosition="center"
                            height={{ base: "300px", md: "500px" }}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                            position="relative"
                            color="white"
                        >
                            <MotionBox
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1 }}
                                bg="rgba(0, 0, 0, 0.5)"
                                p={4}
                                textAlign="center"
                                borderRadius="md"
                            >
                                <Heading as="h1" size="2xl" mb={4}>
                                    {slide.heading}
                                </Heading>
                                <Text fontSize="lg" mb={6}>
                                    {slide.text}
                                </Text>
                                <Button
                                    size="lg"
                                    colorScheme="orange"
                                    bg="#F47D31"
                                    _hover={{ bg: "#e36625" }}
                                    borderRadius="full"
                                    onClick={() => handleButtonClick(slide.collectionId)}
                                >
                                    {slide.button}
                                </Button>
                            </MotionBox>
                        </Box>
                    </Box>
                ))}
            </Slider>
        </Box>
    );
}

export default Banner;
