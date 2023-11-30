/**
 * desc:跟进预约到访，任务中心高级查询表单
 * User:
 * Date: 2018/11/23
 * Time: 下午19:10
 */
import React, {Component} from "react";
import {Button, Col, DatePicker, Form, Row, message} from "antd";
import {Select, Option} from "@/ui/component/select";
import {Input} from "@/ui/component/input";
import {connect} from "react-redux";
import {taskStatusDict, taskStatusEnum} from "../enum";
import {getStuffList} from "@redux-actions/customer/taskCenter";
import moment from "moment";
import {selectTotalEmployeeList} from "@/saga/selectors/home";

const selectOption = {
    workingStatus: "1",
};

// 解构出组件的二级组件，方便调用
const {Item} = Form;
const {RangePicker} = DatePicker;

// 定义SearchForm的props结构、state结构、values结构
interface SearchFormProps {
    [propName: string]: any
}

interface SearchFormValues {
    taskTheme: string,                         // 主题
    leadId: string,                            // 服务对象
    createTaskStaffId: string,                 // 发起人
    executeTaskStaffId: string,                // 执行人
    taskStatus: string,                        // 任务状态
    taskTime: any[] | string,                  // 任务时间
    display?:boolean,                          // 是否不可操作
    [propName: string]: any,
}

class SearchForm extends Component<SearchFormProps, any> {
    constructor(props) {
        super(props);
        this.state = {
            taskStatusList: [
                {
                    key: taskStatusEnum.待完成,
                    text: '待完成'
                }
            ],
            theme: true,
        }
    }

