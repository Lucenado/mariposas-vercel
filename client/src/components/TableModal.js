import React from 'react'
import './TableModal.css'

function TableModal({ setTableModalOpen, edit, confirmEdit, deleteRow }) {
  
  const handleConfirmEdit = () => {
    confirmEdit();
    setTableModalOpen();
  }

  const handleConfirmDelete = () => {
    deleteRow();
    setTableModalOpen();
  }
  
  return (
    <div className='table-modal-background'>
      <div className='table-modal-container'>
        <div className='table-modal-header'>{edit ? "Confirm the changes?" : "Delete selected collection?"}</div>
        <div className='table-modal-actions'>
            <span className='modal-cancel-btn' onClick={setTableModalOpen}>
                <i className="fa-solid fa-lg fa-xmark"></i>
            </span>
            <span className='modal-confirm-btn' onClick={edit ? handleConfirmEdit : handleConfirmDelete}>
                <i className="fa-solid fa-lg fa-check"></i>
            </span>
        </div>

      </div>
    </div>
  )
}

export default TableModal
