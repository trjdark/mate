/**
 *Desc: 选择合同
 *User: Debby.Deng
 *Date: 2019/7/22,
 *Time: 2:41 PM
 */
import * as React from "react";
import {PageTitle} from "@/ui/component/pageTitle";
import {Table, } from "@/ui/component/tablePagination";
import moment from "moment";

class ChooseContract extends React.Component<any>{
    state={
        selectedRowKeys:[this.props.dataSource[0].contractId],
    }
    contractColumns=[
        {
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
        },
        {
            title: '宝宝昵称',
            dataIndex: 'nickName',
            key: 'nickName',
        },
        {
            title: '月龄',
            dataIndex: 'monthValue',
            key: 'monthValue',
        },
        {
            title: '合同编号',
            dataIndex: 'contractCode',
            key: 'contractCode',
        },
        {
            title: '课程包',
            dataIndex: 'packageName',
            key: 'packageName',
        },
        {
            title: '签约日期',
            dataIndex: 'signTime',
            key: 'signTime',
            render:(text)=>(text? moment(text).format('YYYY-MM-DD') : '')
        },
        {
            title: '开课状态',
            dataIndex: 'firstClass',
            key: 'firstClass',
        },
    ];
    onSelectChange=(rowKey)=>{
        this.setState({selectedRowKeys:rowKey});
        this.props.onKeyChange(rowKey);
    };
    render(){
        const {selectedRowKeys}=this.state;
        const rowSelection = {
            selectedRowKeys,
            hideDefaultSelections: true,
            onChange: this.onSelectChange,
            type:'radio'
        }
        return (
            <div className="gym-teaching-schedule-choose-contract">
                <PageTitle title={`选择合同`}/>
                <Table
                    rowSelection={rowSelection}
                    columns={this.contractColumns}
                    rowKey={'contractId'}
                    dataSource={this.props.dataSource}/>

            </div>
        )
    }
}

export {ChooseContract}
