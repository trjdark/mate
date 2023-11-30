/**
 *Desc: 高级查询-客户成长组件
 *User: Debby.Deng
 *Date: 2018/10/12,
 *Time: 上午10:15
 */



import {Checkbox, Radio} from "antd";
import {bool, lastRenewContactStatus} from "../../enum/assign";
import moment from "moment";
import * as React from "react";
import {CommonFrame} from "./common";
const CheckboxGroup=Checkbox.Group;
const RadioGroup=Radio.Group;
import {RangeDateInput} from "../../../../component/datePicker";
import {Select,SelectOption} from "@/ui/pages/customer/assign/advanceSearchPart/newSelect";

class Growth extends React.Component<any,any> {
    render() {
        const { title, form, icon, word, growth, isExpand,gbList,gaList} = this.props;
        const {getFieldDecorator} = form;
        return (
            <CommonFrame icon={icon} word={word} title={title} isExpand={isExpand}>
                <table>
                    <tbody>
                    <tr>
                        <td>续约沟通：</td>
                        <td>
                            {
                                getFieldDecorator('growth-lastRenewContactStatus', {
                                    initialValue: growth.lastRenewContactStatus||[]
                                })(
                                    <CheckboxGroup options={lastRenewContactStatus}/>
                                )
                            }
                        </td>
                        <td>恳谈会参加：</td>
                        <td>
                            {
                                getFieldDecorator('growth-isAttendTalkfest', {
                                    initialValue:typeof growth.isAttendTalkfest==='undefined'? undefined :  growth.isAttendTalkfest
                                })(
                                    <RadioGroup>
                                        {
                                            bool.map((item) => {
                                                return (
                                                    <Radio key={item.value}
                                                           value={item.value}>{item.name}</Radio>
                                                )
                                            })
                                        }
                                    </RadioGroup>
                                )
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>迎新会参加：</td>
                        <td>
                            {
                                getFieldDecorator('growth-isAttendNewcomers', {
                                    initialValue:typeof growth.isAttendNewcomers==='undefined'? undefined :  growth.isAttendNewcomers
                                })(
                                    <RadioGroup>
                                        {
                                            bool.map((item) => {
                                                return (
                                                    <Radio key={item.value}
                                                           value={item.value}>{item.name}</Radio>
                                                )
                                            })
                                        }
                                    </RadioGroup>
                                )
                            }
                        </td>
                        <td>
                            GB：
                        </td>
                        <td>
                            {
                                getFieldDecorator('growth-primaryGbStaffId', {
                                    initialValue: growth.primaryGbStaffId
                                })(
                                    <Select>
                                        {
                                            (gbList).map((item: any) =>
                                                <SelectOption key={item.staffId} value={item.staffId}>
                                                    {item.englishName}{item.chineseName}
                                                </SelectOption>
                                            )
                                        }
                                    </Select>
                                )
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>首次联系：</td>
                        <td>
                            {
                                getFieldDecorator('growth-vleadsTime-time', {
                                    initialValue: [growth.vleadsTimeBegin && moment(growth.vleadsTimeBegin),
                                        growth.vleadsTimeEnd && moment(growth.vleadsTimeEnd)]
                                })(<RangeDateInput/>)
                            }
                        </td>
                        <td>首次到访：</td>
                        <td>
                            {
                                getFieldDecorator('growth-oppTime-time', {
                                    initialValue: [growth.oppTimeBegin && moment(growth.oppTimeBegin),
                                        growth.oppTimeEnd && moment(growth.oppTimeEnd)]
                                })(<RangeDateInput/>)
                            }
                        </td>
                    </tr>
                    <tr>

                        <td>首次试听：</td>
                        <td>
                            {
                                getFieldDecorator('growth-previewTime-time', {
                                    initialValue: [growth.previewTimeBegin && moment(growth.previewTimeBegin),
                                        growth.previewTimeEnd && moment(growth.previewTimeEnd)]
                                })(<RangeDateInput/>)
                            }
                        </td>
                        <td>首次上课：</td>
                        <td>
                            {
                                getFieldDecorator('growth-firstClassTime-time', {
                                    initialValue: [growth.firstClassTimeBegin && moment(growth.firstClassTimeBegin),
                                        growth.firstClassTimeEnd&& moment(growth.firstClassTimeEnd)]
                                })(<RangeDateInput/>)
                            }
                        </td>
                    </tr>
                    <tr>

                        <td>最后一次联系：</td>
                        <td>
                            {
                                getFieldDecorator('growth-lastContactDate-time', {
                                    initialValue: [growth.lastContactDateBegin && moment(growth.lastContactDateBegin),
                                        growth.lastContactDateEnd && moment(growth.lastContactDateEnd)]
                                })(<RangeDateInput/>)
                            }
                        </td>
                        <td>最后一次分配：</td>
                        <td>
                            {
                                getFieldDecorator('growth-distributeTime-time', {
                                    initialValue: [growth.distributeTimeBegin && moment(growth.distributeTimeBegin),
                                        growth.distributeTimeEnd && moment(growth.distributeTimeEnd)]
                                })(<RangeDateInput/>)
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>GA：</td>
                        <td>
                            {
                                getFieldDecorator('growth-primaryGaStaffId', {
                                    initialValue: growth.primaryGaStaffId
                                })(
                                    <Select>
                                        {
                                            (gaList).map((item: any) =>
                                                <SelectOption key={item.staffId} value={item.staffId}>
                                                    {item.englishName}{item.chineseName}
                                                </SelectOption>
                                            )
                                        }
                                    </Select>
                                )
                            }
                        </td>
                        <td></td>
                        <td></td>
                    </tr>
                    </tbody>
                </table>
            </CommonFrame>
        )
    }
}

export {Growth};
