import React, { useState, useEffect, useRef } from 'react'
import './Table.css'

function Table({ body, handleDeleteRow, deleteRow, openModal, addCollection, showRemark }) {

    const [rowToEdit, setRowToEdit] = useState(null);
    const [editData, setEditData] = useState(null);
    const [resetEdit, setResetEdit] = useState(false);
    const lastTr = useRef();

    const numericColls = ["id_collection", "num_spec", "lat", "long"];

    useEffect(() => {

        if (resetEdit || !(rowToEdit in body)) {
            setRowToEdit(null);
            setEditData(null);
            setResetEdit(false);
        }

        let lastRowData = body.slice(-1)[0];

        if (lastRowData && lastRowData["id_collection"] === "") {
            setRowToEdit(body.length - 1);
            setEditData(lastRowData);
            lastTr.current?.scrollIntoView({
                behavior: "instant",
                block: "end"
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [body])

    const handleEdit = (idx) => {
        if(rowToEdit && body[rowToEdit]["id_collection"] === "") {
            deleteRow(rowToEdit);
            showRemark(false);
        };
        
        setRowToEdit(idx);
        setEditData(body[idx]);
    }

    const handleChange = (e) => {
        let { name, value } = e.target;
        let tempData = editData;

        if(numericColls.includes(name) && value !== '' && (/\D/g.test(value))){
            return;
        }
        
        tempData = {
            ...tempData,
            [name]: value
        };

        setEditData(tempData);
    }

    const handleCancelClick = (idx) => {
        if (body[idx]["id_collection"] === "") {
            handleDeleteRow(idx);
            showRemark(false);
        } else {
            setEditData(null);
            setRowToEdit(null);
        }
    }

    const handleConfirmClick = (idx) => {
        if(editData['id_collection'].length === 6){
            openModal(editData, idx);
            setResetEdit(true);
            showRemark(false);
        } else{
            showRemark(true);
        }
    }

    const handleNewRow = () => {
        addCollection();
    }

    return (
        <div className='table-container'>
            {body.length > 0 ? <table className='table'>
                <thead>
                    <tr>
                        {Object.keys(body[0]).map((head, headID) => 
                        <th key={headID}>{head}</th>)}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {body.map((row, idx) => (
                        <tr key={idx}>
                            {Object.entries(row).map(([key, value]) => <td key={key}>{idx === rowToEdit ? <input inputMode='numeric' className={`${key}`} name={key} type="text" value={editData[key] || ""} onChange={(e) => handleChange(e)} disabled={key === 'id_collection' && body[idx]['id_collection'] !== ""} placeholder={key} ></input> : <span className={`${key}`}>{value}</span>}</td>)}
                            <th className='actions-th'>
                                <div className='table-buttons'>
                                    <span className={rowToEdit === idx ? 'table-actions inactive' : 'table-actions active'}>
                                        <i onClick={() => handleEdit(idx)} className="fa-solid fa-lg fa-pen-to-square edit-btn" title='Edit'></i>
                                        <i onClick={() => handleDeleteRow(idx)} className="fa-solid fa-lg fa-circle-xmark delete-btn" title='Delete'></i>
                                    </span>
                                    <span className={rowToEdit === idx ? 'table-edit-actions active' : 'table-edit-actions inactive'}>
                                        <i onClick={() => handleCancelClick(idx)} className="fa-solid fa-ban fa-lg cancel-btn" title='Cancel'></i>
                                        <i onClick={() => handleConfirmClick(idx)} className="fa-solid fa-circle-check fa-lg confirm-btn" title='Confirm'></i>
                                    </span>
                                </div>
                            </th>
                        </tr>
                    ))}
                        <tr ref={lastTr} onClick={() => handleNewRow()} className='add-collection-tr'>
                            <td colSpan="100%"><i className="fa-solid fa-plus"></i> <span>Add Collection</span></td>
                        </tr>
                </tbody>
            </table>
            : <span>No collections found</span>}
        </div>
    )
}

export default Table
