import MenuPanel from "../MenuPanel/MenuPanel";
import styles from "./BuyersManagement.module.css";
import { useAddBuyer, useEditBuyer, useViewBuyers } from "../../hooks/useBuyer";
import type { BuyerDetails } from "../../types/buyer.types";
import { useState } from "react";


const initialAddFormState: BuyerDetails = {
  BuyerId: 0,
  BuyerName: '',
  mobileNumber: '',
  address: '',
  status: 'ACTIVE',
  createdDate: new Date().toISOString()
};

export const BuyersManagement: React.FC = () => {
    const {data: buyers = [], isLoading, isError, error} = useViewBuyers();
    const [newBuyer, setNewBuyer] = useState<BuyerDetails>(initialAddFormState);
      const [editingBuyer, setEditingBuyer] = useState<BuyerDetails | null>(null);
    

    const { mutate: addBuyer } = useAddBuyer();
    const {mutate: editBuyer} = useEditBuyer();

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);


   /* =========================================================================
       1. ADD FORM ACTION HANDLERS
       ========================================================================= */
    const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setNewBuyer((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleAddFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // 3. Wired up the useAddFarmer mutation call
      addBuyer(newBuyer, { 
        onSuccess: () => {
          setIsAddModalOpen(false);
          setNewBuyer(initialAddFormState); // Clear form fields
        } 
      });
    };
 /* =========================================================================
       1. EDIT FORM ACTION HANDLERS
       ========================================================================= */
 const handleEditClick = (buyer: BuyerDetails) => {
     setEditingBuyer({ ...buyer });
   };
 
   const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
     if (!editingBuyer) return;
     const { name, value } = e.target;
     setEditingBuyer({ ...editingBuyer, [name]: value });
   };
 
   const handleEditFormSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     if (!editingBuyer) return;
 
     if (window.confirm(`Are you sure you want to save modifications for "${editingBuyer.BuyerName}"?`)) {
       editBuyer(editingBuyer, {
         onSuccess: () => {
           setEditingBuyer(null); 
         }
       });
     }
   };

  

        return (
           <div className={styles.container}>
      <MenuPanel />
      <main className={styles.mainContent}>
         <div className={styles.header}>
          <h2>Buyers Management</h2>
          <button className={styles.addButton} onClick={() => setIsAddModalOpen(true)}>
            + Add New Buyer
          </button>
        </div> 
        
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Mobile Number</th>
                <th>Address</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((buyer) => (
                <tr key={buyer.BuyerId}>
                  <td>{buyer.BuyerId}</td>
                  <td>{buyer.BuyerName}</td>
                  <td>{buyer.mobileNumber}</td>
                  <td>{buyer.address}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${buyer.status === 'ACTIVE' ? styles.active : styles.inactive}`}>
                      {buyer.status}
                    </span>
                  </td>
                  <td>{new Date(buyer.createdDate).toLocaleDateString()}</td>
                    <td>
                    <button className={styles.editButton} onClick={() => handleEditClick(buyer)}>
                      Edit
                    </button>
                  </td>  
                </tr>
              ))}
              {buyers.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.noData}>No buyers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>   
      
      {/* =========================================================================
         ADD NEW FARMER MODAL PANEL
         ========================================================================= */}
      {isAddModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Add New Buyer</h3>
            <form onSubmit={handleAddFormSubmit}>
              <div className={styles.formGroup}>
                <label>Buyer Name</label>
                <input
                  type="text"
                  name="BuyerName"
                  value={newBuyer.BuyerName}
                  onChange={handleAddInputChange}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Mobile Number</label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={newBuyer.mobileNumber}
                  onChange={handleAddInputChange}
                  placeholder="Enter mobile number"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={newBuyer.address}
                  onChange={handleAddInputChange}
                  placeholder="Enter residential address"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Status</label>
                <select
                  name="status"
                  value={newBuyer.status}
                  onChange={handleAddInputChange}
                  className={styles.selectInput}
                >
                  <option value="ACTIVE">Active</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveButton}>
                  Create Buyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        {/* =========================================================================
         EDIT FARMER MODAL PANEL
         ========================================================================= */}
      {editingBuyer && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Edit Buyer Details</h3>
            <form onSubmit={handleEditFormSubmit}>
              <div className={styles.formGroup}>
                <label>Buyer Name</label>
                <input
                  type="text"
                  name="buyerName"
                  value={editingBuyer.BuyerName}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Mobile Number</label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={editingBuyer.mobileNumber}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={editingBuyer.address}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Status</label>
                <select
                  name="status"
                  value={editingBuyer.status}
                  onChange={handleEditInputChange}
                  className={styles.selectInput}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setEditingBuyer(null)}>
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
