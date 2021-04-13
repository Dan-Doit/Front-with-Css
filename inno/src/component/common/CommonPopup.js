import { useMutation } from '@apollo/client';
import React, {useEffect} from 'react';
import ErrorPopup from './ErrorPopup';

export function PopupDashStep ({stepString, pageIndex}) {
    return  (
        <div className="pop_dashboard_step_wrap">
            <ul className="pop_dashboard_step">
                {stepString.map((item,index)=>{
                    if(pageIndex===index)
                        return <li key={item} className="current">{item}</li>
                    else
                        return <li key={item}>{item}</li>
                })}
            </ul>
        </div>
    )
}

export function ButtonNext({isValid, onClick}) {
    return (
        <button
            type="button"
            className={`btn_btm ${isValid ? '' : 'disable'}`}
            disabled={!isValid}
            onClick={onClick} >
                Next
        </button>
    )
}

export function ButtonPrev({ onClick }) {
    return (
        <button
            type="button"
            className="btn_btm"
            onClick={onClick} >
                Prev
        </button>
    )
}

export function ButtonCancel({popupFn}) {
    return (
        <button
            type="button"
            className="btn_btm cancel"
            onClick={popupFn.hide}>
                CANCEL
        </button>
    )
}

export function ButtonCreate({ isValid, popupFn, errShow, errPopupFn, queryOptions }) {
    return (
        <ButtonMutate
            label="Create"
            isValid={isValid}
            popupFn={popupFn}
            errShow={errShow}
            errPopupFn={errPopupFn}
            queryOptions={queryOptions} >
        </ButtonMutate>
    )
}

export function ButtonEdit({ isValid, popupFn, errShow, errPopupFn, queryOptions }) {
    return (
        <ButtonMutate
            label="Edit"
            isValid={isValid}
            popupFn={popupFn}
            errShow={errShow}
            errPopupFn={errPopupFn}
            queryOptions={queryOptions} >
        </ButtonMutate>
    )
}

function ButtonMutate({label, isValid, popupFn, errShow, errPopupFn, queryOptions }) {
    const [doCreate, {data, error}] = useMutation(queryOptions.query, {
        refetchQueries: queryOptions.refetchQueries ?
            queryOptions.refetchQueries.map(
                (obj, index) => {
                if (!obj.variables)
                    queryOptions.refetchQueries[index]['variables'] = {}
                return {...obj,
                    variables: {
                        ...obj.variables,
                        token: sessionStorage.getItem('token')+"test"
                    }
                }
            }) :
            null,
    })

    let errPopup = <></>

    if (error){
        errPopup =
            <ErrorPopup
                show={errShow}
                message={`GraphQL Query - ${queryOptions.queryString}`}
                gqlError={error}
                popupFn={errPopupFn} >
            </ErrorPopup>
    }

    if (data) {
        Object.values(data).forEach(value => {
            if (value.errors.length > 0) {
                errPopup =
                    <ErrorPopup
                        show={errShow}
                        message={`GraphQL Query - ${queryOptions.queryString}`}
                        errStack={value.errors}
                        popupFn={errPopupFn} >
                    </ErrorPopup>
            } else {
                popupFn.hide()
            }
        })
    }

    return (
        <>
            <button
                className={`btn_btm ${isValid ? 'create' : 'disable'}`}
                disabled={!isValid}
                onClick={() => {
                    errPopupFn.show()
                    let variables = {
                        token: sessionStorage.getItem('token') + "test"
                    }
                    queryOptions.variable_keys.forEach( key => {
                        variables[key] = popupFn.load?.(key)
                    })
                    doCreate({variables})
                }}>
                    {label}
            </button>
            {errPopup}
        </>
    )
}

export function ButtonDelete({deleteList, popupFn, errShow, errPopupFn, queryOptions, onClick}) {
    const [doDelete, {data, error}] = useMutation(queryOptions.query, {
        refetchQueries: queryOptions.refetchQueries ?
            queryOptions.refetchQueries.map(
                (obj, index) => {
                if (!obj.variables)
                    queryOptions.refetchQueries[index]['variables'] = {}
                return {...obj,
                    variables: {
                        ...obj.variables,
                        token: sessionStorage.getItem('token')+"test"
                    }
                }
            }) :
            null,
    })

    let errPopup = <></>

    if (error){
        errPopup =
            <ErrorPopup
                show={errShow}
                message={`GraphQL Query - ${queryOptions.queryString}`}
                gqlError={error}
                popupFn={errPopupFn} >
            </ErrorPopup>
    }

    if (data) {
        Object.values(data).forEach(value => {
            if (value.errors.length) {
                errPopup =
                    <ErrorPopup
                        show={errShow}
                        message={`GraphQL Query - ${queryOptions.queryString}`}
                        errStack={value.errors}
                        popupFn={errPopupFn} >
                    </ErrorPopup>
            } else {
                popupFn.hide()
            }
        })
    }

    return (
        <>
            <button
                className={`btn_btm ${deleteList.length > 0 ? 'del' : 'disable'}`}
                onClick={(e)=>{
                    errPopupFn.show()
                    deleteList.forEach(element => {
                        let obj={
                            token: sessionStorage.getItem('token')+"test",
                        }
                        queryOptions.variable_keys.forEach( key => {
                            obj[key] = element[key]
                        })
                        doDelete({variables: obj})
                    });
                }}>
                    DELETE
            </button>
            {errPopup}
        </>
    )
}

function CommonPopup({forwardRef, popupFn, popupBtn=null, className="pop_wrap", title, children}) {

    useEffect(() => {
        if (forwardRef && forwardRef.current)
            forwardRef.current.focus()
    })

    return (
        <div
            className={className}
            ref={forwardRef}
            style={{display: 'block'}}
            tabIndex={-1}
            onKeyDown={(event) => {
                if(event.key === "Escape") {
                    popupFn.hide();
                }
                event.stopPropagation()
            }} >
            {popupBtn}
            <button
                type="button"
                className="btn_pop_close"
                onClick={popupFn.hide} >
            </button>
            <div className="pop_common">
                <div className="pop_tit">{title}</div>
                <div className="pop_body">
                    <div className="pop_section_wrap">
                        <div className="pop_section on">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CommonPopup;
