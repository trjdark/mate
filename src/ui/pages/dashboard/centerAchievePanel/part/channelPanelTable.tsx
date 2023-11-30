/**
 * desc: 渠道面板表格
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/8/2
 * Time: 下午5:27
 */
import React, {Fragment, Component} from 'react';
import {Table} from "@/ui/component/tablePagination";
import {Icon} from "@/ui/component/icon";
import {PageTitle} from "@/ui/component/pageTitle";
import {Link} from 'react-router-dom';
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";

declare interface ChannelPanelTableProps {
    dataSource:Array<any>
    emitGetData:(type) => void
}

class ChannelPanelTable extends Component <ChannelPanelTableProps, any>{
    /**
     * 刷新数据
     */
    refresh = () => {
        this.props.emitGetData('channel');
    };
    columns = () => [
        {
            title: (
                <div className="gym-dashboard-table-first-th">
                    <PageTitle title='本月渠道跟进' className='mr15 p0'/>
                    <Icon type='qiehuangongsi' className='c999' onClick={() => this.refresh()}/>
                </div>
            ),
            className: 'text-l bgColor',
            dataIndex: 'type',
            fixed: 'left',
            width: 235,
            render: (text, record) => <span className={`${record.children ? 'fontBold' : ''}`}>
                {text}
            </span>

        },{
            title: (
                <Fragment>
                    <p className='text-c'>Leads数</p>
                </Fragment>
            ),
            width: 100,
            dataIndex: 'leads',
            render: (text, record) => <span className={`${record.children ? 'fontBold' : ''}`}>
                {CommonUtils.formatThousand(text)}
            </span>

        },{
            title: (
                <Fragment>
                    <p className='text-c'>OPP数</p>
                </Fragment>
            ),
            width: 100,
            dataIndex: 'opp',
            render: (text, record) => <span className={`${record.children ? 'fontBold' : ''}`}>
                {CommonUtils.formatThousand(text)}
            </span>

        },{
            title: (
                <Fragment>
                    <p className='text-c'>签单数</p>
                </Fragment>
            ),
            width: 100,
            dataIndex: 'sign',
            render: (text, record) => <span className={`${record.children ? 'fontBold' : ''}`}>
                {CommonUtils.formatThousand(text)}</span>

        },{
            title: (
                <Fragment>
                    <p className='text-c'>业绩收入</p>
                </Fragment>
            ),
            width: 100,
            dataIndex: 'amount',
            render: (text, record) => <span className={`${record.children ? 'fontBold' : ''}`}>{CommonUtils.formatThousand(text)}</span>
        },{
            title: (
                <Fragment>
                    <p className='text-c'>待分配</p>
                </Fragment>
            ),
            width: 100,
            dataIndex: 'toAllocate',
            render: (text, record) => (
                <Link className='fontBold' to={`${Routes.分配客户.link}/${CommonUtils.stringify({
                                                                            phaseId: '1',
                                                                            appearanceType: record.appearanceType,
                                                                            channelType: record.channelType
                                                                        })}`}>
                    {CommonUtils.formatThousand(text)}
                </Link>
            )
        },{
            title: (
                <Fragment>
                    <p className='text-c'>已分配</p>
                    <p className='text-c'>未领取</p>
                </Fragment>
            ),
            width: 100,
            dataIndex: 'allocateNoReceive',
            render: (text, record) => (
                <Link className='fontBold' to={`${Routes.分配客户.link}/${CommonUtils.stringify({
                                                                            phaseId: '2',
                                                                            appearanceType: record.appearanceType,
                                                                            channelType: record.channelType
                                                                        })}`}>
                    {CommonUtils.formatThousand(text)}
                </Link>
            )
        },{
            title: (
                <Fragment>
                    <p className='text-c'>已领取</p>
                    <p className='text-c'>待联络</p>
                </Fragment>
            ),
            width: 100,
            dataIndex: 'receiveNoContact',
            render: (text, record) => (
                <Link className='fontBold' to={`${Routes.分配客户.link}/${CommonUtils.stringify({
                                                                            phaseId: '3',
                                                                            appearanceType: record.appearanceType,
                                                                            channelType: record.channelType
                                                                        })}`}>
                    {CommonUtils.formatThousand(text)}
                </Link>
            )
        }
    ];
    render(){
        const {dataSource} = this.props;
        return (
            <Fragment>
                <Table
                    className='gym-dashboard-table mb25'
                    dataSource={dataSource}
                    columns={this.columns()}
                    rowKey={(record) => `${record.id}_${record.type}`}
                    rowClassName='text-c'
                    scroll={{x : 'max-content', y : 400}}
                />
            </Fragment>
        )
    }
}

export {ChannelPanelTable}
