/**
 * Componente ItemForm - Formulario para agregar/editar items
 */
import { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const ItemForm = ({ item, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        quantity: item.quantity || '',
        description: item.description || '',
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error al escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (formData.quantity === '' || formData.quantity < 0) {
      newErrors.quantity = 'La cantidad debe ser un número válido';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        quantity: parseInt(formData.quantity, 10),
      });
    }
  };

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <Input
        label="Nombre del Producto"
        name="name"
        type="text"
        placeholder="Ej: Shampoo Keratina"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <Input
        label="Cantidad"
        name="quantity"
        type="number"
        placeholder="Ej: 25"
        value={formData.quantity}
        onChange={handleChange}
        error={errors.quantity}
        required
      />

      <div className="input-group">
        <label className="input-label">
          Descripción <span className="required">*</span>
        </label>
        <textarea
          name="description"
          placeholder="Ej: Jabón natural de tea tree para control de grasa"
          value={formData.description}
          onChange={handleChange}
          className={`textarea-field ${errors.description ? 'input-error' : ''}`}
          rows="4"
          required
        />
        {errors.description && (
          <span className="error-message">{errors.description}</span>
        )}
      </div>

      <div className="form-actions">
        <Button
          type="submit"
          variant="success"
          disabled={loading}
        >
          {loading ? 'Guardando...' : item ? '✓ Actualizar' : '➕ Agregar'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          ✕ Cancelar
        </Button>
      </div>
    </form>
  );
};
