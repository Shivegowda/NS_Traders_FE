import MenuPanel from '../MenuPanel/MenuPanel';
import styles from './PurchaseOrders.module.css';
import { formatBackendTimestamp } from '../../utility/DateConversionUtility';
import { usePurchaseOrders, useEditPurchaseOrder } from '../../hooks/usePurchaseOrder';
import type { PurchaseOrder } from '../../types/purchaseOrder.types';
import { useState } from 'react';

export const PurchaseOrders: React.FC = () => {
  const { data: orders = [], isLoading, isError, error } = usePurchaseOrders('DRAFT');
    const { mutate: editPurchaseOrder } = useEditPurchaseOrder();

    const [editingPurchaseOrder, setEditingPurchaseOrder] = useState<PurchaseOrder | null>(null);
  

  /* =========================================================================
     2. EDIT FORM ACTION HANDLERS
     ========================================================================= */
  const handleEditClick = (order: PurchaseOrder) => {
    setEditingPurchaseOrder({ ...order });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingPurchaseOrder) return;
    const { name, value } = e.target;
    const updatedOrder = { ...editingPurchaseOrder, [name]: value};
    if (name === 'quantity' ) {
      const newQuantity = Number(value) || 0;
      const currentRate = Number(updatedOrder.rate) || 0;
      updatedOrder.amount = newQuantity * currentRate;
     }
    setEditingPurchaseOrder(updatedOrder);
  };

  const handleEditFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPurchaseOrder) return;

    if (window.confirm(`Are you sure you want to save modifications for "${editingPurchaseOrder.productName}"?`)) {
      editPurchaseOrder(editingPurchaseOrder, {
        onSuccess: () => {
          setEditingPurchaseOrder(null); 
        }
      });
    }
  };



 return (
    <div className={styles.container}>
      <MenuPanel />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h2>Purchase Draft Orders</h2>
          {/* <button className={styles.addButton} onClick={() => setIsAddModalOpen(true)}>
            + Add New Product
          </button> */}
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Product Rate</th>
                <th>Product Quantity</th>
                <th>Amount</th>
                <th>Ordered By</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.productName}</td>
                  <td>{order.rate} </td>
                  <td>{order.quantity}</td>
                  <td>{order.amount}</td>
                  <td>{order.orderedByName}</td>
                  <td>{formatBackendTimestamp(order.createdDate)}</td>
                   <td>
                    <button className={styles.editButton} onClick={() => handleEditClick(order)}>
                      Edit
                    </button>
                  </td> 
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.noData}>No Draft orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
              
        {editingPurchaseOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Edit Purchase Order Details</h3>
            <form onSubmit={handleEditFormSubmit}>
              <div className={styles.formGroup}>
                <label>Product Name</label>
                <label>{editingPurchaseOrder.productName}</label>
              </div>
              <div className={styles.formGroup}>
                <label>Product Rate</label>
                <label>{editingPurchaseOrder.rate}</label>
              </div>
              <div className={styles.formGroup}>
                <label>Product quantity</label>
                <input
                  type="text"
                  name="quantity"
                  value={editingPurchaseOrder.quantity}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
             <div className={styles.formGroup}>
                <label>Amount</label>
                 <input
                  type="text"
                  name="amount"
                  value={editingPurchaseOrder.quantity * editingPurchaseOrder.rate}
                  onChange={handleEditInputChange}
                  readOnly
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setEditingPurchaseOrder(null)}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveButton}>
                  Confirm & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
    );

  
}