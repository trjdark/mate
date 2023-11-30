/**
 *Desc: 客户成长不同状态table head
 *User: Debby.Deng
 *Date: 2018/11/6,
 *Time: 下午2:47
 */
import * as React from "react";
import * as moment from 'moment';
import { Routes } from "@/router/enum/routes";
import { Link } from "react-router-dom";
import leadsStatusCode from "../../../enum/client360";
import { CommonUtils } from '@/common/utils/commonUtils';
import { User } from "@/common/beans/user";
import { FUNC } from "@/ui/pages/setting/enum/functions";
import {eventType, reNewStatus} from "../../../enum/client360";

function parseCodeToName(codeName,value){
    let name='';
    codeName.map((item)=>{
        if(item.value===value){
            name=item.name;
        }
    });
    return name;
}
/**
 * 权限控制
 * @param func key
 */
function isExist  (funcId) {
    const permissionList = User.permissionList;
    return permissionList.includes(funcId)
};
class tableHeader extends React.Component<any,any> {
    static 'transfer'=[// 交接记录
        {
            title: '操作日期',
            dataIndex: 'operatorDate',
            key: 'operatorDate',
            render:(text,record)=>(moment(text).format('YYYY-MM-DD'))
        }, {
            title: '操作人',
            dataIndex: 'operatorUser',
            key: 'operatorUser',
        },
        {
            title: '操作类型',
            dataIndex: 'distributeType',
            key: 'distributeType',
        }, {
            title: '接收人',
            dataIndex: 'receiveUser',
            key: 'receiveUser',
        }
    ];
    static 'keyEvent'=[// 关键事件记录
        {
            title: '时间',
            dataIndex: 'eventDate',
            key: 'eventDate',
            render:(text,record)=>(moment(text).format('YYYY-MM-DD'))
        }, {
            title: '事件类型',
            dataIndex: 'eventType',
            key: 'eventType',
            render:(text,record)=>(eventType[text])
        },
        {
            title: '事件备注',
            dataIndex: 'remark',
            key: 'remark',
            width:'30%'
        }, {
            title: '个人笔记',
            dataIndex: 'comment',
            key: 'comment',
            width:'30%'
        },
    ];

