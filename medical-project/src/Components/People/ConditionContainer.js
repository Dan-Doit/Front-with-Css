import React, { useState, useEffect } from "react";
import ConditionPresenter from './ConditionPresenter';
import { person } from '../../data/person.json'
import { condition_occurrence } from '../../data/condition_occurrence.json'
import { death } from '../../data/death.json'
import { visit_occurrence } from '../../data/visit_occurrence.json'

export default () => {

    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("person_id");
    const [sortData, setSortData] = useState(person);
    const [filterVal, SetFilterVal] = useState([]);

    // getAge Rex
    const getAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10)

    useEffect(() => {
        let data = [];
        let filterValues = { gender: [], age: [], race: [], ethnicity: [], death: [] }
        person.map(p => {
            // generate data
            const dateString = p.birth_datetime.slice(0, 10);
            const isDeath = death.filter(d => d.person_id === p.person_id);
            const getVisited = visit_occurrence.filter(v => v.person_id === p.person_id);
            const getOccurrence = condition_occurrence.filter(o => o.person_id === p.person_id);

            data.push({
                "person_id": p.person_id,
                "gender_source_value": p.gender_source_value,
                "birth_datetime": dateString,
                "race_source_value": p.race_source_value,
                "ethnicity_source_value":p.ethnicity_source_value,
                "age": getAge(dateString),
                "death": isDeath.length > 0 ? '사망' : '환자',
                "total_visited": getVisited.length,
                "condition_concept":getOccurrence
            })
        })
        
        // generate filter values
        data.map(p => {
            // gender
            if (!Object.values(filterValues.gender).includes(p.gender_source_value)) {
                filterValues.gender.push(p.gender_source_value);
            }
            // age
            if (!Object.values(filterValues.age).includes(`${Math.floor(p.age/10)*10} 대`)) {
                filterValues.age.push(`${Math.floor(p.age/10)*10} 대`);
            }
            // race
            if (!Object.values(filterValues.race).includes(p.race_source_value)) {
                filterValues.race.push(p.race_source_value);
            }
            // ethnicity
            if (!Object.values(filterValues.ethnicity).includes(p.ethnicity_source_value)) {
                filterValues.ethnicity.push(p.ethnicity_source_value);
            }
            // death
            if (!Object.values(filterValues.death).includes(p.death)) {
                filterValues.death.push(p.death);
            }
        })

        const sortPeople = data.sort(function (a, b) { 
                return a[sortBy] < b[sortBy] ? -1 : a[sortBy] > b[sortBy] ? 1 : 0;
        });
        setSortData(sortPeople)
        SetFilterVal(filterValues)
        setLoading(false)
    }, [sortBy])
    
    return (
    <div style={{marginBottom:200}}>
            {loading ? null : <ConditionPresenter data={sortData} sortBy={setSortBy} filterVal={filterVal} />}
    </div>
    )
}