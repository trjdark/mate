/**
 *Desc: GA/GB多选框
 *User: Debby.Deng
 *Date: 2018/10/9,
 *Time: 下午3:45
 */
import * as React from "react";
import {Form, Button, Row, Col, Input, DatePicker} from 'antd';
import {Select, Option} from "@/ui/component/select";
import {connect} from "../../../../../common/decorator/connect";
import {User} from "../../../../../common/beans/user";
import {form} from "../../../../../common/decorator/form";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {selectTotalEmployeeList} from "@/saga/selectors/home";
import moment from 'moment';
const FormItem = Form.Item;

const {RangePicker} = DatePicker;

declare interface propsFormat {//传入props结构
    onSubmit?: (values) => (void),
    form?: any,
    showSearchBtn?: boolean,//是否展示查询按钮
    //以下为自身的
    type?:string,
    [propsName: string]: any,
}

const selectConfig = [
    {
        label: 'GB',
        name: 'GB',
        id: 1
    },
    {
        label: 'GA',
        name: 'GA',
        id: 2
    }
];
const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）'])

const selectGAOption = isPostTransRole
    ? {
        workingStatus: "1",
        roleList: ["GA","HGA"]
    }
    : {
        workingStatus: "1",
        postName: ["GA","HGA"]
    };

const selectGBOption = isPostTransRole
    ? {
        workingStatus: "1",
        roleList: ["GB","HGB"]
    }
    : {
        workingStatus: "1",
        postName: ["GB","HGB"]
    };
@form()
@connect((state) => ({
    gaList: selectTotalEmployeeList(state, selectGAOption),
    gbList: selectTotalEmployeeList(state, selectGBOption),

}), {})
class HistoryMultSelect extends React.Component <propsFormat> {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onSubmit(values);
            }
        });
    };

    getOptions(options) {
        const children = [];
        options.map((option, i) => {
            children.push(
                <Option key={i} value={option.staffId}>
                    {`${option.englishName} ${option.chineseName}`}
                </Option>)
        });

        return children;
    }

    getMultSelect = () => {
        const {gaList, gbList} = this.props;
        const {getFieldDecorator} = this.props.form;
        const gbChildren = this.getOptions(gbList), gaChildren = this.getOptions(gaList);
        return selectConfig.map((select, index) => {
            return (
                <Col span={8} key={index}>
                    <FormItem label={`${select.label}`} className='flex gym-mult-select-item'>
                        {
                            getFieldDecorator(`${select.label}`, {
                                initialValue: []
                            })(
                                <Select
                                    style={{width: '200px'}}
                                    mode="multiple"
                                    placeholder=""
                                    optionFilterProp={`children`}
                                    filterOption={true}
                                >
                                    {select.name === 'GA' && gaChildren}
                                    {select.name === 'GB' && gbChildren}
                                </Select>
                            )
                        }
                    </FormItem>
                </Col>
            )
        });
    };
    render() {
        const {showSearchBtn = true, type} = this.props;
        const {getFieldDecorator} = this.props.form;
        return (
            <div className='gym-mult-select'>
                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        {this.getMultSelect()}
                        <Col span={8}>
                            <FormItem label={'手机号'} className='flex gym-mult-select-item'>
                                {
                                    getFieldDecorator(`phone`, {

                                    })(
                                        <Input placeholder={'留空或11位手机号'} style={{width: '200px'}}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    {showSearchBtn && <Row>
                        {
                            type === 'loss' &&
                                <Col span={8}>
                                    <FormItem label={'流失时间'} className='flex gym-mult-select-item gym-form-item'>
                                        {
                                            getFieldDecorator(`loseTime`, {
                                                initialValue: [moment().subtract(1, 'month'), moment()]
                                            })(
                                                <RangePicker
                                                    allowClear={false}
                                                />                                    )
                                        }
                                    </FormItem>
                                </Col>
                        }
                        {
                            type === 'transfer' &&
                                <Col span={8}>
                                    <FormItem label={'转移时间'} className='flex gym-mult-select-item gym-form-item'>
                                        {
                                            getFieldDecorator(`transferTime`, {
                                                initialValue: [moment().subtract(1, 'month'), moment()]
                                            })(
                                                <RangePicker
                                                    allowClear={false}
                                                />                                    )
                                        }
                                    </FormItem>
                                </Col>
                        }
                        {
                            type === 'customerTransfer' &&
                                <Col span={8}>
                                    <FormItem label={'转移时间'} className='flex gym-mult-select-item gym-form-item'>
                                        {
                                            getFieldDecorator(`transfervipTime`, {
                                                initialValue: [moment().subtract(1, 'month'), moment()]
                                            })(
                                                <RangePicker
                                                    allowClear={false}
                                                />                                    )
                                        }
                                    </FormItem>
                                </Col>
                        }
                        {
                            ['loss', 'transfer', 'customerTransfer'].includes(type) ||
                            <Col span={8}/>
                        }
                        <Col span={8}/>
                        <Col span={8}>
                            <FormItem label={' '} colon={false} className='flex gym-mult-select-item-btn'>
                                <Button className='gym-button-xs gym-button-blue'
                                        style={{marginTop: '2px'}}
                                        htmlType="submit">查询</Button>
                            </FormItem>
                        </Col>
                    </Row>
                    }
                </Form>
            </div>
        )
    }
}

export {HistoryMultSelect}
