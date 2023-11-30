import React, {Component} from 'react';
import {Form} from "antd";
import {Option, Select} from "@/ui/component/select";
import {InputNumber} from "@/ui/component/input";
import {Icon} from "antd";
import {ValidateRegEx} from "@/common/utils/validate";

/*解构出二级组件,方便调用*/
const {Item} = Form;

export class GbAchievementList extends Component<any, any> {
    constructor(props) {
        super(props);
    }

    render() {
        const {form, value, index, handleAchieveChange, handleGbChange, deleteItem, options, selectIdList, labels} = this.props;
        const {getFieldDecorator} = form;
        const {staffId, personalTargetSales, label, workingStatus, staffName,} = value;
        return (
            <div className="gym-center-achievement-gb-set">
                <Item label={labels[0]}>
                    {
                        getFieldDecorator(`gb${staffId ? staffId : label}`, {
                            // 如果员工已离职，要标记出来
                            initialValue: workingStatus === '0' ? `${staffName} (离职)` : staffId,
                            rules: [
                                {
                                    required: true,
                                    message: `${labels[0]}不能为空`
                                },
                            ]
                        })(
                            <Select
                                disabled={workingStatus === '0'}
                                onChange={value => handleGbChange(value, index)}
                                style={{width:200}}
                            >
                                {
                                    options.map(item => {
                                        const {staffId, userName, disabled} = item;
                                        return (
                                            <Option
                                                key={staffId}
                                                value={staffId}
                                                disabled={disabled || selectIdList.includes(staffId)}
                                            >
                                                {userName}
                                            </Option>
                                        );
                                    })
                                }
                            </Select>
                        )
                    }
                </Item>
                <span className="gym-center-achievement-gb-set-connect">—</span>
                <Item label={labels[1]}>
                    {
                        getFieldDecorator(`personalTargetSales${staffId ? staffId : label}`, {
                            initialValue: personalTargetSales,
                            rules: [
                                {required: true, message: `${labels[1]}不能为空`},
                                {pattern: ValidateRegEx.不含零正整数, message: '请输入大于0的正整数'}
                            ]
                        })(
                            <InputNumber
                                min={0}
                                precision={0}
                                disabled={workingStatus === '0'}
                                onChange={value => handleAchieveChange(value, index)}
                            />
                        )
                    }
                </Item>
                <Icon
                    type="minus-circle"
                    className="gym-center-achievement-gb-set-remove"
                    onClick={() => deleteItem(index)}
                />
            </div>
        )
    }
}
