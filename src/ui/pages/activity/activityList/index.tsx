/**
 * desc: 活动列表
 * User: Vicky.Yu
 * Date: 2018/12/11
 * Time: 上午11:50
 */
import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {message} from 'antd';
import {TablePagination} from "@/ui/component/tablePagination";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from '@/ui/component/searchForm';
import {connect} from "@/common/decorator/connect";
import {User} from "@/common/beans/user";
import {form} from "@/common/decorator/form";
import {Routes} from "@/router/enum/routes";
import {getActivityData, getdeleteActivity} from "@redux-actions/activity/activityDataList";
import {selectApprovalPermission} from "@/saga/selectors/home";
import moment from 'moment';
import {getActivityTypeDef} from "@redux-actions/activity/activityDetail";
import {ConfirmCheck} from "../components/deletePop";
import "./style/index.scss";
import {CommonUtils} from "@/common/utils/commonUtils";

const mapStateToProps = state => {
    const {activityData} = state.activityList;
    const {
        types,  // 各种类型值
    } = state.activityDetail;
    const {
        teachingActivityType,        // 教学活动类型
        approvalStatusTeach,        // 审批状态
    } = types;

    return {
        activityData,
        teachingActivityType,
        approvalStatusTeach,
        approvalPermisson: selectApprovalPermission(state)
    }
};

@form()
@connect(mapStateToProps, {getActivityData, getActivityTypeDef, getdeleteActivity})
// 表格数据
class ActivityList extends Component<any, any> {
    // 面包屑
    private breadCrumRoutes: Array<any> = [{
        name: '活动',
        path: '',
        link: '#',
        id: ''
    }, {
        name: '活动管理',
        path: '',
        link: '#',
        id: ''
    }, {
        name: '活动列表',
        path: '',
        link: '#',
    }];

    constructor(props) {
        super(props);
        this.state = {
            currentCenterId: User.currentCenterId,
            pageNo: 1,
            pageSize: 10,
            sortName: 'activity.CREATE_DATE',
            sortOrder: 'DESC',
            id: "",
            code: "", // 活动编号
            type: "", // 活动类型
            theme: "", // 活动名称
            startDate: "", // 活动日期
            body: {},
            auditStatus: "",// 审批状态
        }
    }

