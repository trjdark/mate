/**
 * desc: 业务层Action，涉及到流程管控
 * Date: 2018/8/1
 * Time: 下午2:08
 */

enum ServiceActionEnum {
    登录 = 'LOGIN',
    通用模块初始化 = 'INIT',
    获取所有权限列表 = 'QUERY_ALL_PERMISSION_LIST',
    记录用户名 = 'REPORT_USERNAME',
    中心相关审批权限列表 = 'GET_APPROVAL_PERMISSION',

    获取员工中心列表 = 'HOME_STAFF_CENTER_LIST',
    清空预警信息= 'CLEAR_EARLY_WARNING_ALERT',


    获取所有中心列表 = 'QUERY_ALL_CENTER_LIST',
    获取中心基本配置 = 'QUERY_DEFAULT_CENTER_CONFIG',
    添加中心 = 'ADD_CENTER',
    更新中心配置信息 = "UPDATE_CENTER_CONFIG",


    获取中心员工岗位列表 = "QUERY_EMPLOYEE_POST_LIST",
    获取中心员工角色列表 = "QUERY_EMPLOYEE_ROLE_LIST",
    修改员工信息 = 'EDIT_EMPLOYEE_INFO',
    课程资料分类 = 'LESSON_MATERIAL_TYPE',

    获取分配记录列表 = 'QUERY_ASSIGN_RECORD_LIST',

    获取客户360基本信息 = 'QUERY_CLIENT_360_BASIC_INFO',
    获取客户360宝宝信息 = "QUERY_CLIENT_360_BABT_INFORMATION",
    根据类型获取字典数据 = "QUERY_CODE_INFO_BY_TYPE",
    获取高级查询按钮组 = 'QUERY_ADVANCE_SEARCH_BUTTON',
    删除高级查询按钮 = 'DELETE_ADVANCE_SEARCH_BUTTON',
    保存高级查询按钮 = 'SAVE_ADVANCE_SEARCH_BUTTON',
    获取分配状态 = 'QUERY_ASSIGN_STATUS',
    获取分配列表 = 'QUERY_ASSIGN_LIST',
    获取高级查询中心课程包列表 = 'QUERY_ASSIGN_ADVANCE_CENTER_COURSE',
    获取高级查询区域列表 = 'QUERY_ASSIGN_ADVANCE_DISTRICT_LIST',
    获取分配GA角色列表 = 'QUERY_ASSIGN_GA_LIST',
    获取GA已领取leads列表 = 'QUERY_ASSIGN_GA_LEADS_LIST',
    获取分配GB角色列表 = 'QUERY_ASSIGN_GB_LIST',
    获取GB已领取leads列表 = 'QUERY_ASSIGN_GB_LEADS_LIST',
    获取分配所有中心列表 = 'QUERY_ASSIGN_CENTER_LIST',
    获取高级查询INS列表 = 'QUERY_ASSIGN_INS_LIST',
    基本信息是否可编辑='QUERY_EDIT_PERMISSION',

    //大搜索框
    获取innerSearch列表 = 'QUERY_INNER_SEARCH_LIST',

    查询任务列表 = 'QUERY_TASK_LIST',
    删除选中的任务 = 'DELETE_SELECTED_TASK',
    设置选中任务的状态 = 'SET_SELECTED_TASK_ITEM',
    获取服务对象列表 = 'GET_CUSTOMER_LIST',
    编辑任务 = 'EDIT_TASK',
    新建任务 = 'ADD_TASK',

    // 合同
    获取收付款列表 = 'GET_CONTRACT_PAYANDRECEIVE_LIST',
    合同模块初始化 = 'CONTRACT_INIT',

    获取GA列表 = 'GET_GA_LIST',
    获取GB列表 = 'GET_GB_LIST',
    获取中心员工列表 = 'GET_STUFF_LIST',
    // 获取中心员工列表测试 = 'GET_STUFF_LIST_TEST123',
    获取中心在岗员工列表 = 'GET_STUFF_LIST_ON_JOB',

    // 市场渠道
    获取市场列表 = 'QUERY_MARKET_LIST',
    新建市场渠道 = 'CREATE_MARKET',
    更新市场渠道 = 'UPDATE_MARKET',
    获取市场渠道历史数据 = 'GET_HISTORY_DATA',
    查看市场渠道活动信息 = 'QUERY_MARKET_INFO',
    审批市场渠道活动 = 'APPROVE_MARKET',
    拒绝市场渠道活动 = 'REFUSE_MARKET',
    删除市场渠道活动 = 'DELETE_MARKET_INFO',
    获取市场市场渠道来源 = 'GET_CHANNEL_TYPE',

    //教学
    教学获取GAGB列表 = 'TEACHING_GA_GB_INIT',
    教学课程表初始化 = 'TEACHING_SCHEDULE_INIT',
    // 选课筛选课程 = 'QUERY_COURSE_LIST',
    查询中心可用教室列表 = 'QUERY_TEACHING_ROOM_LIST',

    // 选课
    提交选课到预定选课 = 'SUBMIT_SELECTION_TO_RESERVATION',

    //  教学活动
    获取教学活动类型数据 = 'GET_ACTIVITY_TYPE_DEF',
    新建教学活动 = 'CREATE_ACTIVITY',
    编辑教学活动 = 'EDIT_ACTIVITY',
    获取活动教室列表 = 'GET_CLASSROOM',
    获取教学活动列表 = 'GET_ACTIVITY_LIST',
    获取教学活动详情 = 'GET_ACTIVITY_DETAIL',
    获取活动签到列表 = 'GET_SIGN_LIST',
    检查教室可用性 = 'CHECK_CLASSROOM',
    获取所有在岗员工 = 'GET_STAFFLIST_ONWORK',

    // 360会员教学活动
    获取360会员教学活动列表 = 'SET_VIP_ACTIVITY_LIST',

    // 上个签到
    修改签到时间 = 'CHANGE_CHECK_IN_TIME',
    // 获取GI员工列表
    获取GI员工列表 = 'GET_GI_LIST',
    获取技能组列表 = 'GET_GID_LIST',

    读取消息 = 'READ_NOTICE',
    接受消息 = 'ACCEPT_NOTICE',
    基本配置 = 'BASIC_CONFIG',
    // 关闭提示框
    关闭绑定信息提示框 = 'CLOSE_ALERT',
    // 获取CRM资源
    获取CRM静态资源 = 'GET_SOURCE_FROM_CRM',
}

export {ServiceActionEnum};
