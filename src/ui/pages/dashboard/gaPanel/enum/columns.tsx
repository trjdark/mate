/**
 * desc: GA面板表格表头枚举
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/8/30
 * Time: 下午3:28
 */
import React from 'react';
import {CustomerRoutes} from "@/router/enum/customerRoutes";
import {Link} from 'react-router-dom';
import {CommonUtils} from "@/common/utils/commonUtils";
import moment from 'moment';
import { Tooltip } from "antd";
import { Icon } from '@/ui/component/icon';

export const columns = [
    //今日首课宝宝表头
    [
        {
            title: "宝宝姓名",
            dataIndex: "babyName",
            key: "babyName",
            width: "25%",
            render:(text,record)=>(
                <Link target={`_blank`} to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} > {text} </Link>
            )
        },
        {
            title: "课程日期",
            dataIndex: "courseStartTime",
            key: "courseStartTime",
            width: "25%",
        },
        {
            title: "课程",
            dataIndex: "courseCode",
            key: "courseCode",
            width: "25%",
        },
        {
            title: "INS",
            dataIndex: "primaryInsName",
            key: "primaryInsName",
            width: "25%",
        }
    ],
    //未开课宝宝表头
    [
        {
            title: "宝宝姓名",
            dataIndex: "babyName",
            key: "babyName",
            width: "25%",
            render:(text,record)=>(
                <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} > {text} </a>
            )
        },
        {
            title: "月龄",
            dataIndex: "monthAge",
            key: "monthAge",
            width: "25%",
        },
        {
            title: "课程包名称",
            dataIndex: "pacName",
            key: "pacName",
            width: "25%",
        },
        {
            title: "签约时间",
            dataIndex: "signTime",
            key: "signTime",
            width: "25%",
        }
    ],
    //未排课宝宝
    [
        {
            title: "宝宝姓名",
            dataIndex: "babyName",
            key: "babyName",
            width: "16%",
            render:(text,record)=>(
                <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} > {text} </a>
            )
        },
        {
            title: "月龄",
            dataIndex: "monthValue",
            key: "monthValue",
            width: "10%",
        },
        {
            title: <p className='tableHead'><Tooltip title='多个合同取汇总'>剩余课时<Icon type='wenti'/></Tooltip></p>,
            dataIndex: "remaingCourseNum",
            key: "remaingCourseNum",
        },
        {
            title: <p className='tableHead'><Tooltip title='课程耗课+活动耗课（多合同取汇总）'>已上课时<Icon type='wenti'/></Tooltip></p>,
            dataIndex: "uesdCourseNum",
            key: "uesdCourseNum",
        },
        {
            title: "上一次上课时间",
            dataIndex: "lastLessonDate",
            key: "lastLessonDate",
        },
        {
            title: "上一次出席课程",
            dataIndex: "lastCourseCode",
            key: "lastCourseCode",
        },
    ],
    //过去14天以上未耗课且未联系宝宝
    [
        {
            title: "宝宝姓名",
            dataIndex: "babyName",
            key: "babyName",
            width: "16%",
            render:(text,record)=>(
                <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} > {text} </a>
            )
        },
        {
            title: "月龄",
            dataIndex: "monthAge",
            key: "monthAge",
            width: "10%",
        },
        {
            title: "剩余课时",
            dataIndex: "remainingCourseNum",
            key: "remainingCourseNum",
            width: "10%",
        },
        {
            title: "已上课时",
            dataIndex: "usedCourseNum",
            key: "usedCourseNum",
            width: "10%",
        },
        {
            title: "上一次上课时间",
            dataIndex: "lastLessonDate",
            key: "lastLessonDate",
            width: "14%",
            render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm') : ''
        },
        {
            title: "上一次出席课程",
            dataIndex: "lastCourseName",
            key: "lastCourseName",
        },
        {
            title: "上一次联系时间",
            dataIndex: "lastTaskTime",
            key: "lastTaskTime",
            render: (text) => text ?  moment(text).format('YYYY-MM-DD HH:mm') : ''
        },
        {
            title: "上一次联系人",
            dataIndex: "lastTaskStaff",
            key: "lastTaskStaff"
        },
    ],
    //过去7天已约未到宝宝
    [
        {
            title: "宝宝姓名",
            dataIndex: "babyName",
            key: "babyName",
            width: "16%",
            render:(text,record)=>(
                <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} > {text} </a>
            )
        },
        {
            title: "月龄",
            dataIndex: "monthAge",
            key: "monthAge",
            width: "10%",
        },
        {
            title: <p className='tableHead'><Tooltip title='多个合同取汇总'>剩余课时<Icon type='wenti'/></Tooltip></p>,
            dataIndex: "remainingCourseNum",
            key: "remainingCourseNum",
        },
        {
            title: <p className='tableHead'><Tooltip title='课程耗课+活动耗课（多合同取汇总）'>已耗课时<Icon type='wenti'/></Tooltip></p>,
            dataIndex: "usedCourseNum",
            key: "usedCourseNum",
        },
        {
            title: "上一次上课时间",
            dataIndex: "lastLessonDate",
            key: "lastLessonDate",
            render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm') : ''
        },
        {
            title: "上一次出席课程",
            dataIndex: "lastCourseName",
            key: "lastCourseName",
        },
        {
            title: "约课人",
            dataIndex: "lastGaName",
            key: "lastGaName"
        }
    ],
    //未来14天内升班宝宝
    [
        {
            title: "宝宝姓名",
            dataIndex: "babyName",
            key: "babyName",
            width:'33%',
            render:(text,record)=>(
                <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} > {text} </a>
            )
        },
        {
            title: "升班月龄",
            dataIndex: "monthAge",
            key: "monthAge",
            width:'33%',
        },
        {
            title: "升班课程",
            dataIndex: "courseName",
            key: "courseName",
            width:'33%',
        },
    ],
    //今日最后一节课宝宝
    [
        {
            title: "宝宝姓名",
            dataIndex: "babyName",
            key: "babyName",
            width: "16%",
            render:(text,record)=>(
                <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} > {text} </a>
            )
        },
        {
            title: "月龄",
            dataIndex: "monthAge",
            key: "monthAge",
            width: "10%",
        },
        {
            title:"剩余课时",
            dataIndex: "remainingCourseNum",
            key: "remainingCourseNum",
        },
        {
            title: "已上课时",
            dataIndex: "usedCourseNum",
            key: "usedCourseNum",
        },

        {
            title: "最后一次上课时间",
            dataIndex: "lastLessonDate",
            key: "lastLessonDate",
            render: (text) => text ?  moment(text).format('YYYY-MM-DD HH:mm') : ''
        },
        {
            title: "最后一次出席课程",
            dataIndex: "lastCourseCode",
            key: "lastCourseCode",
        },
        {
            title: "INS",
            dataIndex: "ins",
            key: "ins"
        },
    ],
    //今日生日宝宝
    [
        {
            title: "宝宝姓名",
            dataIndex: "babyName",
            key: "babyName",
             width:'33%',
            render:(text,record)=>(
                <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} > {text} </a>
            )
        },
        {
            title: "月龄",
            dataIndex: "monthAge",
            key: "monthAge",
             width:'33%',
        },
        {
            title: "出生日期",
            dataIndex: "babyBirthday",
            key: "babyBirthday",
             width:'33%',
            render: (text) => text ?  moment(text).format('YYYY-MM-DD') : ''
        }
    ],
    //本月生日宝宝
    [
        {
            title: "宝宝姓名",
            dataIndex: "babyName",
            key: "babyName",
            width:'33%',
            render:(text,record)=>(
                <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} > {text} </a>
            )
        },
        {
            title: "月龄",
            dataIndex: "monthAge",
            key: "monthAge",
            width:'33%',
        },
        {
            title: "出生日期",
            dataIndex: "babyBirthday",
            key: "babyBirthday",
            width:'33%',
            render: (text) => text ?  moment(text).format('YYYY-MM-DD') : ''
        }
    ],
];
//表格标题和气泡提示文字
export const remarkInfo = [
    {
        title:'今日首课宝宝',
    },
    {
        title:'未开课宝宝',
        remark:'签约后未产生耗课的宝宝，不包含续约，包含西格玛课包。'
    },
    {
        title:'未排课宝宝',
        remark:'到当前查看时间为止，后面没有选课记录的宝宝，不包含试听、等位、活动。'
    },
    {
        title:'过去14天以上未耗课且未联系宝宝',
        remark:'过去14天以上没有耗课记录（或者活动）且无任务联系记录的宝宝。'
    },
    {
        title:'过去七天已约未到宝宝',
        remark:'过去7天有预约课程或活动但实际未签到的宝宝，包含请假和旷课。'
    },
    {
        title:'未来14天内升班宝宝',
    },
    {
        title:'今日最后一节课宝宝',
    },
    {
        title:'今日生日宝宝',
    },
    {
        title:'本月生日宝宝',
    },
]