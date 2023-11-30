/**
 *Desc: 除手动回收的其他页面
 *User: Debby.Deng
 *Date: 2018/11/7,
 *Time: 上午11:09
 */

import React from "react";
import {CommonRecords, WrappedComponent} from "./record";
import {User} from "../../../../../common/beans/user";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {form} from "../../../../../common/decorator/form";
import {
    historyDownload,
    leadsTransfer,
    longTimeNoContact,
    longTimeNoSign,
    looseLeads, noContact,
    unReceiveList, vipTransfer
} from "@redux-actions/customer/historyList";
import {historyStatus} from "@/ui/pages/customer/enum/history";
import {HistoryMultSelect} from "@/ui/pages/customer/history/part/historyMultSelect";
import {Message} from "@/ui/component/message/message";
import moment from 'moment';
@form()
class OtherRecycle extends React.Component<any, any>{
    state={
        resData:{},
        recordType:'',
        query:{
            currentCenterId: User.currentCenterId,
            gaStaffIdList: [],
            gbStaffIdList: [],
            phone:null,
            pageNo:1,
            pageSize:10,
        },
    };
    handleSearch=(values)=>{
        const query={
            gaStaffIdList:values.GA,
            gbStaffIdList:values.GB,
            phone:values.phone,
            pageNo:1,
            pageSize:10,
            loseTimeStart: values.loseTime ? moment(values.loseTime[0]).startOf('day').valueOf() : null,
            loseTimeEnd: values.loseTime ? moment(values.loseTime[1]).endOf('day').valueOf() : null,
            transferTimeStart: values.transferTime ? moment(values.transferTime[0]).startOf('day').valueOf() : null,
            transferTimeEnd: values.transferTime ? moment(values.transferTime[1]).endOf('day').valueOf() : null,
            transfervipTimeStart: values.transfervipTime ? moment(values.transfervipTime[0]).startOf('day').valueOf() : null,
            transfervipTimeEnd: values.transfervipTime ? moment(values.transfervipTime[1]).endOf('day').valueOf() : null,
        };
        const {phone}=values;
        if(phone){
            const phoneReg = /^1[3456789]\d{9}$/;
            if (!phoneReg.test(phone)) {
                Message.error('请输入11位数的手机号码');
                return;
            }
        }
        this.resetState(query);
    };
    handlePageChange=(page)=>{
        this.resetState(page);
    };
    resetState=(params)=>{
        const {type}=this.props;
        let request=null;
        switch(type){
            case 'loss':request=looseLeads;break;
            case 'transfer':request=leadsTransfer;break;
            case 'disContact':request=longTimeNoContact;break;
            case 'unSign':request=longTimeNoSign;break;
            case 'unReceive':request=unReceiveList;break;
            case 'customerTransfer':request=vipTransfer;break;
            case 'unContact':request=noContact;break;
        }
        const query=Object.assign({},this.state.query,params);
        request(query).then((res)=>{
            this.setState({resData:res,query:query});
        });

    };
    /**
     * 导出
     * @returns {any}
     */
    handleDownload=()=>{
        const {type}=this.props;
        const {resData}:any = this.state;
        const query=Object.assign({},this.state.query,
            {historyType:historyStatus[type],pageNo:null,pageSize:null});
        if(resData.list && resData.list.length>0){
            historyDownload(query);
        }
    };
    componentDidMount(){
        const {type}=this.props;
        let param = {};
        switch(type){
            case 'loss':param = {
                loseTimeStart: moment().subtract(1, 'month').startOf('day').valueOf(),
                loseTimeEnd: moment().endOf('day').valueOf()
            };break;
            case 'transfer':param = {
                transferTimeStart: moment().subtract(1, 'month').startOf('day').valueOf(),
                transferTimeEnd: moment().endOf('day').valueOf()
            };break;
            case 'customerTransfer':param = {
                transfervipTimeStart: moment().subtract(1, 'month').startOf('day').valueOf(),
                transfervipTimeEnd: moment().endOf('day').valueOf()
            };break;
        }
        this.resetState(param);
    }

    render(){
        const {type}=this.props;
        const {resData}:any=this.state;
        const TableWrap=WrappedComponent(CommonRecords,type);
        const table=<TableWrap
            resData={resData}
            onPageChange={this.handlePageChange}/>;
        const role=User.role;
        return (
            <div>
                <HistoryMultSelect onSubmit={this.handleSearch} type={type}/>
                <div className='text-l mb20 mt20 ml30 clear'>
                    {CommonUtils.isInclude(role,['BMS']) && <button
                        className={`${(resData.list &&resData.list.length) > 0 ?
                            `gym-button-default-sm` : 'gym-button-greyb-sm'} fr`}
                        onClick={this.handleDownload}
                    >
                        导出
                    </button>}
                    {
                        ['unReceive', 'unContact', 'disContact', 'unSign'].includes(type) &&
                        <span className='mr15 fr'>本页面支持查询2019年1月1日之后的数据，如需查询更早数据请联系<span className='cDefault'>service@gymboglobal.com </span></span>
                    }
                </div>
                {table}
            </div>
        )
    }
}

export {OtherRecycle}
