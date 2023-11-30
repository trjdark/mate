/**
 * desc: 会员耗课
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/8/2
 * Time: 下午5:28
 */
import React, {Fragment, Component} from 'react';
import {Table} from "@/ui/component/tablePagination";
import {Icon} from "@/ui/component/icon";
import {PageTitle} from "@/ui/component/pageTitle";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";
import {Link} from 'react-router-dom';
import {Tooltip} from "antd";

declare interface ConsumePanelTableProps {
    dataSource:Array<any>
    emitGetData:(type:string) => void
}

class ConsumePanelTable extends Component <ConsumePanelTableProps, any>{
    /**
     * 刷新数据
     */
    refresh = () => {
        this.props.emitGetData('consume');
    };
    columns = () => [
        {
            title: (
                <div className="gym-dashboard-table-first-th">
                    <PageTitle title='本月会员耗课' className='mr15 p0'/>
                    <Icon type='qiehuangongsi' className='c999' onClick={() => this.refresh()}/>
                </div>
            ),
            dataIndex: 'staffName',
            className: 'text-l bgColor',
            fixed: 'left',
            width: 235,
            render: (text, record) => <span className={`${record.children ? 'fontBold' : ''}`}>{text}</span>
        },{
            title: (
                <Fragment>
                    <p className='text-c'>已耗课时数</p>
                    <p className='text-c'>（课程+活动）</p>
                </Fragment>
            ),
            width: 100,
            dataIndex: 'lessonConsume',
            render: (text, record) => <span className={`${record.children ? 'fontBold' : ''}`}>{CommonUtils.formatThousand(text)}</span>

        },{
            title: (
                <Fragment>
                    <p className='text-c'>课程耗课</p>
                    <p className='text-c'>频次</p>
                </Fragment>
            ),
            width: 100,
            dataIndex: 'lessonCostFrequency',
            render: (text, record) => <span className={`${record.children ? 'fontBold' : ''}`}>{text}</span>

        },{
            title: (
                <Fragment>
                    <p className='text-c'>有效</p>
                    <p className='text-c'>会员数</p>
                </Fragment>
            ),
            width: 100,
            dataIndex: 'effectiveMember',
            render: (text, record) => <span className={`${record.children ? 'fontBold' : ''}`}>{CommonUtils.formatThousand(text)}</span>

        },{
            title: (
                <Fragment>
                    <p className='text-c'>活跃</p>
                    <p className='text-c'>会员数</p>
                </Fragment>
            ),
            width: 100,
            dataIndex: 'activeMember',
            render: (text, record) => <span className={`${record.children ? 'fontBold' : ''}`}>{CommonUtils.formatThousand(text)}</span>

        },{
            title: (
                <Tooltip
                    title='该数据为截止到昨天的数据'
                >
                    <div className='gym-dashboard-table-flex-th'>
                        <div>
                            <p className='text-c'>待续</p>
                            <p className='text-c'>会员</p>
                        </div>
                        <Icon className='ml5' type="wenti"/>
                    </div>
                </Tooltip>
            ),
            width: 100,
            dataIndex: 'waitRenewMember',
            render: (text, record) => (
                <Link className='fontBold' to={`${Routes.分配客户.link}/${CommonUtils.stringify({
                                                                            phaseId: '9',
                                                                            postName:record.postName,
                                                                            staffId: record.staffId
                                                                        })}`}>
                    {CommonUtils.formatThousand(text)}
                </Link>
            )
        },{
            title: (
                <Fragment>
                    <p className='text-c'>班容</p>
                </Fragment>
            ),
            width: 100,
            dataIndex: 'classCapacity',
            render: (text, record) => <span className={`${record.children ? 'fontBold' : ''}`}>{text}</span>

        },
    ];
    render(){
        const {dataSource} = this.props;
        return (
            <Fragment>
                <Table
                    className='gym-dashboard-table mb25'
                    dataSource={dataSource}
                    columns={this.columns()}
                    rowKey={(record) => `${record.id}_${record.staffId}`}
                    rowClassName='text-c'
                    scroll={{x : 'max-content', y : 400}}
                />
            </Fragment>
        )
    }
}

export {ConsumePanelTable}
