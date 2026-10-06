import { useInventory } from "../../hooks/useInventory";
import MenuPanel from "../MenuPanel/MenuPanel";
import styles from "./inventory.module.css"


export const Inventory: React.FC = () => {
  const { data: inventory = [], isLoading, isError, error } = useInventory();

    if (isLoading) return <div className={styles.loading}>Loading products...</div>;
  if (isError) return <div className={styles.error}>Error: {error.message}</div>;

return (
    <div className={styles.container}>
      <MenuPanel />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h2>Inventory</h2>
        </div>
        
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Purchased Quantity </th>
                <th>Sold Quantity</th>
                <th>netQuantity</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.productId}>
                  <td>{item.productId}</td>
                  <td>{item.productName}</td>
                  <td>{item.purchasedQuantity}</td>
                  <td>{item.soldQuantity}</td>
                  <td>{item.netQuantity}</td>
                </tr>
              ))}
              {inventory.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.noData}>No products found in Inventory.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
 </div>
  );

};