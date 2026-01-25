/**
 * ItemForm Component - Form for adding/editing items
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
    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (formData.quantity === '' || formData.quantity < 0) {
      newErrors.quantity = 'Quantity must be a valid number';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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
        label="Product Name"
        name="name"
        type="text"
        placeholder="E.g: Keratin Shampoo"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <Input
        label="Quantity"
        name="quantity"
        type="number"
        placeholder="E.g: 25"
        value={formData.quantity}
        onChange={handleChange}
        error={errors.quantity}
        required
      />

      <div className="input-group">
        <label className="input-label">
          Description <span className="required">*</span>
        </label>
        <textarea
          name="description"
          placeholder="E.g: Natural tea tree soap for oil control"
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
          {loading ? 'Saving...' : item ? '✓ Update' : '➕ Add'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          ✕ Cancel
        </Button>
      </div>
    </form>
  );
};
