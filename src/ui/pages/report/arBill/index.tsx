/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2022/9/27
 * Time: 下午3:38
 */
import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Routes} from "@/router/enum/routes";
import {MonthInput} from "@/ui/component/datePicker";
import {queryArBill} from "@redux-actions/report/pos";
import moment from 'moment';
import {User} from "@/common/beans/user";
import {CommonUtils} from "@/common/utils/commonUtils";

class ARBill extends React.Component<any, any>{
    BREAD_CRUMB_ROUTE = [
        {name: '报表', id: 'report'},
        {name: '中心管理', id: 'center-manager'},
        {name: '月度AR账单', id: 'bill'}
    ];
    state = {
        companyCode: null,
        endMonth: moment(),
        total: 0,
        dataSource: [],
        endTime:null,
        hasSearch:false,               // 是否查询过

    };
    componentDidMount(){

    }
    disabledDate = (current) => {
        return current < moment('2020-01-01').endOf('day') || current > moment() ;
    }
    handleChange = (value, name: 'companyCode' | 'endMonth') => {
        switch (name){
            case 'companyCode':
                this.setState({companyCode: value});
                break;
            case 'endMonth' :
                this.setState({endMonth: moment(value)})
                break;
        }
    };
    getOrderGoodsLimitData = () => {
        const {companyCode, endMonth} = this.state;
        const param = {
            companyCode,
            endMonth: moment(endMonth).valueOf(),
            centerNo: User.centerCode
        }
        queryArBill(param).then(res => {
            this.setState({
                total: res.total,
                dataSource: res.list,
                endTime: res.endTime,
                hasSearch:true
            })
        })
    };
    render(){
        const {
            endMonth, total, dataSource, companyCode, endTime,
            hasSearch
        }:any = this.state;

        return (
            <Fragment>
                <BreadCrumb routes={this.BREAD_CRUMB_ROUTE}/>
                <div className='page-wrap'>
                    <div className='order-limit-search'>
                        <div className="order-limit-search-form">
                            <label className='ml30'>截止月份：</label>
                            <MonthInput
                                disabledDate={this.disabledDate}
                                value={endMonth}
                                allowClear={false}
                                onChange = {(e) => this.handleChange(e, 'endMonth')}
                            />
                            <button
                                className="gym-button-xs gym-button-blue"
                                onClick = { this.getOrderGoodsLimitData }
                            >
                                查询
                            </button>
                        </div>
                        {
                            hasSearch
                            ? (
                                <Link
                                    to={`${Routes.月度AR账单明细.link}${CommonUtils.stringify({companyCode: companyCode, endMonth: moment(endMonth).valueOf()})}`}
                                    target="_blank"
                                >
                                    <button className="gym-button-sm gym-button-default">月度AR明细</button>
                                </Link>
                            )
                            : <button className="gym-button-sm gym-button-grey ">月度AR明细</button>
                        }

                    </div>
                    <div className="order-limit-wrap">
                        <div>
                            <p className="order-limit">月度AR余额：<span>{CommonUtils.toThousands(total)}</span></p>
                        </div>
                    </div>
                    <ul className="order-limit-list mb15">
                        {
                            (dataSource || []).map((item, index) => (
                                <li key={`li_${index}`}>
                                    <p className='lg'>{item.companyName}：</p>
                                    <p>
                                        <span>{CommonUtils.toThousands(item.arBalance)}</span>
                                        <Link
                                            to={`${Routes.月度AR账单明细.link}${CommonUtils.stringify({companyCode: item.companyCode, endMonth: moment(endMonth).valueOf()})}`}
                                            target="_blank"
                                            className="gym-button-xxs gym-button-white"
                                        >
                                            明细
                                        </Link>
                                    </p>
                                </li>
                            ))
                        }

                    </ul>
                    <div>
                        {
                            endTime ? <span className='cDefault'>此数据截止到{moment(endTime).format('YYYY-MM-DD')}</span> : null
                        }
                    </div>
                </div>
            </Fragment>
        )
    }
}

export {ARBill}
