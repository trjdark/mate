/**
 * desc: 审批选择
 * Date: 2018/8/15
 * Time: 下午2:24
 */
import React from 'react'
import {Row, Col, Form, Checkbox} from "antd";
import {Select, Option as SelectOption} from "@/ui/component/select";
const FormItem = Form.Item;

class SelectGoroup extends React.Component<any, any> {
    render(){
        const {getFieldDecorator, items, staffList, centerConfig} = this.props;
        return(
            <div className='gym-center-set-approve'>
                {
                    items.map((item:any, index:number) => (
                        <Row key={`selectGroup-${item.label}-${index}`}>
                            <Col span={9}>
                                <FormItem label={`${item.label}1`}>
                                    {
                                        getFieldDecorator(`f${item.name}`,{
                                            initialValue: staffList.filter((staff:any) => staff.staffId === centerConfig[`f${item.name}`]).length > 0
                                                ? centerConfig[`f${item.name}`]
                                                : ''
                                        })(
                                            <Select
                                                className='gym-center-set-form-item-select'
                                                allowClear={true}
                                                showSearch
                                                filterOption={
                                                    (input:any, option:any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {
                                                    // Todo item 为一个list, 参数1为ID，参数2为岗位，参数3为姓名
                                                    staffList.map((staff:any) =>
                                                        <SelectOption key={staff.staffId} value={staff.staffId}>
                                                            {`${staff.englishName}${staff.chineseName}`}
                                                        </SelectOption>
                                                    )
                                                }
                                                </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={9}>
                                <FormItem label={`${item.label}2`}>
                                    {
                                        getFieldDecorator(`s${item.name}`, {
                                            initialValue: staffList.filter((staff:any) => staff.staffId === centerConfig[`s${item.name}`]).length > 0
                                                ? centerConfig[`s${item.name}`]
                                                : ''
                                        })(
                                            <Select
                                                className='gym-center-set-form-item-select'
                                                allowClear={true}
                                                showSearch
                                                filterOption={
                                                    (input:any, option:any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {
                                                    // Todo item 为一个list, 参数1为ID，参数2为岗位，参数3为姓名
                                                    staffList.map((staff:any) =>
                                                        <SelectOption key={staff.staffId} value={staff.staffId}>
                                                            {`${staff.englishName}${staff.chineseName}`}
                                                        </SelectOption>
                                                    )
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                    ))
                }
            </div>
        )
    }
}


class IsCheckSelect extends React.Component<any> {
    handleClear = (value:any, name:string) => {
        const {setFieldsValue} = this.props;
        if(!value.target.checked){
            setFieldsValue({
                [`f${name}`]: '',
                [`s${name}`]: '',
            })
        }
    };
    render(){
        const {getFieldDecorator, items, staffList, centerConfig, getFieldValue} = this.props;
        return(
            <div className='gym-center-set-approve'>
                {
                    items.map((item:any, index:number) => [
                        <Row key={`is-checked-${item.checkLabel}-${index}`}>
                            <FormItem label={`${item.checkLabel}`}>
                                {
                                    getFieldDecorator(item.checkName,{
                                        // 如果赠送审批，默认自动钩上且不能修改
                                        initialValue: item.checkName === 'enableFreeCourseApproval' ? 1 : centerConfig[item.checkName]
                                    })(
                                        <Checkbox
                                            onChange={(value:any) => this.handleClear(value, item.selectName)}
                                            defaultChecked={item.checkName === 'enableFreeCourseApproval' ? true : centerConfig[item.checkName] === 1}
                                            disabled={item.checkName === 'enableFreeCourseApproval'}
                                        />
                                    )
                                }
                            </FormItem>
                        </Row>,
                        <Row key={`select-${item.selectLabel}-${index}`}>
                            <Col span={9}>
                                <FormItem label={`${item.selectLabel}1`}>
                                    {
                                        getFieldDecorator(`f${item.selectName}`,{
                                            rules: [{required: (getFieldValue(item.checkName) && (!getFieldValue(`s${item.selectName}`))), message: '请选择人员'}],
                                            initialValue: staffList.filter((staff:any) => staff.staffId === centerConfig[`f${item.selectName}`]).length > 0
                                                ? centerConfig[`f${item.selectName}`]
                                                : ''
                                        })(
                                            <Select
                                                className='gym-center-set-form-item-select'
                                                disabled={!getFieldValue(item.checkName)}
                                                allowClear={true}
                                                showSearch
                                                filterOption={
                                                    (input:any, option:any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {
                                                    // Todo item 为一个list, 参数1为ID，参数2为岗位，参数3为姓名
                                                    staffList.map((staff:any) =>
                                                        <SelectOption key={staff.staffId} value={staff.staffId}>
                                                            {`${staff.englishName}${staff.chineseName}`}
                                                        </SelectOption>
                                                    )
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={9}>
                                <FormItem label={`${item.selectLabel}2`}>
                                    {
                                        getFieldDecorator(`s${item.selectName}`, {
                                            rules: [{required: (getFieldValue(item.checkName) && !getFieldValue(`f${item.selectName}`)), message: '请选择人员'}],
                                            initialValue: staffList.filter((staff:any) => staff.staffId === centerConfig[`s${item.selectName}`]).length > 0
                                                ? centerConfig[`s${item.selectName}`]
                                                : ''
                                        })(
                                            <Select
                                                className='gym-center-set-form-item-select'
                                                disabled={!getFieldValue(item.checkName)}
                                                allowClear={true}
                                                showSearch
                                                filterOption={
                                                    (input:any, option:any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {
                                                    staffList.map((staff:any) =>
                                                        <SelectOption key={staff.staffId} value={staff.staffId}>
                                                            {`${staff.englishName}${staff.chineseName}`}
                                                        </SelectOption>
                                                    )
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                    ])
                }
            </div>
        )
    }
}

export {SelectGoroup, IsCheckSelect};
