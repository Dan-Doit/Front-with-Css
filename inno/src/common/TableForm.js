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