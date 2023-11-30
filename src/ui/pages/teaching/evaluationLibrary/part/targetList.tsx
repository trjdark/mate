/**
 * desc: 添加达成分解指标
 * User: Vicky.Yu
 * Date: 2020/08/03
 * Time: 上午11:00
 */

import React from 'react';
import {
    Form,
    Row,
    Col,
    Input,
} from "antd";
import { TextArea } from '@/ui/component/input';
import { form } from '@/common/decorator/form';
const { Item } = Form;

@form()

class TargetList extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {

        }
    }
    render() {
        const { deleteTargetItem, index, value, form, handleGoalInput } = this.props;
        const { getFieldDecorator } = form;
        const { targetName } = value;
        return (
            <div className="gym-target-list-content">
                <Row>
                    <Col span={1}>
                        <span>{index + 1}.</span>
                    </Col>
                    <Col span={21}>
                        <Item className="gym-target">
                            {
                                getFieldDecorator('targetName', {
                                    initialValue: targetName,
                                    rules: [
                                        {
                                            required: true,
                                            message: "达成分解指标不能为空"
                                        },
                                    ],
                                })(
                                    <TextArea placeholder={`请输入内容`} style={{ width: '100%' }} maxLength={500} onChange={value => handleGoalInput(value, index)}/>
                                )
                            }
                        </Item>
                    </Col>
                    {
                        index !==0 &&
                        <Col span={1}>
                            <Item>
                                <span >
                                    <button
                                        className="gym-button-xxs gym-button-white gym-target-delete-btn"
                                        onClick={() => deleteTargetItem(value, index)}
                                    >
                                        删除
                                    </button>
                                </span>
                            </Item>
                        </Col>
                    }
                </Row>
            </div>
        )
    }
}

export { TargetList }
