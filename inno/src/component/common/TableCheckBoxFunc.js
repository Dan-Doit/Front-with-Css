import React from 'react'

// TODO: Rename this file to TableUtils.js

export const getCheckedList = (className, [key, id]) => {
    let list = []
    let tableRow = document.querySelectorAll(className + ' tr')
    let selectedRow = document.querySelector(className + ' .selected_tr')

    for (let tr of tableRow){

        const checkbox = tr.querySelector('input[type=checkbox]')

        if(checkbox && checkbox.checked){
            let data = JSON.parse(tr.dataset.dataobject)
            list.push(data)
        }
    }
    if (selectedRow && list.length === 0) {
        
        let data = JSON.parse(selectedRow.dataset.dataobject)

        if (data[key] === id) {
            list.push(data)
        }
    }
    return list
}

// TODO: unexport checkbox functions
function checkboxAllChecked(checkBoxs, allCheckBox) {
    let availableNum = 0
    let checkedNum = 0
    for (let checkBox of checkBoxs){
        if(checkBox.getAttribute("disabled") === null){
            availableNum++
            if(checkBox.checked)
                checkedNum++
        }
    }
    checkedNum === availableNum 
        ? allCheckBox.checked = true
        : allCheckBox.checked = false
}

function checkboxAll(e) {

    let checkboxs = e.target.closest('table').querySelector('tbody').querySelectorAll(`input[type=checkbox]`);
    for (let checkbox of checkboxs){
        if(checkbox.getAttribute("disabled") === null)
            checkbox.checked = e.currentTarget.checked;
    } 
}

function TableCheckBox({type}) {
    switch (type) {
    case 'th':
        return (
            <label className="input_style head_checkbox">
                <input type="checkbox" onClick={(e) => checkboxAll(e)}/>
            </label>
        )
    default:
        return (
            <input type="checkbox"
                onClick={(e)=>{
                    let checkBoxs = e.target.closest('tbody').querySelectorAll('input[type=checkbox]')
                    let allCheckBox = e.target.closest('table').querySelector('.head_checkbox input[type=checkbox]')
                    checkboxAllChecked(checkBoxs, allCheckBox)
                    e.stopPropagation()
                }}>
            </input>
        )
    }
}

export default TableCheckBox;