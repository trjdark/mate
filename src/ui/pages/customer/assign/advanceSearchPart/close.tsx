/**
 *Desc: 高级查询-其他信息组件
 *User: Debby.Deng
 *Date: 2018/10/12,
 *Time: 上午10:15
 */



import { levelNum, levelRange} from "../../enum/assign";
import * as React from "react";
import {CommonFrame} from "./common";
import {Select,SelectOption} from "@/ui/pages/customer/assign/advanceSearchPart/newSelect";

declare interface closeProps {
    form:any,//传入表单
    icon:string,//展开Icon
    word:string,//展开中文
    isExpand:boolean,//是否展开
    close:any,//基础信息-后台返回信息
    title:string,//组件Title
}

class Close extends React.Component<closeProps,any> {
    render() {
        const {form, icon, word, close, isExpand, title} = this.props;
        const {getFieldDecorator} = form;
        return (
            <CommonFrame icon={icon} word={word} title={title} isExpand={isExpand}>
                <table>
                    <tbody>
                    <tr>
                        <td style={{width: '10%'}}>
                            理念认同程度
                        </td>
                        <td>
                            {
                                getFieldDecorator('close-ideaDirection', {
                                    initialValue: close.ideaDirection
                                })(
                                    <Select>
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
                                getFieldDecorator('close-idea', {
                                    initialValue: close.idea
                                })(
                                    <Select>
                                        {
                                            (levelNum).map((item: any) =>
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
                            服务要求
                        </td>
                        <td>
                            {
                                getFieldDecorator('close-serviceDirection', {
                                    initialValue: close.serviceDirection
                                })(
                                    <Select>
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
                                getFieldDecorator('close-service', {
                                    initialValue: close.service
                                })(
                                    <Select>
                                        {
                                            (levelNum).map((item: any) =>
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
                            口碑传播速度
                        </td>
                        <td>
                            {
                                getFieldDecorator('close-praiseDirection', {
                                    initialValue: close.praiseDirection
                                })(
                                    <Select>
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
                                getFieldDecorator('close-praise', {
                                    initialValue: close.praise
                                })(
                                    <Select>
                                        {
                                            (levelNum).map((item: any) =>
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
                            满意度
                        </td>
                        <td>
                            {
                                getFieldDecorator('close-satisfactionDirection', {
                                    initialValue: close.satisfactionDirection
                                })(
                                    <Select>
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
                                getFieldDecorator('close-satisfaction', {
                                    initialValue: close.satisfaction
                                })(
                                    <Select>
                                        {
                                            (levelNum).map((item: any) =>
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
                            参与度
                        </td>
                        <td>
                            {
                                getFieldDecorator('close-involvementDirection', {
                                    initialValue: close.involvementDirection
                                })(
                                    <Select>
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
                                getFieldDecorator('close-involvement', {
                                    initialValue: close.involvement
                                })(
                                    <Select>
                                        {
                                            (levelNum).map((item: any) =>
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
                            坚持程度
                        </td>
                        <td>
                            {
                                getFieldDecorator('close-keepDirection', {
                                    initialValue: close.keepDirection
                                })(
                                    <Select>
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
                                getFieldDecorator('close-keep', {
                                    initialValue: close.keep
                                })(
                                    <Select>
                                        {
                                            (levelNum).map((item: any) =>
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
                    </tbody>
                </table>
            </CommonFrame>
        )
    }
}

export {Close};
