/**
 * desc:跟进预约到访，任务中心表格
 * User: lyon.li@gymboglobal.com
 * Date: 2018/11/1
 * Time: 上午11:44
 */
import React, {Component} from 'react';
import {Tabs} from "antd";
import {connect} from "react-redux";
import {choiceTaskListItem} from "@/saga/actions/customer/taskCenter";
import {ColumnProps} from 'antd/lib/table';
import {TablePagination} from "@/ui/component/tablePagination";
import moment from 'moment';
import {priorityDict, taskStatusEnum} from "../enum";
import {CustomerRoutes} from "@/router/enum/customerRoutes";
import {CommonUtils} from "@/common/utils/commonUtils";
import {User} from "@/common/beans/user";
import { Filter } from "@/common/filters/filter";
import '../style/taskCenter.scss';

// 解构出组件的二级组件，方便调用
const {TabPane} = Tabs;

// 定义表格columns的结构和数据源结构
declare interface TaskListColumns extends ColumnProps {
    title: string,
    dataIndex: string,
    [propName: string]: any
}

declare interface TaskListData {
    key: number,
    taskType: string, // 任务类型
    taskTopic: string,  // 任务主题
    forWho: string, // 服务对象
    taskTime: string, // 任务时间
    initiator: string, // 发起人
    executor: string, // 执行人
    taskStatus: string, // 任务状态
    priority: string, // 操作
    [propName: string]: any
}

// 定义组件的props和state结构
interface TaskTableProps {
    list: TaskListData[], // 数据
    selectedRowKeys: number[],  // 被选择的表单行号
    selectedRows: object[], // 被选择的行内容
    [propName: string]: any
}

interface TaskTableState {
    columns: TaskListColumns[], // columns,定义表头数据
    [propName: string]: any
}

class TaskTable extends Component<TaskTableProps, TaskTableState> {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            columns: [
                {
                    title: '类型',
                    dataIndex: 'taskType',
                    width: 100,
                    render(text) {
                        const config = {
                            '67001': '自定任务',
                            '67002': '伙伴邀约',
                            '67003': '系统提醒',
                        };
                        return config[text];
                    }
                },
                {
                    title: '主题',
                    dataIndex: 'taskTheme',
                    width: 80,
                },
                {
                    title: '服务对象',
                    dataIndex: 'customer',
                    width: 200,
                    render(text, record) {
                        return <a href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId: record.leadsId})}`} target="_blank">{text}</a>;
                    }
                },
                {
                    title: '任务时间',
                    width: 215,
                    dataIndex: 'taskTime',
                    render(text) {
                        return moment(text).format('YYYY-MM-DD HH:mm');
                    }
                },
                {
                    title: '下次联系时间',
                    width: 215,
                    dataIndex: 'tmkNextContactTime',
                    render: (text: number, record: any) => text&&`${moment(text).format('YYYY-MM-DD HH:mm')}`
                },
                {
                    title: '发起人',
                    dataIndex: 'createStaffName',
                    width: 120,
                },
                {
                    title: '执行人',
                    width: 200,
                    dataIndex: 'executorNames',
                },
                {
                    title: '任务状态',
                    dataIndex: 'taskStatus',
                    width: 100,
                    render: (texr: string) => Filter.formatTaskStatus(texr)

                },
                {
                    title: '优先级',
                    dataIndex: 'priority',
                    width: 80,
                    render(text) {
                        return priorityDict[text];
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'operate',
                    width: 120,
                    render: (text, item, index) => {
                        return (
                            <button
                                className="gym-button-xxs gym-button-white"
                                onClick={() => {
                                    const {setTaskId, switchEditModel} = this.props;
                                    setTaskId(item.mainTaskId);
                                    requestAnimationFrame(() => {
                                        switchEditModel(true)
                                    });
                                }}
                            >
                                {/*已有执行结果的任务只能查看*/}
                                {(item.taskStatus === taskStatusEnum.待完成 && (item.executorId || []).includes(User.userId)) ? '更改' : '查看'}
                            </button>
                        )
                    }
                },
            ],
            // tab配置
            tabConfig: [
                {
                    key: '0',
                    name: '全部',
                },
                {
                    key: '67001',
                    name: '自定任务'
                },
                {
                    key: '67002',
                    name: '伙伴邀约'
                }
            ]
        }
    }

    render() {
        const {list, /*selectedRowKeys,*/ pageNo, pageSize, totalSize, taskType} = this.props;
        const {columns, tabConfig} = this.state;
        return (
            <div className="gym-task-wrap">
                <Tabs
                    type="card"
                    activeKey={taskType}
                    className=""
                    onChange={this.handleTabChange}
                >
                    {
                        tabConfig.map(item => {
                            const {key, name} = item;
                            return (
                                <TabPane tab={name} key={key} className="page-wrap-taskcenter">
                                    <TablePagination
                                        columns={columns}
                                        rowKey={val => val.mainTaskId}
                                        dataSource={list}
                                        totalSize={totalSize}
                                        pageSize={pageSize}
                                        handleChangePage={this.handleChangePage}
                                        pageNo={pageNo}
                                    />
                                </TabPane>
                            )
                        })
                    }

                    {/*系统提醒本期不做<TabPane tab="系统提醒" key="67003">
                        <Table
                            bordered={true}
                            columns={columns}
                            dataSource={list}
                            rowKey={item=>item.mainTaskId}
                            rowSelection={{
                                type: 'checkbox',
                                selectedRowKeys,
                                onChange: this.handleCheckChange
                            }}
                            pagination={false}
                        />
                    </TabPane>*/}
                </Tabs>
            </div>
        )
    }

    handleTabChange = (key) => {
        const {searchTaskList, changePageNO, changeTaskTab} = this.props;
        changeTaskTab(key);     // 改变标签页
        changePageNO(1);    // 重置页码
        requestAnimationFrame(() => searchTaskList());
    };

    handleChangePage = ({pageNo, pageSize}) => {
        const {changePageNO, changePageSize, searchTaskList} = this.props;
        changePageNO(pageNo);
        changePageSize(pageSize);
        requestAnimationFrame(() => searchTaskList())
    };
}

// 定义mapStateToProps和mapDispatchToProps;
const mapStateToProps = state => {
    const {selectedRowKeys, selectedRows, list, pageNo, pageSize, totalNo, totalSize, taskType} = state.taskList;
    return {
        list, selectedRowKeys, selectedRows, pageNo, pageSize, totalNo, totalSize, taskType
    }
};

const mapDispatchToProps = dispatch => ({
    choiceListItem(selectedRowKeys: number[], selectedRows: object[]) {
        // 选择条目
        dispatch(choiceTaskListItem(selectedRowKeys, selectedRows));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskTable)
