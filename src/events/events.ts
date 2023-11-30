/**
 * desc: 触发reducer事件
 * Date: 2018/8/7
 * Time: 下午7:14
 */
enum Events {
    GET_IDENTIFY_LIST = 1,
    GET_STAFF_CENTER_LIST,
    GET_ROLE_LIST,
    GET_ALL_PERMISSION_LIST,
    GET_ALL_CENTER_LIST,
    GET_APPROVAL_PERMISSION,          // 中心审批权限
    DEFAULT_ADD_PERMISSION,
    GET_ROLE,
    GET_DEFAULT_ROLE_LIST,
    GET_DEFAULT_ROLE,
    GET_HOLIDAY_LIST,
    GET_HOLIDAY,
    // CHECK_HOLIDAY,
    GET_CENTER_LIST,
    GET_USER_POST_ROLE_INFO,
    GET_BUSINESS_SOURCE_LIST,           // 业务来源列表

    GET_HQ_PACKAGE_LIST,                   // 总部课程包列表
    GET_HQ_PACKAGE_INFO,
    // ADD_HQ_PACKAGE,
    // UPDATE_HQ_PACKAGE,
    GET_HQ_PACKAGE_CENTER,
    DELETE_HQ_PACKAGE_CENTER,
    ADD_HQ_PACKAGE_CENTER,

    GET_CENTER_BASE_CONFIG,
    GET_CENTER_CONFIG,
    GET_CENTER_STAFFS,
    GET_CENTER,

    GET_EMPLOYEE_LIST,
    GET_EMPLOYEE_POST_LIST,
    GET_EMPLOYEE_ROLE_LIST,
    GET_EMPLOYEE_INFO,
    GET_EMPLOYEE_POST_INFO,
    GET_EMPLOYEE_ROLE_INFO,
    // ADD_EMPLOYEE,
    // EDIT_EMPLOYEE,

    GET_CENTER_COURSE_PACKAGE_LIST,
    GET_CENTER_COURSE_PACKAGE,
    GET_CENTER_COURSE_PACKAGE_PRICE_HISTORY_LIST,
    GET_CENTER_COURSE_PACKAGE_PROMOTION_HISTORY_LIST,
    UPDATE_CENTER_COURSE_PACKAGE_PROMOTION_SUCCESS,
    UPDATE_CENTER_COURSE_PACKAGE_PRICE_SUCCESS,

    GET_ROOM_INFO,
    GET_ROOM_LIST,
    ADD_ROOM,
    UPDATE_ROOM,

    GET_PRODUCT_INFO,
    GET_PRODUCT_LIST,
    ADD_PRODUCT,
    UPDATE_PRODUCT,

    // 登录信息，会包各种含登录错误信息
    GET_TOKEN_INFO,

    GET_COURSE_CATEGORY_INFO,
    GET_COURSE_CATEGORY_LIST,
    ADD_COURSE_CATEGORY,
    UPDATE_COURSE_CATEGORY,

    GET_PROMOTOR_LIST,
    ADD_PROMOTOR,
    GET_PROMOTOR_INFO,
    UPDATE_PROMOTOR_INFO,

    GET_LESSON_MATERIAL_INFO,
    GET_LESSON_MATERIAL_LIST,
    LESSON_MATERIAL_TYPE,
    UPGRADE_LESSON_LIST,
    CREATE_LESSON_MATERIAL,
    EDIT_LESSON_MATERIAL,
    CLOSE_OPEN_LESSON_MATERIAL,

    /*
    * 客户中心
    * */
    GET_ADVANCED_BUTTON_LIST, // 高级查询按钮组
    GET_ADVANCED_BUTTON_ID, // 高级查询按钮id
    GET_ASSIGN_STATUS, // 不同状态数量
    GET_ASSIGN_TABLE_LIST, // 查询出客户list
    CLEAR_ASSIGN_TABLE_LIST, // 清空查询出客户list

