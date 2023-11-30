/**
 *Desc: 分配客户页面各阶段表头
 *User: Debby.Deng
 *Date: 2018/11/14,
 *Time: 下午2:19
 */

import React from "react";
import {appearanceType, charLevel, recycleReason, recycleType} from "../../enum/assign";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {CustomerRoutes} from "@/router/enum/customerRoutes";
import moment from 'moment';
import {reNewStatus} from "@/ui/pages/customer/enum/client360";
import {Icon} from "@/ui/component/icon";
import {Tooltip} from 'antd';

function mapLabel(arr,text){
    let value=null;
    arr.map((item)=>{
        if(item.value === text){
            // 如果出现方式为Net-in时，高亮
            value = item.label
                ? (
                    item.label === "Net-in"
                        ? <span style={{color: '#009cbd'}}>{item.label}</span>
                        : item.label)
                : item.name;
        }
    });
    return value;
}
function getApperanceType(text){
    return  mapLabel(appearanceType,text);
}

// 阶段格式化
const  formatTmkPhase = (type) => {
    const map = new Map([
        ['4', '已联络'],
        ['5', '诺访'],
        ['6', '已到访'],
    ]);
    return map.get(type) ? map.get(type) : '';
};
// leads新标签
const  formatRouseFlag = (type) => {
    const map = new Map([
        ['1101001',
            <Tooltip placement="right" title='唤醒'>
                <span><Icon type='lingdang' className='gym-assign-phase-table-td-leads-name-icon green'/></span>
            </Tooltip>],
        ['1101002',
            <Tooltip placement="right" title='Hot'>
                <span><Icon type='remen' className='gym-assign-phase-table-td-leads-name-icon red'/></span>
            </Tooltip>],
        ['1101003',
            <Tooltip placement="right" title='再次获取'>
                <span><Icon type='repeat' className='gym-assign-phase-table-td-leads-name-icon'/></span>
            </Tooltip>],
    ]);
    return map.get(type) ? map.get(type) : null;
};

const newRecycleReason=recycleReason.concat(recycleType);

