import React, { useContext } from "react";
import {useQuery} from '@apollo/client';
import {READ_NUM_USER} from "../../graphql/user";
import {READ_NUM_NODE} from "../../graphql/node";
import {READ_NUM_SERVER, READ_NUM_SELECTED_SERVER_LOG, READ_NUM_NODES_SERVER} from "../../graphql/server";
import {READ_NUM_SUBNET} from "../../graphql/subnet";
import {READ_NUM_ADAPTIVE_IP_SERVER} from "../../graphql/adaptiveIP";
import { ServerContext } from "../server/Server";

function Pages({queryType, listRow, currentPage, changeCurrentPageFn}) {

    const serverData = useContext(ServerContext)

    const {data} = useQuery(queryType, {
        variables: {
            token: sessionStorage.getItem('token'),
            server_uuid: serverData ? serverData.uuid : null,
        },
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'none',
    })

    if (data){
        let totalListNum = 0;
        if (queryType === READ_NUM_NODE)
            totalListNum = data.num_node.number;
        else if(queryType === READ_NUM_SERVER)
            totalListNum = data.num_server.number;
        else if(queryType === READ_NUM_SUBNET)
            totalListNum = data.num_subnet.number;
        else if(queryType === READ_NUM_ADAPTIVE_IP_SERVER)
            totalListNum = data.num_adaptiveip_server.number;
        else if(queryType === READ_NUM_USER)
            totalListNum = data.num_user.number;
        else if (queryType === READ_NUM_SELECTED_SERVER_LOG)
            totalListNum = data.num_server_log.number;
        else if (queryType === READ_NUM_NODES_SERVER)
            totalListNum = data.num_nodes_server.number

        return (
            <div className="pagination_inner">
                <button className="page_btn first disabled"
                onClick={(e) => changeCurrentPageFn(e)} page={1} />
                <button className="page_btn prev disabled"
                onClick={(e) => changeCurrentPageFn(e)} page={(currentPage-1 > 0)?currentPage-1:currentPage} />

                <span className="page_num">
                        <span className="current">
                            {currentPage}
                        </span> / {Math.ceil(totalListNum / listRow)}
                </span>

                <button className="page_btn next"
                onClick={(e) => changeCurrentPageFn(e)} page={(currentPage * listRow >= totalListNum)? currentPage : currentPage + 1} />
                <button className="page_btn last"
                onClick={(e) => changeCurrentPageFn(e)} page={(currentPage * listRow >= totalListNum)? currentPage : Math.ceil(totalListNum / listRow)} />
            </div>
        )
    }

    return <></>
}

function Pagination({queryType, currentPage, listRow, changeCurrentPage, selectedUUID}) {
    return (
        <Pages
            queryType={queryType}
            currentPage={currentPage}
            listRow={listRow}
            changeCurrentPageFn={changeCurrentPage}
            selectedUUID={selectedUUID} >
        </Pages>
    )
}

export default Pagination;
