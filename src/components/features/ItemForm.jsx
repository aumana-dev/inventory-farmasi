import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLanguage } from '../../contexts/LanguageContext';

function ItemForm({ item, onSave, onCancel }) {
  const { t } = useLanguage();

  const CATEGORIES = [
    { value: 'skincare', label: `🧴 ${t('skincare')}` },
    { value: 'makeup', label: `💄 ${t('makeup')}` },
    { value: 'haircare', label: `💇‍♀️ ${t('haircare')}` },
    { value: 'fragrance', label: `🌸 ${t('fragrance')}` },
    { value: 'bodycare', label: `🛁 ${t('bodycare')}` },
    { value: 'nutrition', label: `💊 ${t('nutrition')}` },
  ];
  const [formData, setFormData] = useState({
    name: '',
    category: 'skincare',
    quantity: 0,
    price: 0,
    description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || 'skincare',
        quantity: item.quantity || 0,
        price: item.price || 0,
        description: item.description || '',
      });
    }
  }, [item]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('nameRequired');
    }

    if (formData.quantity < 0) {
      newErrors.quantity = t('quantityInvalid');
    }

    if (formData.price < 0) {
      newErrors.price = t('priceInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const dataToSave = {
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
    };

    if (item?.id) {
      dataToSave.id = item.id;
    }

    onSave(dataToSave);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));

    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="item-form">
      <div className="form-group">
        <label htmlFor="name">{t('productName')} *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t('productNamePlaceholder')}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">{t('categoryLabel')}</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">{t('stockQuantity')} *</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
            className={errors.quantity ? 'error' : ''}
          />
          {errors.quantity && <span className="error-message">{errors.quantity}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="price">{t('priceLabel')}</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="0.01"
          placeholder={t('pricePlaceholder')}
          className={errors.price ? 'error' : ''}
        />
        {errors.price && <span className="error-message">{errors.price}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">{t('descriptionLabel')}</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder={t('descriptionPlaceholder')}
          rows="3"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          {t('cancel')}
        </button>
        <button type="submit" className="btn btn-primary">
          {item?.id ? t('updateProduct') : t('addProduct')}
        </button>
      </div>
    </form>
  );
}

ItemForm.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    category: PropTypes.string,
    quantity: PropTypes.number,
    price: PropTypes.number,
    description: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

ItemForm.defaultProps = {
  item: null,
};

export default ItemForm;
