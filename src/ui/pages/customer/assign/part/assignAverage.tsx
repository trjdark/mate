/**
 *Desc: 分配GA,GB下面平均分配模块
 *User: Debby.Deng
 *Date: 2018/10/31,
 *Time: 下午3:23
 */
import * as React from "react";
import {Button, Checkbox, Select} from "antd";
import {DynamicGaGbList} from "./dynamicForm";
import {Message} from "../../../../component/message/message";
import {form} from "../../../../../common/decorator/form";

const Option = Select.Option;

declare interface averageProps {
    type: string,//会员分配-'vip' || leads分配-'leads'
    role: string,//角色
    optionList: Array<any>,//下拉列表
    onSubmit: (value, staffList) => (void),//各个员工的分配数
    onCancel: () => (void),//取消事件
    leadsArr: Array<any>,//选中leads
    value: object,//分配成功后的回调，

    form?: any,
}

@form()
class AssignAverage extends React.Component<averageProps> {
    state = {
        employeeList: [],
    };

    handleAverage = (e) => {
        const {form, leadsArr, role} = this.props;
        const assignLeads = leadsArr.length;
        const {employeeList} = this.state;
        const isChecked = e.target.checked;
        const num = employeeList.length;
        if (isChecked) {//平均分配
            if (!num) {
                Message.error(`请先选择${role}`);
                return;
            } else {
                const average = Math.floor(assignLeads / num);
                for (let i = num - 1; i >= 0; i--) {
                    let numbers = average;
                    if (i === 0) {
                        numbers = (assignLeads - average * (num - 1));
                    }
                    employeeList[i].average = numbers;
                    form.setFieldsValue({[`leadsNum[${employeeList[i].staffId}]`]: numbers})
                }
            }
        } else {
            employeeList.map((employee) => {
                employee.average = '';
                form.setFieldsValue({[`leadsNum[${employee.staffId}]`]: ''})
            });
        }

    };
    handleAssign = (value) => {//分配leads
        const {form, leadsArr} = this.props;
        const assignLeads = leadsArr.length;
        const params = form.getFieldsValue();
        const staffList = [];
        let total = 0;
        for (let key in params.leadsNum) {
            const number = params.leadsNum[key];
            if (!number) continue;
            total += Number(number);
            staffList.push({
                leadsNum: number,
                staffId: key,
            });
        }
        if (total !== assignLeads) {
            Message.error(`分配数${total}不等于已选中leads数${assignLeads}`);
            return;
        }
        this.props.onSubmit(value, staffList)

    };
    handleRemove = (id) => {
        const {employeeList} = this.state;
        const currentList = employeeList.filter((ga) => {
            return ga.staffId !== id;
        });
        this.setState({employeeList: currentList});

    };
    handleSelect = (id) => {
        const {optionList} = this.props;

        let currentList = optionList.filter((em) => {
            return em.staffId === id;
        });
        currentList = currentList.concat(this.state.employeeList);
        this.setState({employeeList: currentList});

    };

    render() {
        const {employeeList,} = this.state;
        const {optionList = [], role, form, leadsArr, value} = this.props;
        const assignLeads = leadsArr.length;
        const selectedValues = employeeList.map((list) => (list.staffId));

        return (
            <div className='gym-leads-assign-content'>
                <div className='gym-leads-assign-content-title'>
                    <span>{role}: </span>
                    <Select mode='multiple'
                            style={{width: '300px'}}
                            onSelect={employeeList.length < 10 ? this.handleSelect :
                                () => {
                                    Message.warning(`单次最多只能选择10个员工进行分配`)
                                }}
                            value={selectedValues}
                            onDeselect={this.handleRemove}
                    >
                        <Option value='all' disabled>
                            <div className='flex gym-leads-assign-content-flex'>
                                <span className='gym-leads-assign-content-flex'>英文名</span>
                                <span className='gym-leads-assign-content-flex'>中文名</span>
                                {this.props.type === 'leads' &&
                                <span className='gym-leads-assign-content-flex'>已领取leads数</span>}
                            </div>
                        </Option>
                        {optionList.map((list) => {
                            return (
                                <Option key={list.staffId} value={`${list.staffId}`}>
                                    <div className='flex '>
                                    <span className='gym-leads-assign-content-flex'>
                                                            {list.englishName}</span>
                                        <span className='gym-leads-assign-content-flex'>
                                                            {list.chineseName}</span>
                                        {this.props.type === 'leads' &&
                                        <span className='gym-leads-assign-content-flex'>
                                                            {list.receivedLeadsNum || 0}</span>}
                                    </div>
                                </Option>)
                        })}
                    </Select>
                    <span className='ml30'>待分配:
                                        <span className='cDefault'>{assignLeads || 1}</span>
                                    </span>
                    <span className='fr'>
                                        <Checkbox onChange={this.handleAverage}>平均分配</Checkbox>
                                    </span>
                </div>
                <div>
                    {<DynamicGaGbList list={employeeList}
                                      form={form}
                                      removeEmployee={this.handleRemove.bind(this)}/>
                    }

                </div>
                <div className='gym-bottom-btn-group'>
                    <Button htmlType='submit'
                            className='gym-button-xs gym-button-default mr20'
                            onClick={this.handleAssign.bind(this, value)}>分配</Button>
                    <Button className='gym-button-xs gym-button-white'
                            onClick={this.props.onCancel}
                    >取消</Button>
                </div>
            </div>)
    }
}

export {AssignAverage}
