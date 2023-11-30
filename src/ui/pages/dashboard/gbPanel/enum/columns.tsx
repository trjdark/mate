/**
 * desc: GB仪表盘表头
 * User: Katarina.yuan@gymboglobal.com
 * Date: 2021/8/27
 * Time: 下午4:00
 */

import moment from "moment";
import {CustomerRoutes} from "@/router/enum/customerRoutes";
import {CommonUtils} from "@/common/utils/commonUtils";
import React from "react";

// 到访情况表头
export const columns = () => [
    {
        title: "",
        dataIndex: 'leftTitle',
        key: 'leftTitle',
        width: '20%',
    },{
        title: "今日",
        dataIndex: 'today',
        key: 'today',
        width: '30%',
    },{
        title: "本周",
        dataIndex: 'currentWeek',
        key: 'currentWeek',
        width: '28%',
    },{
        title: "本月",
        dataIndex: 'currentMonth',
        key: 'currentMonth',
    }
]

// 已领取待联络Leads表头
export const receiveColumns = () => [
    {
        title: "出现方式",
        dataIndex: 'appearanceType',
        key: 'appearanceType',
        width: 200
    },{
        title: "获取时间",
        dataIndex: 'inquireDate',
        key: 'inquireDate',
        render: (text) => text?moment(text).format('YYYY-MM-DD'):'',
        width: 200
    },{
        title: "渠道来源",
        dataIndex: 'channelType',
        key: 'channelType',
        width:250
    },{
        title: "意向度",
        dataIndex: 'intentionLevel',
        key: 'intentionLevel',
    },{
        title: "月龄",
        dataIndex: 'babyMonth',
        key: 'babyMonth',
    },{
        title: "宝宝姓名",
        dataIndex: 'babyName',
        key: 'babyName',
        render:(text,record)=>(
            <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.id})}`} > {text} </a>
        )
    }
]

// 已联络未到访Leads表头
export const contactColumns = () => [
    {
        title: "出现方式",
        dataIndex: 'appearanceType',
        key: 'appearanceType',
        width: 200
    },{
        title: "获取时间",
        dataIndex: 'inquireDate',
        key: 'inquireDate',
        render: (text) => text?moment(text).format('YYYY-MM-DD'):'',
        width: 200
    },{
        title: "最近一次联系时间",
        dataIndex: 'lastContactDate',
        key: 'lastContactDate',
        render: (text) => text?moment(text).format('YYYY-MM-DD'):'',
        width: 250
    },{
        title: "意向度",
        dataIndex: 'intentionLevel',
        key: 'intentionLevel',
    },{
        title: "月龄",
        dataIndex: 'babyMonth',
        key: 'babyMonth',
    },{
        title: "宝宝姓名",
        dataIndex: 'babyName',
        key: 'babyName',
        render:(text,record)=>(
            <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.id})}`} > {text} </a>
        )
    }
]
