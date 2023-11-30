/**
 * desc: 设置接口api
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/10/23
 * Time: 下午3:31
 */

const PRE = `/mate-basic`;

const SetApi = {
    ppsUrl:`${PRE}/linkToPPS`,
    西格玛商城: `${PRE}/linkToSegmaPPS`,
    登录 : `${PRE}/mate/login`,
    home登录mate : `${PRE}/home/mate/home-mate-login`,
    注销 : `${PRE}/unlogin`,
    获取中心列表 : `${PRE}/basic/center`,
    查询所有权限列表 : `${PRE}/basic/common/functions`,
    获取员工中心列表 : `${PRE}/basic/common/centerlist`,
    获取用户各个中心岗位角色信息 : `${PRE}/basic/staff/findBasicInfo`,
    重置密码: `${PRE}/update/password`,
    员工列表: `${PRE}/basic/staff/staffName/list`,  // 查询所有在岗员工 + 离职半年的员工
    在岗员工列表: `${PRE}/basic/staff/onJob/staffName/list`,  // 查询所有在岗员工
    合同审批权限列表: `${PRE}/basic/common/getApprovalPermission`,
    获取code: `${PRE}/generateSsoCode`,
    发送验证码: `${PRE}/send/verifyCode`,
    更新密码发送验证码: `${PRE}/send/verifyCodeByUserName`,

    获取所有中心列表 : `${PRE}/basic/common/findAllCenter`,
    查询所有角色列表 : `${PRE}/basic/role`,
    添加角色 : `${PRE}/basic/role/add`,
    获取角色 : `${PRE}/basic/role/get`,
    修改角色 : `${PRE}/basic/role/update`,

    获取默认角色列表 : `${PRE}/basic/defaultrole`,
    添加默认角色 : `${PRE}/basic/defaultrole/add`,
    获取默认角色 : `${PRE}/basic/defaultrole/get`,
    修改默认角色 : `${PRE}/basic/defaultrole/update`,

    查询所有自定义角色列表: `${PRE}/basic/customer/role`,
    修改自定义角色: `${PRE}/basic/customer/role/update`,
    添加自定义角色: `${PRE}/basic/customer/role/add`,

    获取节假日列表 : `${PRE}/basic/holiday/list`,
    添加节假日 : `${PRE}/basic/holiday/add`,
    获取节假日 : `${PRE}/basic/holiday/get`,
    更新节假日 : `${PRE}/basic/holiday/edit`,
    检查节假日 : `${PRE}/basic/holiday/check`,

    获取中心基本配置 : `${PRE}/basic/common/codeInfoList`,
    添加中心 : `${PRE}/basic/center/add`,
    获取中心 : `${PRE}/basic/center/get`,
    更新中心 : `${PRE}/basic/center/update`,
    获取中心配置信息 : `${PRE}/basic/center/config/get`,
    更新中心配置信息 : `${PRE}/basic/center/config`,

    获取员工列表 : `${PRE}/basic/staff`,
    获取中心员工岗位列表 : `${PRE}/basic/common/postlist`,
    获取中心角色列表 : `${PRE}/basic/common/rolelist`,
    获取员工岗位信息 : `${PRE}/basic/staff/findpost`,
    获取员工角色信息 : `${PRE}/basic/staff/findrole`,
    获取员工信息 : `${PRE}/basic/staff/get`,
    新增员工信息 : `${PRE}/basic/staff/add`,
    修改员工信息 : `${PRE}/basic/staff/update`,
    非总部修改员工信息: `${PRE}/basic/staff/nhq/update`,
    获取中心在岗员工列表: `${PRE}/basic/staff/findStaffsInCenter`,

    获取中心课程包列表 : `${PRE}/basic/package/list`,
    获取中心课程包 : `${PRE}/basic/package/get`,
    获取中心课程包定价历史列表 : `${PRE}/basic/package/price/list`,
    获取中心课程包促销历史列表 : `${PRE}/basic/package/promotion/list`,
    更新中心课程包促销信息 : `${PRE}/basic/package/promotion/edit`,
    更新中心课程包定价信息 : `${PRE}/basic/package/price/edit`,
    创建中心课程包定价 : `${PRE}/basic/package/price/add`,
    创建中心课程包促销 : `${PRE}/basic/package/promotion/add`,
    根据课程包类型获取中心课程包列表: `${PRE}/basic/package/getByPackageType`,

    获取总部课程包列表 : `${PRE}/basic/hqPackage/list`,
    获取总部课程包信息 : `${PRE}/basic/hqPackage/get`,
    新建总部课程包 : `${PRE}/basic/hqPackage/add`,
    更新总部课程包 : `${PRE}/basic/hqPackage/edit`,
    查询总部课程包适用中心 : `${PRE}/basic/hqPackage/center/list`,

    获取教室信息:`${PRE}/basic/classroom/get`,
    获取教室列表:`${PRE}/basic/classroom/list`,
    获取中心可用教室: `${PRE}/basic/classroom/findByCenterId`,
    创建教室:`${PRE}/basic/classroom/add`,
    更新教室:`${PRE}/basic/classroom/edit`,

    获取产品列表:`${PRE}/basic/product/list`,
    获取总产品列表: `${PRE}/basic/product/all`,
    获取产品信息:`${PRE}/basic/product/get`,
    添加产品:`${PRE}/basic/product/add`,
    更新产品:`${PRE}/basic/product/edit`,

    获取课程资料信息:`${PRE}/basic/course/get`,
    获取课程资料列表:`${PRE}/basic/course/list`,
    课程资料分类:`${PRE}/basic/courseType/findEnableCourseType`,

    获取升班课程:`${PRE}/basic/course/getNextList`,
    新增课程资料:`${PRE}/basic/course/add`,
    修改课程资料:`${PRE}/basic/course/edit` ,
    封存解压课程资料:`${PRE}/basic/course/editIsStorage`,

    获取课程分类信息 : `${PRE}/basic/courseType/get`,
    获取课程分类列表:`${PRE}/basic/courseType/list`,
    新增课程分类:`${PRE}/basic/courseType/add`,
    更新课程分类:`${PRE}/basic/courseType/edit`,
    获取课程分类:`${PRE}/basic/courseType/find`,

    获取promotor列表:`${PRE}/basic/promotor/list`,
    添加promotor:`${PRE}/basic/promotor/add`,
    获取promotor信息:`${PRE}/basic/promotor/get`,
    更新promotor信息:`${PRE}/basic/promotor/edit`,

    根据类型获取字典数据 : `${PRE}/basic/common/getCodeInfoByType`,
    文件上传 : `${PRE}/basic/file/upload`,
    文件下载 : `${PRE}/basic/file/template/download`,
    多类型文件下载:`${PRE}/basic/file/download`,

    // 省、市、区域根据上一级查找下一级
    根据上一级地区查找下一级地区列表:`${PRE}/basic/common/getCodeInfoByParentCode`,
    校验教室是否可用:`${PRE}/basic/classroom/checkClassroomUsable`,

    /*中心业绩设置*/
    新增中心业绩: `${PRE}/basic/center/performance/add`,
    编辑中心业绩: `${PRE}/basic/center/performance/edit`,
    获取中心业绩列表: `${PRE}/basic/center/performance/list`,
    获取中心业绩详情: `${PRE}/basic/center/performance/detail`,

    // 查询当前登录用户有权限的城市
    查询城市列表: `${PRE}/postmap/cities`,
    查询中心列表: `${PRE}/postmap/centers`,

    // RRP列表
    获取课程资料等级下拉列表: `${PRE}/basic/course/getLevelList`,
    获取教具代数下拉列表: `${PRE}/common/getCodeInfoByType`,
    获取RRP模板列表: `${PRE}/rrpMain/list`,
    新增RRP模板: `${PRE}/rrpMain/addRrpMain`,
    编辑RRP模板: `${PRE}/rrpMain/editRrpMain`,
    获取配置模板列表: `${PRE}/rrpMain/getRrpMain`,
    新建或编辑获取配置模板列表: `${PRE}/rrpMain/findLevelAndRrpList`,
    获取RRP配置: `${PRE}/rrpMain/getRrpConfig`,
    保存RRP配置: `${PRE}/rrpMain/saveRrpConfig`,
    推送RRP: `${PRE}/rrpMain/setEnable`,
    获取预览: `${PRE}/rrpMain/preview`,
    获取月份: `${PRE}/rrpMain/getDate`,
    查询这个模板是否能编辑: `${PRE}/rrpMain/checkRrpMainIsEnable`,
    // net in leads 3大主管的手机号
    获取本中心Leads同通知手机号: `${PRE}/basic/netInConfig`,
    保存本中心Leads通知手机号: `${PRE}/basic/netInConfig/edit`,
    // 查询中心所有员工信息-执行人
    查询中心所有员工信息: `${PRE}/basic/staff/findPostStaffByRole`,
    // tmk
    获取Tmk中心列表: `${PRE}/basic/tmkCenter/findTmkList`,
    获取GI列表: `${PRE}/basic/tmkCenter/findGiInfo`,
    获取HTMK人员列表: `${PRE}/basic/tmkCenter/findHtmkStaff`,
    获取TMK人员列表: `${PRE}/basic/tmkCenter/findTmkStaff`,
    添加Tmk中心: `${PRE}/basic/tmkCenter/addTmkCenter`,
    更新Tmk中心: `${PRE}/basic/tmkCenter/updateTmkCenter`,
    根据Tmk查找中心列表: `${PRE}/basic/tmkCenter/findCenterListInTmkCenter`,
    根据Tmk查找人员列表: `${PRE}/basic/tmkCenter/findAllTmkListInTmkCenter`,
    根据中心ID查找tmk人员列表:`${PRE}/basic/tmkCenter/findAllTmk`,
    获取Tmk中心信息:`${PRE}/basic/tmkCenter/getTmkCenterInfo`,
    删除Tmk中心: `${PRE}/basic/tmkCenter/deleteTmkCenter`,
    是否包含TMK中心:`${PRE}/basic/tmkCenter/isTmkCenter`,
    获取总部pop员工列表: `${PRE}/basic/staff/hq/pop/list`,
    //财务管理配置信息
    获取财务管理配置信息:`${PRE}/basic/financial/get`,
    编辑财务管理配置信息:`${PRE}/basic/financial/edit`,

    // 审批管理
    审批列表: `${PRE}/basic/staff/getApplyList`,
    审批列表详情: `${PRE}/basic/staff/getApplyStaffDetail`,
    员工申请解锁: `${PRE}/basic/staff/applyUnlock`,
    账号变更明细: `${PRE}/basic/staff/getApplyStaffDetailByType`,
    审批操作: `${PRE}/basic/staff/approve`,
    员工管理解锁详细信息: `${PRE}/basic/staff/getStaffInfoById`,
    // 业绩指标
    预定量列表: `${PRE}/basic/center/predetermine/list`,
    预定量详情: `${PRE}/basic/center/predetermine/detail`,
    预定量新增接口: `${PRE}/basic/center/predetermine/add`,
    预定量编辑接口: `${PRE}/basic/center/predetermine/edit`,
    // 试点中心
    获取试点中心列表: `${PRE}/basic/pilot/list`,
    根据默认角色ID查询角色对应的可添加试点中心权限: `${PRE}/basic/pilot/findUnusedLeafFunctions`,
    添加试点中心: `${PRE}/basic/pilot/add`,
    删除试点中心: `${PRE}/basic/pilot/delete`,
    // 合同用印
    获取用印流程列表: `${PRE}/basic/centerSealManage/queryCenterSealList`,
    获取用印流程详情: `${PRE}/basic/centerSealManage/detailCenterSeal`,
    添加用印流程: `${PRE}/basic/centerSealManage/addCenterSealManage`,
    编辑用印流程: `${PRE}/basic/centerSealManage/editCenterSealManage`,

    // 绑定账号
    绑定账号: `${PRE}/home/bing/mate/bindingAccount`,
    获取绑定信息: `${PRE}/home/bing/mate/getGidAndMobile`,

    // 审批客户中心导出申请
    获取审批客户中心导出: `${PRE}/basic/export/apply/list`,
    获取客户中心导出申请详情: `${PRE}/basic/export/apply/detail`,
    审批客户中心导出申请: `${PRE}/basic/export/apply/update`,
    获取申请客户中心导出: `${PRE}/basic/export/application/list`,

    //业务来源配置
    业务来源配置列表: `${PRE}/businessSourceConfig/list`,
    中心业务来源: `${PRE}/businessSourceConfig/listByCenter`,

    导入合同leads: `${PRE}/contract-import-record/importContractInfo`

};

export {SetApi}
