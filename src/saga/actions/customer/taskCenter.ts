/*
* desc:跟进预约到访，任务中心action
* User: lyon.li@gymboglobal.com
* Date: 2018/11/6
* Time: 上午14:10
* */

import {CustomerApi} from "@/api/customerApi";
import {SetApi} from "@/api/settingApi";
import {Events} from "@/events/events";
import {call, put} from "redux-saga/effects";
import {Action} from "@/.h/global";
import {Fetch} from "@/service/fetch";
import {message} from "antd";
import moment from "moment";

// 选择任务条目
export const choiceTaskListItem = (selectedRowKeys: number[], selectedRows: object[]): Action => {
    return {
        type: Events.CHOICE_LIST_ITEM,
        selectedRowKeys,
        selectedRows
    }
};

// 切换编辑任务弹框的显示和隐藏
export const switchEditTaskModel = (showEditModel: boolean): Action => {
    return {
        type: Events.SWITCH_EDIT_FORM,
        showEditModel
    }
};

// 设置taskId
export const setTaskId = (taskId): Action => {
    return {
        type: Events.SET_TASK_ID,
        taskId
    }
};

// 切换服务对象弹框的显示和隐藏
export const switchCustomerModal = (showCustomModel: boolean): Action => {
    return {
        type: Events.SWITCH_CUSTOMER_FORM,
        showCustomModel
    }
};

// 选择服务对象条目
export const choiceCustomListItem = (selectedCustomKeys: number[], selectedCustomRows: object[]): Action => {
    return {
        type: Events.CHOICE_CUSTOM_ITEM,
        selectedCustomKeys,
        selectedCustomRows
    }
};

// 切换快速查询标签
export const changeConvinentTag = (quickSearchType: number) => {
    return {
        type: Events.CHANGE_CONVINENTTAG,
        quickSearchType,
    }
};

// 更改任务列表高级搜索的数据
export const changeSearchFormData = (searchData) => {
    return {
        type: Events.SEARCH_FROM_TASK_LIST,
        searchData
    }
};

// 切换任务列表标签
export const changeTaskListTab = (taskType: string) => {
    return {
        type: Events.CHANGE_TASK_LIST_TAB,
        taskType
    }
};

// 更改任务列表页码
export const changeTaskPageNO = (pageNo: number) => {
    return {
        type: Events.CHANGE_TASK_PAGE_NO,
        pageNo
    }
};

// 更改每页条数
export const changeTaskPageSize = (pageSize: number) => {
    return {
        type: Events.CHANGE_TASK_PAGE_SIZE,
        pageSize
    }
};

// 设置客户中心列表
export const setCustomerList = list => {
    return {
        type: Events.SET_CUSTOMER_LIST,
        customerList: list
    }
};

// 重置所有信息
export const resetTaskCenterData = () => {
    return {
        type: Events.RESET_TASKCENTER_DATA,
        data: {
            list: [],   // 任务列表
            selectedRowKeys: [],    // 任务被选择的行号
            selectedRows: [],       // 任务被选择的数据
            selectedCustomKeys: [],  // 服务对象被选择的行号
            selectedCustomRows: [],  // 服务对象被选择的数据
            showEditModel: false,   // 切换编辑任务弹框的显示和隐藏
            showCustomModel: false, // 控制服务对象表单是否显示
            taskId: '',              // 编辑任务表单时，点选的条目Id
            createStaffId: '',       // 发起人Id
            executeStaffIdList: [],  // 执行人Id列表
            customerKeyWord: '',     // 服务对象Id
            pageNo: 1,               //  任务列表当前页面
            pageSize: 10,            // 任务列表每页显示的条数
            totalSize: 0,           // 任务列表总条数
            taskDateBegin: moment().startOf('d').valueOf(),       // 开始日期
            taskDateEnd: moment().endOf('d').valueOf(),         // 结束日期
            taskStatus: '',          // 任务状态
            hasFinish: false,       // 是否查询所有非完成状态的任务
            taskTheme: '',           // 主题
            taskType: '0',           // 类型 1自定义任务，2伙伴邀约任务，3系统提醒任务
            quickSearchType: '0',   // 快速查询
            GAlist: [],              // GA列表
            GBlist: [],              // GB列表
            stuffList: [],           // 员工列表
            tableIsLoading: false,  // table上是否显示一个正在加载的图标
            customerList: [],        // 服务对象列表
        }
    }
};

