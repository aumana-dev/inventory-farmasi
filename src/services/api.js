/**
 * API Service - Comunicación con backend Express
 * Base URL: http://localhost:5000/api
 */

const API_BASE = 'http://localhost:5000/api';

export const inventoryAPI = {
  /**
   * Obtiene todos los items del inventario
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
   * Crea un nuevo item en el inventario
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
   * Actualiza un item existente
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
   * Elimina un item del inventario
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