    GET_ASSIGN_RECORD_LIST, // 查询分配记录list
    GET_CLIENT_360_BASIC_INFO, // 客户360首页信息
    GET_CLIENT_360_BABY_INFO, // 客户360宝宝信息
    GET_CODE_INFO_BY_TYPE,// 查询家庭关系字典
    GET_EDIT_PERMISSION,//360基本信息的编辑权限

    GET_ASSIGN_PACKAGE_LIST, // 高级查询课程包
    GET_ASSIGN_DISTRICT, // 高级查询区域列表
    GET_ASSIGN_GA_LIST, // 分配leads,ga list
    GET_ASSIGN_GA_LEADS_LIST, // 分配leads,ga leads list
    GET_ASSIGN_GB_LIST, // 分配leads,gb list
    GET_ASSIGN_GB_LEADS_LIST, // 分配leads,gb leads list
    GET_ASSIGN_CENTER_LIST, // 分配至中心
    GET_ASSIGN_INS_LIST, // 高级查询ins
    GET_HEADER_QUERY_STRING,//获取表头查询字段,
    CLEAR_HEADER_QUERY_STRING,//清除表头查询字段,
    GET_HEADER_QUERY_LIST,//头部大搜索框搜索的结果
    GET_TOTAL_STAFF_LIST, // 中心员工列表

    // 任务中心
    GET_TASK_LIST, // 根据标签快速查询任务列表
    CHOICE_LIST_ITEM,   // 选择或者反选任务列表的条目
    CHOICE_CUSTOM_ITEM, // 选择或者反选服务对象
    SWITCH_EDIT_FORM,   // 切换编辑任务弹框的显示和隐藏
    SWITCH_CUSTOMER_FORM,   // 切换服务对象弹框的显示和隐藏
    DELETE_SELECTED_TASK,   // 删除已选中的任务
    SET_SELECTED_TASK_ITEM, // 设置选中的条目的状态
    GET_CUSTOMER_LIST,  // 获取服务对象列表
    EDIT_TASK,  // 编辑任务
    ADD_TASK,   // 新建任务
    CHANGE_CONVINENTTAG,    // 切换快速查询标签
    SEARCH_FROM_TASK_LIST,  // 更改任务列表高级搜索数据
    CHANGE_TASK_LIST_TAB,   // 切换任务中心的标签页
    CHANGE_TASK_PAGE_NO,    // 切换标签页码
    CHANGE_TASK_PAGE_SIZE,  // 更改pageSize
    SET_GA_LIST,    // 获取GA列表
    SET_GB_LIST,    // 获取GB列表
    SET_TOTAL_NO,   // 设置总页数
    SET_STUFF_LIST, // 员工列表
    SET_STUFF_LIST_ON_JOB,      // 在岗员工列表
    SET_CUSTOMER_LIST,  // 设置服务对象列表
    SET_TASK_ID,        // 设置taskId
    RESET_TASKCENTER_DATA,  // 设置任务中心所有数据

    // 合同中心
    GET_CONTRACT_LIST,      // 获取合同列表
    GET_CONTRACT_PAYANDRECEIVE_LIST,      // 获取收付款原由
    GET_CONTRACT_BASIC_CONFIG,        // 合同相关基础配置
    // GET_CONTRACT_PAYANDRECEIVE_REASON,      // 获取收付款原由
    // GET_CONTRACT_PAYANDRECEIVE_List,      // 获取收付款原由

    // 市场
    GET_MARKET_LIST,            // 市场渠道列表
    SET_ESTIMATEDFIELDCOST,     // 设置规划场地费用
    SET_ESTIMATEDMATERIALCOST,  // 设置规划物料费用
    SET_ESTIMATEDPERSONNELCOST, // 设置规划人员费用
    SET_ESTIMATEDDAYS,          // 设置规划天数
    SET_REALFIELDCOST,          // 设置实际场地费用
    SET_REALMATERIALCOST,       // 设置实际物料费用
    SET_REALPERSONCOST,         // 设置实际人员费用
    SET_REALDAYS,               // 设置实际活动天数
    SET_ESTIMATEDLEADS,         // 设置规划收取leads数量
    SET_MEMBERTRANSFERRATE,     // 设置leads转化率
    SET_ESTIMATEDMEMBER,        // 设置总共收取会员数量
    SET_AVERAGEPACKAGEAMOUNT,   // 设置规划平均每课包金额
    SET_ATTACHMENT,             // 设置上传附件信息
    SET_MARKET_INFO,            // 设置市场渠道的详细信息
    DELETE_MARKET_INFO,         // 删除市场渠道
    SET_CHANNELTYPE_LIST,       // 设置市场渠道来源列表
    RESET_MARKET_DATA,          // 重置所有market数据
    GET_MARKET_PERMISSION,      // 市场渠道审批权限
    SET_REALACTIVITYTOTALCOST,  // 设置真实的活动总费用

