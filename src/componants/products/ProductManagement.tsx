import React, { useState } from 'react';
// 1. Import both edit and add custom hooks
import styles from './ProductManagement.module.css';
import MenuPanel from '../MenuPanel/MenuPanel';
import type { ViewProduct, AddProductPayload } from '../../types/product.types';
import { useProducts, useEditProduct, useAddProduct, useMarkActiveInactiveProduct } from '../../hooks/useProduct';
import { formatBackendTimestamp } from '../../utility/DateConversionUtility';



const initialAddFormState: AddProductPayload = {
  productName: '',
  productDescription: '',
  productRate: 0,
  productStatus: 'ACTIVE',
};

export const ProductManagement: React.FC = () => {
  const { data: products = [], isLoading, isError, error } = useProducts();
  const { mutate: editProduct } = useEditProduct();
  // 2. Consume your existing add hook mutation
  const { mutate: addProduct } = useAddProduct();
   const { mutate: markActiveInactiveProduct } = useMarkActiveInactiveProduct();

  // Modals UI and Input states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState<AddProductPayload>(initialAddFormState);
  const [editingProduct, setEditingProduct] = useState<ViewProduct | null>(null);
  const [isMarkModalOpen, setIsMarkModalOpen] = useState<ViewProduct | null>(null);
 

  /* =========================================================================
     1. ADD FORM ACTION HANDLERS
     ========================================================================= */
  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 3. Wired up the useAddFarmer mutation call
    addProduct(newProduct, { 
      onSuccess: () => {
        setIsAddModalOpen(false);
        setNewProduct(initialAddFormState); // Clear form fields
      } 
    });
  };

  /* =========================================================================
     2. EDIT FORM ACTION HANDLERS
     ========================================================================= */
  const handleEditClick = (product: ViewProduct) => {
    setEditingProduct({ ...product });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingProduct) return;
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  const handleEditFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (window.confirm(`Are you sure you want to save modifications for "${editingProduct.productName}"?`)) {
      editProduct(editingProduct, {
        onSuccess: () => {
          setEditingProduct(null); 
        }
      });
    }
  };

  /* =========================================================================
     2. MARK ACTIVE/INACTIVE FORM ACTION HANDLERS
     ========================================================================= */
  const handleMarkClick = (product: ViewProduct) => {
    setIsMarkModalOpen({ ...product });
  };

  const handleMarkInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!isMarkModalOpen) return;
    const { name, value } = e.target;
    setIsMarkModalOpen({ ...isMarkModalOpen, [name]: value });
  };

  const handleMarkFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMarkModalOpen) return;

    if (window.confirm(`Are you sure you want to save modifications for "${isMarkModalOpen.productName}"?`)) {
      markActiveInactiveProduct(isMarkModalOpen, {
        onSuccess: () => {
          setIsMarkModalOpen(null); 
        }
      });
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading products...</div>;
  if (isError) return <div className={styles.error}>Error: {error.message}</div>;

  return (
    <div className={styles.container}>
      <MenuPanel />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h2>Products Management</h2>
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
                <th>Product Description</th>
                <th>Product Rate</th>
                <th>Product Status</th>
                <th>Created Date</th>
                <th>Actions</th>
                <th>Mark Active/Inactive</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.productId}>
                  <td>{product.productId}</td>
                  <td>{product.productName}</td>
                  <td>{product.productDescription}</td>
                  <td>{product.productRate}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${product.productStatus === 'ACTIVE' ? styles.active : styles.inactive}`}>
                      {product.productStatus}
                    </span>
                  </td>
                  <td>{formatBackendTimestamp(product.rateChangeDate)}</td>
                  <td>
                    <button className={styles.editButton} onClick={() => handleEditClick(product)}>
                      Edit
                    </button>
                  </td>
                   <td>
                    <button className={styles.editButton} onClick={() => handleMarkClick(product)}>
                      Mark
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.noData}>No products found.</td>
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
            <h3>Add New Product</h3>
            <form onSubmit={handleAddFormSubmit}>
              <div className={styles.formGroup}>
                <label>Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={newProduct.productName}
                  onChange={handleAddInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Product Description</label>
                <input
                  type="text"
                  name="productDescription"
                  value={newProduct.productDescription}
                  onChange={handleAddInputChange}
                  placeholder="Enter product description"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Product Rate</label>
                <input
                  type="number"
                  name="productRate"
                  value={newProduct.productRate}
                  onChange={handleAddInputChange}
                  placeholder="Enter product rate"
                  required
                />
              </div>
        
              <div className={styles.formGroup}>
                <label>Product Status</label>
                <select
                  name="productStatus"
                  value={newProduct.productStatus}
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
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         EDIT FARMER MODAL PANEL
         ========================================================================= */}
      {editingProduct && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Edit Product Details</h3>
            <form onSubmit={handleEditFormSubmit}>
              <div className={styles.formGroup}>
                <label>Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={editingProduct.productName}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Product Description</label>
                <input
                  type="text"
                  name="productDescription"
                  value={editingProduct.productDescription}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Product Rate</label>
                <input
                  type="text"
                  name="productRate"
                  value={editingProduct.productRate}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setEditingProduct(null)}>
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

       {/* =========================================================================
         Mark Active/Inactive Product MODAL PANEL
         ========================================================================= */}
      {isMarkModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Mark Product as Active/Inactive</h3>
            <form onSubmit={handleMarkFormSubmit}>
                 <div className={styles.formGroup}>
                <label>Product Name</label>
                <label> {isMarkModalOpen.productName}</label>
              </div>
              <div className={styles.formGroup}>
                <label>Product Rate</label>
                <input
                  type="text"
                  name="productRate"
                  value={isMarkModalOpen.productRate}
                  onChange={handleMarkInputChange}
                  required
                />
              </div>
               <div className={styles.formGroup}>
                <label>Product Status</label>
                <select
                  name="productStatus"
                  value={isMarkModalOpen.productStatus}
                  onChange={handleMarkInputChange}
                  className={styles.selectInput}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setIsMarkModalOpen(null)}>
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
