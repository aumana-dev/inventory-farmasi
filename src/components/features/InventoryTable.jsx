/**
 * Componente InventoryTable - Tabla del inventario con acciones
 */
import { Button } from '../ui/Button';

export const InventoryTable = ({ items, onEdit, onDelete, loading }) => {
  if (loading) {
    return <div className="loading">Cargando inventario...</div>;
  }

  if (items.length === 0) {
    return <div className="empty-state">No hay items en el inventario</div>;
  }

  return (
    <div className="table-container">
      <table className="inventory-table">
        <thead>
          <tr>
            <th>#ID</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="table-row">
              <td className="cell-id">{item.id}</td>
              <td className="cell-name">{item.name}</td>
              <td className="cell-quantity">
                <span className={`quantity ${item.quantity === 0 ? 'critical' : ''}`}>
                  {item.quantity}
                </span>
              </td>
              <td className="cell-description">{item.description}</td>
              <td className="cell-actions">
                <Button
                  variant="secondary"
                  onClick={() => onEdit(item)}
                  className="btn-sm"
                >
                  ✏️ Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => onDelete(item.id)}
                  className="btn-sm"
                >
                  🗑️ Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
