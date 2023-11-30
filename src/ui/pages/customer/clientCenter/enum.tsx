/**
 * desc: 新客户中心字段枚举
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2022/2/24
 * Time: 下午5:01
 */
import  React from "react";
import moment from 'moment';
import {Tooltip, Icon} from 'antd';


const dateFields = (sortName = '', sortOrder = '') => {
    return [
        {
            title: '月龄',
            label: '月龄',
            dataIndex: 'monthValue',
            sorter:true,
            sortOrder: sortName === 'monthValue' && sortOrder,
            render: (text) => <span className='ml20'>{text}</span>
        },{
            title: '生日',
            label: '生日',
            dataIndex: 'birthday'
        },{
            title: '性别',
            label: '性别',
            dataIndex: 'gender'
        },{
            title: '联系人',
            label: '联系人',
            dataIndex: 'contactName'
        },{
            title: '手机号码（脱敏）',
            label: '手机号码（脱敏）',
            dataIndex: 'insensitivePhoneNumber'
        },{
            title: '区县',
            label: '区县',
            dataIndex: 'district'
        },{
            title: '小区',
            label: '小区',
            dataIndex: 'quarter'
        },{
            title: '客户编号',
            label: '客户编号',
            dataIndex: 'leadsId'
        },{
            title: 'GB',
            label: 'GB',
            dataIndex: 'gb'
        },{
            title: 'GA',
            label: 'GA',
            dataIndex: 'ga'
        },{
            title: '推荐人',
            label: '推荐人',
            dataIndex: 'referalContact'
        },{
            title: 'Promotor',
            label: 'Promotor',
            dataIndex: 'promotor'
        },{
            title: 'TMK',
            label: 'TMK',
            dataIndex: 'tmk'
        },{
            title: '上一个GB',
            label: '上一个GB',
            dataIndex: 'lastGb'
        },{
            title: '意向度',
            label: '意向度',
            dataIndex: 'intentionLevel',
        },{
            title: '出现方式',
            label: '出现方式',
            dataIndex: 'appearanceType',
            sorter:true,
            sortOrder: sortName === 'appearanceType' && sortOrder,
            render: (text) => <span className='ml20'>{text}</span>

        },{
            title: '客户阶段',
            label: '客户阶段',
            dataIndex: 'phase',
            sorter:true,
            sortOrder: sortName === 'phase' && sortOrder,
            render: (text) => <span className='ml20'>{text}</span>

        },{
            title: '渠道来源',
            label: '渠道来源',
            dataIndex: 'channelType'
        },{
            title: '渠道备注',
            label: '渠道备注',
            dataIndex: 'channelComment'
        },{
            title: '首次获取日期',
            label: '首次获取日期',
            dataIndex: 'firstInquireDate',
            render: (date) => date ? moment(date).format('YYYY-MM-DD'): ''
        },{
            title: '最后获取日期',
            label: '最后获取日期',
            dataIndex: 'lastInquireDate',
            sorter:true,
            sortOrder: sortName === 'lastInquireDate' && sortOrder,
            render: (date) => date ? <span className='ml20'>{moment(date).format('YYYY-MM-DD')}</span>: ''
        },{
            title: '创建日期',
            label: '创建日期',
            dataIndex: 'createDate',
            render: (date) => date ? moment(date).format('YYYY-MM-DD'): ''
        },{
            title: '待分配(来源)',
            label: '待分配(来源)',
            dataIndex: 'toAllocateSource',

        },{
            title: '是否进过回收站',
            label: '是否进过回收站',
            dataIndex: 'isIntoRecycle',
        },{
            title: '最后进回收站日期',
            label: '最后进回收站日期',
            dataIndex: 'lastRecycleTime',
            render: (date) => date ? moment(date).format('YYYY-MM-DD'): ''
        },{
            title: '最后分配日期',
            label: '最后分配日期',
            dataIndex: 'lastDistributeTime',
            render: (date) => date ? moment(date).format('YYYY-MM-DD'): ''
        },{
            title: '最后领取日期',
            label: '最后领取日期',
            dataIndex: 'lastReceiveTime',
            render: (date) => date ? moment(date).format('YYYY-MM-DD'): ''
        },{
            title: '回收原因',
            label: '回收原因',
            dataIndex: 'recycleCause'
        },{
            title: '首次联系日期',
            label: '首次联系日期',
            dataIndex: 'firstContactTime',
            render: (date) => date ? moment(date).format('YYYY-MM-DD'): ''
        },{
            title: '最后联系日期',
            label: '最后联系日期',
            dataIndex: 'lastContactTime',
            sorter:true,
            sortOrder: sortName === 'lastContactTime' && sortOrder,
            render: (date) => date ? <span className='ml20'>{moment(date).format('YYYY-MM-DD')}</span>: ''
        },{
            title: <Tooltip title='包含任务和通过云语音拨号建立的任务'><span className='mr5'>有效联系任务数</span><Icon type='info-circle'/></Tooltip>,
            label: '有效联系任务数',
            dataIndex: 'effectiveContactNum'
        },{
            title: '首次联系间隔',
            label: '首次联系间隔',
            dataIndex: 'firstContactInterval'
        },{
            title: '首次成功联系间隔',
            label: '首次成功联系间隔',
            dataIndex: 'firstContactSuccessInterval'
        },{
            title: '首次诺访日期',
            label: '首次诺访日期',
            dataIndex: 'appTime',
            render: (date) => date ? moment(date).format('YYYY-MM-DD'): ''
        },{
            title: '首次到访日期',
            label: '首次到访日期',
            dataIndex: 'oppTime',
            render: (date) => date ? moment(date).format('YYYY-MM-DD'): ''
        },{
            title: '最后一次到访日期',
            label: '最后一次到访日期',
            dataIndex: 'lastVisitTime',
            render: (date) => date ? moment(date).format('YYYY-MM-DD'): ''
        },{
            title: '已到访次数',
            label: '已到访次数',
            dataIndex: 'visitNum'
        },{
            title: '即将到访日期',
            label: '即将到访日期',
            dataIndex: 'toVisitTime',
            render: (date) => date ? moment(date).format('YYYY-MM-DD'): ''
        },{
            title: '最后试听日期',
            label: '最后试听日期',
            dataIndex: 'lastPreviewTime',
            render: (date) => date ? moment(date).format('YYYY-MM-DD'): ''
        },{
            title: '最后测评日期',
            label: '最后测评日期',
            dataIndex: 'lastAssessTime',
            render: (date) => date ? moment(date).format('YYYY-MM-DD'): ''
        },{
            title: '首次收款日期',
            label: '首次收款日期',
            dataIndex: 'firstFinacialTime',
            render: (date) => date ? moment(date).format('YYYY-MM-DD'): ''
        },{
            title: '课程包名称(有效)',
            label: '课程包名称(有效)',
            dataIndex: 'packageName'
        },{
            title: <Tooltip title='已付款的合同最晚到期日'><span className='mr5'>合同到期日</span><Icon type='info-circle'/></Tooltip>,
            label: '合同到期日',
            dataIndex: 'contractExpireTime',
            render: (date) => date ? moment(date).format('YYYY-MM-DD'): ''
        },{
            title: '剩余有效总课时',
            label: '剩余有效总课时',
            dataIndex: 'totalRemainingCourseNum'
        },
    ]
};

