import axios from 'axios';
import api from './authInterceptor'; // Importing the authenticated API
const API_BASE_URL = 'http://127.0.0.1:8000/store/products';

// For GET requests, use api for authenticated calls
export const getProducts = async (url) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { results: [] };
  }
};


export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}/`); // GET request using axios
    return await response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
  }
};

// For non-GET requests, use the API instance with interceptor
export const createProduct = async (productData) => {
  try {
    const response = await api.post(`${API_BASE_URL}/`, productData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`${API_BASE_URL}/${id}/`, productData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`${API_BASE_URL}/${id}/`);
    return response.status === 204;  // No content
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
  }
};
// Add Tag to Product
export const addTagToProduct = async (productId, tag) => {
  try {
    const response = await api.post(`http://127.0.0.1:8000/add-tag-to-product/${productId}/`, { tag });
    return response.data;  // Return the response, which could be updated product info or confirmation
  } catch (error) {
    console.error("Error adding tag to product:", error);
    throw error; // Throw error for further handling
  }
};
