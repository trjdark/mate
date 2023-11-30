/**
 * desc: 业绩面板表格
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/8/2
 * Time: 下午3:13
 */
import React, {Fragment, Component} from 'react';
import {Table} from "@/ui/component/tablePagination";
import {Icon} from "@/ui/component/icon";
import {PageTitle} from "@/ui/component/pageTitle";
import {Link} from 'react-router-dom';
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";

declare interface PerformancePanelTableProps {
    dataSource:Array<any>
    emitGetData:(type) => void
}

class PerformancePanelTable extends Component <PerformancePanelTableProps, any>{
    /**
     * 刷新数据
     */
    refresh = () => {
        this.props.emitGetData('performance');
    };
    columns = () => [
        {
            title: (
                <div className="gym-dashboard-table-first-th">
                    <PageTitle title='本月业绩' className='mr15 p0'/>
                    <Icon type='qiehuangongsi' className='c999' onClick={() => this.refresh()}/>
                </div>
            ),
            className: 'text-l bgColor',
            dataIndex: 'staffName',
            fixed: 'left',
            width: 235,
            render: (text, record) => <span className={`${record.children ? 'fontBold' : ''}`}>{text}</span>
        },{
            title: (
                <Fragment>
                    <p className='text-c'>业绩收入</p>
                    <p className='text-c'>（新合约+续约）</p>
                </Fragment>
            ),
            width: 120,
            dataIndex: 'performanceAmount',
            render: (text, record) => <span className={`${record.children ? 'fontBold' : ''}`}>{CommonUtils.formatThousand(text)}</span>
        },{
            title: (
                <Fragment>
                    <p className='text-c'>业绩指标</p>
                    <p className='text-c'>(完成率)</p>
                </Fragment>
            ),
            width: 100,
            dataIndex: 'personalTargetSalesStr',
            render:(text, record) => text === '未设目标'
                ? (<span className={`cError ${record.children ? 'fontBold' : ''}`}>{text}</span>)
                : (<span className={`${record.children ? 'fontBold' : ''}`}>{CommonUtils.formatThousand(text)}({record.completeRate})</span>)
        },{
            title: (
                <Fragment>
                    <p className='text-c'>净收入</p>
                </Fragment>
            ),
            width: 100,
            dataIndex: 'comeInAmount',
            render: (text, record) => <span className={`${record.children ? 'fontBold' : ''}`}>{CommonUtils.formatThousand(text)}</span>
        },{
            title: (
                <Fragment>
                    <p className='text-c'>新合约</p>
                    <p className='text-c'>业绩收入</p>
                </Fragment>
            ),
            width: 100,
            dataIndex: 'newMemberAmount',
            render: (text, record) => <span className={`${record.children ? 'fontBold' : ''}`}>{CommonUtils.formatThousand(text)}</span>
        },{
            title: (
                <Fragment>
                    <p className='text-c'>续约</p>
                    <p className='text-c'>业绩收入</p>
                </Fragment>
            ),
            width: 100,
            dataIndex: 'preMemberAmount',
            render: (text, record) => <span className={`${record.children ? 'fontBold' : ''}`}>{CommonUtils.formatThousand(text)}</span>
        },{
            title: (
                <Fragment>
                    <p className='text-c'>退费</p>
                    <p className='text-c'>金额</p>
                </Fragment>
            ),
            width: 100,
            dataIndex: 'returnAmount',
            render: (text, record) => <span className={`${record.children ? 'fontBold' : ''}`}>{CommonUtils.formatThousand(text)}</span>
        },{
            title: (
                <Fragment>
                    <p className='text-c'>有效电话量</p>
                    <p className='text-c'>（含云语音）</p>
                </Fragment>
            ),
            width: 100,
            dataIndex: 'validCallNum',
            render: (text, record) => <span className={`${record.children ? 'fontBold' : ''}`}>{CommonUtils.formatThousand(text)}</span>
        },{
            title: (
                <Fragment>
                    <p className='text-c'>本周</p>
                    <p className='text-c'>计划到访</p>
                </Fragment>
            ),
            width: 100,
            fixed: 'right',
            dataIndex: 'weekVisitNum',
            render: (text:number, record:any) => (
                <Link className='fontBold' to={`${Routes.中心业绩看板详情.link}${CommonUtils.stringify({type: 1, staffId: record.staffId})}`} target='_blank'>
                    {CommonUtils.formatThousand(text)}
                </Link>
            )
        },{
            title: (
                <Fragment>
                    <p className='text-c'>本月</p>
                    <p className='text-c'>计划到访</p>
                </Fragment>
            ),
            width: 100,
            fixed: 'right',
            dataIndex: 'monthVisitNum',
            render: (text:number, record:any) => (
                <Link className='fontBold' to={`${Routes.中心业绩看板详情.link}${CommonUtils.stringify({type: 2, staffId: record.staffId})}`} target='_blank'>
                    {CommonUtils.formatThousand(text)}
                </Link>
            )
        },{
            title: (
                <Fragment>
                    <p className='text-c'>本月</p>
                    <p className='text-c'>已到访</p>
                </Fragment>
            ),
            width: 100,
            fixed: 'right',
            dataIndex: 'monthVisitedNum',
            render: (text:number, record:any) => (
                <Link className='fontBold' to={`${Routes.中心业绩看板详情.link}${CommonUtils.stringify({type: 3, staffId: record.staffId})}`} target='_blank'>
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
                    rowKey='id'
                    rowClassName='text-c'
                    scroll={{x : 'max-content', y : 400}}
                />
            </Fragment>
        )
    }
}

export {PerformancePanelTable}
