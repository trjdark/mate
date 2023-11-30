/**
*Desc: 历史名单不同状态table head
*User: Debby.Deng
*Date: 2018/11/6,
*Time: 下午2:47
*/
import moment from 'moment';
import {Link} from 'react-router-dom';
import {recycleType} from "../../enum/assign";
import {Button} from "antd";
import * as React from "react";
import {CustomerRoutes} from "@/router/enum/customerRoutes";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {transferSort} from '../../enum/history';
import {Icon} from "@/ui/component/icon";
import {Tooltip} from "@/ui/component/toolTip";

function getLoseCourse(text,record){
    let content='';
    recycleType.map((item)=>{
        if(item.value===text){
            content=item.name;
        }
    });
    return content;
}
class tableHeader {
    static 'loss'=[ // leads流失
        {
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
            width:'15%',
            render: (text, record) =>
                <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} target='_blank' className='cDefault'>
                    {text}
                </Link>
        }, {
            title: '月龄',
            dataIndex: 'monthValue',
            key: 'monthValue',
        },
        {
            title: '创建',
            dataIndex: 'createDate',
            key: 'createDate',
            render:(text)=>(!!text && moment(text).format('YYYY-MM-DD'))
        }, {
            title: '分配',
            dataIndex: 'distributeDate',
            key: 'distributeDate',
            render:(text)=>(!!text && moment(text).format('YYYY-MM-DD'))

        },
        {
            title: '流失',
            dataIndex: 'loseDate',
            key: 'loseDate',
            render:(text)=>(!!text && moment(text).format('YYYY-MM-DD'))
        }, {
            title: '原GB',
            dataIndex: 'beforeGbStaffName',
            key: 'beforeGbStaffName',
        },
        {
            title: '去向',
            dataIndex: 'loseCause',
            key: 'loseCause',
            render:getLoseCourse,
        }
    ];
   static 'transfer'=[//leads转移
        {
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
            width:'15%',
            render: (text, record) =>
                <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} target='_blank' className='cDefault'>
                    {text}
                </Link>
        }, {
            title: '月龄',
            dataIndex: 'monthValue',
            key: 'monthValue',
        },
        {
            title: '创建时间',
            dataIndex: 'createDate',
            key: 'createDate',
            render:(text)=>(!!text && moment(text).format('YYYY-MM-DD'))

        }, {
            title: '分配时间',
            dataIndex: 'distributeDate',
            key: 'distributeDate',
           render:(text)=>(!!text && moment(text).format('YYYY-MM-DD'))

       },
        {
            title: '转移时间',
            dataIndex: 'transferDate',
            key: 'transferDate',
            render:(text)=>(!!text && moment(text).format('YYYY-MM-DD'))

        }, {
            title: '原GB',
            dataIndex: 'beforeGbStaffName',
            key: 'beforeGbStaffName',
        },
        {
            title: '现GB',
            dataIndex: 'gbStaffName',
            key: 'gbStaffName',
        }
    ];
    static 'disContact'=[//长期未联系
        {
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
            width:'15%',
            render: (text, record) =>
                <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} target='_blank' className='cDefault'>
                    {text}
                </Link>
        }, {
            title: '月龄',
            dataIndex: 'monthValue',
            key: 'monthValue',
        },
        {
            title: '创建',
            dataIndex: 'createDate',
            key: 'createDate',
            render:(text)=>(!!text && moment(text).format('YYYY-MM-DD'))

        }, {
            title: '分配',
            dataIndex: 'distributeDate',
            key: 'distributeDate',
            render:(text)=>(!!text && moment(text).format('YYYY-MM-DD'))

        },
        {
            title: '回收',
            dataIndex: 'recycleDate',
            key: 'recycleDate',
            render:(text)=>(!!text && moment(text).format('YYYY-MM-DD'))

        }, {
            title: '回收原因',
            dataIndex: 'recycleCause',
            key: 'recycleCause',
        },
        {
            title: '原GB',
            dataIndex: 'gbStaffName',
            key: 'gbStaffName',
        }
    ];
    static 'unSign'=tableHeader.disContact;//未签约
    static 'unReceive'=tableHeader.disContact;//待领取
    static 'customerTransfer'=[//会员转移
        {
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
            width:'15%',
            render: (text, record) =>
                <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} target='_blank' className='cDefault'>
                    {text}
                </Link>
        }, {
            title: '月龄',
            dataIndex: 'monthValue',
            key: 'monthValue',
        },
         {
            title: '上次分配时间',
            dataIndex: 'distributeDate',
            key: 'distributeDate',
            render:(text)=>(!!text && moment(text).format('YYYY-MM-DD'))

        },
        {
            title: '转移时间',
            dataIndex: 'transferDate',
            key: 'transferDate',
            render:(text)=>(!!text && moment(text).format('YYYY-MM-DD'))

        },
        {
            title: '原GB',
            dataIndex: 'beforeGbStaffName',
            key: 'beforeGbStaffName',
        },
        {
            title: '现GB',
            dataIndex: 'gbStaffName',
            key: 'gbStaffName',
        },
        {
            title: '原GA',
            dataIndex: 'beforeGaStaffName',
            key: 'beforeGaStaffName',
        },
        {
            title: '现GA',
            dataIndex: 'gaStaffName',
            key: 'gaStaffName',
        },
    ];
    static 'courseClose'=(sortedInfo:{sortName:string,sort:string})=>{
        return [//课程包结束
            {
                title: '宝宝姓名',
                dataIndex: 'babyName',
                key: 'babyName',
                width:'10%',
                render: (text, record) =>
                    <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} target='_blank' className='cDefault'>
                        {text}
                    </Link>
            }, {
                title: '月龄',
                dataIndex: 'babyMonth',
                key: 'babyMonth',
            },
            {
                title: '课程包名称',
                dataIndex: 'packageName',
                key: 'packageName',
                width:'10%'
            }, {
                title: '签约时间',
                dataIndex: 'signTime',
                key: 'signTime',
                render:(text)=>(!!text && moment(text).format('YYYY-MM-DD'))

            },
            {
                title: '合同到期日',
                dataIndex: 'endTime',
                key: 'endTime',
                render:(text)=>(!!text && moment(text).format('YYYY-MM-DD')),
                sorter:true,
                sortOrder:sortedInfo && sortedInfo.sortName==='endTime' && transferSort[sortedInfo.sort],
            },
            {
                title: '结束时间',
                dataIndex: 'accountEndTime',
                key: 'accountEndTime',
                render:(text)=>(!!text && moment(text).format('YYYY-MM-DD')),
                sorter:true,
                sortOrder:sortedInfo && sortedInfo.sortName==='accountEndTime' && transferSort[sortedInfo.sort],
            }, {
                title: '结束原因',
                dataIndex: 'endCause',
                key: 'endCause',
            },
            {
                title: '历史合约数',
                dataIndex: 'historyNum',
                key: 'historyNum',
            },
            {
                title: 'GB',
                dataIndex: 'gbStaffName',
                key: 'gbStaffName',
            },
            {
                title: 'GA',
                dataIndex: 'gaStaffName',
                key: 'gaStaffName',
            },
            {
                title: '客户360',
                dataIndex: 'customer360',
                key: 'customer360',
                render: (text,record)=>(<a target={`_blank`}
                                           href={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`}>
                    <Button className='gym-button-white-xxs'>查看</Button>
                </a>)
            },
        ];
    };
    static  'unContact'=tableHeader.disContact;//未联系
    static 'recycle'=[//手动回收站
        {
            title: '宝宝姓名',
            dataIndex: 'babyName',
            render: (text, record) => (
                <div>
                    {record.tmkLock
                        ?
                        <Tooltip title={record.message}>
                            <Icon type="suo" className='cDefault mr10'/>
                            <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} target='_blank' className='cDefault'>
                                {text}
                            </Link>
                        </Tooltip>
                        :
                        <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} target='_blank' className='cDefault'>
                            {text}
                        </Link>
                    }
                </div>
            )
        }, {
            title: '月龄',
            dataIndex: 'monthValue',
            key: 'monthValue',
        }, {
            title: '出现方式',
            dataIndex: 'appearance',
            key: 'appearance',
        }, {
            title: '获取日期',
            dataIndex: 'createDate',
            key: 'createDate',
            render:(text)=>(!!text && moment(text).format('YYYY-MM-DD'))

        }, {
            title: '回收日期',
            dataIndex: 'recycleDate',
            key: 'recycleDate',
            render:(text)=>(!!text && moment(text).format('YYYY-MM-DD'))

        }, {
            title: '回收原因',
            dataIndex: 'recycleCause',
            key: 'recycleCause',
            render:getLoseCourse,
        }, {
            title: '原GB',
            dataIndex: 'gbStaffName',
            key: 'gbStaffName',
        },{
            title: '操作人',
            dataIndex: 'excutor',
            key: 'excutor',
        },
    ]

}
export {tableHeader}
