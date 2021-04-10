import React, { useState, useEffect } from "react";
import ChartPresenter from './ChartPresenter';
import { person } from '../../data/person.json'

export default () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(person);

    useEffect(() => {
        let data = { gender: [], race:[], ethnicity:[]};
        person.map(p => {
            // gender
            if (Object.keys(data.gender).includes(p.gender_source_value)) {
                data.gender[p.gender_source_value]++;
            } else {
                data.gender[p.gender_source_value] = 1;
            }

            // race
            if (Object.keys(data.race).includes(p.race_source_value)) {
                data.race[p.race_source_value]++;
            } else {
                data.race[p.race_source_value] = 1;
            }

            // ethnicity
            if (Object.keys(data.ethnicity).includes(p.ethnicity_source_value)) {
                data.ethnicity[p.ethnicity_source_value]++;
            } else {
                data.ethnicity[p.ethnicity_source_value] = 1;
            }
        })
        setData(data);
        setLoading(false)
    }, [])
    
    return (
    <div>
            {loading ? null : <ChartPresenter data={data} />}
    </div>
    )
}