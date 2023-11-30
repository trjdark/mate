/**
 * desc: 通话记录表格组件
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/2/13
 * Time: 下午8:00
 */
import React, {Component} from 'react';
import {Table} from "@/ui/component/tablePagination";
import {CommonUtils} from "@/common/utils/commonUtils";
import {Filter} from "@/filter/filter";
import moment from 'moment';
import {Popover} from 'antd';
import {EditCallRecordRemark} from "./editCallRecordRemark";


declare interface RecordTableProps {
    recordDataSource:Array<any>
    emitSubmit: (res:any) => void
}

class RecordTable extends Component<RecordTableProps, any>{
    telephoneColumns = [
        {
            title: '通话时间',
            dataIndex: 'createDate',
            render: (date:number) => moment(date).format("YYYY-MM-DD HH:mm")
        },{
            title: '通话时长',
            dataIndex: 'durationFormat',

        },{
            title: '跟进人员',
            dataIndex: 'sponsorStaffName',
        },{
            title: '摘要',
            dataIndex: 'taskStatus',
            render: (texr:string) => Filter.formatTaskStatus(texr)
        }, {
            title: "记录内容",
            dataIndex: 'taskDesc',
            width: 100,
            render: (text:string) => <Popover content={<div className="gym-call-table-remark">{text}</div>}>
                <div>{CommonUtils.cutstr(text, 10)}</div>
            </Popover>
        },{
            title: '操作',
            dataIndex: 'action',
            render: (text:string, record:any) =>
                record.taskMainId
                    ? <EditCallRecordRemark record={record} emitSubmit={this.props.emitSubmit}/>
                    : null
        },
    ];
    render(){
        const {recordDataSource} = this.props
        return(
            <Table
                className="border"
                columns={this.telephoneColumns}
                dataSource={recordDataSource}
                rowKey={'id'}
            />
        )
    }
}

export {RecordTable}
