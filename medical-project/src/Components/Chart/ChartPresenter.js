import React from "react";
import PieChart from '../PieChart';

export default ({ data }) => {
    return (<div style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <PieChart data={data.gender} category={Object.keys(data)[0]} />
        <PieChart data={data.race} category={Object.keys(data)[1]} />
        <PieChart data={data.ethnicity} category={Object.keys(data)[2]} />
    </div>)
}
