// src/components/inventory/AddProductModal.js
import React from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  Input, Select, Button
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
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageUpload(e.target.files)}
            mb="10px"
            bg="white"
            color="black"
            sx={{
              paddingTop: "4px"
            }}
          />
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
