/**
 * desc:到访测评达人分解指标
 * User: Vicky
 * Date: 2020/7/31
 * Time: 上午11:00
 */
import React from 'react';
import { Form, Row, Col } from "antd";
import { TextArea } from '@/ui/component/input';
import { form } from '@/common/decorator/form';
import {TargetList} from './targetList';
import { cloneDeep } from 'lodash';

const { Item } = Form;

@form()
class ProjectList extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            targetList: this.props.value.targetList,
        };
    }
    /*增加一行达人指标*/
    addTargetLine = () => {
        const {value} = this.props;
        const targetList = cloneDeep(this.state.targetList);
        value.targetList.push({
            order: '',
            targetName: '',
        });
        this.setState({
            targetList
        })
    }
    /*删除一行达人指标*/
    deleteTargetItem = ( i) => {
        let targetArr = this.props.value.targetList
        targetArr.splice(i, 1)
        this.setState({
            targetList: targetArr
        })
    }
    handleGoalInput =(e,i) => {
        const targetList = this.props.value.targetList
        targetList[i].targetName = e.target.value;
        this.setState({ targetList})
        this.props.emitGoalInput(targetList);
    }
    render() {
        const { form, deleteItem, value, index, handleProjectChange, handlePointChange, handleOperate} = this.props;
        const { point, method, itemName} = value;
        const {getFieldDecorator} = form;
        return (
            <div>
                {
                    index!==0 &&
                    <button className="ant-btn gym-button-white gym-button-xs gym-button-delete-big mb10" onClick={() => deleteItem(value, index)} > 删除</button>
                }
                <div className="gym-evaluation-add clearfix">
                    <div className="gym-channel-form">
                        <Row>
                            <Col span={12}>
                                <Item label="测查项目:" className="gym-input-wrap">
                                    {
                                        getFieldDecorator('itemName', {
                                            initialValue: itemName,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '测查项目不能为空'
                                                },
                                            ]
                                        })(
                                            <TextArea style={{ width: 250 }} placeholder="请输入" className="gym-evaluation-add-content-input" maxLength={500} onChange={value => handleProjectChange( value, index)}/>
                                        )
                                    }
                                </Item>
                            </Col>
                            <Col span={12}>
                                <Item label="沟通要点:" className="gym-input-wrap">
                                    {
                                        getFieldDecorator('point', {
                                            initialValue: point,
                                        })(
                                            <TextArea style={{ width: 250 }} placeholder="请输入" maxLength={500} onChange={value => handlePointChange(value, index)}/>
                                        )
                                    }
                                </Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Item label="操作方法:" className="gym-input-wrap">
                                    {
                                        getFieldDecorator('method', {
                                            initialValue: method,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '操作方法不能为空'
                                                },
                                            ]
                                        })(
                                            <TextArea
                                                className="remark"
                                                placeholder="请输入内容"
                                                maxLength={500}
                                                onChange={value => handleOperate(value, index)}
                                            />
                                        )
                                    }
                                </Item>
                            </Col>
                        </Row>
                        <div className="gym-evaluation-add-goal">
                            <span >达成分解指标:</span>
                            <span >
                                <button
                                    className="gym-button-default gym-button-xs market-list-add"
                                    onClick={this.addTargetLine}
                                >
                                    + 新建
                                </button>
                            </span>
                        </div>
                        {
                            value.targetList && value.targetList.map((item,index) => {
                                return (
                                    <TargetList
                                        deleteTargetItem={() => this.deleteTargetItem(index)}
                                        index={index}
                                        value={item}
                                        key={`target_${index}`}
                                        handleGoalInput={this.handleGoalInput}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
         );
    }
}

export {ProjectList};