    static 'growth'=[// 成长报告
        {
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
        }, {
            title: '阶段',
            dataIndex: 'monthValue',
            key: 'monthValue',
        },
        {
            title: 'GA',
            dataIndex: 'create',
            key: 'create',
        }, {
            title: '日期',
            dataIndex: 'distribute',
            key: 'distribute',
        },
        {
            title: '操作',
            dataIndex: 'recycleTime',
            key: 'recycleTime',
        }
    ];
    static 'feedback'=[// 随堂反馈
        {
            title: '操作日期',
            dataIndex: 'commentsTime',
            key: 'commentsTime',
            render:(text)=>moment(text).format('YYYY-MM-DD')
        }, {
            title: '课程代码（学阶)',
            dataIndex: 'courseCode',
            key: 'courseCode',
        },
        {
            title: '课程时间',
            dataIndex: 'courseStartDate',
            key: 'courseStartDate',
            render: (text, record) => <span>{moment(record.courseDate).format('YYYY-MM-DD')} {record.courseStartDate}</span>
        }, {
            title: '主教',
            dataIndex: 'primaryInsStaffName',
            key: 'primaryInsStaffName',
        },
        {
            title: '点评ins',
            dataIndex: 'commentsStaffName',
            key: 'commentsStaffName',
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: '操作',
            dataIndex: 'dddd',
            key: 'dddd',
            render: (text, record) => {
                return (
                    <Link to={`${Routes.随堂反馈管理查看.link}${CommonUtils.stringify({ id: record.commentsId })}`}>
                        <button className='gym-button-xs gym-button-default' >
                            查看
                        </button>
                    </Link>
                )
            }
        }
    ];
    static 'feedbacknew' = [// 随堂反馈2.0
        {
            title: '操作日期',
            dataIndex: 'feedBackTime',
            key: 'feedBackTime',
            render: (text) => text ? moment(text).format('YYYY-MM-DD'): '-'
        }, {
            title: '课程代码（学阶)',
            dataIndex: 'courseCode',
            key: 'courseCode',
        },
        {
            title: '课程时间',
            dataIndex: 'courseDate',
            key: 'courseDate',
            render: (text, record) => <span>{moment(record.courseDate).format('YYYY-MM-DD')} {record.courseStartDate}</span>
        }, {
            title: '主教',
            dataIndex: 'primaryInsStaffName',
            key: 'primaryInsStaffName',
        },
        {
            title: '点评ins',
            dataIndex: 'feedBackStaffName',
            key: 'feedBackStaffName',
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: '操作',
            dataIndex: 'dddd',
            key: 'dddd',
            render: (text, record) => {
                return (
                    <Link to={`${Routes.随堂反馈管理查看新.link}${CommonUtils.stringify({ id: record.feedBackId })}`}>
                        <button className='gym-button-xs gym-button-default' >
                            查看
                        </button>
                    </Link>
                )
            }
        }
    ];
    static 'renew'=[// 续约跟进

        {
            title: '续约沟通',
            dataIndex: 'contactDate',
            key: 'contactDate',
            render:(text)=>(moment(text).format('YYYY-MM-DD')),
        }, {
            title: '续约状态',
            dataIndex: 'renewStatus',
            key: 'renewStatus',
            render:(text,record)=>(parseCodeToName(reNewStatus,text)),
        },
        {
            title: '续约意向',
            dataIndex: 'renewIntention',
            key: 'renewIntention',
        }, {
            title: '续约备注',
            dataIndex: 'renewComment',
            key: 'renewComment',
        },
    ];
    static 'recommend'=[// 热心推荐

        {
            title: '推荐时间',
            dataIndex: 'recommendDate',
            key: 'recommendDate',
            render:(text)=>(moment(text).format('YYYY-MM-DD')),
        }, {
            title: '推荐Leads',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: '状态',
            dataIndex: 'leadsStatus',
            key: 'leadsStatus',
            render:(text)=>(text && leadsStatusCode[text.toString()])
        }, {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
    ];
    static 'package'=[// 课程包结束
        {
            title: '合同编号',
            dataIndex: 'contractCode',
            key: 'contractCode',
        }, {
            title: '课程包名称',
            dataIndex: 'packageName',
            key: 'packageName',
        },
        {
            title: '签约',
            dataIndex: 'signTime',
            key: 'signTime',
            render:(text)=>(text && moment(text).format('YYYY-MM-DD'))
        }, {
            title: '合同到期',
            dataIndex: 'endTime',
            key: 'endTime',
            render:(text)=>(text && moment(text).format('YYYY-MM-DD'))
        },
        {
            title: '实际完成',
            dataIndex: 'endTime',
            key: 'endTime',
            render:(text)=>(text && moment(text).format('YYYY-MM-DD'))
        }, {
            title: '结束原因',
            dataIndex: 'endCause',
            key: 'endCause',
        },
    ];
    // 测评报告
    static 'testRecord' = [
        {
            title: '操作日期',
            dataIndex: 'assessDate',
            key: 'assessDate',
            render:(text)=>(text && moment(text).format('YYYY-MM-DD'))
        }, {
            title: '操作人',
            dataIndex: 'assessStaff',
            key: 'assessStaff',
        },
        {
            title: '学阶',
            dataIndex: 'signTime',
            key: 'signTime',
            render:(text,record) => {
                return <div>{record.courseCode}（{record.beginMonth}-{record.endMonth}个月）</div>
            }
        }, {
            title: 'GB',
            dataIndex: 'gbName',
            key: 'gbName',
        }, {
            title: '操作',
            dataIndex: 'endCause',
            key: 'endCause',
            render:(text, record) => {
                return (
                    <Link to={`${Routes.测评报告详情.link}${CommonUtils.stringify({ id: record.reportId})}`}>
                        {
                            isExist(`${FUNC[`到访测评`]}`) &&
                            <button className='gym-button-xs gym-button-default' >
                                查看
                            </button>
                        }
                    </Link>
                )
            }
        },
    ];
    static 'monthlyList' = [ // 月度回顾
        {
            title: '日期',
            dataIndex: 'feedbackTime',
            key: 'feedbackTime',
            render: (text) => text ?  moment(text).format('YYYY-MM-DD') : '-'
        },
        {
            title: '宝宝名',
            dataIndex: 'babyAllName',
            key: 'babyAllName',
        },
        {
            title: '月龄',
            dataIndex: 'monthValue',
            key: 'monthValue',
        },
        {
            title: '操作',
            dataIndex: 'dddd',
            key: 'dddd',
            render: (text, record) => {
                return (
                    <Link to={`${Routes.月度回顾管理查询.link}${CommonUtils.stringify({ monthlyFeedbackId: record.monthlyFeedbackId })}`}>
                        <button className='gym-button-xs gym-button-default' >
                            查看
                        </button>
                    </Link>
                )
            }
        }
    ];
    static 'badgeList' = [ // 徽章记录
        {
            title: '徽章获取月份',
            dataIndex: 'feedbackTime',
            key: 'feedbackTime',
            render: (text) => moment(text).format('YYYY-MM')
        },
        {
            title: '宝宝姓名',
            dataIndex: 'babyAllName',
            key: 'babyAllName',
        },
        {
            title: '徽章名称',
            dataIndex: 'badgeValue',
            key: 'badgeValue',
        },
    ];
    static 'promotionReport' = [ // 升班报告
        {
            title: '日期',
            dataIndex: 'reportTime',
            key: 'reportTime',
            render: (text) => text ?  moment(text).format('YYYY-MM-DD') : '-'
        },
        {
            title: '宝宝名',
            dataIndex: 'babyName',
            key: 'babyName',
        },
        {
            title: '课程代码',
            dataIndex: 'courseCode',
            key: 'courseCode',
        },
        {
            title: '操作',
            dataIndex: 'dddd',
            key: 'dddd',
            render: (text, record) => {
                if(record.reportId){
                    return (
                        <Link to={`${Routes.升班报告管理查询.link}${CommonUtils.stringify({ reportId: record.reportId, babyId: record.babyId })}`}>
                            <button className='gym-button-xs gym-button-default' >
                                查看
                            </button>
                        </Link>
                    )
                }else {
                    return (
                        <Link to={`${Routes.升班报告管理查询.link}${CommonUtils.stringify({ babyId: record.babyId, courseCode: record.courseCode })}`}>
                            <button className='gym-button-xs gym-button-default' >
                                预览
                            </button>
                        </Link>
                    )
                }
            }
        }
    ];
}
export {tableHeader}
