

export const SalesOrders: React.FC = () => {
      const { data: orders = [], isLoading, isError, error } = useSalesOrders('DRAFT');


       return (
            <div className={styles.container}>
      <MenuPanel />
            <main className={styles.mainContent}>
        <div className={styles.header}>
          <h2>Sales Draft Orders</h2>
          {/* <button className={styles.viewButton} onClick={() => setIsViewModalOpen(true)}>
          View Submitted Orders
          </button> 
           <button className={styles.addButton} onClick={() => setIsAddModalOpen(true)}>
            + Add New Product
          </button>  */}
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
                   {/* <td>
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
                  </td>  */}
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