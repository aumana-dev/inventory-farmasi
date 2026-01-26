import PropTypes from 'prop-types';
import { useLanguage } from '../../contexts/LanguageContext';

const getCategoryClass = (category) => {
  const classes = {
    skincare: 'skincare',
    makeup: 'makeup',
    haircare: 'haircare',
    fragrance: 'fragrance',
    bodycare: 'bodycare',
    nutrition: 'nutrition',
  };
  return classes[category] || '';
};

const getCategoryLabel = (category, t) => {
  const icons = {
    skincare: '🧴',
    makeup: '💄',
    haircare: '💇‍♀️',
    fragrance: '🌸',
    bodycare: '🛁',
    nutrition: '💊',
  };
  const icon = icons[category] || '';
  const label = t(category) || category;
  return `${icon} ${label}`;
};

const getQuantityClass = (quantity) => {
  if (quantity === 0) return 'out-of-stock';
  if (quantity <= 5) return 'low-stock';
  return '';
};

function InventoryTable({ items, onEdit, onDelete }) {
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">💄</div>
        <h3>{t('noProductsFound')}</h3>
        <p>{t('noProductsDescription')}</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="inventory-table">
        <thead>
          <tr>
            <th>{t('product')}</th>
            <th>{t('category')}</th>
            <th>{t('stock')}</th>
            <th>{t('price')}</th>
            <th>{t('description')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <span className="product-name">{item.name}</span>
              </td>
              <td>
                <span className={`category-badge ${getCategoryClass(item.category)}`}>
                  {getCategoryLabel(item.category, t)}
                </span>
              </td>
              <td>
                <span className={`quantity-badge ${getQuantityClass(item.quantity)}`}>
                  {item.quantity} {t('units')}
                </span>
              </td>
              <td>
                <span className="price">${item.price?.toFixed(2) || '0.00'}</span>
              </td>
              <td>
                <span className="description">{item.description || '-'}</span>
              </td>
              <td>
                <div className="actions">
                  <button
                    className="btn-icon edit"
                    onClick={() => onEdit(item)}
                    title={t('edit')}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon delete"
                    onClick={() => onDelete(item.id)}
                    title={t('delete')}
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

InventoryTable.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string,
      quantity: PropTypes.number.isRequired,
      price: PropTypes.number,
      description: PropTypes.string,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default InventoryTable;
