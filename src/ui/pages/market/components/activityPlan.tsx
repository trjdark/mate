/**
 * desc: 市场渠道
 * User: Lyon.li@gymboglobal.com
 * Date: 2018/11/22
 * Time: 下午1:38
 */
import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {PageTitle} from "@/ui/component/pageTitle";
import {InputNumber} from "@/ui/component/input";
import {setInputValue} from "@/saga/actions/market/marketDetail";
import {SafeCalculate} from "@/common/utils/commonUtils";

const pattern = /\B(?=(\d{3})+(?!\d))/g;
const filter = (num: number, digit = 2) => {
    if (Number.isNaN(num) || num === Infinity || num === -Infinity || num == null) {
        num = 0;
    }
    return num.toFixed(digit).replace(pattern, ',');
};

class ActivityPlan extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleNumberInputBlur = this.handleNumberInputBlur.bind(this);
    }

    render() {
        const {
            isView, form, estimatedFieldCost, realFieldCost, estimatedMaterialCost, realMaterialCost, estimatedPersonnelCost, realPersonCost,
            estimatedDays, realDays, estimatedLeads, realTotalLeadsNum, memberTransferRate, estimatedMember, realTotalMemberNum,
            averagePackageAmount, realAveragePackageAmount, realEachLeadsCost, realEachContractCost, realMemberTransferRate, realSaleExpendsRate,
            averageMemberTransferRate, maxMemberTransferRate, minMemberTransferRate, avgAveragePackageAmount, maxAveragePackageAmount,
            minAveragePackageAmount, avgSaleExpendsRate, maxSaleExpendsRate, minSaleExpendsRate, avgEachLeadsCost, maxEachLeadsCost,
            minEachLeadsCost, avgEachContractCost, maxEachContractCost, minEachContractCost, realActivityTotalCost, realTotalDiscountAmmount
        } = this.props;

        const {getFieldDecorator} = form;
        const estimatedTotalCost = SafeCalculate.add(estimatedFieldCost, estimatedMaterialCost, estimatedPersonnelCost);
        const estimatedAmount = SafeCalculate.mul(Math.floor(SafeCalculate.mul(memberTransferRate, estimatedLeads)), averagePackageAmount);
        return (
            <Fragment>
                <PageTitle title={`本期活动规划`} className="mt25"/>
                <div>
                    <div className="gym-activity-plan-table gym-half-radius">
                        <table>
                            <colgroup>
                                <col width="150"/>
                                <col width="190"/>
                                <col width="210"/>
                            </colgroup>
                            <thead>
                            <tr>
                                <th/>
                                <th>本期活动</th>
                                <th>规划</th>
                                <th>实际</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td rowSpan={5} className="rowSpan">活动费用</td>
                                <td>场地费用：</td>
                                <td>
                                    {
                                        getFieldDecorator('estimatedFieldCost', {
                                            initialValue: estimatedFieldCost
                                        })(
                                            <InputNumber
                                                name="estimatedFieldCost"
                                                min={0}
                                                precision={2}
                                                disabled={isView}
                                                onBlur={this.handleNumberInputBlur}
                                            />
                                        )
                                    }
                                </td>
                                <td>
                                    {
                                        getFieldDecorator('realFieldCost', {
                                            initialValue: realFieldCost
                                        })(
                                            <InputNumber
                                                name="realFieldCost"
                                                min={0}
                                                precision={2}
                                                disabled={isView}
                                                onBlur={this.handleNumberInputBlur}
                                            />
                                        )
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>物料费用：</td>
                                <td>
                                    {
                                        getFieldDecorator('estimatedMaterialCost', {
                                            initialValue: estimatedMaterialCost
                                        })(
                                            <InputNumber
                                                name="estimatedMaterialCost"
                                                min={0}
                                                precision={2}
                                                disabled={isView}
                                                onBlur={this.handleNumberInputBlur}
                                            />
                                        )
                                    }
                                </td>
                                <td>
                                    {
                                        getFieldDecorator('realMaterialCost', {
                                            initialValue: realMaterialCost
                                        })(
                                            <InputNumber
                                                name="realMaterialCost"
                                                min={0}
                                                precision={2}
                                                disabled={isView}
                                                onBlur={this.handleNumberInputBlur}
                                            />
                                        )
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>人员费用：</td>
                                <td>
                                    {
                                        getFieldDecorator('estimatedPersonnelCost', {
                                            initialValue: estimatedPersonnelCost
                                        })(
                                            <InputNumber
                                                name="estimatedPersonnelCost"
                                                min={0}
                                                precision={2}
                                                disabled={isView}
                                                onBlur={this.handleNumberInputBlur}
                                            />
                                        )
                                    }
                                </td>
                                <td>
                                    {
                                        getFieldDecorator('realPersonCost', {
                                            initialValue: realPersonCost
                                        })(
                                            <InputNumber
                                                name="realPersonCost"
                                                min={0}
                                                precision={2}
                                                disabled={isView}
                                                onBlur={this.handleNumberInputBlur}
                                            />
                                        )
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>活动天数：</td>
                                <td>
                                    {
                                        getFieldDecorator('estimatedDays', {
                                            initialValue: estimatedDays
                                        })(
                                            <InputNumber
                                                name="estimatedDays"
                                                min={0}
                                                precision={0}
                                                disabled={isView}
                                                onBlur={this.handleNumberInputBlur}
                                            />
                                        )
                                    }
                                </td>
                                <td>
                                    {
                                        getFieldDecorator('realDays', {
                                            initialValue: realDays
                                        })(
                                            <InputNumber
                                                name="realDays"
                                                min={0}
                                                precision={0}
                                                disabled={isView}
                                                onBlur={this.handleNumberInputBlur}
                                            />
                                        )
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td>总费用：</td>
                                <td>
                                    {
                                        filter(estimatedTotalCost)
                                    }
                                </td>
                                <td>
                                    {
                                        filter(realActivityTotalCost)
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td rowSpan={3} className="rowSpan">活动产出</td>
                                <td>总共收取leads数量：</td>
                                <td>
                                    {
                                        getFieldDecorator('estimatedLeads', {
                                            initialValue: estimatedLeads
                                        })(
                                            <InputNumber
                                                name="estimatedLeads"
                                                min={0}
                                                disabled={isView}
                                                precision={0}
                                                onBlur={this.handleNumberInputBlur}
                                            />
                                        )
                                    }
                                </td>
                                <td>{filter(realTotalLeadsNum,0)}</td>
                            </tr>
                            <tr>
                                <td>总共收取会员数量：</td>
                                <td>{filter(estimatedMember, 0)}</td>
                                <td>{filter(realTotalMemberNum, 0)}</td>
                            </tr>
                            <tr>
                                <td>总课程包金额：</td>
                                <td>{filter(estimatedAmount)}</td>
                                <td>{filter(realTotalDiscountAmmount)}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="gym-activity-plan-table plan-table-latter">
                        <table>
                            <colgroup>
                                <col width="150"/>
                                <col width="190"/>
                                <col width="210"/>
                            </colgroup>
                            <thead>
                            <tr>
                                <th/>
                                <th>本期活动</th>
                                <th>规划</th>
                                <th>实际</th>
                                <th>活动历史平均值</th>
                                <th>活动历史最高</th>
                                <th>活动历史最低</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td rowSpan={5} className="rowSpan">活动绩效</td>
                                <td>leads→会员转化率：</td>
                                <td>
                                    {
                                        getFieldDecorator('memberTransferRate', {
                                            initialValue: memberTransferRate * 100
                                        })(
                                            <InputNumber
                                                name="memberTransferRate"
                                                min={0}
                                                max={100}
                                                precision={2}
                                                disabled={isView}
                                                formatter={value => `${value}%`}
                                                parser={value=>value.replace('%','')}
                                                onBlur={this.handleNumberInputBlur}
                                            />
                                        )
                                    }
                                </td>
                                <td>{filter(SafeCalculate.mul(realMemberTransferRate, 100))}%</td>
                                <td>{filter(SafeCalculate.mul(averageMemberTransferRate, 100))}%</td>
                                <td>{filter(SafeCalculate.mul(maxMemberTransferRate, 100))}%</td>
                                <td>{filter(SafeCalculate.mul(minMemberTransferRate, 100))}%</td>
                            </tr>
                            <tr>
                                <td>平均每单课程包金额：</td>
                                <td>
                                    {
                                        getFieldDecorator('averagePackageAmount', {
                                            initialValue: averagePackageAmount
                                        })(
                                            <InputNumber
                                                name="averagePackageAmount"
                                                min={0}
                                                precision={2}
                                                disabled={isView}
                                                onBlur={this.handleNumberInputBlur}
                                            />
                                        )
                                    }
                                </td>
                                <td>{filter(realAveragePackageAmount)}</td>
                                <td>{filter(avgAveragePackageAmount)}</td>
                                <td>{filter(maxAveragePackageAmount)}</td>
                                <td>{filter(minAveragePackageAmount)}</td>
                            </tr>
                            <tr>
                                <td>营销费用占比：</td>
                                <td>
                                    {
                                        filter((SafeCalculate.mul(SafeCalculate.divide(estimatedTotalCost, estimatedAmount), 100)) || 0) + '%'
                                    }
                                </td>
                                <td>{filter(SafeCalculate.mul(realSaleExpendsRate, 100))}%</td>
                                <td>{filter(SafeCalculate.mul(avgSaleExpendsRate, 100))}%</td>
                                <td>{filter(SafeCalculate.mul(maxSaleExpendsRate, 100))}%</td>
                                <td>{filter(SafeCalculate.mul(minSaleExpendsRate, 100))}%</td>
                            </tr>
                            <tr>
                                <td>每leads成本：</td>
                                <td>
                                    {
                                        filter(SafeCalculate.divide(estimatedTotalCost, estimatedLeads) || 0)
                                    }
                                </td>
                                <td>{filter(realEachLeadsCost)}</td>
                                <td>{filter(avgEachLeadsCost)}</td>
                                <td>{filter(maxEachLeadsCost)}</td>
                                <td>{filter(minEachLeadsCost)}</td>
                            </tr>
                            <tr>
                                <td>每合同成本：</td>
                                <td>
                                    {
                                        filter(SafeCalculate.divide(estimatedTotalCost, estimatedMember) || 0)
                                    }
                                </td>
                                <td>{filter(realEachContractCost)}</td>
                                <td>{filter(avgEachContractCost)}</td>
                                <td>{filter(maxEachContractCost)}</td>
                                <td>{filter(minEachContractCost)}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Fragment>
        )
    }

    handleNumberInputBlur(e) {
        const {setInputValue: setValue} = this.props;
        const {name, value} = e.target;
        const type = `SET_${name.toUpperCase()}`;
        let numValue = value;
        if (value.includes('%')) {
            // 如果是百分号形式，删除百分号
            numValue = value.replace('%', '')/100;
        }
        if (value.includes(',')) {
            // 如果是千分位形式，删除逗号
            numValue = value.replace(/,/g, '');
        }
        setValue(type, +numValue);   // 向redux设置相对应的值

        if (name === 'memberTransferRate' || name === 'estimatedLeads') {
            // 如果当前填写的是规划leads数量或者会员转化率，需要计算总共收取会员数量
            window.requestAnimationFrame(() => {
                const {memberTransferRate, estimatedLeads} = this.props;
                setValue(`SET_${'estimatedMember'.toUpperCase()}`, Math.floor(SafeCalculate.mul(memberTransferRate, estimatedLeads)));
            })
        }

        if (name === 'realFieldCost' || name==='realMaterialCost' || name==='realPersonCost') {
            // 如果当前填写的是真实场地支出，真实物料支出，真实人员支出，需要计算真实总指出
            window.requestAnimationFrame(() => {
                const {realFieldCost, realMaterialCost, realPersonCost} = this.props;
                setValue(`SET_${'realActivityTotalCost'.toUpperCase()}`, SafeCalculate.add(realFieldCost, realMaterialCost, realPersonCost));
            })
        }
    }
}

const mapStateToProps = state => {
    const {
        estimatedFieldCost,          // 场地费用规划
        realFieldCost,               // 场地费用真实
        estimatedMaterialCost,       // 物料费用规划
        realMaterialCost,            // 物料费用真实
        estimatedPersonnelCost,      // 人员费用规划
        realPersonCost,              // 人员费用真实
        estimatedDays,               // 活动天数规划
        realDays,                    // 活动天数真实
        estimatedLeads,              // leads数量计划
        realTotalLeadsNum,           // leads数量真实
        memberTransferRate,          // leads转化率规划
        estimatedMember,             // 收取会员数计划
        realTotalMemberNum,          // 收取会员数真实
        realTotalDiscountAmmount,    // 总课包金额真实
        averagePackageAmount,        // 平均课程包金额规划
        realActivityTotalCost,       // 活动总支出真实
        realAveragePackageAmount,    // 平均课程包金额实际
        realEachLeadsCost,           // 实际每leads成本
        realEachContractCost,        // 实际每合同成本
        realMemberTransferRate,      // 实际会员转化率
        realSaleExpendsRate,         // 实际营销费用占比
        averageMemberTransferRate,   // leads会员转化率(平均值)
        maxMemberTransferRate,       // leads会员转化率(最大)
        minMemberTransferRate,       // leads会员转化率(最低)
        avgAveragePackageAmount,     // 平均每单课程包金额(平均值)
        maxAveragePackageAmount,     // 平均每单课程包金额(最高)
        minAveragePackageAmount,     // 平均每单课程包金额(最低)
        avgSaleExpendsRate,          // 营销费用占比(平均)
        maxSaleExpendsRate,          // 营销费用占比(最大)
        minSaleExpendsRate,          // 营销费用占比(最小)
        avgEachLeadsCost,            // 每leads成本(平均)
        maxEachLeadsCost,            // 每leads成本(最大)
        minEachLeadsCost,            // 每leads成本(最小)
        avgEachContractCost,         // 每合同成本(平均)
        maxEachContractCost,         // 每合同成本(最大)
        minEachContractCost,         // 每合同成本(最小)

    } = state.marketDetail;
    return {
        estimatedFieldCost,
        realFieldCost,
        estimatedMaterialCost,
        realMaterialCost,
        estimatedPersonnelCost,
        realPersonCost,
        estimatedDays,
        realDays,
        estimatedLeads,
        realTotalLeadsNum,
        memberTransferRate,
        estimatedMember,
        realTotalMemberNum,
        realTotalDiscountAmmount,
        averagePackageAmount,
        realAveragePackageAmount,
        realEachLeadsCost,
        realMemberTransferRate,
        realSaleExpendsRate,
        realEachContractCost,
        averageMemberTransferRate,
        maxMemberTransferRate,
        minMemberTransferRate,
        avgAveragePackageAmount,
        maxAveragePackageAmount,
        minAveragePackageAmount,
        avgSaleExpendsRate,
        maxSaleExpendsRate,
        minSaleExpendsRate,
        avgEachLeadsCost,
        maxEachLeadsCost,
        minEachLeadsCost,
        avgEachContractCost,
        maxEachContractCost,
        minEachContractCost,
        realActivityTotalCost
    }
};

const mapStateToDispatch = dispatch => ({
    setInputValue(type, value) {
        dispatch(setInputValue(type, value))
    }
});

export default connect(mapStateToProps, mapStateToDispatch)(ActivityPlan);