    render() {
        // 解构出props和state里需要用到的方法和数据，避免反复取值
        const {
            createStaffId, executeStaffIdList, customerKeyWord, taskStatus,
            taskTheme, form, stuffList, startDate, endDate
        } = this.props;
        const {getFieldDecorator} = form;
        const { taskStatusList} = this.state;
        const taskThemeList = [
            { key: "70001", value: "联系" },
            { key: "70002", value: "面谈" },
            { key: "70003", value: "签约" },
            {key: "70004", value: "其他"}
        ]
        return (
            <Form className="gym-search-form page-wrap">
                <Row>
                    <Col span={8}>
                        <Item label="主题:">
                            {
                                getFieldDecorator('taskTheme', {
                                    initialValue: taskTheme
                                })(
                                    <Select onChange={this.handleChangeTaskTheme}>
                                        {
                                            taskThemeList.map(item => (
                                                <Option value={item.key} key={item.key}>{item.value}</Option>))
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label="服务对象:">
                            {
                                getFieldDecorator('customerKeyWord', {
                                    initialValue: customerKeyWord
                                })(
                                    <Input style={{width: 200}} placeholder="请输入宝宝姓名"/>
                                )
                            }
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label="任务状态:">
                            {
                                getFieldDecorator('taskStatus', {
                                    initialValue: taskStatus
                                })(
                                    <Select>
                                        {
                                            taskStatusList.map(item => (
                                                <Option value={item.key} key={item.key}>{item.text}</Option>))
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Item label="发起人">
                            {
                                getFieldDecorator('createStaffId', {
                                    initialValue: createStaffId
                                })(
                                    <Select
                                        filterOption={(input, option) => {
                                            const text = option.props.children as string;
                                            return text.toLowerCase().includes(input.toLowerCase())
                                        }}
                                        showSearch={true}
                                    >
                                        {
                                            stuffList.map(item => (
                                                <Option value={item.staffId} key={item.staffId}>{item.userName}</Option>))
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item label="执行人:" className="gym-task-execute">
                            {
                                getFieldDecorator('executeStaffIdList', {
                                    initialValue: executeStaffIdList
                                })(
                                    <Select
                                        mode="multiple"
                                        filterOption={(input, option) => {
                                            const text = option.props.children as string;
                                            return text.toLowerCase().includes(input.toLowerCase())
                                        }}
                                    >
                                        {
                                            stuffList.map(item => (
                                                <Option value={item.staffId} key={item.staffId}>{item.userName}</Option>))
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item className="gym-task-time" label="任务时间:">
                            {
                                getFieldDecorator('taskTime', {
                                    initialValue: [moment(startDate), moment(endDate)]
                                })(
                                    <RangePicker
                                        showTime={false}
                                        format="YYYY-MM-DD HH:mm"/>
                                )
                            }
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item className="gym-task-time" label="下次联系时间:">
                            {
                                getFieldDecorator('tmkNextContactTime', {
                                })(
                                    <RangePicker
                                        showTime={false}
                                    />
                                )
                            }
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={16}>
                        <div className="gym-search-btn-group">
                            <Button
                                htmlType="button"
                                className='gym-button-xs gym-button-blue ml15'
                                onClick={this.handleSearch}
                            >
                                查询
                            </Button>
                            <Button
                                htmlType="button"
                                onClick={this.handleReset}
                                className='gym-button-xs gym-button-wBlue ml15'
                            >
                                重置
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        )
    }

    componentDidMount() {

    }

    handleChangeTaskTheme = (value) => {
        // 当重新选择任务主题时，清空已选择的任务状态并生成新的状态值
        const {form} = this.props;
        form.resetFields(['taskStatus']);
        this.setState({
            taskStatusList: taskStatusDict[value]
        });
    };

    handleSearch = (e) => {
        /*点击查询按钮时执行的操作*/
        e.preventDefault();
        const {form, searchTaskList, changeFormData, changePageNO, changeTag} = this.props;
        form.validateFields((err: Error, values: SearchFormValues) => {
            if (err) {
                message.error('获取表单数据出错，请稍后重试');
                return;
            }
            // 把任务时间拆分成开始时间和结束时间两个字段
            const { taskTime, tmkNextContactTime} = values;
            let taskDateBegin: string = '', taskDateEnd: string = '';
            let tmkNextContactTimeBegin: string = '', tmkNextContactTimeEnd: string = '';
            if (Array.isArray(taskTime) && taskTime.length === 2) {
                taskDateBegin = taskTime[0].startOf('day').valueOf();
                taskDateEnd = taskTime[1].endOf("day").valueOf();
            }
            values.taskDateBegin = taskDateBegin;
            values.taskDateEnd = taskDateEnd;
            if (Array.isArray(tmkNextContactTime) && tmkNextContactTime.length === 2) {
                tmkNextContactTimeBegin = tmkNextContactTime[0].startOf('day').valueOf();
                tmkNextContactTimeEnd = tmkNextContactTime[1].endOf("day").valueOf();
            }
            values.tmkNextContactTimeBegin = tmkNextContactTimeBegin;
            values.tmkNextContactTimeEnd = tmkNextContactTimeEnd;
            delete values.taskTime;

            changePageNO(1);    // 重置页码，发送表单数据并执行查询
            changeTag('0');     // 重置快速查询
            changeFormData(values);
            requestAnimationFrame(() => searchTaskList(values));
        })
    };

    handleReset = (e) => {
        /*点击重置按钮时执行的操作*/
        e.preventDefault();
        const {changeFormData, form, startDate, endDate} = this.props;
        changeFormData({
            createStaffId: '',
            executeStaffIdList: [],
            leadId: '',
            taskStatus: '',
            taskTheme: '',
            customerKeyWord: '',
            taskDateBegin: startDate,
            taskDateEnd: endDate
        });
        form.resetFields();
    }
}

// 设置mapStateToProps和mapDispatchToProps
const mapStateToProps = state => {
    const { createTaskStaffId, executeStaffIdList, customerKeyWord, taskStatus, taskTheme, taskType, tmkNextContactTime} = state.taskList;
    return {
        createTaskStaffId,      // 发起人Id
        executeStaffIdList,     // 执行人Id
        customerKeyWord,        // 服务对象
        taskStatus,             // 任务状态
        taskTheme,              // 主题
        taskType,               // 类型
        tmkNextContactTime,     // 下次联系时间
        stuffList: selectTotalEmployeeList(state, selectOption),              // 员工列表
    }
};
const mapDispatchToProps = dispatch => ({
    getCenterStuffList(params) {
        dispatch(getStuffList(params));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
