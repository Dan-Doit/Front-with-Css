import React, { useEffect, useMemo, useState } from 'react'
import FormCheckFn from './FormCheck'

function AlertMessage ({message="Invalid input."}) {
    return <div className="alert_message" style={{color: 'red'}}>{ message }</div>

}

function useDebounce(text, delay) {
    const [textValue, setTextValue] = useState(text)

    useEffect( () => {
        const timer = setTimeout(() => {
            setTextValue(text)
        }, delay)

        return () => {
            clearTimeout(timer)
        }
    }, [text])

    return textValue
}

function TextInput({ formDataObject, checkFn }) {
    const [text, setText] = useState("")
    const [alertComponent, setAlertComponent] = useState(null)

    const debouncedText = useDebounce(text, 300)

    useEffect( () => {
        let inputText = ""

        if (debouncedText) {
            inputText = debouncedText
        } else if (formDataObject.defaultValue) {
            inputText = formDataObject.defaultValue
        }

        let msg = checkFn?.(inputText)
        if (msg) {
            formDataObject.validFn.setInvalid()
            if ( !alertComponent ) {
                setAlertComponent(
                    <AlertMessage message={msg} />
                )
            }
        } else {
            formDataObject.validFn.setValid()
            if ( alertComponent )
                setAlertComponent(null)
        }
    },[debouncedText, formDataObject.defaultValue])

    return (
        <>
            <input
                type="text"
                className="input_tb_text"
                ref={formDataObject.ref}
                defaultValue={formDataObject.defaultValue}
                onChange={(e) => {
                    setText(e.target.value)
                }} >
            </input>
            {alertComponent}
        </>
    )
}

function TextAreaInput({formDataObject, checkFn}) {
    const [text, setText] = useState("")
    const [alertComponent, setAlertComponent] = useState(null)

    const debouncedText = useDebounce(text, 300)

    useEffect( () => {
        let inputText = ""

        if (debouncedText) {
            inputText = debouncedText
        } else if (formDataObject.defaultValue) {
            inputText = formDataObject.defaultValue
        }

        let msg = checkFn?.(inputText)
        if (msg) {
            formDataObject.validFn.setInvalid()
            if ( !alertComponent ) {
                setAlertComponent(
                    <AlertMessage message={msg} />
                )
            }
        } else {
            formDataObject.validFn.setValid()
            if ( alertComponent )
                setAlertComponent(null)
        }
    },[debouncedText, formDataObject.defaultValue])

    return (
        <>
            <textarea
                ref={formDataObject.ref}
                defaultValue={formDataObject.defaultValue}
                onChange={(e) => {
                    setText(e.target.value)
                }} >
            </textarea>
            {alertComponent}
        </>
    )
}

function SelectInput({ formDataObject }) {

    const [alertComponent, setAlertComponent] = useState(null)
    const options = useMemo(() => {
        if (formDataObject.options) {
            return Object.entries(formDataObject.options).map(
                ([key, value]) => <option key={`option_${key}`} value={key}>{value}</option>
            )
        }
        return null
    }, [formDataObject.options])

    useEffect(() => {
        if (options.length === 0) {
            setAlertComponent(
                <AlertMessage message={"옵션을 선택해주세요"} />
            )
            formDataObject.validFn.setInvalid()
        } else {
            setAlertComponent(null)
            formDataObject.validFn.setValid()
        }
    }, [options])

    return (
        <>
            <select
                defaultValue={"Select Option"}
                ref={formDataObject.ref} >
                {options}
            </select>
            {alertComponent}
        </>
    )
}

// tnis only for creating label and input boxes
const LabelBox = ({value, id, getSelected}) => {
    return (
        <>
            <input type='checkbox' id={id} value={value} onClick={getSelected} />
            <label for={id}><span>{ value.length > 18 ? value.slice(0,19) : value }</span></label>
        </>
    );
}

