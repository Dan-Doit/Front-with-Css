import React, { useMemo, useState } from 'react'

function CommonTab({tabList=[], componentList=[]}) {
    const [tabIndex, setTabIndex] = useState(0)
    const tabMenuList = useMemo(() => {
        let newIndex = tabIndex
        let  urls = document.URL.split("#")

        if (tabList && urls.length > 1) {
            tabList.forEach(
                (value, index) => {
                    if (`tab_${value}`.toLowerCase().localeCompare(decodeURI(urls[1])) === 0) {
                        newIndex = index
                        setTabIndex(newIndex)
                    }
                }
            )
        }
        return (
            tabList.map(
                (value, index) => {
                    return (
                        <a
                            key={`tab${index}`}
                            href={`#tab_${value}`.toLowerCase()}
                            className={
                                newIndex === index ? 
                                'tab_btn on' : 'tab_btn'
                            } >
                                <span>{value}</span>
                        </a>
                    )
                }
            )
        )
    }, [document.URL])

    return (
        <div className="detail_wrap">
            <div className="tab_wrap clearfix" data-target="detailTabs">
                {tabMenuList}
            </div>
            <div className="detail_panel" data-target="detailTabs">
                {componentList[tabIndex]}
            </div>
        </div>
    )
}

export default CommonTab;