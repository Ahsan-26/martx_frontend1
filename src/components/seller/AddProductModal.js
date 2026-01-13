// src/components/inventory/AddProductModal.js
import React from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  Input, Select, Button, Box, Text, Flex
} from '@chakra-ui/react';
import api from '../../services/authInterceptor';
import { useState } from 'react';

const AddProductModal = ({
  isOpen,
  onClose,
  newProduct,
  handleInputChange,
  handleAddProduct,
  handleImageUpload,
  collections,
  editingProductId,
  onProductSaved
}) => {
  const [tags, setTags] = useState(''); // Add state for tags
  const fileInputRef = React.useRef(null);

  const handleTagChange = (event) => {
    setTags(event.target.value);  // Update tags state
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', newProduct.title);
    formData.append('description', newProduct.description);
    formData.append('slug', newProduct.slug);
    formData.append('unit_price', newProduct.unit_price);
    formData.append('inventory', newProduct.inventory);
    formData.append('collection', newProduct.collection);

    // Extract tags from input, split by commas, and trim any extra spaces
    const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    // Append tags to formData
    tagList.forEach(tag => formData.append('tags', tag));

    // Append Images (assuming handleImageUpload sets newProduct.images as FileList or array)
    if (newProduct.images) {
      for (let i = 0; i < newProduct.images.length; i++) {
        formData.append('images', newProduct.images[i]);
      }
    }

    try {
      if (editingProductId) {
        await api.patch(`http://127.0.0.1:8000/store/products/${editingProductId}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('http://127.0.0.1:8000/store/products/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      if (onProductSaved) onProductSaved();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="#0A0E23" color="white">
        <ModalHeader>{editingProductId ? 'Update Product' : 'Add New Product'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            name="title"
            placeholder="Product Name"
            value={newProduct.title}
            onChange={handleInputChange}
            mb="10px"
            bg="white"
            color="black"
          />
          <Input
            name="description"
            placeholder="Description"
            value={newProduct.description}
            onChange={handleInputChange}
            mb="10px"
            bg="white"
            color="black"
          />
          <Input
            name="slug"
            placeholder="Slug"
            value={newProduct.slug}
            onChange={handleInputChange}
            mb="10px"
            bg="white"
            color="black"
          />
          <Input
            name="unit_price"
            placeholder="Price"
            value={newProduct.unit_price}
            onChange={handleInputChange}
            mb="10px"
            bg="white"
            color="black"
          />
          <Input
            name="inventory"
            placeholder="Quantity"
            value={newProduct.inventory}
            onChange={handleInputChange}
            mb="10px"
            bg="white"
            color="black"
          />
          <Select
            name="collection"
            placeholder="Select Collection"
            value={newProduct.collection}
            onChange={handleInputChange}
            mb="10px"
            bg="white"
            color="black"
          >
            {collections.map(collection => (
              <option key={collection.id} value={collection.id}>
                {collection.title}
              </option>
            ))}
          </Select>
          <Box mb="10px">
            <Flex alignItems="center" bg="white" p={2} borderRadius="md">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    handleImageUpload(e.target.files);
                  }
                  e.target.value = ''; // Reset input to allow re-selecting same files
                }}
              />
              <Button
                size="sm"
                colorScheme="gray"
                mr={3}
                onClick={() => fileInputRef.current.click()}
              >
                Choose Files
              </Button>
              <Text color="gray.600" fontSize="sm" isTruncated>
                {newProduct.images && newProduct.images.length > 0
                  ? `${newProduct.images.length} file${newProduct.images.length !== 1 ? 's' : ''} selected`
                  : 'No files selected'}
              </Text>
            </Flex>
          </Box>
          {newProduct.images && newProduct.images.length > 0 && (
            <Box mb="10px" p="5px" border="1px solid gray" borderRadius="md">
              <Text fontSize="xs" color="gray.400" mb="2">Selected Images ({newProduct.images.length}):</Text>
              <Flex wrap="wrap" gap="2">
                {newProduct.images.map((file, index) => (
                  <Box key={index} position="relative" w="50px" h="50px" border="1px solid #F47D31" borderRadius="sm">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <Button
                      size="xs"
                      position="absolute"
                      top="-5px"
                      right="-5px"
                      colorScheme="red"
                      borderRadius="full"
                      w="16px"
                      h="16px"
                      p="0"
                      onClick={() => {
                        const updatedImages = [...newProduct.images];
                        updatedImages.splice(index, 1);
                        handleInputChange({ target: { name: 'images', value: updatedImages } });
                      }}
                    >
                      ×
                    </Button>
                  </Box>
                ))}
              </Flex>
            </Box>
          )}
          {/* Add Tag Input */}
          <Input
            name="tags"
            placeholder="Enter Tags (comma-separated)"
            value={tags}
            onChange={handleTagChange}
            mb="10px"
            bg="white"
            color="black"
          />

        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleSubmit}
            bg="#F47D31"
            color="white"
            _hover={{ bg: '#0A0E23', color: '#F47D31', border: '2px solid #F47D31' }}
          >
            {editingProductId ? 'Update Product' : 'Add Product'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddProductModal;
