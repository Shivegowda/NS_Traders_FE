import React, { useState } from 'react';
// 1. Import both edit and add custom hooks
import { useFarmers, useEditFarmers, useAddFarmer } from '../../hooks/useFarmer'; 
import type { ViewFarmer, AddFarmerPayload } from '../../types/farmer.types';
import styles from './FarmersManagement.module.css';
import MenuPanel from '../MenuPanel/MenuPanel';



const initialAddFormState: AddFarmerPayload = {
  farmerName: '',
  mobileNumber: '',
  address: '',
  status: 'ACTIVE',
};

export const FarmersManagement: React.FC = () => {
  const { data: farmers = [], isLoading, isError, error } = useFarmers();
  const { mutate: editFarmer } = useEditFarmers();
  // 2. Consume your existing add hook mutation
  const { mutate: addFarmer } = useAddFarmer(); 

  // Modals UI and Input states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newFarmer, setNewFarmer] = useState<AddFarmerPayload>(initialAddFormState);
  const [editingFarmer, setEditingFarmer] = useState<ViewFarmer | null>(null);

  /* =========================================================================
     1. ADD FORM ACTION HANDLERS
     ========================================================================= */
  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewFarmer((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 3. Wired up the useAddFarmer mutation call
    addFarmer(newFarmer, { 
      onSuccess: () => {
        setIsAddModalOpen(false);
        setNewFarmer(initialAddFormState); // Clear form fields
      } 
    });
  };

  /* =========================================================================
     2. EDIT FORM ACTION HANDLERS
     ========================================================================= */
  const handleEditClick = (farmer: ViewFarmer) => {
    setEditingFarmer({ ...farmer });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingFarmer) return;
    const { name, value } = e.target;
    setEditingFarmer({ ...editingFarmer, [name]: value });
  };

  const handleEditFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFarmer) return;

    if (window.confirm(`Are you sure you want to save modifications for "${editingFarmer.farmerName}"?`)) {
      editFarmer(editingFarmer, {
        onSuccess: () => {
          setEditingFarmer(null); 
        }
      });
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading farmers...</div>;
  if (isError) return <div className={styles.error}>Error: {error.message}</div>;

  return (
    <div className={styles.container}>
      <MenuPanel />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h2>Farmers Management</h2>
          <button className={styles.addButton} onClick={() => setIsAddModalOpen(true)}>
            + Add New Farmer
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
              {farmers.map((farmer) => (
                <tr key={farmer.farmerId}>
                  <td>{farmer.farmerId}</td>
                  <td>{farmer.farmerName}</td>
                  <td>{farmer.mobileNumber}</td>
                  <td>{farmer.address}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${farmer.status === 'ACTIVE' ? styles.active : styles.inactive}`}>
                      {farmer.status}
                    </span>
                  </td>
                  <td>{new Date(farmer.createdDate).toLocaleDateString()}</td>
                  <td>
                    <button className={styles.editButton} onClick={() => handleEditClick(farmer)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {farmers.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.noData}>No farmers found.</td>
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
            <h3>Add New Farmer</h3>
            <form onSubmit={handleAddFormSubmit}>
              <div className={styles.formGroup}>
                <label>Farmer Name</label>
                <input
                  type="text"
                  name="farmerName"
                  value={newFarmer.farmerName}
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
                  value={newFarmer.mobileNumber}
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
                  value={newFarmer.address}
                  onChange={handleAddInputChange}
                  placeholder="Enter residential address"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Status</label>
                <select
                  name="status"
                  value={newFarmer.status}
                  onChange={handleAddInputChange}
                  className={styles.selectInput}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.saveButton}>
                  Create Farmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         EDIT FARMER MODAL PANEL
         ========================================================================= */}
      {editingFarmer && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Edit Farmer Details</h3>
            <form onSubmit={handleEditFormSubmit}>
              <div className={styles.formGroup}>
                <label>Farmer Name</label>
                <input
                  type="text"
                  name="farmerName"
                  value={editingFarmer.farmerName}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Mobile Number</label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={editingFarmer.mobileNumber}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={editingFarmer.address}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Status</label>
                <select
                  name="status"
                  value={editingFarmer.status}
                  onChange={handleEditInputChange}
                  className={styles.selectInput}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setEditingFarmer(null)}>
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
};
