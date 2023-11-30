/**
 * desc: 事件汇总
 * User:
 * Date: 2018/7/30
 * Time: 下午3:38
 */

import {takeLatest} from 'redux-saga/effects';
import {ServiceActionEnum} from "@redux-actions/serviceActionsEnum";


import {
    getStaffCenterList,
    getCodeInfoList, commonInit,
    emptyEarlyWarningAlert, readNoNotice,
    acceptNoNotice, getApprovalPermission,
    getBasicConfig, closeAlertBingMsg
} from "./actions/home";

import {
    getLessonMatType,
} from "./actions/setting/lessonMaterial";

import {
    updateCenterConfig
} from "./actions/setting/center";

import {
    getEmployeePostList, getCommonCenterList,
} from './actions/setting/employee';
import {
    getClient360BasicInfo,
    getClient360BaByInfo,
    getCodeInfoByTypeRedux, queryEditPermmision
} from './actions/customer/client360';
import {
    deleteAdvanceButton,
    getAdvanceButtons,
    getAssignCenterCourse, getAssignCenterList, getAssignCustomerList, getAssignGaList,
    getAssignGbList, getAssignINSList,
    getDistrictList, getNavNum, saveAdvanceButton
} from "./actions/customer/assign";
import {
    getAssignRecordList
} from './actions/customer/assignRecord';
import {
    getTaskList,
    deleteSelectedTask,
    setSelectedTaskItem,
    editTask,
    addTask,
    getGAlist,
    getGBlist,
    getStuffList,
    getCustomerList,
    getStuffListOnJob,
} from './actions/customer/taskCenter';

import {
    getPayAndReceiveManagement, contractInit
} from './actions/contract';

import {
    getMarketData,
    getdeleteMarketPost
} from './actions/market/marketList';
import {
    createMarketInfo,
    getHistoryData,
    getMarketInfo,
    approveMarket,
    refuseMarket,
    updateMarketInfo,
    getChannelType
} from './actions/market/marketDetail';
import {
    getActivityTypeDef,
    createActivity,
    getClassroomList,
    getActivityDetail,
    getSignList,
    editActivity,
    checkClassRoom,
    getStaffListOnWork,
} from './actions/activity/activityDetail';
import {getactivityData, getActivityList} from './actions/activity/activityDataList';
import {initSchedule, teachingGaGbList, updateCheckInTime} from "./actions/teaching/schedule";
import {submitSelectionToReservation} from './actions/teaching/choose';
import {innerSearch} from "@/saga/actions/customer/innerQuery";
import {queryGIList} from "@/saga/actions/setting/tmk";
import {queryGidList} from "@/saga/actions/telephone/callRecord";
import {saveUserName} from "@/saga/actions/home";
import {getSourceInit} from "@redux-actions/teaching/rCourse";

