/**
 * desc: 市场渠道
 * User: Vicky.yu@gymboglobal.com
 * Date: 2018/11/22
 * Time: 下午1:38
 */
import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {message} from 'antd';
import {TablePagination} from '@/ui/component/tablePagination';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from '@/ui/component/searchForm';
import {connect} from "@/common/decorator/connect";
import {getMarketData, getdeleteMarketPost} from "@redux-actions/market/marketList";
import {marketDataList} from "@/saga/selectors/customer/marketList"
import {selectApprovalPermission} from "@/saga/selectors/home";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";
import {User} from "@/common/beans/user";
import {approvalStatusEnum} from '../enum/index'
import moment from 'moment';
import {ConfirmCheck} from "@/ui/component/confirmCheck";
import './style/index.scss';
import {requirePermission} from "@/router/enum/routeFuncIdMap";

// 表格数据
@connect(
    (state: any) => ({marketDataList: marketDataList(state), approvePermission: selectApprovalPermission(state)}),
    {getMarketData, getdeleteMarketPost}
)

class MarketList extends Component<any, any> {
    // 面包屑
    private breadCrumRoutes: Array<any> = [{
        name: '市场渠道',
        path: '',
        link: '#',
        id: ''
    }, {
        name: '市场渠道列表',
        path: '',
        link: '#',
        id: ''
    }];

    constructor(props) {
        super(props);
        this.state = {
            id: "", // 市场渠道id
            currentCenterId: User.currentCenterId,
            pageNo: 1,
            pageSize: 10,
            code: "", // 市场渠道编号
            theme: "", // 渠道名称
            startDate: "", // 开始时间
            endDate: "", // 结束时间
            createBy: "", // 创建人
            approvalStatus: "", // 审批状态
            editPermission: requirePermission('新建市场渠道')(),   // 用户是否有新建和编辑的权限
        }
    }

