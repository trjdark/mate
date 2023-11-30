/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/8/17
 * Time: 上午9:17
 */
import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import ConvenientSearchTag from '../part/convenientSearchTag';
import EditorTaskForm from '../../../component/editTaskForm';
import SearchForm from '../part/searchForm';
import TaskTable from '../part/taskTable';
import SearchCostomer from '../part/searchCostomer';
import OperatPanel from '../part/operatPanel';
import {Form} from "antd";
import {getTaskCenterList} from "@redux-actions/customer/taskCenter";
import {User} from "@/common/beans/user";
import {
    changeConvinentTag,
    changeSearchFormData, changeTaskListTab, changeTaskPageNO, changeTaskPageSize,
    switchEditTaskModel, setTaskId,resetTaskCenterData
} from "@/saga/actions/customer/taskCenter";
import {CommonUtils} from "@/common/utils/commonUtils";


// 设置props和state的数据结构
interface TaskCenterProps {
    showEditModel,  // 显示编辑弹框
    searchData,     // 查询任务列表的数据
    [propName: string]: any
}

interface TaskCenterState {
    [propName: string]: any
}

class TaskCenter extends Component<TaskCenterProps, TaskCenterState> {
    // 面包屑配置
    private breadCrumbRoutes = [
        {
            path: 'first',
            name: '工作台',
            id: '',
            link: ''
        }, {
            path: 'second',
            name: '任务中心',
            id: '',
            link: ''
        }
    ];

    constructor(props) {
        super(props);
        this.state = {
            leadsId: '',
            phase:'',   // 从360跳转带过来的阶段字段
            quickSearchType:'0'
        }
    }

    render() {
        // 解构出props和state里需要用到的方法和数据，避免反复取值
        const {
            showEditModel, showCustomModel, switchEditModel, changeTag, changeFormData, changeTaskTab,
            changePageNO, changePageSize, taskId, setMainTaskId,form, searchData
        } = this.props;
        const {leadsId,phase,quickSearchType} = this.state;
        return (
            <Fragment>
                {/*面包屑导航*/}
                <BreadCrumb routes={this.breadCrumbRoutes}/>
                {/*快速搜索标签*/}
                <ConvenientSearchTag
                    changeTag={changeTag}
                    changeFormData={changeFormData}
                    searchTaskList={this.handleSearchTaskList}
                    changeTaskTab={changeTaskTab}
                    changePageNO={changePageNO}
                    startDate={searchData.taskDateBegin}
                    endDate={searchData.taskDateEnd}
                    form={form}
                    selectedConvenientSearchTag={quickSearchType}
                />

                {/*高级查询表单*/}
                <SearchForm
                    changeFormData={changeFormData}
                    changeTag={changeTag}
                    searchTaskList={this.handleSearchTaskList}
                    changePageNO={changePageNO}
                    startDate={searchData.taskDateBegin}
                    endDate={searchData.taskDateEnd}
                    form={form}
                />

                {/*操作面板*/}
                <OperatPanel/>

                {/*tab页签和表格*/}
                <TaskTable
                    searchTaskList={this.handleSearchTaskList}
                    switchEditModel={switchEditModel}
                    changeTag={changeTag}
                    setTaskId={setMainTaskId}
                    changeTaskTab={changeTaskTab}
                    changePageNO={changePageNO}
                    changePageSize={changePageSize}
                />

                {/*编辑任务的弹框*/}
                {
                    showEditModel
                        ? <EditorTaskForm
                            switchEditModel={switchEditModel}
                            leadsId={leadsId}
                            taskId={taskId}
                            phase={phase}
                            searchTaskList={this.handleSearchTaskList}
                            handleOk={this.handleOk}
                        />
                        : null
                }

                {/*搜索服务对象弹框*/}
                {showCustomModel ? <SearchCostomer/> : null}
            </Fragment>
        );
    }

