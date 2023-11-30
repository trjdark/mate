/**
 * desc: 活动费用信息组件
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/12/7
 * Time: 下午1:38
 */
import React, {Component, Fragment} from 'react';
import {PageTitle} from "@/ui/component/pageTitle";
import {Button, Icon, Form} from "antd";
import {Select, Option} from "@/ui/component/select";
import {connect} from "react-redux";
import GetFreebie from './getFreebie';
import {cloneDeep} from 'lodash';
import {InputNumber} from "@/ui/component/input";
import {setActivityData} from "@/saga/actions/activity/activityDetail";

const {Item} = Form;

const ACTUALACTIVITYCOST = 'ACTUALACTIVITYCOST';    // 更改实际活动费用
const PAYMODE = 'PAYMODE';      // 更改扣费方式;
const APPLICATIONCONSUMPTION = 'APPLICATIONCONSUMPTION';    // 更改扣课数
const APPLICATIONFEE = 'APPLICATIONFEE';    // 更改付费金额
const ESTIMATEDPARTICIPANTNUM = 'ESTIMATEDPARTICIPANTNUM';      // 更改规划宝宝数
const ACTUALFREEGIFTLIST = 'ACTUALFREEGIFTLIST';    // 改变实际的赠品列表
const FREEGIFTLIST = 'FREEGIFTLIST';    // 规划的产品列表

