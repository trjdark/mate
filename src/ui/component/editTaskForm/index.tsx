/**
 * desc:跟进预约到访，任务中心编辑任务表单
 * User: lyon.li@gymboglobal.com
 * Date: 2018/11/1
 * Time: 上午11:44
 */
import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Button, Checkbox, Col, DatePicker, Form, Modal, Row, Select } from 'antd';
import moment from 'moment';
import { TextArea, Input } from "../input";
import { switchCustomerModal } from "@/saga/actions/customer/taskCenter";
import { addTask, editTask, getCustomerList, getStuffListOnJob } from "@redux-actions/customer/taskCenter";
import { setCustomerList } from "@/saga/actions/customer/taskCenter";
import { Fetch } from "@/service/fetch";
import { CustomerApi } from "@/api/customerApi";
import { User } from "@/common/beans/user";
import { cloneDeep } from 'lodash';
import { priorityEnum, taskStatusDict, taskStatusEnum, taskThemeDict, taskThemeEnum } from "../../pages/taskCenter/enum";
import { leadsStatus } from "@/ui/pages/customer/enum/client360";
import { PageTitle } from "@/ui/component/pageTitle";
import { message } from "antd/es";
import { CustomerRoutes } from "@/router/enum/customerRoutes";
import { CommonUtils } from "@/common/utils/commonUtils";
import {intentionLevel} from "@/ui/pages/customer/enum/assign";

// 解构出组件的二级组件，方便调用
const { Item } = Form;
const { Option } = Select;

// 定义props和state数据结构
interface EditorTaskFormState {
    createNew: boolean, // 添加下次任务页面结构控制
    isEnd: boolean, // 控制创建下次任务按钮是否可用
    [propName: string]: any
}

interface EditTaskFormProps {
    showEditModel: boolean, // 控制弹框是否显示
    taskDetail: any,        // 任务详情
    [propName: string]: any
}

// 定义表单的布局方式
const formItemLayout = {
    labelCol: {
        sm: 5
    },
    wrapperCol: {
        sm: 18
    }
};

class EditorTaskForm extends Component<EditTaskFormProps, EditorTaskFormState> {
    private taskTime = new Date();

    static getDerivedStateFromProps(nextProps, prevState) {
        /*如果总部员工给中心员工创建任务，会出现找不到总部员工的状况，此时把总部员工添加到列表里*/
        const { stuffListOnJob } = nextProps;
        const { executorList } = prevState.taskDetail;
        if (JSON.stringify(stuffListOnJob) === JSON.stringify(prevState.stuffListOnJob)) {
            return null
        }

        let newStuffList = cloneDeep(stuffListOnJob);
        for (let i = 0; i < executorList.length; i++) {
            let flag = 0;
            let len = stuffListOnJob.length;
            for (let j = 0; j < len; j++) {
                if (executorList[i].staffId !== stuffListOnJob[j].id) {
                    flag++;
                }
            }
            // 循环完毕仍然没有发现该员工，就手动的加进去
            if (flag === len) {
                const { staffId, staffName } = executorList[i];
                newStuffList.unshift({
                    id: staffId,
                    staffName
                });
            }
        }

        return { stuffListOnJob: newStuffList }
    }

    constructor(props) {
        super(props);
        const { userId, englishName, chineseName } = User.user;
        const fullName = `${englishName} ${chineseName}`;

        this.state = {
            createNew: false,
            isEnd: false,
            taskStatusList: [],  // 任务状态列表
            nextPriority: priorityEnum.正常,  // 下次任务是否紧急
            stuffListOnJob: [],  // 中心职员列表
            taskThemeList: taskThemeDict,
            taskDetail: {
                creator: {
                    staffId: userId,
                    staffName: fullName
                },
                customerList: [],
                executorList: [
                    {
                        staffId: userId,
                        staffName: fullName
                    }
                ],
                priority: priorityEnum.正常,
                remindFrequencyTime: 30,
                afterTaskIntention: undefined,
                taskDesc: '',
                taskStatus: '',
                taskTheme: '',
                taskTime: this.taskTime,
            }
        };
    }

