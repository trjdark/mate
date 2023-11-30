/**
 *Desc: 合同状态变更
 *User: Debby.Deng
 *Date: 2018/11/5,
 *Time: 上午10:04
 */


import {connect} from "../../../../../../common/decorator/connect";
import * as React from "react";
import {TablePagination} from "../../../../../component/tablePagination";
import moment from "moment";
import leadsStatusCode from "@/ui/pages/customer/enum/client360";

@connect((state)=>({
}),{})
class StatusChange extends React.Component<any>{
    handleChangePage=(page)=>{
        this.props.onPageChange(page);
    };
    render(){
        const columns=[
            {
                title: '操作人',
                dataIndex: 'operName',
                key: 'operName',
                width: '20%'
            }, {
                title: '操作时间',
                dataIndex: 'time',
                key: 'time',
                render:(text)=>(text? moment(text).format('YYYY-MM-DD') : ''),
                width: '20%'
            },
            {
                title: '变更前状态',
                dataIndex: 'beforePhase',
                key: 'beforePhase',
                render:(text)=>(text && leadsStatusCode[text.toString()]),
                width: '10%'
            }, {
                title: '变更后状态',
                dataIndex: 'afterPhase',
                key: 'afterPhase',
                render:(text)=>(text && leadsStatusCode[text.toString()]),
                width: '10%',
            },
            {
                title: '变更备注',
                dataIndex: 'desc',
                key: 'desc',
            }
        ];
        const {tableData}=this.props;
        return (
            <TablePagination
                columns={columns}
                dataSource={tableData.list}
                totalSize={tableData.totalSize}
                pageSize={tableData.pageSize}
                handleChangePage={this.handleChangePage}
                pageNo={tableData.pageNo}
            />
        )
    }
}

export {StatusChange};

