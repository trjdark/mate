/**
 * desc: 渠道日志
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2019/5/22
 * Time: 上午9:38
 */
import React from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {PageTitle} from "@/ui/component/pageTitle";
import {Table} from "@/ui/component/tablePagination";
import {CommonUtils} from "@/common/utils/commonUtils";
import {getInfo} from "@redux-actions/customer/channelLogs";
import {User} from "@/common/beans/user";
import moment from 'moment';
import {Popover} from 'antd';

class ChannelLogs extends React.Component<any, any>{
    breadItems = [
        {name: '客户', path: '', link: '#', id: 'customer'},
        {name: '客户360', path: '', link: '#', id: 'customer360'},
        {name: '渠道日志', path: '', link: '#', id: 'channelLogs'},
    ];
    columns = [
        {
            title: '导入时间',
            dataIndex: 'importDate',
            width: 120,
            render:(date:number) => date && moment(date).format('YYYY-MM-DD')
        },
        {
            title: '获取时间',
            dataIndex: 'inquireDate',
            width: 120,
            render:(date:number) => date && moment(date).format('YYYY-MM-DD')
        },
        {
            title: '月龄',
            dataIndex: 'monthValue',
            width: 100,
        },
        {
            title: '接待GB',
            dataIndex: 'primaryGb',
            width: 160,
        },
        {
            title: '接待GA',
            dataIndex: 'primaryGa',
            width: 160,
        },
        {
            title: '详情',
            dataIndex: 'remark',
            width: 200,
            render: (text:string, record:any) => (
                <Popover placement="left" title={this.detail(record)} trigger="hover">
                    <div title={text} className='gym-channel-remark cDefault'>查看详情</div>
                </Popover>
            )
        },
    ];
    leadsId:string;
    constructor(props:any){
        super(props)
        if(CommonUtils.hasParams(props)){
            this.leadsId = CommonUtils.parse(props).leadsId;
        }
        this.state = {
            logs: [],
            channelTypes: [],
            appearanceTypes: []
        }
    }
    componentDidMount(){
        const body = {
            currentCenterId: User.currentCenterId,
            leadsId:this.leadsId
        }
        getInfo(body)
            .then((res:any) => {
                this.setState({
                    logs: res.logs,
                    channelTypes: res.channelTypes,
                    appearanceTypes: res.appearanceTypes
                })
            })
    }
    detail = (record:any) => {
        return (
            <div className="gym-channel-remark-pop">
                <div className="gym-channel-remark-pop-title">详情</div>
                <div className="gym-channel-remark-pop-row">
                    <div className="gym-channel-remark-pop-row-item">
                        <span className="gym-channel-remark-pop-row-label">出现方式：</span>
                        <span className="gym-channel-remark-pop-row-content">{record.appearanceType}</span>
                    </div>
                    <div className="gym-channel-remark-pop-row-item">
                        <span className="gym-channel-remark-pop-row-label">渠道来源：</span>
                        <span className="gym-channel-remark-pop-row-content">{record.channelType}</span>
                    </div>
                </div>
                <div className="gym-channel-remark-pop-row">
                    <div className="gym-channel-remark-pop-row-item">
                        <span className="gym-channel-remark-pop-row-label">宝宝姓名：</span>
                        <span className="gym-channel-remark-pop-row-content">{record.babyName}</span>
                    </div>
                    <div className="gym-channel-remark-pop-row-item">
                        <span className="gym-channel-remark-pop-row-label">宝宝生日：</span>
                        <span className="gym-channel-remark-pop-row-content">{record.birthday}</span>
                    </div>
                </div>
                <div className="gym-channel-remark-pop-row">
                    <div className="gym-channel-remark-pop-row-item long">
                        <span className="gym-channel-remark-pop-row-label">Promotor：</span>
                        <span className="gym-channel-remark-pop-row-content">{record.promoterName}</span>
                    </div>
                </div>
                <div className="gym-channel-remark-pop-row">
                    <div className="gym-channel-remark-pop-row-item long">
                        <span className="gym-channel-remark-pop-row-label">市场渠道编号：</span>
                        <span className="gym-channel-remark-pop-row-content">{record.marketingActivityCode}</span>
                    </div>
                </div>
                <div className="gym-channel-remark-pop-row">
                    <div className="gym-channel-remark-pop-row-item long">
                        <span className="gym-channel-remark-pop-row-label">渠道备注：</span>
                        <span className="gym-channel-remark-pop-row-content">{record.channelRemark}</span>
                    </div>
                </div>
                <div className="gym-channel-remark-pop-row">
                    <div className="gym-channel-remark-pop-row-item long">
                        <span className="gym-channel-remark-pop-row-label">联系人备注：</span>
                        <span className="gym-channel-remark-pop-row-content">{record.contactRemark}</span>
                    </div>
                </div>
            </div>
        )
    };
    render(){
        const {logs} = this.state;
        return(
            <div>
                <BreadCrumb routes={this.breadItems}/>
                <div className='page-wrap'>
                    <PageTitle title={'渠道日志'}/>
                    <Table
                        columns={this.columns}
                        dataSource={logs}
                        rowKey={'order'}
                    />
                </div>
            </div>
        )
    }
}

export {ChannelLogs}
