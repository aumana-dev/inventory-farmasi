/**
 * Multi-user Authentication & Inventory System using localStorage
 */

const SEED_VERSION = 'v1-multiuser';

// Storage helpers
const storage = {
  get: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
  set: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
  getArray: (key) => JSON.parse(localStorage.getItem(key) || '[]'),
  getCurrentUser: () => storage.get('currentUser'),
  setCurrentUser: (user) => storage.set('currentUser', user),
  logout: () => {
    localStorage.removeItem('currentUser');
  }
};

// Initialize users storage
if (!storage.getArray('users').length) {
  storage.set('users', []);
  storage.set('storage_version', SEED_VERSION);
}

// Auth API
export const authAPI = {
  login: async (username, password) => {
    const users = storage.getArray('users');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      storage.setCurrentUser({ username: user.username, id: user.id });
      return { success: true, user: { username: user.username, id: user.id } };
    }
    return { success: false, message: 'Usuario o contraseña incorrecta' };
  },

  register: async (username, password) => {
    const users = storage.getArray('users');
    
    if (users.find(u => u.username === username)) {
      return { success: false, message: 'El usuario ya existe' };
    }

    const newUser = {
      id: Date.now(),
      username,
      password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    storage.set('users', users);
    storage.setCurrentUser({ username: newUser.username, id: newUser.id });

    // Initialize empty inventory for new user
    storage.set(`inventory_${newUser.id}`, []);

    return { success: true, user: { username: newUser.username, id: newUser.id } };
  },

  getCurrentUser: () => {
    return storage.getCurrentUser();
  },

  logout: () => {
    storage.logout();
  }
};

// Inventory API - per user
export const inventoryAPI = {
  getAll: async () => {
    const user = storage.getCurrentUser();
    if (!user) throw new Error('No user logged in');
    return storage.getArray(`inventory_${user.id}`);
  },

  create: async (itemData) => {
    const user = storage.getCurrentUser();
    if (!user) throw new Error('No user logged in');
    
    const items = storage.getArray(`inventory_${user.id}`);
    const newItem = {
      ...itemData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    items.push(newItem);
    storage.set(`inventory_${user.id}`, items);
    return newItem;
  },

  update: async (id, itemData) => {
    const user = storage.getCurrentUser();
    if (!user) throw new Error('No user logged in');
    
    const items = storage.getArray(`inventory_${user.id}`);
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) throw new Error('Item not found');
    
    items[index] = {
      ...items[index],
      ...itemData,
      updatedAt: new Date().toISOString()
    };
    
    storage.set(`inventory_${user.id}`, items);
    return items[index];
  },

  delete: async (id) => {
    const user = storage.getCurrentUser();
    if (!user) throw new Error('No user logged in');
    
    const items = storage.getArray(`inventory_${user.id}`);
    const filtered = items.filter(item => item.id !== id);
    storage.set(`inventory_${user.id}`, filtered);
  }
};