    componentDidMount() {
        const {switchEditModel, changeFormData,changeTag} = this.props;
        if (CommonUtils.hasParams(this.props)) {
            // 如果有路由参数，说明是从360页面跳过来的
            const routerParams = CommonUtils.parse(this.props);
            if (routerParams.hasOwnProperty('leadsId') && routerParams.hasOwnProperty('taskStatus')) {
                // 如果路由参数里面同时含有leadsId和taskStatus，进行查询操作
                const {taskStatus, leadsId} = routerParams;
                if (typeof taskStatus === 'string') {
                    // 如果状态值是字符串，查询未完成状态的数据
                    changeFormData({leadId: leadsId, taskStatus})
                } else if (typeof taskStatus === 'boolean' && taskStatus) {
                    // 如果状态是布尔值且状态为true，查询所有非未完成状态的数据
                    changeFormData({leadId: leadsId, hasFinish: taskStatus});
                }
            }

            if (routerParams.hasOwnProperty('leadsId') && !routerParams.hasOwnProperty('taskStatus')) {
                // 如果路由参数里面含有leadsId但没有taskStatus，新建任务
                const {leadsId, phase} = routerParams;
                this.setState({
                    leadsId,
                    phase
                });
                switchEditModel(true);
            }
            //如果带有quickSearchType则直接进行快速查询
            if(routerParams.hasOwnProperty('quickSearchType')){
                const {quickSearchType} = routerParams;
                changeTag(quickSearchType);
                this.handleSearchTaskList();
            }
            // 设置完查询条件后，执行一次查询
            requestAnimationFrame(() => this.handleSearchTaskList());
        } else {
            // 页面加载，首先执行一次查询
            this.handleSearchTaskList();
        }
    }

    componentWillUnmount() {
        // 卸载组件时，重置所有数据
        this.props.resetAllData();
    }

    handleSearchTaskList = () => {
        const {searchData, getTaskList} = this.props;
        let data = {...searchData};
        if (data.taskType === '0') {
            // 当查询类型为全部时，不传递这个值
            delete data.taskType;
        }
        if (data.quickSearchType === '0') {
            // 当快速查询标签为全部时，不传递对应的参数
            delete data.quickSearchType
            this.setState({
                quickSearchType:'0',
            })
        }else{
            this.setState({
                quickSearchType:data.quickSearchType,
            })
        }
        getTaskList(data);
    };

    handleOk = () => {
        // 点击确定按钮之后的回调函数
        this.props.switchEditModel(false);
    }
}

// 设置mapStateToProps和mapDispatchToProps
const mapStateToProps = state => {
    const {
        showEditModel, showCustomModel, createStaffId, executeStaffIdList, customerKeyWord, pageNo, pageSize,
        taskDateBegin, taskDateEnd, taskStatus, taskTheme, taskType, quickSearchType, taskId, hasFinish, tmkNextContactTimeBegin,
        tmkNextContactTimeEnd
    } = state.taskList;
    const currentCenterId = User.currentCenterId;
    return {
        showEditModel,              // 显示编辑弹框
        showCustomModel,            // 显示服务对象弹框
        taskId,                     // 当前任务的id
        searchData: {
            currentCenterId,        // 中心id
            createStaffId,          // 发起人Id
            executeStaffIdList,     // 执行人Id列表
            pageNo,                 // 当前页面
            pageSize,               // 每页显示的条数
            taskDateBegin,          // 开始日期
            taskDateEnd,            // 结束日期
            taskStatus,             // 任务状态
            taskTheme,              // 主题
            taskType,               // 类型
            quickSearchType,        // 快速查询
            customerKeyWord,        // 服务对象
            hasFinish,              // 是否查询所有非完成状态的任务
            tmkNextContactTimeBegin,
            tmkNextContactTimeEnd
        }
    }
};
const mapDispatchToProps = dispatch => ({
    getTaskList(params) {
        dispatch(getTaskCenterList(params));
    },
    switchEditModel(showEditModel: boolean) {
        dispatch(switchEditTaskModel(showEditModel))
    },
    changeTag(params) {
        dispatch(changeConvinentTag(params))
    },
    changeFormData(searchData) {
        // 发送表单数据
        dispatch(changeSearchFormData(searchData));
    },
    changeTaskTab(taskType: string) {
        dispatch(changeTaskListTab(taskType));
    },
    changePageNO(pageSize: number) {
        // 更改页码
        dispatch(changeTaskPageNO(pageSize));
    },
    changePageSize(pageSize: number) {
        // 切换每页条数
        dispatch(changeTaskPageSize(pageSize))
    },
    setMainTaskId(id: string) {
        // 设置taskId
        dispatch(setTaskId(id));
    },
    resetAllData(){
        // 重置所有数据
        dispatch(resetTaskCenterData());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(TaskCenter));
