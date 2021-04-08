import React, { useState } from 'react';

const UserMenuItemList = ({itemEntries}) => {

    const itemList = []
    itemEntries.forEach(
        (value, key) => {
            itemList.push(
                <li key={`userMenuItem_${key}`}>
                    <a onClick={value}>{key}</a>
                </li>
            )
        }
    )
    return (
        <ul className="header_user_menu_list">
            {itemList}
        </ul>
    )
}

function MenuUserInfo() {

    const [showDropdown, setShowDropdown] = useState(false)

    return (
        <div className="header_user">
            <div className="header_user_profile">
                {/*<img src="" alt="">*/}
            </div>
            <div className="header_user_info">
                <button type="button" className="header_user_btn" id="userBtn" onClick={() => setShowDropdown(!showDropdown)}>
                    <span className="dropdown">{sessionStorage.getItem('id')}</span>
                </button>
                {/* header_user_menu */}
                <div className="header_user_menu" id="userMenu"
                     style={showDropdown ? {display: 'block'} : {}}>
                    <UserMenuItemList
                        itemEntries={new Map([
                            ['Profile', null],
                        ])} >
                    </UserMenuItemList>
                    <button
                        type="button" className="header_user_menu_btn"
                        onClick={() => {
                            sessionStorage.clear();
                            window.location.href = "/";
                        }}>
                            Logout
                    </button>
                </div>
            </div>
        </div>
    )
}


export default MenuUserInfo;