    render() {
        // 解构出props和state里需要用到的方法和数据，避免反复取值
        const {switchEditModel, form, taskId } = this.props;
        const { getFieldDecorator } = form;
        const { createNew, taskDetail, taskStatusList, stuffListOnJob, taskThemeList } = this.state;
        const { taskDesc, taskTime, priority, creator, executorList, customerList, taskTheme, taskStatus, remindFrequencyTime, createTime, afterTaskIntention, tmkNextContactTime } = taskDetail;
        const executorIdList = executorList.map(item => item.staffId);  // 执行人name列表
        // 判断自己执行任务是否已结束,结束后表单不可编辑
        const isEnd = !((taskStatus === taskStatusEnum.待完成 || taskStatus === '') && (executorList || []).map((item: any) => item.staffId).includes(User.userId));
        const taskThemeListNew = isEnd ? taskThemeList.concat([{ key: '70005', value: 'TMK' }, { key: '70006', value: '云语音' }]) : taskThemeList

        return (
            <Modal
                wrapClassName={isEnd ? "gym-no-footer-modal" : "gym-center-footer"}
                visible={true}
                bodyStyle={{ padding: '30px 15px 15px' }}
                destroyOnClose={true}
                maskClosable={false}
                footer={false}
                onCancel={() => switchEditModel(false)}
                centered={true}
                width={800}
            >
                {this.createModalTitle(isEnd)}
                <Form className="gym-channel-form">
                    <Item label="发起人" {...formItemLayout} className="gym-input-wrap">
                        {
                            getFieldDecorator('createStaffId', {
                                initialValue: creator.staffName
                            })(
                                <Input type="text" disabled={true} style={{ width: 200 }} />
                            )
                        }
                        <Checkbox
                            className="gym-extra"
                            checked={priority === priorityEnum.紧急}
                            disabled={isEnd}
                            onChange={this.handleChangePriority}
                        >
                            紧急
                        </Checkbox>
                    </Item>
                    <Item label="执行人" {...formItemLayout} className="gym-input-wrap">
                        {
                            getFieldDecorator('executorList', {
                                initialValue: executorIdList
                            })(
                                <Select
                                    mode="multiple"
                                    disabled={isEnd ? isEnd : (taskId !== '')}
                                    filterOption={(input, option) => {
                                        const text = option.props.children as string;
                                        return text.toLowerCase().includes(input.toLowerCase())
                                    }}
                                >
                                    {
                                        stuffListOnJob.map(
                                            item => {
                                                const id = item.id;
                                                return (
                                                    <Option
                                                        value={id}
                                                        key={id}
                                                        disabled={id === creator.staffId}
                                                    >
                                                        {item.staffName}
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
                                initialValue: customerList.map(item => item.leadsId)
                            })(
                                <Select mode="multiple" disabled={true} style={{ width: 200 }}>
                                    {
                                        this.props.customerList.map(item => (
                                            <Option
                                                disabled={true}
                                                value={item.leadsId}
                                                key={item.leadsId}
                                            >
                                                {item.customerName}
                                            </Option>
                                        ))
                                    }
                                </Select>
                            )
                        }
                        <a
                            className="look-more"
                            href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({ leadsId: (customerList[0] || {}).leadsId })}`}
                            target="_blank"
                        >
                            查看详情
                        </a>
                    </Item>
                    {
                        isEnd ?
                            <Item label="主题" {...formItemLayout} className="gym-input-wrap">
                                {
                                    getFieldDecorator('taskThemeCode', {
                                        initialValue: taskTheme,
                                        rules: [
                                            {
                                                required: true,
                                                message: '任务主题不能为空'
                                            },
                                        ]
                                    })(
                                        <Select
                                            onChange={this.handleChangeTaskTheme}
                                            disabled={isEnd ? isEnd : (taskId !== '')}
                                            style={{ width: 200 }}
                                        >
                                            {
                                                taskThemeListNew.map(item => (
                                                    <Option value={item.key} key={item.key} disabled={!item.isCreated}>{item.value}</Option>))
                                            }
                                        </Select>
                                    )
                                }
                            </Item>
                            :
                            <Item label="主题" {...formItemLayout} className="gym-input-wrap">
                                {
                                    getFieldDecorator('taskThemeCode', {
                                        initialValue: taskTheme,
                                        rules: [
                                            {
                                                required: true,
                                                message: '任务主题不能为空'
                                            },
                                        ]
                                    })(
                                        <Select
                                            onChange={this.handleChangeTaskTheme}
                                            disabled={isEnd ? isEnd : (taskId !== '')}
                                            style={{ width: 200 }}
                                        >
                                            {
                                                taskThemeList.map(item => (
                                                    <Option value={item.key} key={item.key} disabled={!item.isCreated}>{item.value}</Option>))
                                            }
                                        </Select>
                                    )
                                }
                            </Item>
                    }
                    <Item label="任务时间" {...formItemLayout} className="gym-input-wrap">
                        {
                            getFieldDecorator('taskTime', {
                                initialValue: moment(taskTime),
                                rules: [
                                    {
                                        required: true,
                                        message: '任务时间不能为空'
                                    },
                                ]
                            })(
                                <DatePicker
                                    style={{ width: 200 }}
                                    className="gym-datepick"
                                    format="YYYY-MM-DD HH:mm"
                                    disabled={isEnd}
                                    showTime={true}
                                />
                            )
                        }
                    </Item>
                    <Item label="提醒时间" {...formItemLayout} className="gym-input-wrap">
                        {
                            getFieldDecorator('remindFrequencyTime', {
                                initialValue: remindFrequencyTime,
                                rules: [
                                    {
                                        required: true,
                                        message: '提醒时间不能为空'
                                    },
                                ]
                            })(
                                <Select disabled={isEnd} style={{ width: 200 }}>
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
                                initialValue: taskDesc,
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
                                    disabled={isEnd}
                                    placeholder="请在此输入"
                                />
                            )
                        }
                    </Item>
                    {
                        isEnd &&
                        <Item label="下次联系时间" {...formItemLayout} className="gym-input-wrap">
                            {
                                getFieldDecorator('tmkNextContactTime', {
                                    initialValue: tmkNextContactTime && moment(tmkNextContactTime),
                                    rules: [
                                        {
                                            required: true,
                                            message: '下次联系时间不能为空'
                                        },
                                    ]
                                })(
                                    <DatePicker
                                        style={{ width: 200 }}
                                        className="gym-datepick"
                                        format="YYYY-MM-DD HH:mm"
                                        disabled={isEnd}
                                        showTime={true}
                                    />
                                )
                            }
                        </Item>
                    }
                    <Item label="意向度" {...formItemLayout} className="gym-input-wrap">
                        {
                            // 没有选择意向度的时候才会显示无
                            !afterTaskIntention && (
                                <Fragment>
                                    <span>无</span>
                                    {
                                        // 处于新建或者编辑状态时，才会显示箭头
                                        !isEnd && (<span> -> </span>)
                                    }
                                </Fragment>
                            )
                        }
                        {
                            getFieldDecorator('afterTaskIntention', {
                                initialValue: afterTaskIntention
                            })(
                                <Select disabled={isEnd} style={{ width: 200 }}>
                                    {
                                        intentionLevel.map(item => <Option value={item.code} key={item.code}>
                                            {item.name}</Option>)
                                    }
                                </Select>
                            )
                        }
                    </Item>
                    <Item label="任务状态" {...formItemLayout} className="gym-input-wrap">
                        {
                            getFieldDecorator('taskStatus', {
                                initialValue: taskStatus,
                                rules: [
                                    {
                                        required: true,
                                        message: '任务状态不能为空'
                                    }
                                ]
                            })(
                                <Select onChange={this.handleStatusChange} disabled={isEnd} style={{ width: 200 }}>
                                    {
                                        (taskStatusList || []).map(item => (
                                            <Option value={item.key} key={item.key}>{item.text}</Option>))
                                    }
                                </Select>
                            )
                        }
                    </Item>
                    {
                        (isEnd || taskId !== '') ? (
                            <Item label="创建时间" {...formItemLayout} className="gym-input-wrap">
                                {
                                    getFieldDecorator('createTime', {
                                        initialValue: createTime ? moment(createTime).format('YYYY-MM-DD HH:mm:ss') : ''
                                    })(
                                        <Input disabled={true} />
                                    )
                                }
                            </Item>
                        ) : null
                    }
                    {
                        !isEnd && (
                            <Fragment>
                                <Item label="创建下次任务" {...formItemLayout} className="gym-input-wrap">
                                    {this.switchNextTaskBtn(createNew)}
                                </Item>
                                {this.createNextTaskForm(createNew)}
                            </Fragment>
                        )
                    }

                </Form>
                {
                    !isEnd ? (
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
                                onClick={() => switchEditModel(false)}
                            >
                                取消
                            </button>
                        </div>
                    ) : null
                }
            </Modal>
        )
    }

    componentDidMount() {
        const { leadsId, getCustomer, getCenterStuffList, stuffListOnJob, phase } = this.props;
        const currentCenterId = User.currentCenterId;
        const centerId = User.centerCode;
        if (leadsId) {
            // 如果leadsId存在，说明是从360页面跳转过来，需要新建，默认赋值一个customerList
            const taskDetail = cloneDeep(this.state.taskDetail);
            taskDetail.customerList = [
                {
                    'customerName': '',
                    'leadsId': leadsId
                }
            ];
            this.setState({
                taskDetail
            });
            getCustomer({ currentCenterId, leadsId });  // 加载服务对象列表
        }

        if (phase === leadsStatus.待分配 || phase === leadsStatus.已分配) {
            // 如果从360页面带过来的阶段值为待分配和已分配，则只能创建其他类型的任务
            const list = taskThemeDict.filter((item) => item.value === '其他');
            this.setState({taskThemeList: list})
        }
        if (!stuffListOnJob || (stuffListOnJob && stuffListOnJob.length === 0)) {
            getCenterStuffList({ centerId, currentCenterId });  // 加载员工列表
        }
        this.handleGetFromData();
    }

    createModalTitle(isEnd: boolean) {
        // 根据状态，生成不同的弹框标题
        const taskId = this.props.taskId;
        if (isEnd) {
            return <PageTitle title={'查看任务'} />;
        } else {
            // 任务已处理，只能查看
            return taskId === '' ? <PageTitle title={'新建任务'} /> : <PageTitle title={'编辑任务'} />;
        }
    }

    handleChangeTaskTheme = (value) => {
        // 当重新选择任务主题时，清空已选择的任务状态并生成新的状态值
        const { form } = this.props;
        const taskStatus = taskStatusDict[value];
        form.setFieldsValue({ 'taskStatus': taskStatus[0].key });
        this.setState({
            taskStatusList: taskStatus
        });

        // 如果创建下次任务已打开，关闭它
        this.handleStatusChange(taskStatus[0].key);
    };

    handleGetFromData() {
        // 请求表单数据
        const { taskId, setCustomer } = this.props;
        if (taskId === '') {
            // 如果不存在taskId,说明是新建任务，不请求数据
            return;
        }
        const currentCenterId = User.currentCenterId;
        const params = {
            url: CustomerApi.查询任务详情,
            data: {
                id: taskId,
                currentCenterId
            }
        };
        Fetch.post(params).then((res) => {
            // 取得详情数据后，填充到表单，并且初始化任务状态的选项
            const { customerList, taskTheme } = res;
            this.setState({
                taskDetail: res,
                taskStatusList: taskStatusDict[taskTheme]
            });

            // 把宝宝列表设置到redux
            setCustomer(customerList);
        }).catch((e) => {
            console.log(e);
        })
    }

    handleChangePriority = e => {
        const newTaskDetail = { ...this.state.taskDetail };
        if (e.target.checked) {
            newTaskDetail.priority = priorityEnum.紧急;
        } else {
            newTaskDetail.priority = priorityEnum.正常;
        }
        this.setState({
            taskDetail: newTaskDetail
        })
    };

    openNextTask = () => {
        /*显示下次任务表单*/
        this.setState({
            createNew: true
        })
    };

    closeNextTask = () => {
        /*关闭下次任务表单*/
        this.setState({
            createNew: false,
            nextPriority: false
        })
    };

    handleChangeNextPriority = e => {
        this.setState({
            nextPriority: e.target.checked ? priorityEnum.紧急 : priorityEnum.正常
        })
    };

    switchNextTaskBtn = (createNew: boolean) => {
        /*用户点击创建下次任务切换按钮*/
        const { nextPriority } = this.state;
        if (createNew) {
            return (
                <Row>
                    <Col span={16}>
                        <Button
                            htmlType="button"
                            type="primary"
                            size="small"
                            ghost={true}
                            shape="circle"
                            icon="minus"
                            onClick={this.closeNextTask}
                        />
                    </Col>
                    <Col span={8}>
                        <Checkbox
                            checked={nextPriority === priorityEnum.紧急}
                            onChange={this.handleChangeNextPriority}
                        >
                            紧急
                        </Checkbox>
                    </Col>
                </Row>
            )
        }

        return (
            <Button
                htmlType="button"
                type="primary"
                size="small"
                ghost={true}
                disabled={!this.state.isEnd}
                shape="circle"
                icon="plus"
                onClick={this.openNextTask}
            />
        )
    };

    createNextTaskForm = (createNew: boolean) => {
        /*用户点击创建下次任务添加的表单结构*/
        const { getFieldDecorator } = this.props.form;

        if (createNew) {
            return (
                <div className="next-task-wrap">
                    <Item label="主题" {...formItemLayout} className="gym-input-wrap">
                        {
                            getFieldDecorator('nextTaskThemeCode', {
                                rules: [
                                    {
                                        required: true,
                                        message: '下次任务主题不能为空'
                                    }
                                ]
                            })(
                                <Select style={{ width: 200 }}>
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
                            getFieldDecorator('nextTaskTime', {
                                initialValue: moment(this.taskTime),
                                rules: [
                                    {
                                        required: true,
                                        message: '下次任务时间不能为空'
                                    }
                                ]
                            })(
                                <DatePicker
                                    className="gym-datepick"
                                    format="YYYY-MM-DD HH:mm"
                                    showTime={true}
                                    style={{ width: 200 }}
                                />
                            )
                        }
                    </Item>
                    <Item label="任务描述" {...formItemLayout} className="gym-input-wrap">
                        {
                            getFieldDecorator('nextTaskDesc', {
                                rules: [
                                    {
                                        required: true,
                                        message: '下次任务描述不能为空'
                                    }
                                ]
                            })(
                                <TextArea maxLength={3000} className="remark" placeholder="请在此输入" />
                            )
                        }
                    </Item>
                </div>
            )
        }

        return null;
    };

    handleStatusChange = (value) => {
        /*处理任务状态变更*/
        if (value !== taskStatusEnum.待完成) {
            this.setState({
                isEnd: true
            })
        } else {
            this.setState({
                isEnd: false
            });

            // 关闭已生成的表单
            if (this.state.createNew) {
                this.setState({
                    createNew: false
                })
            }
        }
    };
    handleSubmit = () => {
        // 提交表单
        const { submitEditForm, submitAddForm, form, taskId, searchTaskList, handleOk } = this.props;
        const { taskDetail, nextPriority, createNew } = this.state;
        const { creator, priority } = taskDetail;
        const currentCenterId = User.currentCenterId;
        form.validateFields((err: Error, values) => {
            if (!err) {
                const { taskThemeCode, taskTime, taskStatus } = values;
                // 面谈已到访的时间不能晚于当前时间
                if (taskThemeCode === taskThemeEnum.面谈 && taskStatus === taskStatusEnum.已到访 && new Date(taskTime).getTime() > Date.now()) {
                    message.error('到访时间不能晚于当前时间，请修改任务时间!');
                    return;
                }
                values.currentCenterId = currentCenterId;
                values.createStaffId = creator.staffId;
                values.priority = priority;
                values.taskTime = values.taskTime.valueOf();

                if (createNew) {
                    values.nextTaskFlag = createNew ? '1' : '0';
                    values.nextPriority = nextPriority;
                    values.nextTaskTime = values.nextTaskTime.valueOf();
                }

                if (taskId) {
                    // 编辑任务
                    values.mainTaskId = taskId;
                    submitEditForm({
                        editData: values,
                        cb: handleOk
                    });
                } else {
                    // 新建任务
                    submitAddForm({
                        addData: values,    // 新建任务表单数据
                        searchTaskList,     // 成功之后执行此函数，请求一下任务列表数据
                        cb: handleOk
                    });
                }
            }
        });
    }
}

// 设置mapStateToProps和mapDispatchToProps
const mapStateToProps = state => {
    const { stuffListOnJob, customerList } = state.taskList;
    return {
        stuffListOnJob,          // 员工列表
        customerList,       // 服务对象列表
    }
};

const mapDispatchToProps = dispatch => ({
    switchCustomModal(showCustomModel: boolean) {
        // 切换服务对象表单的显示状态
        dispatch(switchCustomerModal(showCustomModel));
    },
    submitEditForm(params) {
        // 编辑表单
        dispatch(editTask(params));
    },
    submitAddForm(params) {
        // 添加任务
        dispatch(addTask(params));
    },
    getCenterStuffList(params) {
        dispatch(getStuffListOnJob(params));
    },
    getCustomer(params) {
        // 获取服务对象列表
        dispatch(getCustomerList(params));
    },
    setCustomer(params) {
        // 设置服务对象列表
        dispatch(setCustomerList(params));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(EditorTaskForm));
