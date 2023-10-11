import React, { useEffect, useState } from 'react'
import './ModalColls.css'
import Table from './Table'
import TableModal from './TableModal';
import { downloadExcel } from "react-export-table-to-excel";

function ModalColls({ setCollsModalOpen, data }) {

    const [tableData, setTableData] = useState([]);
    const [openTableModal, setOpenTableModal] = useState(false);
    const [newData, setNewData] = useState();
    const [rowIdx, setRowIdx] = useState();
    const [isEdit, setIsEdit] = useState(false);
    const [remark, setRemark] = useState(false);

    useEffect(() => {
        if (data.length > 0) {
            const clearedData = data.map(({id_main, ...keepAttrs}) => keepAttrs)
            setTableData(clearedData)
        }

    }, [data])

    console.log(tableData)

    const handleModalClick = event => {
        event.stopPropagation();
    }

    const handleModalOpenDelete = (idx) => {
        setRowIdx(idx)
        setIsEdit(false)
        setOpenTableModal(!openTableModal)
    }

    const handleModalOpenEdit = (editData, idx) => {
        setNewData(editData)
        setRowIdx(idx)
        setIsEdit(true)
        setOpenTableModal(!openTableModal)
    }

    const handleNewCollection = () => {
        if (tableData && tableData.slice(-1)[0]["id_collection"] !== ""){
            var newColl = {}
            Object.keys(tableData[0]).forEach((head) => {
                newColl[`${head}`] = "";
            })
            setTableData(tableData => [...tableData, newColl])
        }
    }

    const handleDeleteRow = (idxToDelete) => {
        idxToDelete ? setTableData(tableData.filter((_, idx) => idx !== idxToDelete)) : setTableData(tableData.filter((_, idx) => idx !== rowIdx))
    }

    const handleConfirmEdit = () => {
        const tempData = [...tableData]
        tempData[rowIdx] = newData

        setTableData(tempData)
    }

    const handleDownloadExcel = () => {
        downloadExcel({
            fileName: "Collections",
            sheet: "Collections",
            tablePayload: {
              header: Object.keys(tableData[0]),
              body: tableData,
            },
          });
    }

    const handleRemark = (param) => {
        setRemark(param);
    }

    return (
        <div className='modal-background' onClick={setCollsModalOpen}>
            <div className='modals-container' onClick={handleModalClick}>
                <div className='collections-modal-container'>
                    <div className='collections-modal-header'>
                        <div className='buttons-container'>
                            <button onClick={handleDownloadExcel} className='export-btn'>EXPORT TO EXCEL</button>
                            <button onClick={handleNewCollection} className='add-btn'>ADD COLLECTION</button>
                        </div>
                        <div className='close-container'>
                            <i className="close-btn fa-solid fa-xl fa-xmark" onClick={setCollsModalOpen} title='Close'></i>
                        </div>
                    </div>
                    <div className='spreadsheet-container'>
                        {/*tableData.length > 0 ? */<Table body={ tableData } handleDeleteRow={ handleModalOpenDelete } deleteRow={ handleDeleteRow } openModal={ handleModalOpenEdit } addCollection={ handleNewCollection } showRemark={ handleRemark }/>/* : <span>No collections found</span>*/}
                    </div>
                    <div className='remarks-container'>
                        {remark && <span>Note: "id_collection" must be valid.</span>}
                    </div>
                </div>
                { openTableModal && <TableModal setTableModalOpen={ () => setOpenTableModal(!openTableModal) } edit={ isEdit } confirmEdit={ handleConfirmEdit } deleteRow={ handleDeleteRow } />}
            </div>
        </div>
    )
}

export default ModalColls