class CostInfoForm extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            showFreebieModal: false,     // 显示选择赠品弹框，默认不显示
            freeListType: false,         // 赠品弹框的类型, false表示规划赠品的弹框，true表示实际赠品的弹框
        };
        this.handleOpenFreebie = this.handleOpenFreebie.bind(this);
        this.handleCloseFreebie = this.handleCloseFreebie.bind(this);
        this.handleRemoveFreebie = this.handleRemoveFreebie.bind(this);
        this.handleInputNumberChange = this.handleInputNumberChange.bind(this);
    }

    render() {
        const {showFreebieModal, freeListType} = this.state;
        const {
            form, isView, activityPayMode, payMode, estimateFreeGifts, estimateActivityCost, actualActivityCost,
            applicationFee, applicationConsumption, isApproved, actualFreeGifts, estimateParticipantNum,
            actualParticipantNum, estimateTotalCourse, estimateTotalFee, actualTotalCourse, actualTotalFee,
            activityPayModeEnum
        } = this.props;
        const {getFieldDecorator} = form;
        return (
            <Fragment>
                <PageTitle title="活动费用信息" className="mt25"/>
                <div className="gym-activity-plan-table gym-half-radius">
                    <table>
                        <colgroup>
                            <col width="150"/>
                            <col width="150"/>
                            <col width="400"/>
                        </colgroup>
                        <thead>
                        <tr>
                            <th/>
                            <th>本期活动</th>
                            <th>规划</th>
                            <th>{isApproved ? '实际' : ''}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td rowSpan={2} className="rowSpan">活动费用</td>
                            <td><span className={!isView ? 'error' : ''}>活动费用：</span></td>
                            <td>
                                <Item className="input-wrap">
                                    {
                                        getFieldDecorator('activityCost', {
                                            initialValue: estimateActivityCost,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '活动费用不能为空'
                                                },
                                            ]
                                        })(
                                            <InputNumber
                                                disabled={isView}
                                                style={{width: 250}}
                                                precision={2}
                                                min={0}
                                                placeholder="请输入"
                                            />
                                        )
                                    }
                                </Item>
                            </td>
                            <td>
                                {
                                    isApproved ?
                                        getFieldDecorator('actualActivityCost', {
                                            initialValue: actualActivityCost,
                                        })(
                                            <InputNumber
                                                style={{width: 250}}
                                                precision={2}
                                                placeholder="请输入"
                                                onChange={value => this.handleInputNumberChange(ACTUALACTIVITYCOST, value)}
                                            />
                                        ) : ''
                                }
                            </td>
                        </tr>
                        <tr>
                            <td><span>活动赠品：</span></td>
                            <td>
                                <div className="freebie-wrap">
                                    {
                                        estimateFreeGifts.map((item, index) => {
                                            return (
                                                <div
                                                    className="freebie-list"
                                                    key={`estimate_${item.id}`}
                                                >
                                                    <span>{item.freeGiftName} * {item.freeGiftNum}</span>
                                                    {
                                                        !isView ? (
                                                            <Icon
                                                                className="freebie-remove"
                                                                type="close"
                                                                onClick={() => this.handleRemoveFreebie(index, false)}
                                                            />
                                                        ) : null
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        !isView ? (
                                            <Button
                                                htmlType="button"
                                                type="primary"
                                                size="small"
                                                shape="circle"
                                                icon="plus"
                                                style={{float: 'left'}}
                                                onClick={() => this.handleOpenFreebie(false)}
                                            />
                                        ) : null
                                    }
                                </div>
                            </td>
                            <td>
                                {
                                    isApproved ? (
                                        <div className="freebie-wrap">
                                            {
                                                actualFreeGifts.map((item, index) => {
                                                    return (
                                                        <div
                                                            className="freebie-list"
                                                            key={`actual_${item.id}`}
                                                        >
                                                            <span>{item.freeGiftName} * {item.freeGiftNum}</span>
                                                            <Icon
                                                                className="freebie-remove"
                                                                type="close"
                                                                onClick={() => this.handleRemoveFreebie(index, true)}
                                                            />
                                                        </div>
                                                    )
                                                })

                                            }
                                            {
                                                <Button
                                                    htmlType="button"
                                                    type="primary"
                                                    size="small"
                                                    shape="circle"
                                                    icon="plus"
                                                    style={{float: 'left'}}
                                                    onClick={() => this.handleOpenFreebie(true)}
                                                />
                                            }
                                        </div>
                                    ) : ''
                                }
                            </td>
                        </tr>
                        <tr>
                            <td rowSpan={4} className="rowSpan">活动收费</td>
                            <td><span className={!isView ? 'error' : ''}>扣费方式：</span></td>
                            <td>
                                <Item className="input-wrap">
                                    {
                                        getFieldDecorator('payMode', {
                                            initialValue: payMode,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '扣费方式不能为空'
                                                },
                                            ]
                                        })(
                                            <Select
                                                disabled={isView}
                                                style={{width: 250}}
                                                placeholder="请选择"
                                                onChange={value => this.handleInputNumberChange(PAYMODE, value)}
                                            >
                                                {
                                                    activityPayMode.map(item => {
                                                        const {code, codeValue} = item;
                                                        return (
                                                            <Option value={code} key={code}>
                                                                {codeValue}
                                                            </Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        )
                                    }
                                </Item>
                            </td>
                            <td>
                                {
                                    isApproved ?
                                        getFieldDecorator('payMode', {
                                            initialValue: payMode,
                                        })(
                                            <Select disabled={isView} style={{width: 250}} placeholder="请选择">
                                                {
                                                    activityPayMode.map(item => {
                                                        const {code, codeValue} = item;
                                                        return (
                                                            <Option value={code} key={code}>
                                                                {codeValue}
                                                            </Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        ) : ''
                                }
                            </td>
                        </tr>
                        <tr>
                            <td><span className={!isView ? 'error' : ''}>扣课数：</span></td>
                            <td>
                                <InputNumber
                                    value={applicationConsumption}
                                    precision={0}
                                    min={0}
                                    disabled={isView || payMode === activityPayModeEnum.仅付费 || payMode === activityPayModeEnum.免费}
                                    style={{width: 250}}
                                    onChange={value => this.handleInputNumberChange(APPLICATIONCONSUMPTION, value)}
                                />
                            </td>
                            <td>
                                {
                                    isApproved ? getFieldDecorator('applicationConsumption', {
                                        initialValue: applicationConsumption
                                    })(
                                        <InputNumber
                                            precision={0}
                                            min={0}
                                            disabled={isView}
                                            style={{width: 250}}
                                        />
                                    ) : ''
                                }
                            </td>
                        </tr>
                        <tr>
                            <td><span className={!isView ? 'error' : ''}>付费金额：</span></td>
                            <td>
                                <InputNumber
                                    value={applicationFee}
                                    disabled={isView || payMode === activityPayModeEnum.仅扣课 || payMode === activityPayModeEnum.免费}
                                    style={{width: 250}}
                                    precision={2}
                                    min={0}
                                    onChange={value => this.handleInputNumberChange(APPLICATIONFEE, value)}
                                />
                            </td>

                            <td>
                                {
                                    isApproved ?
                                        getFieldDecorator('applicationFee', {
                                            initialValue: applicationFee
                                        })(
                                            <InputNumber
                                                disabled={isView}
                                                style={{width: 250}}
                                                precision={2}
                                                min={0}
                                            />
                                        ) : ''
                                }
                            </td>
                        </tr>
                        <tr>
                            <td><span className={!isView ? 'error' : ''}>宝宝数：</span></td>
                            <td>
                                <Item className="input-wrap">
                                    {
                                        getFieldDecorator('participantNum', {
                                            initialValue: estimateParticipantNum,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '宝宝数不能为空'
                                                },
                                            ]
                                        })(
                                            <InputNumber
                                                disabled={isView}
                                                precision={0}
                                                min={0}
                                                style={{width: 250}}
                                                placeholder="请输入"
                                                onChange={value => this.handleInputNumberChange(ESTIMATEDPARTICIPANTNUM, value)}
                                            />
                                        )
                                    }
                                </Item>
                            </td>
                            <td>{isApproved ? actualParticipantNum : ''}</td>
                        </tr>
                        <tr>
                            <td rowSpan={2} className="rowSpan">活动绩效</td>
                            <td>总扣课数：</td>
                            <td>{estimateTotalCourse}</td>
                            <td>{isApproved ? actualTotalCourse : null}</td>
                        </tr>
                        <tr>
                            <td>总付费金额：</td>
                            <td>{estimateTotalFee}</td>
                            <td>{isApproved ? actualTotalFee : null}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                {
                    showFreebieModal ? (
                        <GetFreebie
                            handleCloseFreebie={this.handleCloseFreebie}
                            handleOpenFreebie={this.handleOpenFreebie}
                            freeListType={freeListType}
                        />
                    ) : null
                }
            </Fragment>
        )
    }

    /**
     * 打开选择赠品弹框
     * @params type 弹框类型，规划赠品弹框或者实际赠品弹框
     */
    handleOpenFreebie(type) {
        this.setState({
            showFreebieModal: true,
            freeListType: type,
        })
    }

    /*关闭选择赠品弹框*/
    handleCloseFreebie() {
        this.setState({
            showFreebieModal: false
        })
    }

    /*移除选择的赠品*/
    handleRemoveFreebie(index, type) {
        const {estimateFreeGifts, actualFreeGifts} = this.props;
        if (type) {
            // 移除实际的赠品
            const list = cloneDeep(actualFreeGifts);
            list.splice(index, 1);
            this.props.setActivityData(ACTUALFREEGIFTLIST, list);
        } else {
            const list = cloneDeep(estimateFreeGifts);
            list.splice(index, 1);
            this.props.setActivityData(FREEGIFTLIST, list);
        }
    }

    /*改变数据*/
    handleInputNumberChange(type, num) {
        this.props.setActivityData(type, num);
    }
}

const mapStateToProps = state => {
    const {
        types,                      // 各种类型值
        payMode,                    // 扣费方式
        estimateFreeGifts,          // 规划赠品列表
        estimateActivityCost,       // 规划活动费用
        applicationFee,             // 付费金额
        estimateParticipantNum,     // 规划的宝宝数
        applicationConsumption,     // 扣课数
        actualActivityCost,         // 真实活动费用
        actualParticipantNum,       // 实际的宝宝数
        estimateTotalCourse,        // 规划的总扣课数
        estimateTotalFee,           // 规划的总付费金额
        actualTotalCourse,          // 实际总扣课数
        actualTotalFee,             // 实际总付费金额
        actualFreeGifts,            // 实际的赠品
    } = state.activityDetail;

    const {
        activityPayMode,            // 活动支付类型
        activityPayModeEnum,        // 支付方式的枚举值（用于比较）
    } = types;

    return {
        activityPayMode,
        payMode,
        estimateFreeGifts,
        estimateActivityCost,
        applicationFee,
        estimateParticipantNum,
        applicationConsumption,
        actualActivityCost,
        actualParticipantNum,
        estimateTotalCourse,
        estimateTotalFee,
        actualTotalCourse,
        actualTotalFee,
        actualFreeGifts,
        activityPayModeEnum,
    }
};
const mapDispatchToProps = dispatch => ({
    setActivityData(type, data) {
        dispatch(setActivityData(type, data));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(CostInfoForm);
