import React from 'react'
import Select from 'react-select'

const Filter = ({ values }) => {

  let options = [];

  if (values) {
    const temp = []
    values.sort((a,b)=> a < b ? -1 : a > b ? 1 : 0)
    values.map(v => temp.push({ value: v, label: v }))
    options = temp;
  }

  return (
    <div style={{ width: 120, height: 30 }}>
      { options ? <Select options={options} /> : null }
    </div>
  )
};

export default Filter;