import React, {useEffect, useRef} from 'react';

const ErrStackTableRow = ({errStack}) => {
    return errStack.map((err, index) =>
        <p key={"errStack"+index} style={{textAlign: 'left', padding: '3px 10px'}}>{err.errtext}</p>
    )
}

export const ErrorPopupFn = (ref, dispatch) => ({
    hide: ()=> {
        dispatch({type: 'hide'})
    },
    show: ()=> {
        dispatch({type: 'show'})
    },
    focus: () => {
        if (ref && ref.current)
            ref.current.focus()
    }
})

export function ErrorReducer(state, action) {
    switch (action.type) {
        case 'hide':
            return false
        case 'show':
            return true
        default:
            return Error()
    }
}

function ErrorPopup({show, popupFn, message, errStack, gqlError}) {
    const errRef = useRef()

    useEffect(() => {
        if (errRef.current) {
            errRef.current.focus()
        }
    })

    if (!show)
        return <></>
    else {
        return (
            <div className="pop_error_wrap"
                ref={errRef}
                style={{display: 'block'}}
                tabIndex={-1}
                onKeyDown={(event) => {
                    if(event.key === "Escape") {
                        popupFn.hide();
                        popupFn.focus();
                    }
                    event.stopPropagation()
                }} >
                <button
                    type="button"
                    className="btn_pop_close"
                    onClick={() => {
                        popupFn.hide()
                        popupFn.focus()
                    }} >
                        Close
                </button>
                <div className="pop_common">
                    <div className="pop_tit">Error</div>
                    <div className="pop_body">
                        <div className="pop_error_cont">
                            <p style={{textAlign: 'left', padding: '5px 5px', marginBottom: '5px', borderBottom: '1px solid lightgray'}}>
                                {message}
                            </p>
                            {errStack?
                            <ErrStackTableRow errStack={errStack}/>:
                            <p style={{textAlign: 'left', padding: '3px 10px'}}>
                                Request Fail. Check dev console message.{console.error(gqlError)}
                            </p>}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ErrorPopup;
