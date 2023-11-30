/**
 * desc: 数据枚举值
 * User: katarina.yuan@gymboglobal.com
 * Date: 2021/5/12
 * Time: 上午11:53
 */

/*完成状态枚举值*/
export const finishStatusList = [
    {postCode: '65001', postName: '待完成'},
    {postCode: '62002', postName: '已到访'},
    {postCode: '62003', postName: '未到访'}
]
/*到访次数枚举值*/
export const visitCountList = [
    {postCode: '13001', postName: '首访'},
    {postCode: '13002', postName: '多访'},
]
/*统计范围枚举值*/
export const countScopeList = [
    {postCode: null, postName: '全部'},
    {postCode: '0', postName: '会员'},
    {postCode: '1', postName: '非会员'}
]
export const enumList = new Map([
                                    ['65001', '待完成'],
                                    ['62002', '已到访'],
                                    ['62003', '未到访'],
                                    ['', '全部'],
                                    ['0', '会员'],
                                    ['1', '非会员'],
                                ])
/*数据项枚举值*/
export const columns = [
    {finallyId: 1, postCode: 'babyName', postName: '宝宝姓名'},
    {finallyId: 1, postCode: 'babyMonth', postName: '宝宝月龄'},
    {finallyId: 1, postCode: 'babyGender', postName: '宝宝性别'},
    {finallyId: 1, postCode: 'contactName', postName: '联系人姓名'},
    {finallyId: 1, postCode: 'primaryContactTel', postName: '联系人电话'},
    {finallyId: 1, postCode: 'visitCount', postName: '首/多访'},
    {finallyId: 1, postCode: 'oppTime', postName: '首次到访时间'},
    {finallyId: 1, postCode: 'signTime', postName: '首次签约日期'},
    {finallyId: 1, postCode: 'createBy', postName: '本次任务发起人'},
    {finallyId: 1, postCode: 'executorName', postName: '本次任务接待人'},
    {finallyId: 1, postCode: 'createDate', postName: '本次诺访时间'},

    {finallyId: 2, postCode: 'taskTime', postName: '本次计划到访时间'},
    {finallyId: 2, postCode: 'taskStatus', postName: '本次到访完成状态'},
    {finallyId: 2, postCode: 'taskFinishTime', postName: '本次任务完成时间'},
    {finallyId: 2, postCode: 'finishBy', postName: '本次任务完成人'},
    {finallyId: 2, postCode: 'lastVisitTime', postName: '最近一次到访时间'},
    {finallyId: 2, postCode: 'assessDate', postName: '最近一次到访测评日期'},
    {finallyId: 2, postCode: 'lastPreviewDate', postName: '最近一次试听日期'},
    {finallyId: 2, postCode: 'inquireDate', postName: 'leads获取时间'},
    {finallyId: 2, postCode: 'leadsCreateDate', postName: 'leads导入时间'},
    {finallyId: 2, postCode: 'appearanceType', postName: '出现方式'},

    {finallyId: 3, postCode: 'channelType', postName: '渠道来源'},
    {finallyId: 3, postCode: 'marketTheme', postName: '市场渠道名称'},
    {finallyId: 3, postCode: 'intentionLevel', postName: 'leads意向度'},
    {finallyId: 3, postCode: 'promoter', postName: 'Promoter'},
    {finallyId: 3, postCode: 'tmk', postName: 'TMK'},
    {finallyId: 3, postCode: 'gb', postName: 'GB'},
    {finallyId: 3, postCode: 'ga', postName: 'GA'},
    {finallyId: 3, postCode: 'leadsId', postName: 'LeadsID'},
    {finallyId: 3, postCode: 'babyId', postName: '宝宝ID'},
    {finallyId: 3, postCode: 'toVisitCount', postName: '至今已到访次数'},
]
