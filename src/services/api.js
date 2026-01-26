/**
 * API Service - Communication with Express backend
 * Base URL: Production API on Render
 */

const API_BASE = import.meta.env.VITE_API_URL || 'https://inventory-farmasi.onrender.com/api';

export const inventoryAPI = {
  /**
   * Get all items from inventory
   */
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE}/items`);
      if (!response.ok) throw new Error('Error fetching inventory');
      return await response.json();
    } catch (error) {
      console.error('getAll error:', error);
      throw error;
    }
  },

  /**
   * Create a new item in inventory
   */
  create: async (itemData) => {
    try {
      const response = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      if (!response.ok) throw new Error('Error creating item');
      return await response.json();
    } catch (error) {
      console.error('create error:', error);
      throw error;
    }
  },

  /**
   * Update an existing item
   */
  update: async (id, itemData) => {
    try {
      const response = await fetch(`${API_BASE}/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      if (!response.ok) throw new Error('Error updating item');
      return await response.json();
    } catch (error) {
      console.error('update error:', error);
      throw error;
    }
  },

  /**
   * Delete an item from inventory
   */
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE}/items/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error deleting item');
      return await response.json();
    } catch (error) {
      console.error('delete error:', error);
      throw error;
    }
  },
};
