/**
 * App.jsx - Componente principal
 * Administrador de inventario de Farmacéutica
 */
import { useState } from 'react';
import { useInventory } from './hooks/useInventory';
import { InventoryTable } from './components/features/InventoryTable';
import { ItemForm } from './components/features/ItemForm';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import './App.css';

function App() {
  const { items, loading, error, addItem, updateItem, deleteItem } = useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

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
      console.error('Error en formulario:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este item?')) {
      try {
        await deleteItem(id);
      } catch (err) {
        console.error('Error al eliminar:', err);
      }
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">💊 Farmacéutica Inventario</h1>
          <p className="app-subtitle">Sistema de Gestión de Inventario</p>
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

          {/* Toolbar */}
          <div className="toolbar">
            <div className="toolbar-info">
              <span className="item-count">
                Total de items: <strong>{items.length}</strong>
              </span>
            </div>
            <Button
              variant="success"
              onClick={handleOpenModal}
              disabled={loading}
            >
              ➕ Nuevo Item
            </Button>
          </div>

          {/* Inventory Table */}
          <InventoryTable
            items={items}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            loading={loading}
          />
        </div>
      </main>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        title={editingItem ? 'Editar Item' : 'Nuevo Item'}
        onClose={handleCloseModal}
      >
        <ItemForm
          item={editingItem}
          onSubmit={handleSubmitForm}
          onCancel={handleCloseModal}
          loading={submitLoading}
        />
      </Modal>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2026 Farmacéutica Inventario | v1.0.0</p>
      </footer>
    </div>
  );
}

export default App;
