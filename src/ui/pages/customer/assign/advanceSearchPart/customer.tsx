/**
*Desc: 高级查询-客户获取组件
*User: Debby.Deng
*Date: 2018/10/12,
*Time: 上午10:15
*/

import {Checkbox,InputNumber} from "antd";
import {
    appearanceType,
     charLevel,
    contractType,
    recycleReason
} from "../../enum/assign";
import moment from "moment";
import * as React from "react";
import {CommonFrame} from "./common";
import {RangeDateInput} from "../../../../component/datePicker";

const CheckboxGroup=Checkbox.Group;
import {Select,SelectOption} from "@/ui/pages/customer/assign/advanceSearchPart/newSelect";
import {levelRange} from "@/ui/pages/customer/enum/assign";
import {getCodeInfoByType} from "@redux-actions/customerCreate";
import {User} from "@/common/beans/user";


class Customer extends React.Component<any,any> {
    state={
        ChannelTypeList: [],

    }
    componentDidMount(){
        //获取渠道列表
        getCodeInfoByType({
            type: 'ChannelType',
            currentCenterId: User.currentCenterId
        }).then((res) => {
            this.setState({ChannelTypeList: res.map((item)=>({
                    value:item.code,
                    label:item.codeValue
                })
                )})
        })
    }
    render() {
        const {form, icon, word, customer, isExpand, title,cpackageList,gbList} = this.props;
        const {getFieldDecorator} = form;
        const {ChannelTypeList}=this.state;
        return (
            <CommonFrame icon={icon} word={word} title={title} isExpand={isExpand}>
                <table>
                    <tbody>
                    <tr>
                        <td>
                            出现方式：
                        </td>
                        <td>
                            {
                                getFieldDecorator('customer-appearanceType', {
                                    initialValue: customer.appearanceType||[]//array
                                })(
                                    <CheckboxGroup options={appearanceType}/>
                                )
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            渠道来源：
                        </td>
                        <td>
                            {
                                getFieldDecorator('customer-channelType', {
                                    initialValue: customer.channelType||[]//array
                                })(
                                    <CheckboxGroup options={ChannelTypeList}/>
                                )
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            课程包名称：
                        </td>
                        <td>
                            {
                                getFieldDecorator('customer-centerPackageId', {
                                    initialValue: customer.centerPackageId
                                })(

                                    <Select>
                                        {
                                            (cpackageList).map((item: any) =>
                                                <SelectOption key={item.centerPackageId} value={item.centerPackageId}>
                                                    {item.packageName}
                                                </SelectOption>
                                            )
                                        }
                                    </Select>
                                )
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            合同到期日：
                        </td>
                        <td>
                            {
                                getFieldDecorator('customer-endTime-time', {
                                    initialValue: [customer.endTimeBegin && moment(customer.endTimeBegin),
                                        customer.endTimeEnd && moment(customer.endTimeEnd)]
                                })(
                                    <RangeDateInput />
                                )
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            合同类型：
                        </td>
                        <td>
                            {
                                getFieldDecorator('customer-contractType', {
                                    initialValue: customer.contractType||[]
                                })(
                                    <CheckboxGroup options={contractType}/>
                                )
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            剩余课时：
                        </td>
                        <td>
                            {
                                getFieldDecorator('customer-remainingDirection', {
                                    initialValue: customer.remainingDirection
                                })(
                                    <Select className='mr15'>
                                        {
                                            (levelRange).map((item: any) =>
                                                <SelectOption key={item.value} value={item.value}>
                                                    {item.name}
                                                </SelectOption>
                                            )
                                        }
                                    </Select>
                                )
                            }
                            {
                                getFieldDecorator('customer-remainingCourseNum', {
                                    initialValue: customer.remainingCourseNum
                                })(
                                    <InputNumber min={0} precision={0}/>
                                )
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            意向度：
                        </td>
                        <td>
                            {
                                getFieldDecorator('customer-intentionLevel', {
                                    initialValue: customer.intentionLevel
                                })(
                                    <Select>
                                        {
                                            (charLevel).map((item: any) =>
                                                <SelectOption key={item.value} value={item.value}>
                                                    {item.name}
                                                </SelectOption>
                                            )
                                        }
                                    </Select>
                                )
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            原GB：
                        </td>
                        <td>
                            {
                                getFieldDecorator('customer-oldPrimaryGbStaffId', {
                                    initialValue: customer.oldPrimaryGbStaffId
                                })(
                                    <Select>
                                        {
                                            (gbList).map((item: any) =>
                                                <SelectOption key={item.staffId} value={item.staffId}>
                                                    {`${item.englishName}${item.chineseName}`}
                                                </SelectOption>
                                            )
                                        }
                                    </Select>
                                )
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            回炉原因：
                        </td>
                        <td>
                            {
                                getFieldDecorator('customer-recycleReason', {
                                    initialValue: customer.recycleReason||[]
                                })(
                                    <CheckboxGroup options={recycleReason}/>
                                )
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            回炉时间：
                        </td>
                        <td>
                            {
                                getFieldDecorator('customer-recycleTime-time', {
                                    initialValue: [customer.recycleTimeBegin && moment(customer.recycleTimeBegin),
                                        customer.recycleTimeEnd && moment(customer.recycleTimeEnd)]
                                })(
                                    <RangeDateInput />
                                )
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Leads创建日：
                        </td>
                        <td>
                            {
                                getFieldDecorator('customer-createDate-time', {
                                    initialValue: [customer.createDateBegin && moment(customer.createDateBegin),
                                        customer.createDateEnd && moment(customer.createDateEnd)]
                                })(
                                    <RangeDateInput />
                                )
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Leads获取日：
                        </td>
                        <td>
                            {
                                getFieldDecorator('customer-inquireDate-time', {
                                    initialValue: [customer.inquireDateBegin && moment(customer.inquireDateBegin),
                                        customer.inquireDateEnd && moment(customer.inquireDateEnd)]
                                })(
                                    <RangeDateInput />
                                )
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            最近领取时间：
                        </td>
                        <td>
                            {
                                getFieldDecorator('customer-lastReceiveTime-time', {
                                    initialValue: [customer.lastReceiveTimeBegin && moment(customer.lastReceiveTimeBegin),
                                        customer.lastReceiveTimeEnd && moment(customer.lastReceiveTimeEnd)]
                                })(
                                    <RangeDateInput />
                                )
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>
                            最近交还时间：
                        </td>
                        <td>
                            {
                                getFieldDecorator('customer-lastReturnTime-time', {
                                    initialValue: [customer.lastReturnTimeBegin && moment(customer.lastReturnTimeBegin),
                                        customer.lastReturnTimeEnd && moment(customer.lastReturnTimeEnd)]
                                })(
                                    <RangeDateInput />
                                )
                            }
                        </td>
                    </tr>
                    </tbody>
                </table>
            </CommonFrame>
        )
    }
}

export {Customer};

