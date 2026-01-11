import ActivationPage from './components/ActivationPage';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages and Components
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProductPage from './pages/ProductDetailpage';
import CheckoutPage from './components/CheckoutPage';
import OrderConfirmation from './components/OrderConfirmation';
import GuestOrderView from './components/GuestOrderView';
//import Dashboard from './pages/Dashboard';
import ImageUpload from './components/Image';
import LogoutButton from './components/LogoutButton';
import { useCart } from './hooks/useCart';
import { initializeCart } from './services/cartService';
import useCartStore from './stores/cartStore';
import GuestInfoModal from './components/GuestInfoModal';
import OrderHistory from './components/OrderHistory';
import OrderDetail from './components/OrderDetail';
import GuestOrderTracking from './components/GuestOrderTracking';
import VendorProductsPage from './components/VendorProductsPage';
import ProductListing from './components/ProductListing';
import Profile from './components/Profile';
import Wishlist from './components/Wishlist';
import ForYouProducts from './components/ForYouProducts';

// Seller Dashboard Components
import SellerDashboard from './components/seller/SellerDashboard';
import Sidebar from './components/seller/Sidebar';
import ManageInventory from './components/seller/ManageInventory';
import Earnings from './components/seller/Earnings';
import DailySalesLineChart from './components/seller/DailySalesLineChart';
import Header from './components/seller/Header';
import MonthlyStatsBarChart from './components/seller/MonthlyStatsBarChart';
import VendorOrders from './components/seller/VendorOrders';
import MainSellerPage from './components/seller/MainSellerPage';
import AuthComponent from './components/AuthComponent';
import ProfilePreview from './components/ProfilePopover';
import ProfileModal from './components/ProfilePopover';
import ProductSearchPage from './pages/ProductSearchPage';
import VendorListingPage from './pages/VendorListingPage';
import VendorSales from './components/seller/VendorSales'
import ProfilePopover from './components/ProfilePopover';
import SellerSignup from './components/seller/SellerSignup';



const stripePromise = loadStripe('pk_test_51PsV1D03pR92vHPUx85GxUuipVPCfKAjxsboQbvefxLLoZFQUC0Ec6xD0P99uWJth7pW2SHuGQCCzT7sq2sA9azK00Au7Rxijd');

// Create a QueryClient instance
const queryClient = new QueryClient();

function App() {
  const setCart = useCartStore((state) => state.setCart);

  // Initialize cart when app loads
  useEffect(() => {
    const initializeAppCart = async () => {
      try {
        const { cartId, cartItems } = await initializeCart();
        setCart(cartId, cartItems);
      } catch (error) {
        console.error('Error initializing cart:', error);
      }
    };

    initializeAppCart();
  }, [setCart]);

  return (
    <QueryClientProvider client={queryClient}>
      <Elements stripe={stripePromise}>
        <Router>

          <Routes>
            <Route path="/foryou" element={<ForYouProducts />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/sellersignup" element={<SellerSignup />} />
            <Route path="/profilepop" element={<ProfilePopover />} />
            <Route path="/auth" element={<AuthComponent />} />
            <Route path="/products" element={<ProductSearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/checkout/:orderId" element={<CheckoutPage />} />
            <Route path="/checkout/" element={<CheckoutPage />} />
            <Route path="/guest-info/" element={<GuestInfoModal />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/guest-order-confirmation/:orderId" element={<GuestOrderView />} />
            <Route path="/image" element={<ImageUpload />} />
            <Route path="/logout" element={<LogoutButton />} />

            {/* Order Routes */}
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/order-detail/:orderId" element={<OrderDetail />} />
            <Route path="/guest-order-tracking" element={<GuestOrderTracking />} />

            {/* Vendor Product Listing */}
            <Route path="/vendors/:vendorId/products" element={<VendorProductsPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/vendor-orders" element={<VendorOrders />} />
            <Route path="/vendors" element={<VendorListingPage />} />
            <Route path="/vendorsales" element={<VendorSales />} />

            <Route path="/activate/:uid/:token" element={<ActivationPage />} />
            <Route path="/auth" element={<AuthComponent />} />

            {/* Seller Dashboard Routes with Layout */}
            <Route path="/MainSellerPage" element={<MainSellerPage />}>
              <Route index element={<SellerDashboard />} />
              <Route path="manage-inventory" element={<ManageInventory />} />
              <Route path="earnings" element={<Earnings />} />
              <Route path="vendor-orders" element={<VendorOrders />} />
              <Route path="vendorsales" element={<VendorSales />} />
            </Route>

            <Route path="/sidebar" element={<Sidebar />} />
          </Routes>
        </Router>
      </Elements>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
    </QueryClientProvider>
  );
}

export default App;