const searchConditionMap = {
    babyName: '宝宝姓名',
    phoneNumber: '手机号',
    gb: 'GB',
    ga: 'GA',
    phase: '客户阶段',
    promotor: 'promotor',
    tmk: 'TMK',
    lastGb: '上一个GB',
    intentionLevel: '意向度',
    monthValueBegin: '月龄开始',
    monthValueEnd: '月龄结束',
    birthdayBegin: '生日开始',
    birthdayEnd: '生日结束',
    birthdayMonth: '生日月',
    gender: '性别',
    contactName: '联系人',
    district: '区县',
    quarter: '小区',
    leadsId: '客户编号',
    appearanceType: '出现方式',
    channelType: '渠道来源',
    channelComment: '渠道备注',
    firstInquireDateBegin: '首次获取日期开始',
    firstInquireDateEnd: '首次获取日期结束',
    lastInquireDateBegin: '最后获取日期开始',
    lastInquireDateEnd: '最后获取日期结束',
    createDateBegin: '创建日期开始',
    createDateEnd: '创建日期结束',
    toAllocateSource: '待分配(来源)',
    isIntoRecycle: '是否进过回收站',
    lastRecycleTimeBegin: '最后进回收站日期开始',
    lastRecycleTimeEnd: '最后进回收站日期结束',
    lastDistributeTimeBegin: '最后分配日期开始',
    lastDistributeTimeEnd: '最后分配日期结束',
    lastReceiveTimeBegin: '最后领取日期开始',
    lastReceiveTimeEnd: '最后领取日期结束',
    firstContactTimeBegin: '首次联系日期开始',
    firstContactTimeEnd: '首次联系日期结束',
    lastContactTimeBegin: '最后联系日期开始',
    lastContactTimeEnd: '最后联系日期结束',
    effectiveContactNumBegin: '有效联系任务数开始',
    effectiveContactNumEnd: '有效联系任务数结束',
    firstContactIntervalBegin: '首次联系间隔开始',
    firstContactIntervalEnd: '首次联系间隔结束',
    firstContactSuccessIntervalBegin: '首次成功联系间隔开始',
    firstContactSuccessIntervalEnd: '首次成功联系间隔结束',
    appTimeBegin: '首次诺访日期开始',
    appTimeEnd: '首次诺访日期结束',
    oppTimeBegin: '首次到访日期开始',
    oppTimeEnd: '首次到访日期结束',
    lastVisitTimeBegin: '最后一次到访日期开始',
    lastVisitTimeEnd: '最后一次到访日期结束',
    visitNumBegin: '已到访次数开始',
    visitNumEnd: '已到访次数结束',
    toVisitTimeBegin: '即将到访日期开始',
    toVisitTimeEnd: '即将到访日期结束',
    lastPreviewTimeBegin: '最后试听日期开始',
    lastPreviewTimeEnd: '最后试听日期结束',
    lastAssessTimeBegin: '最后测评日期开始',
    lastAssessTimeEnd: '最后测评日期结束',
    firstFinacialTimeBegin: '首次收款日期开始',
    firstFinacialTimeEnd: '首次收款日期结束',
    packageId: '课程包名称(有效)',
    contractExpireTimeBegin: '合同到期日开始',
    contractExpireTimeEnd: '合同到期日结束',
    totalRemainingCourseNumBegin: '剩余有效总课时开始',
    totalRemainingCourseNumEnd: '剩余有效总课时结束'
};


export {dateFields, searchConditionMap,}
