/**
 * desc: 多任务弹层
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/8/13
 * Time: 上午9:28
 */
import React, {Fragment} from 'react';
import {Modal, Form, Checkbox, Input, Select, DatePicker, message} from 'antd'
import {connect} from "@/common/decorator/connect";
import {PageTitle} from "@/ui/component/pageTitle";
import {form} from "@/common/decorator/form";
import { getStuffListOnJob} from "@redux-actions/customer/taskCenter";
import {User} from "@/common/beans/user";
import {selectTotalEmployeeList} from "@/saga/selectors/home";
import {taskThemeDict, taskStatusDict, taskStatusEnum, priorityEnum} from "@/ui/pages/taskCenter/enum";
import {mulitCreateTask} from "@redux-actions/customerCreate";
import moment from 'moment';

declare interface MultiTaskFormProps {
    form?:any
    handleCancel:() => void
    handleOk:() => void
    stuffListOnJob?:Array<any>
    getStuffListOnJob?:any
    switchEditModel?:Array<any>
    leads:Array<any>
    leadsName:Array<string>
}

const {Item} = Form;
const {Option} = Select;
const TextArea = Input.TextArea;

// 定义表单的布局方式
const formItemLayout = {
    labelCol: {
        sm: 5
    },
    wrapperCol: {
        sm: 18
    }
};
const selectOption = {workingStatus: "1",}
@form()
@connect((state:any) => ({
    stuffListOnJob: selectTotalEmployeeList(state, selectOption),
}), {getStuffListOnJob})
class MultiTaskForm extends React.Component<MultiTaskFormProps, any> {
    state = {
        taskStatusList: taskStatusDict['70001'],
        createNew: false,
        nextPriority: priorityEnum.正常,
    };
    componentDidMount(){}
    handleChangePriority = (e) => {
        const {setFieldsValue} = this.props.form;
        if(e.target.checked){
            setFieldsValue({priority: priorityEnum.紧急})
        }else{
            setFieldsValue({priority: priorityEnum.正常})
        }
    };
    handleChangeTaskTheme = (value) => {
        // 当重新选择任务主题时，清空已选择的任务状态并生成新的状态值
        const {form} = this.props;
        const taskStatus = taskStatusDict[value];
        form.setFieldsValue({'taskStatus': taskStatus[0].key});
        this.setState({
            taskStatusList: taskStatus
        });

        // 如果创建下次任务已打开，关闭它
        this.handleStatusChange(taskStatus[0].key);
    };
    handleStatusChange = (value) => {
        /*处理任务状态变更*/
        if (value !== taskStatusEnum.待完成) {

        } else {
            // 关闭已生成的表单
            if (this.state.createNew) {
                this.setState({
                    createNew: false
                })
            }
        }
    };
    handleSubmit = (e:any) => {
        e.preventDefault();
        const {validateFields} = this.props.form;
        validateFields((err:any, values:any) => {
            if(!err){
                const params = Object.assign({}, values, {
                    taskTime: moment(values.taskTime).valueOf(),
                    executorList: values.executorList instanceof Array ? values.executorList : [values.executorList],
                    currentCenterId: User.currentCenterId
                })
                mulitCreateTask(params)
                    .then((res:any) => {
                        message.success("创建成功")
                        this.props.handleOk()
                    }, (err:any) => {
                        message.error("创建失败")
                        this.props.handleOk()
                    })
            }
        })
    };
    render(){
        const {getFieldDecorator} = this.props.form;
        const {stuffListOnJob, leads, leadsName} = this.props;
        const {taskStatusList} = this.state;
        return(
            <Modal
                visible={true}
                onCancel={this.props.handleCancel}
                wrapClassName="gym-center-footer"
                bodyStyle={{padding: '30px 15px 15px'}}
                centered={true}
                width={800}
                footer={false}
                {...this.props}
            >
                <PageTitle title={'新建任务'}/>
                <Form className="gym-channel-form">
                    <span>{getFieldDecorator('priority', {
                        initialValue: priorityEnum.正常
                    })(<span/>)}</span>
                    <span>{getFieldDecorator('createStaffId', {
                        initialValue: User.userId
                    })(<span/>)}</span>
                    <Item label="发起人" {...formItemLayout} className="gym-input-wrap">
                        {
                            getFieldDecorator('createStaffName', {
                                initialValue: `${User.englishName}${User.chineseName}`
                            })(
                                <Input type="text" disabled={true} style={{width: 200}}/>
                            )
                        }

                        <Checkbox
                            className="gym-extra"
                            onChange={this.handleChangePriority}
                        >
                            紧急
                        </Checkbox>
                    </Item>
                    <Item label="执行人" {...formItemLayout} className="gym-input-wrap">
                        {
                            getFieldDecorator('executorList', {
                                initialValue: User.userId
                            })(
                                <Select
                                    mode="multiple"
                                    filterOption={(input, option) => {
                                        const text = option.props.children as string;
                                        return text.toLowerCase().includes(input.toLowerCase())
                                    }}
                                >
                                    {
                                        (stuffListOnJob || []).map(
                                            item => {
                                                const id = item.staffId;
                                                return (
                                                    <Option
                                                        value={id}
                                                        key={id}
                                                    >
                                                        {`${item.englishName} ${item.chineseName}`}
                                                    </Option>
                                                )
                                            }
                                        )
                                    }
                                </Select>
                            )
                        }
                    </Item>
                    <Item label="服务对象" {...formItemLayout} className="gym-input-wrap">
                        {
                            getFieldDecorator('customerList', {
                                initialValue: leads
                            })(
                                <Fragment>
                                    {leadsName.map((item:any, index:number) =>
                                        <span className="gym-input-wrap-span" key={`customer_${index}`}>{item}</span>)}
                                </Fragment>
                            )
                        }

                    </Item>
                    <Item label="主题" {...formItemLayout} className="gym-input-wrap">
                        {
                            getFieldDecorator('taskThemeCode', {
                                initialValue: '70001',
                                rules: [
                                    {
                                        required: true,
                                        message: '任务主题不能为空'
                                    },
                                ]
                            })(
                                <Select
                                    onChange={this.handleChangeTaskTheme}
                                    style={{width: 200}}
                                >
                                    {
                                        taskThemeDict.map(item => (
                                            <Option value={item.key} key={item.key} disabled={!item.isCreated}>{item.value}</Option>))
                                    }
                                </Select>
                            )
                        }
                    </Item>
                    <Item label="任务时间" {...formItemLayout} className="gym-input-wrap">
                        {
                            getFieldDecorator('taskTime', {
                                rules: [
                                    {
                                        required: true,
                                        message: '任务时间不能为空'
                                    },
                                ]
                            })(
                                <DatePicker
                                    style={{width: 200}}
                                    className="gym-datepick"
                                    format="YYYY-MM-DD HH:mm"
                                    showTime={true}
                                />
                            )
                        }
                    </Item>
                    <Item label="提醒时间" {...formItemLayout} className="gym-input-wrap">
                        {
                            getFieldDecorator('remindFrequencyTime', {
                                rules: [
                                    {
                                        required: true,
                                        message: '提醒时间不能为空'
                                    },
                                ]
                            })(
                                <Select style={{width: 200}}>
                                    {/*value值为与后台约定的字典值*/}
                                    <Option value={30}>任务开始前30分钟</Option>
                                    <Option value={60}>任务开始前1小时</Option>
                                    <Option value={120}>任务开始前2小时</Option>
                                    <Option value={360}>任务开始前6小时</Option>
                                    <Option value={1440}>任务开始前24小时</Option>
                                </Select>
                            )
                        }
                    </Item>
                    <Item label="任务描述" {...formItemLayout} className="gym-input-wrap">
                        {
                            getFieldDecorator('taskDesc', {
                                rules: [
                                    {
                                        required: true,
                                        message: '任务描述不能为空'
                                    }
                                ]
                            })(
                                <TextArea
                                    className="remark firstRemark"
                                    autosize={true}
                                    maxLength={3000}
                                    placeholder="请在此输入"
                                />
                            )
                        }
                    </Item>
                    <Item label="任务状态" {...formItemLayout} className="gym-input-wrap">
                        {
                            getFieldDecorator('taskStatus', {
                                initialValue: "65001",
                                rules: [
                                    {
                                        required: true,
                                        message: '任务状态不能为空'
                                    }
                                ]
                            })(
                                <Select onChange={this.handleStatusChange} style={{width: 200}}>
                                    {
                                        taskStatusList.map(item => (
                                            <Option value={item.key} key={item.key}>{item.text}</Option>))
                                    }
                                </Select>
                            )
                        }
                    </Item>
                </Form>
                <div className='text-c mt30'>
                    <button
                        key="submit"
                        className="gym-button-xs gym-button-default mr20"
                        onClick={this.handleSubmit}
                    >
                        保存
                    </button>
                    <button
                        key="back"
                        className="gym-button-xs gym-button-white"
                        onClick={this.props.handleCancel}
                    >
                        取消
                    </button>
                </div>
            </Modal>
        )
    }
}

export {MultiTaskForm}
