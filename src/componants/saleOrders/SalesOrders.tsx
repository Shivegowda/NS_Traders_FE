import { useState } from "react";
import { useAddDraftOrder, useBuyerListDropDown, useSalesOrders } from "../../hooks/useSalesOrders";
import type { NewOrderPayload } from "../../types/salesOrders.types";
import { formatBackendTimestamp } from "../../utility/DateConversionUtility";
import MenuPanel from "../MenuPanel/MenuPanel";
import styles from "../saleOrders/SalesOrders.module.css"
import { useProductListDropDown } from "../../hooks/usePurchaseOrder";
import { Check, Delete, Pencil } from "lucide-react";


const initialAddFormState: NewOrderPayload = {
                "amount": 0,
                "orderedBy": 0,
                "orderedByName": '',
                "productId": 0,
                "productName":'',
                "quantity": 1,
                "rate": 0,
};

export const SalesOrders: React.FC = () => {
      const { data: orders = [], isLoading, isError, error } = useSalesOrders('DRAFT');


          const { mutate: addDraftOrder } = useAddDraftOrder();
      

            const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
            const [newDraftOrder, setNewDraftOrder] = useState<NewOrderPayload>(initialAddFormState);
          
              const {data: productList = [], isLoading: isProductListLoading } = useProductListDropDown(isAddModalOpen);
              const {data: buyerList = [], isLoading: isBuyerListLoading } = useBuyerListDropDown(isAddModalOpen);
            

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


       return (
            <div className={styles.container}>
      <MenuPanel />
            <main className={styles.mainContent}>
        <div className={styles.header}>
          <h2>Sales Draft Orders</h2>
          {/* <button className={styles.viewButton} onClick={() => setIsViewModalOpen(true)}>
          View Submitted Orders
          </button>  */}
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
                <th>Edit</th>
                <th>Delete</th>
                <th>Submit</th>

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
                      <Pencil size={16} className={styles.editIcon} />
                    </button>
                  </td> 
                   <td>
                    <button className={styles.deleteButton} onClick={() => handleDeleteClick(order)}>
                      <Delete size={16} className={styles.deleteIcon} />
                    </button>
                  </td> 
                   <td>
                    <button className={styles.submitButton} onClick={() => handleSubmitClick(order)}>
                      <Check size={16} className={styles.submitIcon} />
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
                <label>Select Buyer</label>
                <select name="buyerId">
            
                  <option value="">Select a Buyer</option>
                  {buyerList.map((buyer) => (
                    <option key={buyer.value} value={buyer.value}>
                      {buyer.label}
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

      </div>
       );
}