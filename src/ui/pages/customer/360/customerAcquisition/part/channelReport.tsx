/**
 * desc: 渠道编辑记录
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/7/20
 * Time: 下午1:42
 */
import * as React from "react";
import {TablePagination} from "../../../../../component/tablePagination";
import moment from "moment";


class ChannelReport extends React.Component<any>{
    handleChangePage=(page)=>{
        this.props.onPageChange(page);
    };
    render(){
        const columns=[
            {
                title: '操作人',
                dataIndex: 'lastUpdateBy',
            }, {
                title: '操作时间',
                dataIndex: 'lastUpdateDate',
                render:(text)=>(text? moment(text).format('YYYY-MM-DD') : ''),
            },
            {
                title: '编辑前',
                dataIndex: 'beforeEditing',
            }, {
                title: '编辑后',
                dataIndex: 'afterEditing',
            },
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

export {ChannelReport};
