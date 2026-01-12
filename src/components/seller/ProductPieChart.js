import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../../services/authInterceptor'; // Assuming you're using an API interceptor

const VendorProductsPieChart = () => {
  const navigate = useNavigate(); // Initialize useNavigate for routing

  // Fetch products of the specific vendor
  const getVendorProducts = async () => {
    try {
      // First get the vendor's own profile to get the correct ID
      const vendorResponse = await api.get('/store/vendors/me/');
      const vendorId = vendorResponse.data.id;
      const response = await api.get(`/store/vendors/${vendorId}/products/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for vendor:`, error);
      return [];
    }
  };

  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Product Remaining',
        data: [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66CDAA'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66CDAA'],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    // Fetch products and update pie chart data
    async function fetchProducts() {
      const products = await getVendorProducts();
      const productTitles = products.map(product => product.title);
      const productInventories = products.map(product => product.inventory);

      setPieData({
        labels: productTitles,
        datasets: [
          {
            label: 'Product Remaining',
            data: productInventories,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66CDAA'],
            borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66CDAA'],
            borderWidth: 1,
          },
        ],
      });
    }

    fetchProducts();
  }, []);

  // Handle click on pie chart segment
  const handleClick = (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const clickedProductTitle = pieData.labels[index];

      // Navigate to the inventory management page
      // Pass the clicked product as state
      navigate('/MainSellerPage/manage-inventory', { state: { productTitle: clickedProductTitle } });
    }
  };

  return (
    <div>
      <h2>Vendor Products</h2>
      <Pie
        data={pieData}
        options={{
          onClick: handleClick, // Attach click handler to the pie chart
        }}
      />
    </div>
  );
};

export default VendorProductsPieChart;
