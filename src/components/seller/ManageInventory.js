import React, { useState, useEffect } from 'react';
import { Input, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverBody, Button, IconButton, Box, Heading, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { getProducts, createProduct, deleteProduct, updateProduct, addTagToProduct } from '../../services/productService';
import AddProductModal from './AddProductModal';
import { useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon, SmallAddIcon } from '@chakra-ui/icons';


const ManageInventory = () => {
  const navigate = useNavigate();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    slug: '',
    inventory: '',
    unit_price: '',
    collection: '',
    images: [], // Ensure this is an array
  });
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tagInputs, setTagInputs] = useState({});

  // Fetch data including pagination info
  const fetchData = async (url = 'http://127.0.0.1:8000/store/products/?vendor=me') => {
    try {
      const products = await getProducts(url);
      if (products && products.results) {
        setInventoryItems(products.results);
        setNextPage(products.next);
        setPreviousPage(products.previous);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    async function fetchCollections() {
      const response = await fetch('http://127.0.0.1:8000/store/collections');
      const data = await response.json();
      setCollections(data);
    }
    fetchCollections();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const handleAddProduct = async () => {
    if (editingProductId) {
      await updateProduct(editingProductId, newProduct);
    } else {
      const addedProduct = await createProduct(newProduct);
      setInventoryItems([...inventoryItems, addedProduct]);
    }

    setNewProduct({
      title: '',
      description: '',
      slug: '',
      inventory: '',
      unit_price: '',
      collection: '',
      images: [],
    });
    setEditingProductId(null);
    onClose();
  };

  const handleImageUpload = (files) => {
    const fileArray = Array.from(files);
    setNewProduct(prev => ({
      ...prev,
      images: [...(prev.images || []), ...fileArray],
    }));
  };

  const handleEditProduct = (product) => {
    setNewProduct({
      title: product.title,
      description: product.description,
      slug: product.slug,
      inventory: product.inventory,
      unit_price: product.unit_price,
      collection: product.collection,
      images: [], // Reset images for new uploads while editing
    });
    setEditingProductId(product.id);
    onOpen();
  };

  const handleDeleteProduct = async (id) => {
    const isDeleted = await deleteProduct(id);
    if (isDeleted) {
      setInventoryItems(inventoryItems.filter(item => item.id !== id));
    }
  };
  const handleAddTagProduct = async (productId) => {
    try {
      const tag = tagInputs[productId]; // Get the input value for the tag
      if (!tag) {
        alert("Please enter a tag");
        return;
      }

      const response = await addTagToProduct(productId, tag); // Call the API service
      alert("Tag added successfully!");

      // Update the inventoryItems state to reflect the added tag
      setInventoryItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, tags: [...(item.tags || []), tag] } : item
        )
      );

      // Clear the input field for the tag
      setTagInputs({ ...tagInputs, [productId]: '' });
    } catch (error) {
      console.error("Failed to add tag to product:", error);
      alert("Failed to add tag");
    }
  };


  const handleTagInputChange = (productId, value) => {
    setTagInputs({ ...tagInputs, [productId]: value });
  };


  const handleNextPage = () => {
    if (nextPage) {
      fetchData(nextPage); // Fetch data for the next page
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      fetchData(previousPage); // Fetch data for the previous page
    }
  };


  return (
    <Box
      p="20px"
      bg="#0A0E23"
      color="white"
      border="2px"
      boxShadow="md"
      mt="0px"
      borderRadius="lg"
    >
      <IconButton
        aria-label="Back"
        icon={<ArrowBackIcon />}
        colorScheme="orange"
        onClick={() => navigate('/MainSellerPage')}
        mb="4"
      />
      <Heading mb="20px" color="#F47D31">Manage Inventory</Heading>

      {/* Add Product Button */}
      <Box display="flex" justifyContent="flex-end" mb="10px">
        <IconButton
          icon={<AddIcon />}
          colorScheme="orange"
          onClick={onOpen}
          aria-label="Add new product"
        />
      </Box>

      {/* Inventory Table */}
      <Table
        variant="simple"
        bg="white"
        color="black"
        borderRadius="lg"
        mb="20px"
        size="sm"
      >
        <Thead bg="#F47D31">
          <Tr>
            <Th color="white" px="10px" py="8px">Product Name</Th>
            <Th color="white" px="10px" py="8px">Status</Th>
            <Th color="white" px="10px" py="8px">Quantity</Th>
            <Th color="white" px="10px" py="8px">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {inventoryItems.map(item => (
            <Tr key={item.id}>
              <Td px="10px" py="8px">{item?.title}</Td>
              <Td px="10px" py="8px">{item.inventory > 0 ? 'In Stock' : 'Out of Stock'}</Td>
              <Td px="10px" py="8px">{item.inventory}</Td>
              <Td px="10px" py="8px">
                <IconButton
                  icon={<EditIcon />}
                  backgroundColor="#0A0E23"
                  _hover={{ backgroundColor: "#0F1333" }}
                  color="white"
                  mr="2"
                  onClick={() => handleEditProduct(item)}
                  aria-label="Edit Product"
                />
                <IconButton
                  icon={<DeleteIcon />}
                  backgroundColor="#F47D31"
                  _hover={{ backgroundColor: "#FF8B4C" }}
                  color="white"
                  onClick={() => handleDeleteProduct(item.id)}
                  aria-label="Delete Product"
                />
                {/* Add Tag Popover */}
                <Popover>
                  <PopoverTrigger>
                    <IconButton
                      icon={<SmallAddIcon />}
                      aria-label="Add Tag"
                      colorScheme="orange"
                      size="sm"
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                      <Input
                        placeholder="Enter tag"
                        value={tagInputs[item.id] || ''}
                        onChange={(e) => handleTagInputChange(item.id, e.target.value)}
                        size="sm"
                        mb="2"
                      />
                      <Button
                        onClick={() => handleAddTagProduct(item.id)}
                        colorScheme="orange"
                        size="sm"
                      >
                        Add Tag
                      </Button>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Pagination Buttons */}
      <Box display="flex" justifyContent="space-between" mt="20px">
        <Button
          onClick={handlePreviousPage}
          disabled={!previousPage}
          colorScheme="orange"
        >
          Previous
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={!nextPage}
          colorScheme="orange"
        >
          Next
        </Button>
      </Box>

      {/* Add or Update Product Modal */}
      <AddProductModal
        isOpen={isOpen}
        onClose={onClose}
        newProduct={newProduct}
        handleInputChange={handleInputChange}
        handleAddProduct={handleAddProduct}
        handleImageUpload={handleImageUpload}
        collections={collections}
        editingProductId={editingProductId}
        onProductSaved={() => fetchData()}
      />
    </Box>
  );
};

export default ManageInventory;
