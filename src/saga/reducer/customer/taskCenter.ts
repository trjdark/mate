/*
* desc:跟进预约到访，任务中心reducer
* User: lyon.li@gymboglobal.com
* Date: 2018/11/6
* Time: 上午14:10
* */
import {handleActions} from 'redux-actions';
import {Events} from "@/events/events";
import {Action} from "@/.h/global";
import {cloneDeep} from 'lodash';
import moment from "moment";

const defaultState = {
    list: [],   // 任务列表
    selectedRowKeys: [],    // 任务被选择的行号
    selectedRows: [],       // 任务被选择的数据
    selectedCustomKeys:[],  // 服务对象被选择的行号
    selectedCustomRows:[],  // 服务对象被选择的数据
    showEditModel: false,   // 切换编辑任务弹框的显示和隐藏
    showCustomModel: false, // 控制服务对象表单是否显示
    taskId:'',              // 编辑任务表单时，点选的条目Id
    createStaffId:'',       // 发起人Id
    executeStaffIdList:[],  // 执行人Id列表
    customerKeyWord:'',     // 服务对象
    pageNo:1,               //  任务列表当前页面
    pageSize:10,            // 任务列表每页显示的条数
    totalSize: 0,           // 任务列表总条数
    taskDateBegin: moment().startOf('d').valueOf(),       // 开始日期
    taskDateEnd: moment().endOf('d').valueOf(),         // 结束日期
    taskStatus:'',          // 任务状态
    hasFinish: false,       // 是否查询所有非完成状态的任务
    taskTheme:'',           // 主题
    taskType:'0',           // 类型 1自定义任务，2伙伴邀约任务，3系统提醒任务
    quickSearchType: '0',   // 快速查询
    GAlist:[],              // GA列表
    GBlist:[],              // GB列表
    stuffList:[],           // 员工列表（在职加离职半年）
    stuffListOnJob: [],     // 员工列表（在职）
    tableIsLoading: false,  // table上是否显示一个正在加载的图标
    customerList:[],        // 服务对象列表
};

const reducer = handleActions(
    {
        [Events.GET_TASK_LIST](state: any, action: Action) {
            // 查询任务列表
            return {
                ...state,
                list: action.data
            };
        },
        [Events.CHOICE_LIST_ITEM](state: any, action: Action) {
            // 设置选中的任务条目
            const {selectedRowKeys, selectedRows} = action;
            return {
                ...state,
                selectedRowKeys,
                selectedRows
            }
        },
        [Events.CHOICE_CUSTOM_ITEM](state:any, action:Action){
            // 设置选中的服务对象条目
            const {selectedCustomKeys, selectedCustomRows} = action;
            return {
                ...state,
                selectedCustomKeys,
                selectedCustomRows
            }
        },
        [Events.SWITCH_EDIT_FORM](state:any, action:Action){
            // 切换编辑任务表单的显示状态
            const {showEditModel} = action;
            return {
                ...state,
                showEditModel
            }
        },
        [Events.SET_TASK_ID](state:any, action:Action){
            // 切换编辑任务表单的显示状态
            const {taskId} = action;
            return {
                ...state,
                taskId
            }
        },
        [Events.SWITCH_CUSTOMER_FORM](state:any, action:Action){
            // 切换服务对象弹框的显示状态
            return {
                ...state,
                showCustomModel: action.showCustomModel
            }
        },
        [Events.DELETE_SELECTED_TASK](state:any, action:Action){
            // 删除选中的任务条目
            return {
                ...state
            }
        },
        [Events.SET_SELECTED_TASK_ITEM](state:any, action:Action){
            // 设置选中的任务条目
            return {
                ...state
            }
        },
        [Events.EDIT_TASK](state:any, action:Action){
            const {list} = state;
            const newList = cloneDeep(list);
            const data = action.data;
            for (let i=0; i<newList.length; i++){
                if(newList[i].mainTaskId === data.mainTaskId){
                    newList[i] = data;
                    break;
                }
            }
            // 编辑任务;
            return {
                ...state,
                list:newList
            }
        },
        [Events.ADD_TASK](state:any, action:Action){
            // 新建任务;
            return {
                ...state
            }
        },
        [Events.CHANGE_CONVINENTTAG](state:any, action:Action){
            // 切换tag标签
            return {
                ...state,
                quickSearchType: action.quickSearchType
            }
        },
        [Events.SEARCH_FROM_TASK_LIST](state:any, action:Action){
            // 更改任务列表高级搜索的数据
            return {
                ...state,
                ...(action.searchData)
            }
        },
        [Events.CHANGE_TASK_LIST_TAB](state:any,action:Action){
            // 切换任务中心的tab
            return {
                ...state,
                taskType: action.taskType
            }
        },
        [Events.CHANGE_TASK_PAGE_NO](state:any, action:Action){
            // 切换页码
            return {
                ...state,
                pageNo:action.pageNo
            }
        },
        [Events.CHANGE_TASK_PAGE_SIZE](state:any, action:Action){
            // 切换每页条数
            return {
                ...state,
                pageSize:action.pageSize
            }
        },
        [Events.SET_TOTAL_NO](state:any, action:Action){
          // 设置总条数
          return {
              ...state,
              totalSize: action.totalSize
          }
        },
        [Events.SET_GA_LIST](state:any, action:Action){
            // 设置galist
            return {
                ...state,
                GAlist:action.GAlist
            }
        },
        [Events.SET_GB_LIST](state:any, action:Action){
            // 设置gblist
            return {
                ...state,
                GBlist:action.GBlist
            }
        },
        [Events.SET_STUFF_LIST](state:any, action:Action){
            // 设置员工列表
            return {
                ...state,
                stuffList: action.stuffList
            }
        },
        [Events.SET_STUFF_LIST_ON_JOB](state:any, action:Action){
            // 设置在岗员工列表
            return {
                ...state,
                stuffListOnJob: action.stuffListOnJob
            }
        },
        [Events.SET_CUSTOMER_LIST](state:any, action:Action){
            // 设置服务对象列表
            return {
                ...state,
                customerList: action.customerList
            }
        },
        [Events.RESET_TASKCENTER_DATA](state:any, action:Action){
            // 重置所有的数据
            return {
                ...state,
                ...action.data
            }
        }
    },
    defaultState
);

let taskCenterReducer: any = {};
taskCenterReducer.taskList = reducer;
export default taskCenterReducer;