    onSearch = (values: any) => {
        this.setState({
            ...values,
            pageNo: 1,
            pageSize: this.state.pageSize
        });
        this.handleSearch(values);
    };
    // 高级搜索
    handleSearch = (body: any) => {
        const params = {
            pageNo: 1,
            id: this.state.id,
            pageSize: this.state.pageSize,
            code: this.state.code, // 市场渠道编号
            currentCenterId: User.currentCenterId,
            theme: this.state.theme, // 渠道名称
            startDate: body.duringDate != undefined ? body.duringDate[0].format('YYYY-MM-DD') : undefined, // 开始时间
            endDate: body.duringDate != undefined ? body.duringDate[1].format('YYYY-MM-DD') : undefined, // 结束时间
            createBy: this.state.createBy, // 创建人
            approvalStatus: this.state.approvalStatus, // 审批状态
        };
        this.props.getMarketData(Object.assign({}, params, body));
    };
    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo: any) => {
        this.setState(pageInfo);
        this.handleSearch(pageInfo);
    };

    componentDidMount() {
        this.handleSearch({})
    };

    deleteMarket = (params: any) => {
        getdeleteMarketPost({id: params.id, currentCenterId: User.currentCenterId,}).then((res: any) => {
            this.handleSearch({pageNo: this.state.pageNo})
        });
        message.success('删除成功!')
    };

    formatDate = (start, end) => {
        const startDate = CommonUtils.transferDate(start);
        const endDate = CommonUtils.transferDate(end);
        return (<span>{startDate} ~ {endDate}</span>)
    };

    render() {
        const {marketDataList, approvePermission} = this.props;
        const {pageNo, pageSize, editPermission} = this.state;
        const {permission} = editPermission;
        const marketListItem:any = [
            {
                type: 'text',
                label: '市场渠道名称',
                name: 'theme',
                placeholder: '渠道名称',
            },
            {
                type: 'text',
                label: '市场渠道编号',
                name: 'code',
                placeholder: '编号',

            },
            {
                type: 'select',
                label: '审批状态',
                name: 'approvalStatus',
                options: approvalStatusEnum,
            },
            {
                type: 'text',
                label: '创建人',
                name: 'createBy',
                placeholder: '中文名',
            },
            {
                type: 'rangePicker',
                label: '开始与结束日期',
                name: 'duringDate',
            },
        ];

        // 表格表头
        const marketColumns: any = [{
            title: '市场渠道编号',
            dataIndex: 'code',
            key: 'code',
        }, {
            title: '市场渠道名称',
            dataIndex: 'theme',
            key: 'theme',
        }, {
            title: '开始与结束日期',
            dataIndex: '',
            key: 'duringDate',
            render: (text: string, record: any) => (this.formatDate(record.startDate, record.endDate))
        }, {
            title: '创建人',
            dataIndex: 'createBy',
            key: 'createBy',
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (text: number) => moment(text).format("YYYY-MM-DD")
        }, {
            title: '审批状态',
            dataIndex: 'approvalStatus',
            key: 'approvalStatus',
            render: (text, record: any) => {
                return (
                    <div className="market-approval-status">
                        <span
                            className={record.approvalStatus === '待审批' ? 'market-colorGray' : record.approvalStatus === '未通过' ? 'market-colorRed' : 'market-colorGreen'}/>
                        <span>{record.approvalStatus}</span>
                    </div>
                )
            }
        },
            {
                title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                render: (text, record) => {
                    record.params = CommonUtils.stringify({id: record.id});
                    if (record.approvalStatus === '待审批') {
                        if (approvePermission.marketingActivityApproval) {
                            return (
                                <div>
                                    <Link
                                        to={{
                                            pathname: `${Routes.市场渠道明细.link}/${record.params}`,
                                            state: {isApprove: true}
                                        }}
                                    >
                                        <button className="gym-button-xxs gym-button-white">审批</button>
                                    </Link>
                                    <Link to={`${Routes.市场渠道明细.link}/${record.params}`}>
                                        <button className="gym-button-xxs gym-button-white">查看</button>
                                    </Link>
                                </div>
                            )
                        }
                        return (
                            <div>
                                <Link to={`${Routes.市场渠道明细.link}/${record.params}`}>
                                    <button className="gym-button-xxs gym-button-white">查看</button>
                                </Link>
                            </div>
                        )
                    } else if (record.approvalStatus === '未通过') {
                        return (
                            <div>
                                <Link to={`${Routes.市场渠道明细.link}/${record.params}`}>
                                    <button className="gym-button-xxs gym-button-white">查看</button>
                                </Link>
                                {
                                    permission ? (
                                        <Link to={`${Routes.编辑市场渠道.link}/${record.params}`}>
                                            <button className="gym-button-xxs gym-button-white">编辑</button>
                                        </Link>
                                    ) : null
                                }
                                <ConfirmCheck button='删除' item={record} ensure={this.deleteMarket}/>
                            </div>
                        )
                    } else {
                        return (
                            <div>
                                <Link to={`${Routes.市场渠道明细.link}/${record.params}`}>
                                    <button className="gym-button-xxs gym-button-white">查看</button>
                                </Link>
                                {
                                    permission ? (
                                        <Link to={`${Routes.编辑市场渠道.link}/${record.params}`}>
                                            <button className="gym-button-xxs gym-button-white">编辑</button>
                                        </Link>
                                    ) : null
                                }
                            </div>
                        )
                    }
                }
            },
        ];
        return (
            <div id="market-list">
                {/* 面包屑 */}
                <BreadCrumb routes={this.breadCrumRoutes}/>
                <div id={`market-list-content`} className="page-wrap">
                    {/* 搜索框 */}
                    <SearchForm items={marketListItem} onSearch={this.onSearch}/>
                    {/* 新建 */}
                    {
                        permission ? (
                            <Link to={Routes.编辑市场渠道.link}>
                                <button className="gym-button-default gym-button-xs market-list-add mb20"> + 新建</button>
                            </Link>
                        ) : null
                    }
                    {/* table表格 */}
                    <TablePagination
                        columns={marketColumns}
                        rowKey={`id`}
                        dataSource={marketDataList.list}
                        totalSize={marketDataList.totalSize}
                        pageSize={pageSize}
                        pageNo={pageNo}
                        handleChangePage={this.handleChangePage}
                    />
                </div>
            </div>
        )
    }
}

export default MarketList;
