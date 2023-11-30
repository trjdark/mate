/**
*Desc: 教学API接口
*User: Debby.Deng
*Date: 2018/12/17,
*Time: 下午12:45
*/

const PRE = `/mate-teach`;
const ASSESS_PRE = '/mate-assess';

const TeachingApi={
    //固定排课
    新增固定排课:`${PRE}/teach/schedule/addClassSchedule`,
    编辑固定排课:`${PRE}/teach/schedule/updateClassSchedule`,
    删除固定排课:`${PRE}/teach/schedule/deleteClassSchedule`,
    查询固定排课:`${PRE}/teach/schedule/listClassSchedule`,
    //临时排课
    新增临时排课:`${PRE}/lesson/add`,
    编辑临时排课:`${PRE}/lesson/edit`,
    删除临时排课:`${PRE}/lesson/remove`,
    查询临时排课:`${PRE}/lesson/day/list`,
    //签到
    签到列表:`${PRE}/signIn/list`,
    请假确认列表:`${PRE}/signIn/leave/confirm/list`,
    请假提交:`${PRE}/signIn/leave`,
    状态变更:`${PRE}/signIn/submit`,
    判断是否月结:`${PRE}/signIn/checkManualMonthly`,
    批量打印:`${PRE}/signIn/bulkPrint/list`,
    //TODO
    测试:`${PRE}/test/bulkPrint/test`,
    签到打印:`${PRE}/signIn/print/info`,
    课程详情签到列表:`${PRE}/signIn/findLessonDetailAndSignInList`,
    宝宝预约:`${PRE}/signIn/getSignInBabyList`,
    宝宝合同:`${PRE}/signIn/getSignInBabyContractInfo`,
    预约排课:`${PRE}/signIn/previewBookLesson`,
    预约等位:`${PRE}/signIn/previewWatingLesson`,

    // 选课
    选课固定课程列表查询:`${PRE}/chooseLesson/classSchedule/list`,
    备选临时课程列表查询:`${PRE}/chooseLesson/backup/lesson/list`,
    备选临时课程列表查询新: `${PRE}/batchExchangeLesson/exchange/list`,
    提交选课:`${PRE}/chooseLesson/book`,
    提交换课: `${PRE}/batchExchangeLesson/exchange/submit`,
    操作人明细: `${PRE}/batchExchangeLesson/operate/list`,
    // 试听
    查询试听选课固定课程列表:`${PRE}/preview/classSchedule/list`,
    获取试听备选课程:`${PRE}/preview/preselection/list`,
    试听申请提交:`${PRE}/preview/booking/save`,
    //通用接口
    查询中心可用教室列表:`${PRE}/teach/classroom/list`,
    查询中心课程信息列表:`${PRE}/teach/course/info/list`,
    选课筛选课程:`${PRE}/attendanceRecord/courseList`,
    查询中心INS含HI列表:`${PRE}/teach/hiIns/list`,
    GAHGA列表:`${PRE}/teach/hgaGa/list`,
    GBHGB列表:`${PRE}/teach/hgbGb/list`,
    //申请管理
    新增金宝检查: `${PRE}/gymboGuard/save`,
    查询金宝列表: `${PRE}/gymboGuard/list`,
    删除金宝检查: `${PRE}/gymboGuard/delete`,
    查询申请请假列表: `${PRE}/apply/leave/list`,
    查询申请请假详情: `${PRE}/apply/leave/detail`,
    查询申请试听列表: `${PRE}/apply/preview/list`,
    查询申请试听列表导出: `${PRE}/apply/preview/list/export`,
    查看试听审批详情: `${PRE}/apply/preview/find`,
    同意试听审批: `${PRE}/apply/preview/approvePreviewRecord`,
    拒绝试听审批: `${PRE}/apply/preview/refusePreviewRecord`,
    //选课情况
    查询选课情况列表: `${PRE}/attendanceRecord/list`,
    查询选课情况日历: `${PRE}/attendanceRecord/calendar/list`,
    删除未上课程: `${PRE}/attendanceRecord/deleteLesson`,
    查询固定排课今后选课情况: `${PRE}/teach/schedule/getLessonByClassSchedule`,
    // 教学管理
    // 测评库
    测评库列表: `${ASSESS_PRE}/visit-assess-libary/list`,
    获取项目列表: `${ASSESS_PRE}/visit-assess-libary/find/projects`,
    获取月龄学阶: `${ASSESS_PRE}/visit-assess-libary/find/course-months`,
    编辑测评库: `${ASSESS_PRE}/visit-assess-libary/edit`,
    测评库详情: `${ASSESS_PRE}/visit-assess-libary/get/info`,
    新建测评库: `${ASSESS_PRE}/visit-assess-libary/save`,
    测评库重复项: `${ASSESS_PRE}/visit-assess-report/lookRepeat`,
    编辑时测评库重复项: `${ASSESS_PRE}/visit-assess-report/editLookRepeat`,
    // 测评报告
    编辑测评报告: `${ASSESS_PRE}/visit-assess-report/edit`,
    编辑查询测评报告详情: `${ASSESS_PRE}/visit-assess-report/info/edit-query`,
    新建测评报告: `${ASSESS_PRE}/visit-assess-report/save`,
    报告雷达图: `${ASSESS_PRE}/visit-assess-report/project/ratio`,
    生成报告图详情: `${ASSESS_PRE}/visit-assess-report/info/query`,
    可选学阶: `${ASSESS_PRE}/visit-assess-report/find/baby/course-months`,
    获取测评报告列表: `${ASSESS_PRE}/visit-assess-report/babys`,
    客户中心宝宝测评列表: `${ASSESS_PRE}/visit-assess-report/baby/reports`,
    选择测评报告列表: `${ASSESS_PRE}/visit-assess-report/baby/edit/reports`,
    查看选择测评宝宝报告列表: `${ASSESS_PRE}/visit-assess-report/baby/simple/reports`,
    新建未选测评: `${ASSESS_PRE}/visit-assess-report/info/query/all`,
    发送至App: `${ASSESS_PRE}/visit-assess-report/push`,
    默认学阶: `${ASSESS_PRE}/visit-assess-report/default/course`,
    // 点评库
    点评库教案列表: `${ASSESS_PRE}/teaching-plan/query-list`,
    点评库教案详情: `${ASSESS_PRE}/teaching-plan/detail`,
    点评库教案保存: `${ASSESS_PRE}/teaching-plan/lesson-plan-save`,
    点评库主题详情: `${ASSESS_PRE}/teaching-plan/theme-detail`,
    点评库主题保存: `${ASSESS_PRE}/teaching-plan/theme-save`,
    中心主题配置详情页面: `${ASSESS_PRE}/teaching-plan/config-detail`,
    中心主题配置保存: `${ASSESS_PRE}/teaching-plan/config-save`,
    随堂表现教具: `${ASSESS_PRE}/teaching-plan/pieceContent-performance-detail`,
    能力发展教具: `${ASSESS_PRE}/teaching-plan/pieceContent-ability-detail`,
    点评库新增教具: `${ASSESS_PRE}/teaching-plan/pieceContent-save`,
    // 点评库2.0
    点评库教案列表新: `${ASSESS_PRE}/review-theme/program-list`,
    点评库教案详情新: `${ASSESS_PRE}/review-theme/program-detail`,
    中心主题配置保存新: `${ASSESS_PRE}/review-theme/config-save`,
    中心主题配置详情页面新: `${ASSESS_PRE}/review-theme/review-config-detail`,
    点评库主题详情新: `${ASSESS_PRE}/review-theme/theme-detail`,
    点评库主题保存新: `${ASSESS_PRE}/review-theme/theme-update`,

    // 随堂反馈
    随堂反馈课程表: `${ASSESS_PRE}/ins-comments/signList`,
    随堂反馈点评宝宝维度详情: `${ASSESS_PRE}/ins-comments/getCommentsList`,
    随堂反馈点评随堂表现: `${ASSESS_PRE}/ins-comments/getPerformanceDetail`,
    随堂反馈点评随堂表现教具: `${ASSESS_PRE}/ins-comments/getPerformancePieceContent`,
    随堂反馈点评能力发展: `${ASSESS_PRE}/ins-comments/getAbility`,
    添加随堂反馈点评:`${ASSESS_PRE}/ins-comments/addComments`,
    随堂反馈编辑获取图片: `${ASSESS_PRE}/ins-comments/getPhotoByCommentsId`,
    随堂反馈数据统计列表: `${ASSESS_PRE}/ins-comments/getFeedBackDataList`,
    随堂反馈数据统计列表详情: `${ASSESS_PRE}/ins-comments/getFeedbBackDataDetail`,
    随堂反馈管理列表: `${ASSESS_PRE}/ins-comments/getCommentsManageList`,
    随堂反馈管理列表详情: `${ASSESS_PRE}/ins-comments/getCommentsDetail`,
    随堂反馈管理教具: `${ASSESS_PRE}/ins-comments/getDetailPerformancePieceContent`,
    数据统计获取能力发展: `${ASSESS_PRE}/ins-comments/getAbilityFreeBackData`,
    数据统计获取随堂表现: `${ASSESS_PRE}/ins-comments/getPerformanceFreeBackData`,
    数据统计教具: `${ASSESS_PRE}/ins-comments/getFeedBackPerformancePieceContent`,
    客户360随堂反馈列表: `${ASSESS_PRE}/ins-comments/getFeedBackDataToCustomer`,
    客户360随堂反馈报告: `${ASSESS_PRE}/ins-comments/getCustomerGrowth`,
    客户360随堂反馈报告新: `${ASSESS_PRE}/class-feedback/feedback-customer-list`,
    反馈数据统计获取完整手机号: `${ASSESS_PRE}/ins-comments/getPhoneNum`,
    校验教室类型是否匹配: `${ASSESS_PRE}/ins-comments/judgeCourseAndClassroom`,
    离职在职Hi和Ins: `${ASSESS_PRE}/ins-comments/getInsList`,
    导出随堂反馈管理数据: `${ASSESS_PRE}/ins-comments/getCommentsManageList-assessExcel`,

    // 随堂反馈2.0
    校验是否可以进行随堂反馈: `${ASSESS_PRE}/class-feedback/feedback-judge`,
    随堂反馈点评宝宝维度详情新: `${ASSESS_PRE}/class-feedback/feedback-list`,
    随堂反馈点评随堂表现教具新: `${ASSESS_PRE}/class-feedback/feedback-piece-list`,
    随堂反馈点评随堂表现新: `${ASSESS_PRE}/class-feedback/feedback-behavior-list`,
    添加随堂反馈点评新: `${ASSESS_PRE}/class-feedback/saveFeedBack`,
    随堂反馈管理列表新: `${ASSESS_PRE}/class-feedback/feedback-manage-list`,
    随堂反馈管理列表详情新: `${ASSESS_PRE}/class-feedback/feedback-manage-detail`,
    导出随堂反馈管理数据新: `${ASSESS_PRE}/class-feedback/feedback-manage-list-export`,
    导出随堂反馈管理: `${ASSESS_PRE}/class-feedback/feedback-manage-list-export`,
    随堂反馈数据统计列表新: `${ASSESS_PRE}/class-feedback/feedback-data-list`,
    随堂反馈数据统计列表详情新: `${ASSESS_PRE}/class-feedback/feedback-data-detail`,

    约课等位中心列表:`${PRE}/pilot/center/list`,
    中心是否能约课等位:`${PRE}/pilot/center/types`,
    修改中心约课等位:`${PRE}/pilot/center/save`,
    等位日志列表:`${PRE}/signIn/waitingLog`,

    // 月度回顾管理
    月度回顾列表: `${ASSESS_PRE}/monthly-feedback/customer-myfk-list`,
    客户中心徽章记录:`${ASSESS_PRE}/monthly-feedback/customer-badge-list`,
    月度回顾管理列表:`${ASSESS_PRE}/monthly-feedback/myfk-manage-list`,
    月度回顾管理列表详情:`${ASSESS_PRE}/monthly-feedback/customer-myfk-detail`,


    // 升班报告
    客户中心宝宝升班报告: `${ASSESS_PRE}/promotionReport/list`,
    升班报告管理列表: `${ASSESS_PRE}/promotionReport/manage`,
    升班报告查询详情: `${ASSESS_PRE}/promotionReport/detail`,
    升班报告预览详情: `${ASSESS_PRE}/promotionReport/preview`,
    导出升班报告查询详情: `${ASSESS_PRE}/promotionReport/report/export`,
    导出升班报告预览详情: `${ASSESS_PRE}/promotionReport/preview/export`,
    升班报告同步至启蒙: `${ASSESS_PRE}/promotionReport/report/push`,
    升班报告课程选课: `${ASSESS_PRE}/promotionReport/goUpCourseList`,

    八大领域管理列表: `${ASSESS_PRE}/review-measure/query`,
    八大领域管理编辑: `${ASSESS_PRE}/review-measure/update-measure-enabled`,
    // R店主题
    R店主题资源库课程列表: `${ASSESS_PRE}/r-course-theme-resources/getRCourseList`,
    R店主题资源库课程列表无分页: `${ASSESS_PRE}/r-course-theme-resources/getRThemeResourceListNotPage`,
    R店主题资源库资源列表: `${ASSESS_PRE}/r-course-theme-resources/getRThemeResourceList`,
    R店主题资源添加: `${ASSESS_PRE}/r-course-theme-resources/addRThemeResource`,
    R店主题资源删除: `${ASSESS_PRE}/r-course-theme-resources/deleteRThemeResource`,
    R店主题资源更新排序: `${ASSESS_PRE}/r-course-theme-resources/updRThemeResourceSort`,
    R店主题资源更新: `${ASSESS_PRE}/r-course-theme-resources/updRThemeResourceTheme`,
    查询CRM资源列表: `${ASSESS_PRE}/r-course-theme-resources/getRCourseResourceList`,
    R店主题资源更新音乐: `${ASSESS_PRE}/r-course-theme-resources/updRThemeResourceMusic`,
    获取oss的key: `${ASSESS_PRE}/r-course-theme-resources/getRCourseOSSUpload/`,
    更新R店主题资源库教案: `${ASSESS_PRE}/r-course-theme-resources/updRThemeResourceTeachingPlan`,
    更新R店主题资源库随堂反馈: `${ASSESS_PRE}/r-course-theme-resources/updRThemeResourceFeedBack`,
    获R店资源库配置: `${ASSESS_PRE}/r-course-theme/getRCourseThemeList`,
    更新获R店资源库配置: `${ASSESS_PRE}/r-course-theme/saveOrUpdateRCourseTheme`,

    获取app课程列表: `${ASSESS_PRE}/appCourseShow/list`,
    更新app课程: `${ASSESS_PRE}/appCourseShow/update`

};

export {TeachingApi}
