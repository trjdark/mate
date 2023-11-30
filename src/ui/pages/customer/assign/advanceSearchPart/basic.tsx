/**
 *Desc: 高级查询-基础信息组件
 *User: Debby.Deng
 *Date: 2018/10/12,
 *Time: 上午10:06
 */


import {InputNumber,Radio} from "antd";
import {Input} from "../../../../component/input";
import {gender} from "../../enum/assign";
import moment from "moment";
import * as React from "react";
import {CommonFrame} from "./common";
const RadioGroup=Radio.Group;
import {Select,SelectOption} from "@/ui/pages/customer/assign/advanceSearchPart/newSelect";
import {MonthInput} from "../../../../component/datePicker";

declare interface basicProps {
    form:any,//传入表单
    icon:string,//展开Icon
    word:string,//展开中文
    isExpand:boolean,//是否展开
    basic:any,//基础信息-后台返回信息
    districtList:Array<any>,//区域列表-后台接口返回
    title:string,//组件Title
}

class Basic extends React.Component<basicProps,any>{
    render(){
        const {form,icon,word,basic,isExpand,districtList,title}=this.props;
        const {getFieldDecorator}=form;
        return (
            <CommonFrame icon={icon} word={word} title={title} isExpand={isExpand}>
                <table className='gym-advanced-search-table' id='gym-advanced-search-table-basic'>
                    <tbody>
                    <tr>
                        <td className='gym-advanced-search-table-label'>
                            月龄:
                        </td>
                        <td>

                            {
                                getFieldDecorator('basic-monthBegin', {
                                    initialValue: basic.monthBegin
                                })(
                                    <InputNumber min={0} precision={0}/>
                                )
                            }
                            <span> 至 </span>
                            {
                                getFieldDecorator('basic-monthEnd', {
                                    initialValue: basic.monthEnd
                                })(
                                    <InputNumber min={1} precision={0}/>
                                )
                            }
                            <span>个月</span>
                        </td>
                        <td>
                            性别：
                        </td>
                        <td>
                            {
                                getFieldDecorator('basic-gender', {
                                    initialValue: basic.gender,
                                })(
                                    <RadioGroup>
                                        {
                                            gender.map((item) => {
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
                        <td>
                            区县：
                        </td>
                        <td>
                            {
                                getFieldDecorator('basic-district', {
                                    initialValue: basic.district
                                })(
                                    <Select allowClear={true}>
                                        {
                                            (districtList).map((item: any) =>
                                                <SelectOption key={item.code} value={item.code}>
                                                    {item.codeValue}
                                                </SelectOption>
                                            )
                                        }
                                    </Select>
                                )
                            }

                        </td>
                        <td>
                            小区：
                        </td>
                        <td>
                            {
                                getFieldDecorator('basic-quarter', {
                                    initialValue: basic.quarter
                                })(
                                    <Input placeholder={`请输入小区名称`}/>
                                )
                            }
                        </td>
                    </tr>
                    <tr className='gym-advanced-search-table-last-tr'>
                        <td className='gym-advanced-search-table-last-tr-left-td'>
                            出生年月：
                        </td>
                        <td>
                            {
                                getFieldDecorator('basic-yearMonth-singleTime', {
                                    initialValue: basic.yearMonth && moment(basic.yearMonth,`YYYY-MM`),
                                })(
                                    <MonthInput
                                        format={`YYYY-MM`}
                                    />
                                )
                            }
                        </td>
                        <td/>
                        <td className='gym-advanced-search-table-last-tr-right-td'/>
                    </tr>
                    </tbody>
                </table>
            </CommonFrame>
        )
    }
}

export {Basic}