function getHeader(sortedInfo){
    return {
        '待分配-关键信息':[{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
            fixed: 'left',
            width: 120,
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='babyName' && sortedInfo.sortOrder,
            render: (text:string, record:any) => (
                <div className='gym-assign-phase-table-td-leads-name'>
                    <span>{text}</span>{formatRouseFlag(record.rouseFlag)}
                </div>
            )
        }, {
            title: '月龄',
            dataIndex: 'monthValue',
            key: 'monthValue',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='monthValue' && sortedInfo.sortOrder,
            fixed: 'left',
        }, {
            title: '出现方式',
            dataIndex: 'appearanceType',
            key: 'appearanceType',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='appearanceType' && sortedInfo.sortOrder,
            render: getApperanceType
        }, {
            title: '渠道来源',
            dataIndex: 'channelType',
            key: 'channelType',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='channelType' && sortedInfo.sortOrder,
        },{
            title:'创建',
            dataIndex:'createDate',
            key:'createDate',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='createDate' && sortedInfo.sortOrder,
            render:(text)=>(text && moment(text).format('YYYY-MM-DD'))
        },{
            title: '累积接通次数',
            dataIndex: 'callSuccessTimes',
        },{
            title: "下次联系时间",
            dataIndex: 'tmkNextContactTime',
            key: "tmkNextContactTime",
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='tmkNextContactTime' && sortedInfo.sortOrder,
            render: (text) => text ? moment(text).format("YYYY-MM-DD HH:mm") : null
        },{
            title: "阶段",
            dataIndex: 'tmkPhase',
            render: (text) => formatTmkPhase(text)
        },{
            title: 'PROMOTOR',
            dataIndex: 'promoterName',
            key: 'promoterName',
        },{
            title: '最近导入时间',
            dataIndex: 'lastImportingTime',
            key: 'lastImportingTime',
            render:(text)=>(text && moment(text).format('YYYY-MM-DD')),
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='lastedRepeatedTime' && sortedInfo.sortOrder,
        },{
            title: '累积重复次数',
            dataIndex: 'repeatedNum',
            key: 'repeatedNum',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='repeatedNum' && sortedInfo.sortOrder,
        }, {
            title: '回炉时间',
            dataIndex: 'recycleTime',
            key: 'recycleTime',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='recycleTime' && sortedInfo.sortOrder,
            render:(text)=>(text && moment(text).format('YYYY-MM-DD'))
        },{
            title: '回炉原因',
            key: 'recycleReason',
            dataIndex:'recycleReason',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='recycleReason' && sortedInfo.sortOrder,
            render:(text,record)=>(mapLabel(newRecycleReason,text))
        },{
            title: '客户360',
            key: '360',
            fixed: 'right',
            render:(text,record)=>(
                <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`}>
                    <button className='gym-button-white gym-button-xxs'>查看</button>
                </a>)
        }],
        '已分配-关键信息':[{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
            fixed: 'left',
            width: 120,
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='babyName' && sortedInfo.sortOrder,
            render: (text:string, record:any) => (
                <div className='gym-assign-phase-table-td-leads-name'>
                    {text}{formatRouseFlag(record.rouseFlag)}
                </div>
            ),
        }, {
            title: '月龄',
            dataIndex: 'monthValue',
            key: 'monthValue',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='monthValue' && sortedInfo.sortOrder,
            fixed: 'left',
        }, {
            title: '出现方式',
            dataIndex: 'appearanceType',
            key: 'appearanceType',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='appearanceType' && sortedInfo.sortOrder,
            render: getApperanceType
        }, {
            title: '渠道来源',
            dataIndex: 'channelType',
            key: 'channelType',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='channelType' && sortedInfo.sortOrder,
        },{
            title: '分配',
            key: 'distributeTime',
            dataIndex:'distributeTime',
            render:(text)=>(text && moment(text).format('YYYY-MM-DD')),
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='distributeTime' && sortedInfo.sortOrder
        },{
            title: '到期',
            key: 'unReceiveDays',//未领取
            dataIndex:'unReceiveDays',
            render:(text,record)=>(`${text||'--'}天`),
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='unReceiveDays' && sortedInfo.sortOrder
        },{
            title: '累积接通次数',
            dataIndex: 'callSuccessTimes',
        },{
            title: "下次联系时间",
            dataIndex: 'tmkNextContactTime',
            key: "tmkNextContactTime",
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='tmkNextContactTime' && sortedInfo.sortOrder,
            render: (text) => text ? moment(text).format("YYYY-MM-DD HH:mm") : null
        },{
            title: "阶段",
            dataIndex: 'tmkPhase',
            render: (text) => formatTmkPhase(text)
        },{
            title: 'GB',
            key: 'primaryGbStaffName',
            dataIndex:'primaryGbStaffName',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='primaryGbStaffName' && sortedInfo.sortOrder
        },{
            title: 'GA',
            key: 'primaryGaStaffName',
            dataIndex:'primaryGaStaffName',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='primaryGaStaffName' && sortedInfo.sortOrder
        },{
            title: '客户360',
            key: '360',
            fixed: 'right',
            render:(text,record)=>(
                <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`}>
                    <button className='gym-button-white gym-button-xxs'>查看</button>
                </a>)    }
        ],
        '已领取-关键信息':[{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
            fixed: 'left',
            width: 120,
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='babyName' && sortedInfo.sortOrder,
            render: (text:string, record:any) => (
                <div className='gym-assign-phase-table-td-leads-name'>
                    {text}{formatRouseFlag(record.rouseFlag)}
                </div>
            ),
        }, {
            title: '月龄',
            dataIndex: 'monthValue',
            key: 'monthValue',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='monthValue' && sortedInfo.sortOrder,
            fixed: 'left',
        }, {
            title: '出现方式',
            dataIndex: 'appearanceType',
            key: 'appearanceType',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='appearanceType' && sortedInfo.sortOrder,
            render: getApperanceType
        }, {
            title: '累积接通次数',
            dataIndex: 'callSuccessTimes',
        },{
            title: "下次联系时间",
            dataIndex: 'tmkNextContactTime',
            key: 'tmkNextContactTime',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='tmkNextContactTime' && sortedInfo.sortOrder,
            render: (text) => text ? moment(text).format("YYYY-MM-DD HH:mm") : null
        },{
            title: '渠道来源',
            dataIndex: 'channelType',
            key: 'channelType',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='channelType' && sortedInfo.sortOrder,
        },{
            title: '领取',
            key: 'receiveTime',
            dataIndex:'receiveTime',
            render:(text)=>(text && moment(text).format('YYYY-MM-DD')),
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='receiveTime' && sortedInfo.sortOrder
        },{
            title: '到期',
            key: 'unContactDays',//到期未联系
            dataIndex:'unContactDays',
            render:(text)=>(`${text||'--'}天`),
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='unContactDays' && sortedInfo.sortOrder
        },{
            title: 'GB',
            key: 'primaryGbStaffName',
            dataIndex:'primaryGbStaffName',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='primaryGbStaffName' && sortedInfo.sortOrder
        },{
            title: 'GA',
            key: 'primaryGaStaffName',
            dataIndex:'primaryGaStaffName',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='primaryGaStaffName' && sortedInfo.sortOrder
        },{
            title: '客户360',
            key: '360',
            fixed: 'right',
            render:(text,record)=>(
                <a  target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`}>
                    <button className='gym-button-white gym-button-xxs'>查看</button>
                </a>)
        }],
        '已联络-关键信息':[{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
            fixed: 'left',
            width: 120,
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='babyName' && sortedInfo.sortOrder,
            render: (text:string, record:any) => (
                <div className='gym-assign-phase-table-td-leads-name'>
                    {text}{formatRouseFlag(record.rouseFlag)}
                </div>
            ),
        }, {
            title: '月龄',
            dataIndex: 'monthValue',
            key: 'monthValue',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='monthValue' && sortedInfo.sortOrder,
            fixed: 'left',
        }, {
            title: '意向度',
            dataIndex: 'intentionLevel',
            key: 'intentionLevel',
            render:(text)=>(mapLabel(charLevel,text)),
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='intentionLevel' && sortedInfo.sortOrder
        }, {
            title: '累积接通次数',
            dataIndex: 'callSuccessTimes',
        },{
            title: "下次联系时间",
            dataIndex: 'tmkNextContactTime',
            key: 'tmkNextContactTime',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='tmkNextContactTime' && sortedInfo.sortOrder,
            render: (text) => text ? moment(text).format("YYYY-MM-DD HH:mm") : null
        },{
            title: '最近联系',
            dataIndex: 'lastContactDate',
            key: 'lastContactDate',
            sorter:true,
            render:(text)=>(text && moment(text).format('YYYY-MM-DD')),
            sortOrder:sortedInfo && sortedInfo.sortName==='lastContactDate' && sortedInfo.sortOrder
        },{
            title: '是否试听',
            key: 'hasPreviewLesson',
            dataIndex:'hasPreviewLesson',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='hasPreviewLesson' && sortedInfo.sortOrder,
            render:(text)=>((text && parseInt(text))? "是" : "否")
        },{
            title: 'GB',
            key: 'primaryGbStaffName',
            dataIndex:'primaryGbStaffName',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='primaryGbStaffName' && sortedInfo.sortOrder
        },{
            title: 'GA',
            key: 'primaryGaStaffName',
            dataIndex:'primaryGaStaffName',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='primaryGaStaffName' && sortedInfo.sortOrder
        },{
            title: '客户360',
            key: '360',
            fixed: 'right',
            render:(text,record)=>(
                <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`}>
                    <button className='gym-button-white gym-button-xxs'>查看</button>
                </a>)

        }],
        '诺访-关键信息':[{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
            fixed: 'left',
            width: 120,
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='babyName' && sortedInfo.sortOrder,
            render: (text:string, record:any) => (
                <div className='gym-assign-phase-table-td-leads-name'>
                    {text}{formatRouseFlag(record.rouseFlag)}
                </div>
            ),

        }, {
            title: '月龄',
            dataIndex: 'monthValue',
            key: 'monthValue',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='monthValue' && sortedInfo.sortOrder,
            fixed: 'left',
        }, {
            title: '意向度',
            dataIndex: 'intentionLevel',
            key: 'intentionLevel',
            render:(text)=>(mapLabel(charLevel,text)),
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='intentionLevel' && sortedInfo.sortOrder
        }, {
            title: '累积接通次数',
            dataIndex: 'callSuccessTimes',
        },{
            title: "下次联系时间",
            dataIndex: 'tmkNextContactTime',
            key: 'tmkNextContactTime',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='tmkNextContactTime' && sortedInfo.sortOrder,
            render: (text) => text ? moment(text).format("YYYY-MM-DD HH:mm") : null
        },{
            title: '最近联系',
            dataIndex: 'lastContactDate',
            key: 'lastContactDate',
            sorter:true,
            render:(text)=>(text && moment(text).format('YYYY-MM-DD')),
            sortOrder:sortedInfo && sortedInfo.sortName==='lastContactDate' && sortedInfo.sortOrder
        }, {
            title: '诺访',
            dataIndex: 'lastAppTime',
            key: 'lastAppTime',
            sorter:true,
            render:(text)=>(text && moment(text).format('YYYY-MM-DD')),
            sortOrder:sortedInfo && sortedInfo.sortName==='lastAppTime' && sortedInfo.sortOrder
        },{
            title: '是否试听',
            key: 'hasPreviewLesson',
            dataIndex:'hasPreviewLesson',
            render:(text)=>((text && parseInt(text))? "是" : "否")

        },{
            title: 'GB',
            key: 'primaryGbStaffName',
            dataIndex:'primaryGbStaffName',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='primaryGbStaffName' && sortedInfo.sortOrder
        },{
            title: 'GA',
            key: 'primaryGaStaffName',
            dataIndex:'primaryGaStaffName',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='primaryGaStaffName' && sortedInfo.sortOrder
        },{
            title: '客户360',
            key: '360',
            fixed: 'right',
            render:(text,record)=>(
                <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`}>
                    <button className='gym-button-white gym-button-xxs'>查看</button>
                </a>)

        }],
        '已到访-关键信息':[{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
            fixed: 'left',
            width: 120,
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='babyName' && sortedInfo.sortOrder,
            render: (text:string, record:any) => (
                <div className='gym-assign-phase-table-td-leads-name'>
                    {text}{formatRouseFlag(record.rouseFlag)}
                </div>
            ),
        }, {
            title: '月龄',
            dataIndex: 'monthValue',
            key: 'monthValue',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='monthValue' && sortedInfo.sortOrder,
            fixed: 'left',
        }, {
            title: '意向度',
            dataIndex: 'intentionLevel',
            key: 'intentionLevel',
            render:(text)=>(mapLabel(charLevel,text)),
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='intentionLevel' && sortedInfo.sortOrder

        },{
            title: '累积接通次数',
            dataIndex: 'callSuccessTimes',
        },{
            title: "下次联系时间",
            key: 'tmkNextContactTime',
            dataIndex: 'tmkNextContactTime',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='tmkNextContactTime' && sortedInfo.sortOrder,
            render: (text) => text ? moment(text).format("YYYY-MM-DD HH:mm") : null
        }, {
            title: '诺访',
            dataIndex: 'lastAppTime',
            key: 'lastAppTime',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='lastAppTime' && sortedInfo.sortOrder,
            render:(text)=>(text && moment(text).format('YYYY-MM-DD')),
        },{
            title: '首次到访',
            key: 'oppTime',
            dataIndex:'oppTime',
            sorter:true,
            render:(text)=>(text && moment(text).format('YYYY-MM-DD')),
            sortOrder:sortedInfo && sortedInfo.sortName==='oppTime' && sortedInfo.sortOrder
        },{
            title: '最近联系',
            key: 'lastContactDate',
            dataIndex:'lastContactDate',
            sorter:true,
            render:(text)=>(text && moment(text).format('YYYY-MM-DD')),
            sortOrder:sortedInfo && sortedInfo.sortName==='lastContactDate' && sortedInfo.sortOrder
        },{
            title: 'GB',
            key: 'primaryGbStaffName',
            dataIndex:'primaryGbStaffName',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='primaryGbStaffName' && sortedInfo.sortOrder
        },{
            title: 'GA',
            key: 'primaryGaStaffName',
            dataIndex:'primaryGaStaffName',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='primaryGaStaffName' && sortedInfo.sortOrder
        },{
            title: '客户360',
            key: '360',
            fixed: 'right',
            render:(text,record)=>(
                <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`}>
                    <button className='gym-button-white gym-button-xxs'>查看</button>
                </a>)

        }],
        '新会员-老会员-关键信息':[{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
            fixed: 'left',
            width: 120,

        }, {
            title: '月龄',
            dataIndex: 'monthValue',
            key: 'monthValue',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='monthValue' && sortedInfo.sortOrder,
            fixed: 'left',
        }, {
            title: '课程包名称',
            dataIndex: 'packageName',
            key: 'packageName',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='packageName' && sortedInfo.sortOrder
        }, {
            title: '累积接通次数',
            dataIndex: 'callSuccessTimes',
        },{
            title: "下次联系时间",
            key: 'tmkNextContactTime',
            dataIndex: 'tmkNextContactTime',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='tmkNextContactTime' && sortedInfo.sortOrder,
            render: (text) => text ? moment(text).format("YYYY-MM-DD HH:mm") : null
        },{
            title: '最近分配时间',
            dataIndex: 'distributeGaTime',
            key: 'distributeGaTime',
            render:(text,record)=>{
                const {distributeTime}=record;
                let time="";
                if(text && distributeTime){
                     time= Number(text)-Number(distributeTime)>0?
                        text : distributeTime;
                }else{
                     time= text||distributeTime;
                }
                return time? moment(time).format("YYYY-MM-DD") : "";
            }
        }, {
            title: '签约',
            dataIndex: 'signTime',
            key: 'signTime',
            sorter:true,
            render:(text)=>(text && moment(text).format('YYYY-MM-DD')),
            sortOrder:sortedInfo && sortedInfo.sortName==='signTime' && sortedInfo.sortOrder

        },{
            title: '开课',
            key: 'firstClassTime',
            dataIndex:'firstClassTime',
            render:(text)=>(text && moment(text).format('YYYY-MM-DD')),
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='firstClassTime' && sortedInfo.sortOrder
        },{
            title: '到期',
            dataIndex: 'endDate',
            key: 'endDate',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='endDate' && sortedInfo.sortOrder

        },{
            title: 'GB',
            key: 'primaryGbStaffName',
            dataIndex:'primaryGbStaffName',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='primaryGbStaffName' && sortedInfo.sortOrder
        },{
            title: 'GA',
            key: 'primaryGaStaffName',
            dataIndex:'primaryGaStaffName',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='primaryGaStaffName' && sortedInfo.sortOrder
        },{
            title: '客户360',
            key: '360',
            fixed: 'right',
            render:(text,record)=>(
                <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`}>
                    <button className='gym-button-white gym-button-xxs'>查看</button>
                </a>)
        }],
        '待续会员-关键信息':[{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
            fixed: 'left',
            width: 120,
        }, {
            title: '月龄',
            dataIndex: 'monthValue',
            key: 'monthValue',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='monthValue' && sortedInfo.sortOrder,
            fixed: 'left',
        }, {
            title: '课程包名称',
            dataIndex: 'packageName',
            key: 'packageName',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='packageName' && sortedInfo.sortOrder
        },{
            title: '累积接通次数',
            dataIndex: 'callSuccessTimes',
        },{
            title: "下次联系时间",
            dataIndex: 'tmkNextContactTime',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='tmkNextContactTime' && sortedInfo.sortOrder,
            render: (text) => text ? moment(text).format("YYYY-MM-DD HH:mm") : null
        },{
            title: '到期',
            dataIndex: 'endDate',
            key: 'endDate',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='endDate' && sortedInfo.sortOrder,

        },{
            title: '剩余课时',
            key: 'remainingCourseNum',
            dataIndex:'remainingCourseNum',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='remainingCourseNum' && sortedInfo.sortOrder
        },{
            title: '续约沟通',
            key: 'lastRenewContactDate',
            dataIndex:'lastRenewContactDate',
            render:(text)=>(text && moment(text).format('YYYY-MM-DD')),
        },{
            title: '续约状态',
            key: 'lastRenewContactStatus',
            dataIndex:'lastRenewContactStatus',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='lastRenewContactStatus' && sortedInfo.sortOrder,
            render:(text)=>(mapLabel(reNewStatus,text))
        },{
            title: 'GB',
            key: 'primaryGbStaffName',
            dataIndex:'primaryGbStaffName',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='primaryGbStaffName' && sortedInfo.sortOrder
        },{
            title: 'GA',
            key: 'primaryGaStaffName',
            dataIndex:'primaryGaStaffName',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='primaryGaStaffName' && sortedInfo.sortOrder
        },{
            title: '客户360',
            key: '360',
            fixed: 'right',
            render:(text,record)=>(
                <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`}>
                    <button className='gym-button-white gym-button-xxs'>查看</button>
                </a>)

        }],
        '基本信息':[{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
            fixed: 'left',
            width: 120,
        },{
            title: '月龄',
            dataIndex: 'monthValue',
            key: 'monthValue',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='monthValue' && sortedInfo.sortOrder,
            fixed: 'left',
        },{
            title: '主要联系人',
            dataIndex: 'contactRelation',
            key: 'contactRelation',
        },{
            title: '区县',
            dataIndex: 'district',
            key: 'district',
        },{
            title: '居住小区',
            dataIndex: 'quarter',
            key: 'quarter',
        },{
            title: '客户360',
            key: '360',
            render:(text,record)=>(
                <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`}>
                    <button className='gym-button-white gym-button-xxs'>查看</button>
                </a>)
        }
        ],
        'leads信息':[
            {
                title: '宝宝姓名',
                dataIndex: 'babyName',
                key: 'babyName',
                fixed: 'left',
                width: 120,
            },
            {
                title: '出现方式',
                dataIndex: 'appearanceType',
                key: 'appearanceType',
                sorter:true,
                sortOrder:sortedInfo && sortedInfo.sortName==='appearanceType' && sortedInfo.sortOrder,
                render: getApperanceType
            },
            {
                title: '渠道来源',
                dataIndex: 'channelType',
                key: 'channelType',
                sorter:true,
                sortOrder:sortedInfo && sortedInfo.sortName==='channelType' && sortedInfo.sortOrder,
            },
            {
                title: '渠道备注',
                dataIndex: 'channelComment',
                key: 'channelComment',
                width:'20%'
            },
            {
                title: '客户360',
                key: '360',
                fixed: 'right',
                render:(text,record)=>(
                    <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`}>
                        <button className='gym-button-white gym-button-xxs'>查看</button>
                    </a>)
            }
        ],
        '跟进信息':[
            {
                title: '宝宝姓名',
                dataIndex: 'babyName',
                key: 'babyName',
                fixed: 'left',
                width: 120,
            },
            {
                title: '试听',
                dataIndex: 'previewTime',
                key: 'previewTime',
                sorter:true,
                sortOrder:sortedInfo && sortedInfo.sortName==='previewTime' && sortedInfo.sortOrder,
                render:(text)=>(text && moment(text).format('YYYY-MM-DD'))
            },
            {
                title: '到访次数',
                dataIndex: 'visitTimes',
                key: 'visitTimes',
                sorter:true,
                sortOrder:sortedInfo && sortedInfo.sortName==='visitTimes' && sortedInfo.sortOrder,
                render:(text)=>(!!text? text : '')
            },
            {
                title: '跟进次数',
                dataIndex: 'followTimes',
                key: 'followTimes',
                sorter:true,
                sortOrder:sortedInfo && sortedInfo.sortName==='followTimes' && sortedInfo.sortOrder,
                render:(text)=>(!!text? text : '')

            },
            {
                title: '定金',
                dataIndex: 'depositTime',
                key: 'depositTime',
                sorter:true,
                sortOrder:sortedInfo && sortedInfo.sortName==='depositTimes' && sortedInfo.sortOrder,
                render:(text)=>(text && moment(text).format('YYYY-MM-DD'))
            },
            {
                title: '意向度',
                dataIndex: 'intentionLevel',
                key: 'intentionLevel',
                render:(text)=>(mapLabel(charLevel,text)),
                sorter:true,
                sortOrder:sortedInfo && sortedInfo.sortName==='intentionLevel' && sortedInfo.sortOrder
            },
            {
                title: '客户360',
                key: '360',
                fixed: 'right',
                render:(text,record)=>(
                    <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`}>
                        <button className='gym-button-white gym-button-xxs'>查看</button>
                    </a>)

            },
        ],
        '合同信息':[{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
            fixed: 'left',
            width: 120,
        },{
            title: '课程包名称',
            dataIndex: 'packageName',
            key: 'packageName',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='packageName' && sortedInfo.sortOrder,
        },{
            title: '签约',
            dataIndex: 'signTime',
            key: 'signTime',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='lastEffectiveDate' && sortedInfo.sortOrder,
            render:(text)=>(text && moment(text).format('YYYY-MM-DD'))

        },{
            title: '到期',
            dataIndex: 'endDate',
            key: 'endDate',
            render:(text)=>(text && moment(text).format('YYYY-MM-DD')),
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='endDate' && sortedInfo.sortOrder
        },{
            title: '剩余课时',
            dataIndex: 'remainingCourseNum',
            key: 'remainingCourseNum',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='remainingCourseNum' && sortedInfo.sortOrder
        },{
            title: '客户360',
            key: '360',
            fixed: 'right',
            render:(text,record)=>(
                <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`}>
                    <button className='gym-button-white gym-button-xxs'>查看</button>
                </a>)

        },],
        '上课情况':[{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
            fixed: 'left',
            width: 120,
        },{
            title: '所选课程',
            dataIndex: 'selectLessons',
            key: 'selectLessons',
        },{
            title: '近6个月平均周耗课',
            dataIndex: 'lastHalfyrAverageExpends',
            key: 'lastHalfyrAverageExpends',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='lastHalfyrAverageExpends' && sortedInfo.sortOrder
        },{
            title: '三周未出席',
            dataIndex: 'isThrwksNoAttendance',
            key: 'isThrwksNoAttendance',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='isThrwksNoAttendance' && sortedInfo.sortOrder,
            render:(text)=>(text && (Number(text)? '是' : ''))
        },{
            title: '客户360',
            key: '360',
            fixed: 'right',
            render:(text,record)=>(
                <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`}>
                    <button className='gym-button-white gym-button-xxs'>查看</button>
                </a>)

        },],
        '客户成长':[{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
            fixed: 'left',
            width: 120,
        },{
            title: '参加迎新会',
            dataIndex: 'isAttendNewComes',
            key: 'isAttendNewComes',
            render:(text)=>(text? '是' : '')
        },{
            title: '恳谈会',
            dataIndex: 'isAttendTalkfest',
            key: 'isAttendTalkfest',
            render:(text)=>(text? '是' : '')
        },{
            title: '原GB',
            dataIndex: 'oldPimaryGbStaffName',
            key: 'oldPimaryGbStaffName',
            sorter:true,
            sortOrder:sortedInfo && sortedInfo.sortName==='oldPimaryGbStaffName' && sortedInfo.sortOrder
        },{
            title: 'GB',
            dataIndex: 'primaryGbStaffName',
            key: 'primaryGbStaffName',

        },{
            title: 'GA',
            dataIndex: 'primaryGaStaffName',
            key: 'primaryGaStaffName',

        },{
            title: '客户360',
            key: '360',
            fixed: 'right',
            render:(text,record)=>(
                <a target={`_blank`} href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`}>
                    <button className='gym-button-white gym-button-xxs'>查看</button>
                </a>)

        },],
    };
}
export {getHeader}
