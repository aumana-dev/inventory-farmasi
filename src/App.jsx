/**
 * App.jsx - Main component
 * Farmasi Beauty Inventory - Distributor Management App
 */
import { useState, useMemo } from 'react';
import { useInventory } from './hooks/useInventory';
import InventoryTable from './components/features/InventoryTable';
import ItemForm from './components/features/ItemForm';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { useLanguage } from './contexts/LanguageContext';
import './App.css';

function App() {
  const { items, loading, error, addItem, updateItem, deleteItem } = useInventory();
  const { language, toggleLanguage, t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Product categories for Farmasi
  const CATEGORIES = [
    { id: 'all', label: t('all'), icon: '✨' },
    { id: 'skincare', label: t('skincare'), icon: '🧴' },
    { id: 'makeup', label: t('makeup'), icon: '💄' },
    { id: 'haircare', label: t('haircare'), icon: '💇‍♀️' },
    { id: 'fragrance', label: t('fragrance'), icon: '🌸' },
    { id: 'bodycare', label: t('bodycare'), icon: '🛁' },
    { id: 'nutrition', label: t('nutrition'), icon: '💊' },
  ];

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, selectedCategory]);

  // Calculate dashboard statistics
  const stats = useMemo(() => {
    const totalProducts = items.length;
    const lowStockItems = items.filter(item => item.quantity > 0 && item.quantity <= 5).length;
    const outOfStockItems = items.filter(item => item.quantity === 0).length;
    const categories = [...new Set(items.map(item => item.category))].length;
    const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
      totalProducts,
      lowStockItems: lowStockItems + outOfStockItems,
      categories,
      totalValue
    };
  }, [items]);

  const handleOpenModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmitForm = async (formData) => {
    setSubmitLoading(true);
    try {
      if (editingItem) {
        await updateItem(editingItem.id, formData);
      } else {
        await addItem(formData);
      }
      handleCloseModal();
    } catch (err) {
      console.error('Form error:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteItem(id);
      } catch (err) {
        console.error('Error deleting item:', err);
      }
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand">
            <div className="header-logo">✨</div>
            <div>
              <h1 className="app-title">{t('title')}</h1>
              <p className="app-subtitle">{t('subtitle')}</p>
            </div>
          </div>
          <div className="header-user">
            <button
              className="language-toggle"
              onClick={toggleLanguage}
              title="Change language / Cambiar idioma"
            >
              {language === 'en' ? '🇪🇸 ES' : '🇬🇧 EN'}
            </button>
            <div className="user-avatar">👩‍💼</div>
            <span className="user-name">Distributor</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="container">
          {/* Error Message */}
          {error && (
            <div className="alert alert-error">
              ⚠️ Error: {error}
            </div>
          )}

          {/* Dashboard Stats */}
          <div className="dashboard-stats">
            <div className="stat-card products">
              <div className="stat-icon">📦</div>
              <div className="stat-value">{stats.totalProducts}</div>
              <div className="stat-label">{t('totalProducts')}</div>
            </div>
            <div className="stat-card low-stock">
              <div className="stat-icon">⚠️</div>
              <div className="stat-value">{stats.lowStockItems}</div>
              <div className="stat-label">{t('lowStock')}</div>
            </div>
            <div className="stat-card categories">
              <div className="stat-icon">🏷️</div>
              <div className="stat-value">{stats.categories}</div>
              <div className="stat-label">{t('categories')}</div>
            </div>
            <div className="stat-card value">
              <div className="stat-icon">💰</div>
              <div className="stat-value">${stats.totalValue.toLocaleString()}</div>
              <div className="stat-label">{t('inventoryValue')}</div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="toolbar">
            <div className="toolbar-left">
              <div className="toolbar-info">
                <span className="item-count">
                  Showing <strong>{filteredItems.length}</strong> of <strong>{items.length}</strong> products
                </span>
              </div>
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-buttons">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <Button
              variant="primary"
              onClick={handleOpenModal}
              disabled={loading}
            >
              ➕ {t('addProduct')}
            </Button>
          </div>

          {/* Inventory Table */}
          <InventoryTable
            items={filteredItems}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            loading={loading}
          />
        </div>
      </main>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        title={editingItem ? `✏️ ${t('edit')}` : `✨ ${t('addProduct')}`}
        onClose={handleCloseModal}
      >
        <ItemForm
          item={editingItem}
          onSubmit={handleSubmitForm}
          onCancel={handleCloseModal}
          loading={submitLoading}
          categories={CATEGORIES.filter(c => c.id !== 'all')}
        />
      </Modal>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2026 Farmasi Inventory | Made with 💕 for Beauty Distributors</p>
      </footer>
    </div>
  );
}

export default App;
