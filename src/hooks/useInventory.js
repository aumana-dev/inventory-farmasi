/**
 * Custom Hook: useInventory
 * Manages all inventory logic
 */

import { useState, useEffect, useCallback } from 'react';
import { inventoryAPI } from '../services/api';

export const useInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load all items from inventory
   */
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await inventoryAPI.getAll();
      setItems(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading inventory:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add a new item
   */
  const addItem = useCallback(async (itemData) => {
    try {
      const newItem = await inventoryAPI.create(itemData);
      setItems((prevItems) => [...prevItems, newItem]);
      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Update an existing item
   */
  const updateItem = useCallback(async (id, itemData) => {
    try {
      const updatedItem = await inventoryAPI.update(id, itemData);
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? updatedItem : item))
      );
      return updatedItem;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Delete an item from inventory
   */
  const deleteItem = useCallback(async (id) => {
    try {
      await inventoryAPI.delete(id);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Load items when component mounts
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
  };
};