// 查询任务列表
export function* getTaskList(action: Action) {
    let params;
    params = {
        url: CustomerApi.查询任务列表,
        data: action.data
    };
    try {
        const {list, totalSize} = yield call(Fetch.post.bind(Fetch), params);
        // 设置任务列表
        yield put({type: Events.GET_TASK_LIST, data: list});
        // 设置总页数和总条数
        yield put({type: Events.SET_TOTAL_NO, totalSize});
    } catch (e) {
        console.error(e.msg);
    }
}

// 删除选中的任务
export function* deleteSelectedTask(action: Action) {
    const params = {
        url: CustomerApi.删除选中的任务,
        data: action.params
    };

    const res = yield call(Fetch.post.bind(Fetch), params);
    yield put({type: Events.DELETE_SELECTED_TASK, data: res})
}

// 设置选中任务条目的状态（已完成，待完成，已忽略）
export function* setSelectedTaskItem(action: Action) {
    const params = {
        url: CustomerApi.设置任务状态,
        data: action.params
    };
    const res = yield call(Fetch.post.bind(Fetch), params);
    yield put({type: Events.SET_SELECTED_TASK_ITEM, data: res});
}

// 获取GA列表
export function* getGAlist(action: Action) {
    const params = {
        url: CustomerApi.查询GAHGA在职离职半年,
        data: action.params
    };
    try {
        const res = yield call(Fetch.post.bind(Fetch), params);
        yield put({type: Events.SET_GA_LIST, GAlist: res})
    } catch (e) {
        // 错误处理
        console.error(e.msg);
    }
}

// 获取GB列表
export function* getGBlist(action: Action) {
    const params = {
        url: CustomerApi.查询GBHGB在职离职半年,
        data: action.params
    };
    try {
        const res = yield call(Fetch.post.bind(Fetch), params);
        yield put({type: Events.SET_GB_LIST, GBlist: res});
    } catch (e) {
        // 错误处理
        console.error(e.msg);
    }
}

// 新建任务
export function* addTask(action: Action) {
    const {addData, searchTaskList, cb} = action.params;
    const params = {
        url: CustomerApi.新建任务,
        data: addData
    };
    try {
        yield call(Fetch.post.bind(Fetch), params);
        yield call(searchTaskList);
        yield message.success('添加任务已成功');
        if (typeof cb === 'function') {
            yield cb();
        }
    } catch (e) {
        // 错误处理
        message.error(e.msg);
    }
}

// 编辑任务
export function* editTask(action: Action) {
    const {editData, cb} = action.params;
    const params = {
        url: CustomerApi.编辑任务,
        data: editData
    };

    try {
        const res = yield call(Fetch.post.bind(Fetch), params);
        if (res) {
            yield put({type: Events.EDIT_TASK, data: res});
            yield message.success('编辑任务已成功');
            if (typeof cb === 'function') {
                yield cb();
            }
        }
    } catch (e) {
        console.error(e.msg);
    }
}

// 获取员工列表(在职加离职半年)
export function* getStuffList(action: Action) {
    const params = {
        url: SetApi.员工列表,
        data: action.params
    };

    try {
        const res = yield call(Fetch.post.bind(Fetch), params);
        if (res && res.length > 0) {
            yield put({type: Events.SET_STUFF_LIST, stuffList: res});
        }
    } catch (e) {
        console.error(e.msg);
    }
}

// 获取员工列表（在职）
export function* getStuffListOnJob(action: Action) {
    const params = {
        url: SetApi.在岗员工列表,
        data: action.params
    };
    try {
        const res = yield  call(Fetch.post.bind(Fetch), params);
        if (res && res.length > 0) {
            yield put({type: Events.SET_STUFF_LIST_ON_JOB, stuffListOnJob: res})
        }
    } catch (e) {
        console.error((e.msg));
    }
}

// 获取服务对象列表
export function* getCustomerList(action: Action) {
    const params = {
        url: CustomerApi.查询leads客户名称信息,
        data: action.params
    };

    try {
        const res = yield call(Fetch.post.bind(Fetch), params);
        if (res && res.length > 0) {
            yield put(setCustomerList(res))
        }
    } catch (e) {
        console.log(e.msg);
    }
}