    onSearch = (values: any) => {
        this.setState(
            {
                ...values,
                pageNo: 1,
                pageSize: this.state.pageSize
            },
            () => {
                this.handleSearch(values);
            });
    };
    // 高级搜索
    handleSearch = (body: any = {}) => {
        const {pageSize, pageNo, sortName, sortOrder} = this.state;
        const {startDate, auditStatus, theme, type, code} = body;
        const params = {
            pageNo,
            currentCenterId: User.currentCenterId,
            pageSize,
            code,
            type,
            theme,
            startDate: startDate ? startDate.valueOf() : null,   // 活动日期
            auditStatus,
            sortName : sortName === 'createDate' ? 'activity.CREATE_DATE' : sortName ? sortName : null,
            sortOrder: sortOrder === 'descend' ? 'DESC' : sortOrder === 'ascend' ? 'ASC' : null
        };
        this.setState(
            {body},
            () => {
                this.props.getActivityData(Object.assign({}, {pageNo: 1}, params));
            })
    };
    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo: any) => {
        this.setState(pageInfo, () => {
            this.handleSearch(this.state.body);
        });
    };

    componentDidMount() {
        this.handleSearch({});
        this.props.getActivityTypeDef({ currentCenterId: User.currentCenterId})
    };

    /**
     * 删除活动
     */
    deleteAcivity = (params: any) => {
        getdeleteActivity({id: params.id, currentCenterId: User.currentCenterId}).then((res: any) => {
            this.handleSearch({pageNo: this.state.pageNo})
        });
        message.success('删除成功')
    };
    /**
     * 搜索条件配置
     * @returns {Array<any>}
     */
    activityListItem = ():Array<any> => {
        const {teachingActivityType, approvalStatusTeach} = this.props;
        const actApprovalStatus = approvalStatusTeach.map((item: any) => ({
            postCode: item.code,
            postName: item.codeValue
        }));
        const activityType = teachingActivityType.map((item: any) => ({postCode: item.code, postName: item.codeValue}));
        return [
            {
                type: 'text',
                label: '活动名称',
                name: 'theme',
                placeholder: '请输入'
            },
            {
                type: 'datesPicker',
                label: '活动日期',
                name: 'startDate'
            },
            {
                type: 'select',
                label: '审批状态',
                name: 'auditStatus',
                options: actApprovalStatus,
                placeholder: '请选择'
            },
            {
                type: 'text',
                label: '活动编号',
                name: 'code',
                placeholder: '请输入'
            },
            {
                type: 'select',
                label: '活动类型',
                name: 'type',
                options: activityType,
                placeholder: '请选择'
            },

        ];
    };
    /**
     *
     * @returns {({title: string; dataIndex: string; key: string} | {title: string; dataIndex: string; key: string; render: (text) => any} | {title: string; dataIndex: string; key: string; render: (text: number) => string} | {title: string; dataIndex: string; key: string; render: (text: number) => string} | {title: string; dataIndex: string; key: string; render: (text, record: any) => any} | {title: string; dataIndex: string; key: string; render: (text, record) => (any | any | any | any)})[]}
     */
    activityColumns = (sortName, sortOrder) => {
        const {teachingActivityType, approvalStatusTeach, approvalPermisson} = this.props;
        return [{
                title: '活动名称',
                dataIndex: 'theme',
                key: 'theme',
            }, {
                title: '活动编号',
                dataIndex: 'teachingActivityCode',
                key: 'teachingActivityCode',
            }, {
                title: '活动类型',
                dataIndex: 'type',
                key: 'type',
                render: (text) => {
                    const res = teachingActivityType.filter((item: any) => item.code === text);
                    return res.length > 0 ? res[0].codeValue : '-';
                }
            }, {
                title: '活动日期',
                dataIndex: 'startDate',
                key: 'startDate',
                render: (text: number) => moment(text).format("YYYY-MM-DD")
            }, {
                title: '创建人',
                dataIndex: 'createByName',
                key: 'createByName',
            }, {
                title: '创建日期',
                dataIndex: 'createDate',
                key: 'createDate',
                sorter:true,
                sortOrder: sortName === 'createDate' && sortOrder,
                render: (text: number) => moment(text).format("YYYY-MM-DD")
            }, {
                title: '审批状态',
                dataIndex: 'approvalStatus',
                key: 'approvalStatus',
                render: (text, record: any) => {
                    const res = approvalStatusTeach.filter((item: any) => item.code === text);
                    return (
                        <div className="activity-approval-status">
                            <span className={record.approvalStatus === '32001' ? 'activity-colorGray' : record.approvalStatus === '32002' ? 'activity-colorRed' : 'activity-colorGreen'}/>
                            <span>{res.length > 0 ? res[0].codeValue : '-'}</span>
                        </div>
                    )
                }
            }, {
                title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                render: (text, record) => {
                    record.params = CommonUtils.stringify({id: record.id})
                    if (record.approvalStatus === '32001') { // 待审批
                        if (approvalPermisson.memberActivityApproval) {
                            return (
                                <div>
                                    <a target={`_blank`} href={`${Routes.编辑活动.link}/${record.params}`}>
                                        <button className="gym-button-xxs gym-button-white">查看</button>
                                    </a>
                                    <Link to={`${Routes.审批活动.link}/${record.params}`}>
                                        <button className="gym-button-xxs gym-button-white">审批</button>
                                    </Link>
                                </div>
                            )
                        } else {
                            return (
                                <div>
                                    <a target={`_blank`} href={`${Routes.编辑活动.link}/${record.params}`}>
                                        <button className="gym-button-xxs gym-button-white">查看</button>
                                    </a>
                                </div>
                            )
                        }

                    } else if (record.approvalStatus === '32002') { // 未通过
                        return (
                            <div>
                                <a target={`_blank`} href={`${Routes.编辑活动.link}/${record.params}`}>
                                    <button className="gym-button-xxs gym-button-white">查看</button>
                                </a>
                                <ConfirmCheck button={'删除'} item={record} ensure={this.deleteAcivity}/>
                            </div>
                        )
                    } else return ( // 已通过
                        <div>
                            <Link target={`_blank`} to={`${Routes.编辑活动.link}/${record.params}`}>
                                <button className="gym-button-xxs gym-button-white">查看</button>
                            </Link>
                            {
                                <Link to={`${Routes.活动签到.link}/${record.params}`}>
                                    <button className="gym-button-xxs gym-button-white">签到</button>
                                </Link>
                            }

                        </div>
                    )

                }
            }];

    };
    /**
     * 排序
     */
    handleTableSort = (pagination,filters,sort) => {
        const sortInfo = {
            sortName: sort.columnKey || '',
            sortOrder: sort.order,
        };
        this.setState({
            sortName: sortInfo.sortName,
            sortOrder: sortInfo.sortOrder,
        }, () => this.handleSearch(this.state.body));
    };
    /**
     * 操作按钮
     */
    render() {
        const {form, activityData} = this.props;
        const {pageNo, pageSize, sortName, sortOrder} = this.state;
        return (
            <div id="activity-list">
                {/* 面包屑 */}
                <BreadCrumb routes={this.breadCrumRoutes}/>
                <div className="page-wrap">
                    {/* 搜索框 */}
                    <SearchForm items={this.activityListItem()} form={form} onSearch={this.onSearch}/>
                    {/* 新建 */}
                    <Link target={`_blank`} to={Routes.编辑活动.link}>
                        <button className="gym-button-default gym-button-sm market-list-add mb20"> + 创建活动</button>
                    </Link>
                    {/* table表格 */}
                    <TablePagination
                        columns={this.activityColumns(sortName, sortOrder)}
                        dataSource={activityData ? activityData.list : []}
                        rowKey={`id`}
                        totalSize={activityData ? activityData.totalSize:null}
                        pageNo={pageNo}
                        pageSize={pageSize}
                        handleChangePage={this.handleChangePage}
                        handleFilterTableChange={this.handleTableSort}

                    />
                </div>
            </div>
        )
    }
}

export default ActivityList;
