import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import FeaturedCategories from '../components/FeaturedCategories';
import Footer from '../components/Footer';
import ProductListing from '../components/FeatureProducts';
import Testimonials from '../components/Testimonials';
import PromotionalBanner from '../components/PromotionalBanner';
import NewsletterSignup from '../components/NewsletterSignup';
import Cart from '../components/Cart';
import VendorCard from '../components/VendorCard';
import useStore from '../stores/store';
import BuyerSidebar from './BuyerSidebar';

const DashboardPage = () => {
    const { initializeCart, fetchProducts, } = useStore();

    // useEffect(() => {
    //     initializeCart();
    //     fetchProducts();
    // }, [initializeCart, fetchProducts]);

    return (
        <>  <BuyerSidebar />
            <Navbar />
            <Banner />
            <FeaturedCategories />
            <ProductListing />
            <PromotionalBanner />
            {/* <Testimonials /> */}
            <VendorCard />

            <NewsletterSignup />
            <ProductListing />
            <Footer />
        </>
    );
};

export default DashboardPage;
