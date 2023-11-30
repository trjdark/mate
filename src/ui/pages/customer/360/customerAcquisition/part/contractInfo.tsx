/**
 *Desc: 合同信息
 *User: Debby.Deng
 *Date: 2018/11/5,
 *Time: 上午10:03
 */
import * as React from "react";
import {connect} from "../../../../../../common/decorator/connect";
import moment from 'moment';
import {TablePagination} from "../../../../../component/tablePagination";
import history from "@/router/history";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";

@connect((state)=>({
}),{})
class ContractInfo extends React.Component<any>{
    handleChangePage=(page)=>{
        this.props.onPageChange(page);
    };
     /**
      * 行点击事件
      * @param record
      * @returns {any}
      */
    onRowFunction=(record)=>{
        return {
            onClick:()=>{
                history.push(`${Routes.合同详情.link}${CommonUtils.stringify({contractCode:record.contractCode, contractId:record.contractId})}`)
            }
        }
    };
    render(){
        const {contractInfo}=this.props;
        const columns=[
            {
                title: '合同编号',
                dataIndex: 'contractCode',
                key: 'contractCode',
                render:(text:string,record:any)=>(
                    record.priority === 1 ? <div>{text}<span style={{fontSize:"12px",color:"#009cbd",marginLeft:"5px"}}>C端优先扣课</span></div> : text
                )
            }, {
                title: '课程包',
                dataIndex: 'packageName',
                key: 'packageName',
            },
            {
                title: '合同金额',
                dataIndex: 'contractTotal',
                key: 'contractTotal',
                render:(text,record)=>(Number(record.registeredFee||0)+Number(record.reallyAfterDiscountPrice||0)).toFixed(2)
            }, {
                title: '剩余课时',
                dataIndex: 'remainingCourseNum',
                key: 'remainingCourseNum',
                render: (text:number, record:any) => `${record.remainingPackageCourseNum } + ${record.reallyFreeCourseNum}`
            },
            {
                title: '剩余金额',
                dataIndex: 'remainingCoursePrice',
                key: 'remainingCoursePrice',
                render: (num:number) => num.toFixed(2)

            }, {
                title: '合同到期日',
                dataIndex: 'endTime',
                key: 'endTime',
                render:(text)=>(text? moment(text).format('YYYY-MM-DD') : '')
            }
            ,{
                title: '付款状态',
                dataIndex: 'paymentStatus',
                key: 'paymentStatus',
            },
        ];
        return (
            <TablePagination
                columns={columns}
                rowKey={'contractId'}
                dataSource={contractInfo.list}
                totalSize={contractInfo.totalSize}
                pageSize={contractInfo.pageSize}
                handleChangePage={this.handleChangePage}
                pageNo={contractInfo.pageNo}
                onRow={this.onRowFunction}
            />
        )
    }
}

export {ContractInfo};