    //教学
    GET_TEACHING_INS_HI,
    GET_TEACHING_COURSE_LIST,
    GET_TEACHING_ROOM_LIST,
    GET_TEACHING_GA_LIST,
    GET_TEACHING_GB_LIST,
    TEACHING_SCHEDULE_LAST_ROUTE,
    CLEAR_TEACHING_INIT_DATA,

    // 选课
    SELECTION_TO_RESERVATION,

    // 教学活动
    SET_ACTIVITY_TYPE_DEF,      // 设置活动类型定义
    SET_FREEGIFTLIST,           // 设置规划的赠品
    SET_FIELDTYPE,              // 设置地点类型
    SET_CLASSROOMLIST,          // 设置活动教室列表
    SET_ESTIMATEDPARTICIPANTNUM,// 设置宝宝数
    SET_APPLICATIONFEE,         // 设置付费金额
    SET_APPLICATIONCONSUMPTION, // 设置扣课数
    GET_ACTIVITY_LIST,          // 活动列表
    SET_ALL_ACTIVITY_DATA,      // 查看详情/查看审批时设置所有数据
    RESET_ACTIVITY_DATA,        // 重置所有活动数据
    SET_SELECTED_BABY_ID,       // 签到时选中的babyId
    SET_SELECTED_BABY,          // 报名时选中的baby
    SET_SELECTED_COURSE,        // 报名时选中的课程包
    SET_SIGN_LIST,              // 设置已报名列表数据
    SET_DURATION,               // 设置活动时长
    SET_STARTTIME,              // 设置活动时间
    SET_CLASSROOMID,            // 设置教室id
    SET_ACTUALACTIVITYCOST,     // 设置实际的活动费用
    SET_ACTUALPARTICIPANTNUM,   // 设置实际的宝宝数
    SET_ACTUALFREEGIFTLIST,     // 设置实际的赠品列表
    SET_PAYMODE,                // 设置付费方式
    SET_BABYS,                  // 编辑参与会员时设置baby列表
    SET_STAFFS,                 // 设置员工列表
    SET_STAFFLISTONWORK,        // 设置中心所有在职员工
    UPDATE_CHECK_IN_TIME,       // 修改签到时间
    // 360会员教学活动
    SET_VIP_ACTIVITY_LIST,      // 360会员教学活动列表
    SELECT_BABY,                // 360会员教学活动选择宝宝
    SELECT_ACTIVITY,            // 360会员教学活动选择活动
    RESET_CHECKIN_DATA,         // 重置报名流程数据
    SET_CLASSROOM_USABLE,       // 设置教室的可用性
    // 云语音
    GET_GI_LIST_INFO,           // 获取GI列表
    INCLUDE_TMK_CENTER,         // 是否包含云语音

    GET_EARLY_WARNING_ALERT,    // 预警提示
    INCLUDE_PAYMENT_CENTER,     // 是否包含移动支付中心
    INCLUDE_SIGMA_CENTER,     // 是否有西格玛权限

    GET_GID_LIST,               // 技能组列表
    GET_NO_NOTICE,              // 未读消息
    USERNAME,                   // 用户账号
    BASIC_CONFIG,               // 基本配置

    ALERT_FLAG,                 // 绑定信息框开关

    CRM_VIDEO_LIST,
    CRM_AUDIO_LIST,
    CRM_IMAGE_LIST,
}

export {Events}
