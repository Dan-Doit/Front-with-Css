import React from 'react';
import { Link, BrowserRouter as Router } from "react-router-dom";

function MenuItem({defaultOn, toExternal, isParent, isChild, linkTo, menuText, subMenu, clickHandler}) {

    let isDefault

    if (window.location.href.indexOf(linkTo) >= 0 ||
        (window.location.href.indexOf("login") >= 0 && defaultOn)) {
        isDefault = true
    } else {
        isDefault = false
    }
    return (
        <li className={'menu ' +
                (isDefault?'on ':'') +
                (isParent?'haveChild ':'') +
                (isDefault&isParent?'open ':'') +
                (isChild?'child ':'')
            }
            onClick={clickHandler} >
                {toExternal?
                    <Router><Link to={{pathname: linkTo, state: true}} target="_blank" >{menuText}</Link></Router> :
                    <Link to={linkTo}>{menuText}</Link>
                }
                {subMenu}
        </li>
    )
}

function SubMenu({menuInfo, clickHandler}) {

    return (
        <ul>
            {menuInfo.map((info) => {
                return (
                    <MenuItem
                        key={"subMenu_"+info.text}
                        toExternal={info.toExternal?true:false}
                        isParent={false}
                        isChild={true}
                        linkTo={info.link}
                        menuText={info.text}
                        subMenu={null}
                        onClick={clickHandler} >
                    </MenuItem>
                )
            })}
        </ul>
    )
}


function Menu() {
    const menuClickHandler = (e)=> {
        e.stopPropagation()

        let header = document.querySelectorAll('.menu')
        let target = e.target.parentNode

        header.forEach((node)=> {
            node.classList.remove('on')
            node.classList.remove('open')
        })

        target.classList.add('on')
        if (target.classList.contains('haveChild'))
            target.classList.add('open')

        if (target.classList.contains('child')) {
            target.parentNode.parentNode.classList.add('on')
            target.parentNode.parentNode.classList.add('open')
        } else if (target.classList.contains('haveChild')) {
            target.childNodes[1].childNodes[0].classList.add('on')
        }
    }

    return (
        <ul className="header_nav">
            <MenuItem
                defaultOn
                isParent={false} isChild={false}
                linkTo="/resource" menuText="Resource"
                subMenu={null}
                clickHandler={menuClickHandler} >
            </MenuItem>
            <MenuItem
                isParent={false} isChild={false}
                linkTo="/server" menuText="Server"
                subMenu={null}
                clickHandler={menuClickHandler} >
            </MenuItem>
            <MenuItem
                isParent={true} isChild={false}
                linkTo="/network" menuText="Network"
                subMenu={
                    <SubMenu
                        menuInfo={[{
                            link: "/network/subnet",
                            text: "Subnet",
                        }, {
                            link: "/network/adaptiveIP",
                            text: "AdaptiveIP",
                        }]}
                        clickHandler={menuClickHandler} >
                    </SubMenu>
                }
                clickHandler={menuClickHandler} >
            </MenuItem>
            <MenuItem
                isParent={true} isChild={false}
                linkTo="/management" menuText="Management"
                subMenu={
                    <SubMenu
                        menuInfo={[{
                            link: "/management/user",
                            text: "User",
                        }, {
                            link: "/management/quota",
                            text: "Quota",
                        }, {
                            link: "/management/billing",
                            text: "Billing",
                        }, {
                            link: "http://gw.teratec.co.kr:55023/",
                            text: "Timpani",
                            toExternal: true,
                        }]}
                        clickHandler={menuClickHandler} >
                    </SubMenu>
                }
                clickHandler={menuClickHandler} >
            </MenuItem>
        </ul>
    )
}

export default Menu;
