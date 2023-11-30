/**
 *Desc: 高级查询-其他信息组件
 *User: Debby.Deng
 *Date: 2018/10/12,
 *Time: 上午10:15
 */



import { Radio} from "antd";
import {bool} from "../../enum/assign";
import * as React from "react";
import {CommonFrame} from "./common";
const RadioGroup=Radio.Group;

declare interface otherProps {
    form:any,//传入表单
    icon:string,//展开Icon
    word:string,//展开中文
    isExpand:boolean,//是否展开
    other:any,//其他信息-后台返回信息
    title:string,//组件Title
}

class Other extends React.Component<otherProps,any> {
    render() {
        const {form, icon, word, other, isExpand, title} = this.props;
        const {getFieldDecorator} = form;
        return (
            <CommonFrame icon={icon} word={word} title={title} isExpand={isExpand}>
                <table>
                    <tbody>
                    <tr>
                        <td style={{height:'43px'}}>Gymboclub：</td>
                        <td>
                            {
                                getFieldDecorator('other-isCertificated', {
                                    initialValue: typeof other.isCertificated==='undefined'? undefined :  other.isCertificated
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
                    </tbody>
                </table>
            </CommonFrame>
        )
    }
}

export {Other};
