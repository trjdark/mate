/**
 * desc: 预警弹框提示
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/12/2
 * Time: 上午10:20
 */
import React, {Fragment} from 'react';
import {Icon as AntdIcon} from 'antd';
import {Icon} from "@/ui/component/icon";
import {connect} from "@/common/decorator/connect";
import {selectEarlyWarningAlert} from "@/saga/selectors/home";
import {clearEarlyWarning} from "@redux-actions/homeActions";

@connect((state) => ({
    errList: selectEarlyWarningAlert(state)
}), {clearEarlyWarning})
class EarlyWarning extends React.Component<any, any>{
    constructor(props:any){
        super(props)
        this.state = {

        }
    }
    /**
     * 关闭提示弹层
     */
    closeModal = () => {
        this.props.clearEarlyWarning()
    };
    /**
     * 渲染信息
     * @param record
     */
    renderList = (record:any) => {
        const option = new Map([
            ['81001', (
                <p className="gym-early-warning-modal-content-text">
                    本月<span className="high-light">
                    Leads数指标{record.warningNum}{record.unit}，
                    MTD Leads数指标{record.shouldValue}{record.unit}，
                    MTD Leads数为{record.realValue}{record.unit}，
                    </span>
                    尚未达标，请及时关注！
                </p>
            )], ['81002', (
                <p className="gym-early-warning-modal-content-text">
                    本月<span className="high-light">OPP数指标{record.warningNum}{record.unit}，
                    MTD OPP数指标{record.shouldValue}{record.unit}，
                    MTD OPP数已获取{record.realValue}{record.unit}，</span>
                    尚未达标，请及时关注！
                </p>
            )], ['81003', (
                <p className="gym-early-warning-modal-content-text">
                    本月<span className="high-light">OPP—PAY转化率指标{record.warningNum}{record.unit}，
                    当前OPP—PAY转化率{record.realValue}{record.unit}，
                    </span>
                    尚未达标，请及时关注！
                </p>
            )], ['81004', (
                <p className="gym-early-warning-modal-content-text">
                    本月<span className="high-light">待分配数指标{record.warningNum}{record.unit}，
                    当前待分配数指标{record.realValue}{record.unit}，
                    </span>
                    数量过多，请及时关注！
                </p>
            )], ['81005', (
                <p className="gym-early-warning-modal-content-text">
                    本月<span className="high-light">已分配数指标（{record.warningNum}{record.unit}）个，
                    当前已分配数{record.realValue}个，
                    </span>
                    数量过多，请及时关注！
                </p>
            )], ['81006', (
                <p className="gym-early-warning-modal-content-text">
                    本月<span className="high-light">已领取数指标（{record.warningNum}{record.unit}）个，
                    当前已领取数{record.realValue}个，
                    </span>
                    数量过多，请及时关注！
                </p>
            )],['81007', (
                <p className="gym-early-warning-modal-content-text">
                    本月<span className="high-light">业绩指标{record.warningNum}{record.unit}，
                    MTD 业绩指标{record.shouldValue}{record.unit}，
                    MTD 业绩指标进度完成{record.realValue}{record.unit}，
                    </span>
                    尚未达标，请及时关注！
                </p>
            )],
        ]);
        return option.get(record.warningCode) ? option.get(record.warningCode) : null;
    };
    render(){
        const {errList} = this.props;
        const visible = errList.length > 0;
        return <Fragment>
            <div id="gym-early-warning-modal" className={`gym-early-warning-modal ${visible ? 'active' : ''}`} >
                <div className="gym-early-warning-modal-head">
                    <div className="gym-early-warning-modal-head-title">
                        <Icon type="beizhu" className="title"/>
                        <span>关键数据预警</span>
                    </div>
                    <span onClick={this.closeModal}><AntdIcon type="close" className="close"/></span>
                </div>
                <div className="gym-early-warning-modal-content">
                    {
                        errList.map((item:any) => this.renderList(item))
                    }
                </div>
            </div>
        </Fragment>
    }
}

export {EarlyWarning}