function SelectionsInput ({ formDataObject }) {

    // shown data
    const [ leftSelection, setLeftSelection ] = useState(formDataObject.leftSelection);
    const [ rightSelection, setRightSelection ] = useState(formDataObject.rightSelection);

    // search keyword data
    const [leftKeyWord, setLeftKeyWord] = useState('');
    const [rightKeyWord, setRightKeyWord ] = useState('');

    // debounce data
    const leftDebouncedText = useDebounce(leftKeyWord,500);
    const rightDebouncedText = useDebounce(rightKeyWord,500);

    // temp arr data
    let left = []
    let right = []

    const [alertComponent, setAlertComponent] = useState(null)

    // data that checked
    const getSelected = () => {
        left = []
        right = []
        let labelboxes = document.querySelectorAll('input[id*=labelbox]');

        labelboxes.forEach((box)=>{
            if(box.checked){
                if(box.id.endsWith('R')) right.push(box.value)
                else if(box.id.endsWith('L')) left.push(box.value)}                
        })
    }

    useEffect(() => {
        if (Object.keys(rightSelection).length === 0) {
            setAlertComponent(<AlertMessage message={"노드를 선택해주세요."} />)
            formDataObject.validFn.setInvalid()
        } else {
            setAlertComponent(null)
            formDataObject.validFn.setValid()
        }
    }, [rightSelection])

    // when click arrow will start this handle 
    const handleSelection = (e) => {
        let includes = {}
        let excludes = {}

        if (e.target.className.endsWith('left')){
            Object.entries(leftSelection).forEach(([key,value])=>{
                if(left.includes(key)) {
                    includes = {...includes,[key]:value}
                }else {
                    excludes = {...excludes,[key]:value}
                }
                includes = {...rightSelection,...includes}
            })
        }else if(e.target.className.endsWith('right')){
            Object.entries(rightSelection).forEach(([key,value])=>{
                if(right.includes(key)) {
                    excludes = {...excludes,[key]:value}
                }else {
                    includes = {...includes,[key]:value}
                }
                excludes = {...leftSelection,...excludes}
            })
        }

        setLeftSelection(excludes)
        setRightSelection(includes)

        let labelboxes = document.querySelectorAll('input[id*=labelbox]');
        labelboxes.forEach((box)=>{
            box.checked = false;
        }) 
    } 

    // create input and labels which have node info
    const leftSelections = Object.entries(leftSelection).map(([key, value])=>{
            if(leftDebouncedText) {
                if(value.toLowerCase().includes(leftDebouncedText.toLowerCase())) {
                    return (<div><LabelBox key={key} value={key} id={`labelbox${key}L`} getSelected={getSelected} /></div>)
                }else {
                    return ;
                }
            }else{
                return (<div><LabelBox key={key} value={key} id={`labelbox${key}L`} getSelected={getSelected} /></div>)
            }
        });

    const rightSelections = Object.entries(rightSelection).map(([key,value])=>{

        if(rightDebouncedText) {
            if(value.toLowerCase().includes(rightDebouncedText.toLowerCase())) {
                return(<div ref={formDataObject.ref} ><LabelBox key={key} value={key} id={`labelbox${key}R`} getSelected={getSelected} /></div>)
            }else {
                return ;
            }
            }else{
                return(<div ref={formDataObject.ref} ><LabelBox key={key} value={key} id={`labelbox${key}R`} getSelected={getSelected} /></div>)
            }
        });

    return(
        <>
        <div className='selection_container_wrapper' >
            <div className='selection_container'>
                <div className='selection_presenter'>
                    <div className='search_container'>
                        <div className="table_header_search">
                            <input type="search" className="search_keyword" onChange={(e)=>{setLeftKeyWord(e.target.value)}}  />
                            <button type="submit" className="search_btn"><span className="ico">Search</span></button>
                        </div>
                            <hr className='search_line' />
                    </div>
                    <div className='selections'>
                    {leftSelections}
                    </div>
                    {leftSelections.length > 6 ? <span><strong>&#709;</strong></span> : null}
                </div>
            </div>
            <div className='button_container'>
                <button className='btn btn_left' onClick={handleSelection}><span className='span_left' >▶</span></button>
                <button className='btn btn_right' onClick={handleSelection}><span className='span_right' >◀</span></button>
            </div>
            <div className='selection_container'>
                <div className='selection_presenter'>
                    <div className='search_container'>
                        <div className="table_header_search">
                            <input type="search" name="" className="search_keyword" onChange={(e)=>{setRightKeyWord(e.target.value)}} />
                            <button type="submit" className="search_btn"><span className="ico">Search</span></button>
                        </div>
                            <hr className='search_line' />
                    </div>
                    <div className='selections'>
                        {rightSelections}
                    </div>
                    {rightSelections.length > 6 ? <span><strong>&#709;</strong></span> : null}
                </div>                    
            </div>
            {alertComponent}
        </div>
        </>
    )   
}

export const TableFormDispatchFn = (key, dispatch) => ({
    setValid: () => dispatch({type: 'valid', key: key}),
    setInvalid: () => dispatch({type: 'invalid', key: key}),
    getValid: () => dispatch({type: 'get', key: key})
})

export function TableFormReducer(state,  action) {
    switch (action.type) {
        case 'valid':
            return {...state, [action.key]: true}
        case 'invalid':
            return {...state, [action.key]: false}
        case 'get':
            return state[action.key]
        default:
            return Error()
    }
}

function TableForm ({ formDataEntries }) {
    const formDataObject = useMemo( () => {
        let object = Object.fromEntries(formDataEntries)
        Object.entries(object).forEach(
            ([key, value]) => {
                if (value.type === "select" && value.options === undefined)
                    object[key]["options"] = null
            }
        )
        return object
    }, [formDataEntries])

    let trs = Object.entries(formDataObject).map(
        ([key, value]) => {
            let checkFn = (content) => {
                if (!value.validCheck) {
                    return null
                }

                let msg

                for (const checkFn of value.validCheck.values()) {
                    switch (checkFn) {
                        case "ipv4":
                            msg = FormCheckFn.ipv4(content)
                            break;
                        case "match":
                            msg = FormCheckFn.match(content)
                            break;
                        case "notnull":
                            msg = FormCheckFn.notnull(content)
                            break;
                        case "numeric":
                            msg = FormCheckFn.numeric(content)
                            break;
                        default:
                    }
                    if (msg)
                        break;
                }

                return msg
            }

            let inputComponent = null
            switch(value.type){
            case "text":
                inputComponent = <TextInput formDataObject={value} checkFn={checkFn} />
                break;
            case "textarea":
                inputComponent = <TextAreaInput formDataObject={value} checkFn={checkFn} />
                break;
            case "select":
                inputComponent = <SelectInput formDataObject={value} />
                break;
            case "selections":
                return <SelectionsInput formDataObject={value} />
            default:
                inputComponent = null
                break;
            }

            return (
                <tr key={`input_${key}`}>
                    <th scope="row" >{key}</th>
                    <td className="input_td">
                        {inputComponent}
                    </td>
                </tr>
            )
        }
    )

    return (
        <table className="tb_pop_data">
            <tbody>
                {trs}
            </tbody>
        </table>
    )
}

export default TableForm;