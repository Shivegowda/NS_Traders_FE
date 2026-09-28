import MenuPanel from '../MenuPanel/MenuPanel';
import styles from './PurchaseOrders.module.css';
import { formatBackendTimestamp } from '../../utility/DateConversionUtility';
import { usePurchaseOrders, useEditPurchaseOrder, useAddDraftOrder, useProductListDropDown, useFarmerListDropDown, useDeleteDraftOrder } from '../../hooks/usePurchaseOrder';
import type { NewOrderPayload, PurchaseOrder } from '../../types/purchaseOrder.types';
import { useState } from 'react';

const initialAddFormState: NewOrderPayload = {
                "amount": 0,
                "orderedBy": 0,
                "orderedByName": '',
                "productId": 0,
                "productName":'',
                "quantity": 1,
                "rate": 0,
};


export const PurchaseOrders: React.FC = () => {
  const { data: orders = [], isLoading, isError, error } = usePurchaseOrders('DRAFT');
    const { mutate: editPurchaseOrder } = useEditPurchaseOrder();
    const { mutate: addDraftOrder } = useAddDraftOrder();
    const { mutate: deleteDraftOrder } = useDeleteDraftOrder();
    


  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newDraftOrder, setNewDraftOrder] = useState<NewOrderPayload>(initialAddFormState);
  const [editingPurchaseOrder, setEditingPurchaseOrder] = useState<PurchaseOrder | null>(null);

    const {data: productList = [], isLoading: isProductListLoading } = useProductListDropDown(isAddModalOpen);
    const {data: farmerList = [], isLoading: isFarmerListLoading } = useFarmerListDropDown(isAddModalOpen);

     /* =========================================================================
         1. ADD FORM ACTION HANDLERS
         ========================================================================= */
      const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewDraftOrder(prev => {
          const updatedOrder = { ...prev, [name]: value };
          if (name === 'quantity' || name === 'rate') {
            const newQuantity = Number(updatedOrder.quantity) || 1;
            const newRate = Number(updatedOrder.rate) || 1;
            console.log('New Quantity:', newQuantity, 'New Rate:', newRate);
            updatedOrder.amount = newQuantity * newRate;
          }
          return updatedOrder;
        });
      };
    
      const handleAddSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log('Select Change:', name, value);
        const selectedProduct = productList.find(p => p.productId === Number(value));
        console.log('Selected Product:', selectedProduct);
          setNewDraftOrder(prev => {
        return { ...prev, 
           productName: selectedProduct ? selectedProduct.productName : '', 
           rate: selectedProduct ? selectedProduct.productRate : 1,
           amount: selectedProduct ? selectedProduct.productRate * prev.quantity : 0};
                });
      };

      const handleAddFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // 3. Wired up the useAddFarmer mutation call
        addDraftOrder(newDraftOrder, { 
          onSuccess: () => {
            setIsAddModalOpen(false);
            setNewDraftOrder(initialAddFormState); // Clear form fields
          } 
        });
      };

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

  
     /* =========================================================================
     3. DELETE FORM ACTION HANDLERS
     ========================================================================= */
  const handleDeleteClick = (order: PurchaseOrder) => {
    if (window.confirm(`Are you sure you want to Delete Draft order for ${order.productName}?`)) {
     deleteDraftOrder(order.orderId, {
        onSuccess: () => {
            alert('Draft order deleted successfully');
     },
      });
    
  };
};



 return (
    <div className={styles.container}>
      <MenuPanel />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h2>Purchase Draft Orders</h2>
           <button className={styles.addButton} onClick={() => setIsAddModalOpen(true)}>
            + Add New Product
          </button> 
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
                   <td>
                    <button className={styles.deleteButton} onClick={() => handleDeleteClick(order)}>
                      Delete
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

       {/* =========================================================================
         ADD NEW FARMER MODAL PANEL
         ========================================================================= */}
         {(isAddModalOpen &&  
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Create New Draft Order</h3>
            <form onSubmit={handleAddFormSubmit}>
              <div className={styles.formGroup}>
                <label>Select Product</label>
                <select name="productId" onChange={handleAddSelectChange}>
              
                  <option value="">Select a product</option>
                  {productList.map((product) => (
                    <option key={product.productId} value={product.productId}>
                      {product.productName} - Rate: {product.productRate}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Select Farmer</label>
                <select name="farmerId">
            
                  <option value="">Select a Farmer</option>
                  {farmerList.map((farmer) => (
                    <option key={farmer.value} value={farmer.value}>
                      {farmer.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Product Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={newDraftOrder.quantity}
                  onChange={handleAddInputChange}
                  placeholder="Enter product quantity"
                  min="1"
                  required
                />
              </div>
               <div className={styles.formGroup}>
                <label>Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={newDraftOrder.amount}
                  onChange={handleAddInputChange}
                  readOnly
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveButton}>
                  Create Draft Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
              
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