/**
 *Desc: 高级查询-课程教学组件
 *User: Debby.Deng
 *Date: 2018/10/12,
 *Time: 上午10:15
 */


import * as React from "react";
import {CommonFrame} from "./common";
import {levelRange} from "../../enum/assign";
import {InputNumber,} from "antd";
import {RangeDateInput} from "../../../../component/datePicker";
import moment from "moment";
import {Select,SelectOption} from "@/ui/pages/customer/assign/advanceSearchPart/newSelect";

declare interface lessonProps {
    form:any,//传入表单
    icon:string,//展开Icon
    word:string,//展开中文
    isExpand:boolean,//是否展开
    lesson:any,//上课情况-后台返回信息
    title:string,//组件Title
}

class Lesson extends React.Component<lessonProps,any> {
    render() {
        const { icon, word, isExpand, title, form, lesson} = this.props;
        const {getFieldDecorator} = form;
        return (
            <CommonFrame icon={icon} word={word} title={title} isExpand={isExpand}>
                <table>
                    <tbody>
                    <tr>
                        <td>
                            近6个月平均周耗课：
                        </td>
                        <td>
                            {
                                getFieldDecorator('lesson-expendsDirection', {
                                    initialValue: lesson.expendsDirection
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
                                getFieldDecorator('lesson-lastHalfyrAverageExpends', {
                                    initialValue: lesson.lastHalfyrAverageExpends
                                })(
                                    <InputNumber/>
                                )
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>近4周出席：</td>
                        <td>
                            {
                                getFieldDecorator('lesson-attendanceDirection', {
                                    initialValue: lesson.attendanceDirection
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
                                getFieldDecorator('lesson-lastFourwksAttendanceTimes', {
                                    initialValue: lesson.lastFourwksAttendanceTimes
                                })(
                                    <InputNumber/>
                                )
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>请假：</td>
                        <td>
                            {
                                getFieldDecorator('lesson-leaveTime-time', {
                                    initialValue: [lesson.leaveTimeBegin && moment(lesson.leaveTimeBegin),
                                        lesson.leaveTimeEnd&& moment(lesson.leaveTimeEnd)]
                                })(<RangeDateInput/>)
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>旷课：</td>
                        <td>
                            {
                                getFieldDecorator('lesson-truantTime-time', {
                                    initialValue: [lesson.truantTimeBegin && moment(lesson.truantTimeBegin),
                                        lesson.truantTimeEnd&& moment(lesson.truantTimeEnd)]
                                })(<RangeDateInput/>)
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>近半年出席率：</td>
                        <td>
                            {
                                getFieldDecorator('lesson-attendanceRateDirection', {
                                    initialValue: lesson.attendanceRateDirection
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
                                getFieldDecorator('lesson-lastHalfyrAttendanceRate', {
                                    initialValue: lesson.lastHalfyrAttendanceRate
                                })(
                                    <InputNumber/>
                                )
                            }
                            <span>%</span>
                        </td>
                    </tr>
                    <tr>
                        <td>近半年耗课率：</td>
                        <td>
                            {
                                getFieldDecorator('lesson-expendRateDirection', {
                                    initialValue: lesson.expendRateDirection
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
                                getFieldDecorator('lesson-lastHalfyrExpendRate', {
                                    initialValue: lesson.lastHalfyrExpendRate
                                })(
                                    <InputNumber/>
                                )
                            }
                            <span>%</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </CommonFrame>
        )
    }
}

export {Lesson};
