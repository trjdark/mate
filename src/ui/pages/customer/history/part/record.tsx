/**
 *Desc: 通用表格记录
 *User: Debby.Deng
 *Date: 2018/11/2,
 *Time: 上午10:44
 */
import * as React from "react";
import {TablePagination} from "../../../../component/tablePagination";
import {tableHeader} from "./tableHeader";

declare interface tableProps {
    resData: any,
    onPageChange: (type) => (void),
    onRowSelection?: any,
    rowKey?: string,
    onRowClick?:(event)=>{},
    sortedInfo?:any,
    onSortChange?:()=>(void),
    //不用传入
    type?: any,
}

class CommonRecords extends React.Component<tableProps> {
    onRow=(record)=>{
        const {onRowClick}=this.props;
        return {
            onClick:onRowClick && onRowClick.bind(this,record)
        }
    };
    getContent = (id) => {
        let columns = null;
        let {resData, onRowSelection, rowKey, onPageChange, type, sortedInfo, onSortChange} = this.props;
        if (!rowKey) {
            if (type === 'courseClose') {
                rowKey = 'contractId';
            } else {
                rowKey = 'recordId';
            }
        }
        switch (id) {
            case 'loss': {//leads流失
                columns = tableHeader.loss;
                break;
            }
            case 'transfer': {
                columns = tableHeader.transfer;
                break;
            }
            case 'disContact': {
                columns = tableHeader.disContact;
                break;
            }
            case 'unSign': {
                columns = tableHeader.unSign;
                break;
            }
            case 'unReceive': {
                columns = tableHeader.unReceive;
                break;
            }
            case 'customerTransfer': {
                columns = tableHeader.customerTransfer;
                break;
            }
            case 'courseClose': {
                columns = tableHeader.courseClose(sortedInfo);
                break;
            }
            case 'unContact': {
                columns = tableHeader.unContact;
                break;
            }
            case 'recycle': {
                columns = tableHeader.recycle;
                break;
            }
        }
        return <TablePagination
            rowKey={rowKey}
            rowSelection={onRowSelection ? onRowSelection : null}
            columns={columns}
            dataSource={resData.list}
            pageSize={resData.pageSize}
            pageNo={resData.pageNo}
            totalSize={resData.totalSize}
            handleChangePage={onPageChange}
            onRow={this.onRow}
            handleFilterTableChange={onSortChange}
        />;

    };

    render() {
        const {type} = this.props;
        return this.getContent(type)
    }
}

function WrappedComponent(Wrap, type) {
    return class extends React.Component<any> {
        render() {
            return <Wrap type={type} {...this.props}/>
        }
    }
}

export {WrappedComponent, CommonRecords}