export default function* runSaga() {
    yield [
        // 通用接口
        takeLatest(ServiceActionEnum.通用模块初始化, commonInit),
        takeLatest(ServiceActionEnum.基本配置, getBasicConfig),
        takeLatest(ServiceActionEnum.记录用户名, saveUserName),
        takeLatest(ServiceActionEnum.获取所有中心列表, getCommonCenterList),
        takeLatest(ServiceActionEnum.获取员工中心列表, getStaffCenterList),
        takeLatest(ServiceActionEnum.清空预警信息, emptyEarlyWarningAlert),
        takeLatest(ServiceActionEnum.获取中心基本配置, getCodeInfoList),
        takeLatest(ServiceActionEnum.更新中心配置信息, updateCenterConfig),
        takeLatest(ServiceActionEnum.获取中心员工岗位列表, getEmployeePostList),
        takeLatest(ServiceActionEnum.课程资料分类, getLessonMatType),
        takeLatest(ServiceActionEnum.中心相关审批权限列表, getApprovalPermission),

        // TODO 客户中心
        takeLatest(ServiceActionEnum.获取客户360基本信息, getClient360BasicInfo),
        takeLatest(ServiceActionEnum.获取客户360宝宝信息, getClient360BaByInfo),
        takeLatest(ServiceActionEnum.根据类型获取字典数据, getCodeInfoByTypeRedux),
        takeLatest(ServiceActionEnum.基本信息是否可编辑, queryEditPermmision),
        takeLatest(ServiceActionEnum.获取高级查询按钮组, getAdvanceButtons),
        takeLatest(ServiceActionEnum.获取分配列表, getAssignCustomerList),
        takeLatest(ServiceActionEnum.保存高级查询按钮, saveAdvanceButton),
        takeLatest(ServiceActionEnum.删除高级查询按钮, deleteAdvanceButton),
        takeLatest(ServiceActionEnum.获取分配状态, getNavNum),
        takeLatest(ServiceActionEnum.获取高级查询中心课程包列表, getAssignCenterCourse),
        takeLatest(ServiceActionEnum.获取高级查询区域列表, getDistrictList),
        takeLatest(ServiceActionEnum.获取高级查询INS列表, getAssignINSList),
        takeLatest(ServiceActionEnum.获取分配GA角色列表, getAssignGaList),
        takeLatest(ServiceActionEnum.获取分配GB角色列表, getAssignGbList),

        //大搜索框
        takeLatest(ServiceActionEnum.获取innerSearch列表, innerSearch),


        takeLatest(ServiceActionEnum.获取分配所有中心列表, getAssignCenterList),
        takeLatest(ServiceActionEnum.获取分配记录列表, getAssignRecordList),
        takeLatest(ServiceActionEnum.查询任务列表, getTaskList),
        takeLatest(ServiceActionEnum.删除选中的任务, deleteSelectedTask),
        takeLatest(ServiceActionEnum.设置选中任务的状态, setSelectedTaskItem),
        takeLatest(ServiceActionEnum.编辑任务, editTask),
        takeLatest(ServiceActionEnum.新建任务, addTask),

        // 合同管理
        takeLatest(ServiceActionEnum.获取收付款列表, getPayAndReceiveManagement),
        takeLatest(ServiceActionEnum.合同模块初始化, contractInit),

        // 任务中心
        takeLatest(ServiceActionEnum.获取GA列表, getGAlist),
        takeLatest(ServiceActionEnum.获取GB列表, getGBlist),
        takeLatest(ServiceActionEnum.获取中心员工列表, getStuffList),
        takeLatest(ServiceActionEnum.获取中心在岗员工列表, getStuffListOnJob),
        takeLatest(ServiceActionEnum.获取服务对象列表, getCustomerList),

        // 市场渠道
        takeLatest(ServiceActionEnum.获取市场列表, getMarketData),
        takeLatest(ServiceActionEnum.新建市场渠道, createMarketInfo),
        takeLatest(ServiceActionEnum.获取市场渠道历史数据, getHistoryData),
        takeLatest(ServiceActionEnum.删除市场渠道活动, getdeleteMarketPost),
        takeLatest(ServiceActionEnum.查看市场渠道活动信息, getMarketInfo),
        takeLatest(ServiceActionEnum.审批市场渠道活动, approveMarket),
        takeLatest(ServiceActionEnum.拒绝市场渠道活动, refuseMarket),
        takeLatest(ServiceActionEnum.更新市场渠道, updateMarketInfo),
        takeLatest(ServiceActionEnum.获取市场市场渠道来源, getChannelType),

        // 选课
        takeLatest(ServiceActionEnum.提交选课到预定选课, submitSelectionToReservation),

        // 教学活动
        takeLatest(ServiceActionEnum.获取教学活动类型数据, getActivityTypeDef),
        takeLatest(ServiceActionEnum.新建教学活动, createActivity),
        takeLatest(ServiceActionEnum.获取活动教室列表, getClassroomList),
        takeLatest(ServiceActionEnum.获取教学活动列表, getactivityData),
        takeLatest(ServiceActionEnum.获取教学活动详情, getActivityDetail),
        takeLatest(ServiceActionEnum.获取活动签到列表, getSignList),
        takeLatest(ServiceActionEnum.编辑教学活动, editActivity),
        takeLatest(ServiceActionEnum.获取360会员教学活动列表, getActivityList),
        takeLatest(ServiceActionEnum.教学课程表初始化, initSchedule),
        takeLatest(ServiceActionEnum.教学获取GAGB列表, teachingGaGbList),
        takeLatest(ServiceActionEnum.检查教室可用性, checkClassRoom),
        takeLatest(ServiceActionEnum.获取所有在岗员工, getStaffListOnWork),
        // 修改签到时间
        takeLatest(ServiceActionEnum.修改签到时间, updateCheckInTime),
        // 获取GI列表
        takeLatest(ServiceActionEnum.获取GI员工列表, queryGIList),
        takeLatest(ServiceActionEnum.获取技能组列表, queryGidList),
        // 阅读信息
        takeLatest(ServiceActionEnum.读取消息, readNoNotice),
        takeLatest(ServiceActionEnum.接受消息, acceptNoNotice),
        //
        takeLatest(ServiceActionEnum.关闭绑定信息提示框, closeAlertBingMsg),
        takeLatest(ServiceActionEnum.获取CRM静态资源, getSourceInit)

    ];
}
