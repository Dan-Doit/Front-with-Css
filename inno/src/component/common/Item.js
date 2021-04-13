import React from 'react';
import LoadingImage from "../../resource/static/images/loading.gif";
import TableCheckBox from "./TableCheckBoxFunc"

export function EmptyItem({rowNum=1, colNum}) {
    let emptyItems = []
    for (let i = 0; i < rowNum; i++) {
        emptyItems.push(
            <tr key={`node_table_loading_${i}`}>
                <td colSpan={colNum}></td>
            </tr>
        )
    }
    return emptyItems
}

export function LoadingItem({colNum}) {
    return(
        <>
            <tr key="node_table_loading">
                <td colSpan={colNum}><img src={LoadingImage} alt="LoadingImage"/></td>
            </tr>
        </>
    )
}

export function LogItem({ dataEntries }) {
    let datasetObject = Object.fromEntries(dataEntries)

    let rowItem = (
        <>
            <tr className={(datasetObject.result === "Failed")?"clickable":""}
                onClick={(datasetObject.result === "Failed") ?
                    (e) => {
                        let hiddenInfo = e.currentTarget.nextSibling

                        if (hiddenInfo.style.display === "table-row")
                            hiddenInfo.style.display = "none"
                        else
                            hiddenInfo.style.display = "table-row"

                    } : null}>
                <td>{datasetObject.time}</td>
                <td>{datasetObject.action.split(" / ")[1]}</td>
                <td style={(datasetObject.result === "Failed" ? {color: "red"} : {})}>{datasetObject.result}</td>
                <td>{datasetObject.user_id}</td>
            </tr>
            {(datasetObject.result === "Failed") ?
            <tr className="hidden_info">
                <td colspan="4">
                    <label>{datasetObject.err_str}</label>
                </td>
            </tr> :
            <></>}
        </>
    )

    return (
        <>
            {rowItem}
        </>
    )
}

// Default Item for Vertical Table
export function Item({type="td", highlight=false, enableCheckbox=false, onClickFn, dataEntries}) {
    let datasetObject = Object.fromEntries(dataEntries)
    let tds = []
    dataEntries.forEach(
        (value, key) => {
            if (typeof(value) === 'object'){
                /**
                 * Usually this object value contain Apollo useQuery hook.
                 * React Component cannot convert to JSON string.
                 *
                 * Assign `null` to avoid error at `JSON.stringify()`
                 * then use cached result data of useQuery, if needed.
                 *
                 * Use `apolloClient.readQuery()` to get cached result.
                 */
                datasetObject[key] = null
            }
            if (key.indexOf("_") === 0) {
                /**
                 * Key which start with underline(_) will not show in <Item/> row,
                 * but the key & value will stored in <Item/>'s dataobject.
                 *
                 * Key's underline will remove when it stored in dataobject.
                 * ex]
                 *       datasetObject                dataobject
                 *  _uuid : "random uuid"   =>   uuid : "random uuid"
                 *  _as_a : "test string"   =>   as_a : "test string"
                 */
                datasetObject[key.slice(1)] = value
                delete datasetObject[key]
                return
            }
            if (key.indexOf(".") === 0) {
                /**
                 * Key which start with dot(.) will add <span /> in <Item/> row,
                 * then apply value to <span/>'s className.
                 *
                 * Key & value will stored in <Item/>'s dataobject.
                 */
                datasetObject[key.slice(1)] = value
                delete datasetObject[key]

                switch (type) {
                case 'th':
                    tds.push (
                            <th key={key} scope="col">
                                <span className={value} />
                            </th>
                    )
                    break;
                default:
                    tds.push (
                            <td key={key} >
                                <span className={value} />
                            </td>
                    )
                    break;
                }
                return
            }
            switch (type) {
            case 'th':
                tds.push (<th key={key} scope="col">{value}</th>)
                break;
            default:
                tds.push(<td key={key}>{value}</td>)
                break;
            }
        }
    )
    let checkbox = null
    if (enableCheckbox) {
        switch (type) {
        case 'th':
            checkbox = <th scope="col"><TableCheckBox type='th' /></th>
            break;
        default:
            checkbox = <td><TableCheckBox type='td' /></td>
            break;
        }
    }

    return (
            <tr
                className={highlight ? 'selected_tr' : ''}
                data-dataobject={JSON.stringify(datasetObject)}
                onClick={onClickFn}>
                {checkbox}
                {tds}
            </tr>
    )
}

// Default Item for Landscape Table
export function VerticalItem({dataEntries}) {
    let datasetObject = Object.fromEntries(dataEntries)
    let trs =  Object.entries(datasetObject).map(
        ([key, value]) => {
            return (
                <tr key={`vertical_item_${key}`}>
                    <th scope="row">{key}</th>
                    <td>{value}</td>
                </tr>
            )
        }
    )

    return trs
}