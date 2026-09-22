import MenuPanel from '../MenuPanel/MenuPanel';
import styles from './PurchaseOrders.module.css';
import { formatBackendTimestamp } from '../../utility/DateConversionUtility';
import { usePurchaseOrders } from '../../hooks/usePurchaseOrder';

export const PurchaseOrders: React.FC = () => {
  const { data: orders = [], isLoading, isError, error } = usePurchaseOrders('DRAFT');

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
                <th>Order Id</th>
                <th>product Id </th>
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
                <tr key={order.productId}>
                  <td>{order.productId}</td>
                  <td>{order.productName}</td>
                  <td>{order.amount}</td>
                  <td>{order.quantity}</td>
                 
                  <td>{formatBackendTimestamp(order.createdDate)}</td>
                  {/* <td>
                    <button className={styles.editButton} onClick={() => handleEditClick(product)}>
                      Edit
                    </button>
                  </td> */}
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
    </div>
    );
}