/**
 * desc: 试听申请列表
 * User: colin.lu
 * Date: 2018/12/28
 * Time: 上午10:00
 */

import React from 'react';
import {Link} from "react-router-dom";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import {TablePagination} from "@/ui/component/tablePagination";
import {CommonUtils} from "@/common/utils/commonUtils";
import moment from 'moment';
import {Tabs, message} from "antd";
import {Routes} from "@/router/enum/routes";
import {anotherStatus, applyStatus,
} from "../enum/apply";
import FullScreen from '@/ui/pages/report/components/fullScreen';
import {User} from "@/common/beans/user";
import {exportMakeupList, getMakeupList} from "@redux-actions/teaching/applyManage";
import history from "../../../../router/history";
import {connect} from "@/common/decorator/connect";
import {selectApprovalPermission} from "@/saga/selectors/home";
import {FUNC} from "@/ui/pages/setting/enum/functions";

const TabPane = Tabs.TabPane;

const searchConfig:Array<any> = [
    {
        label: '宝宝姓名',
        required: false,
        type: 'text',
        placeholder: '请输入',
        name: 'babyName'
    }, {
        label: '试听日期',
        required: false,
        type: 'rangePicker',
        name: 'date'
    }, {
        label: '审批状态',
        required: false,
        type: 'select',
        name: 'status',
        placeholder: '请选择',
        options: applyStatus
    }, {
        label: '课程状态',
        required: false,
        type: 'select',
        name: 'attendanceStatus',
        placeholder: '请选择',
        options: anotherStatus
    }
];

@connect((state: any) => ({
    approvalPermission: selectApprovalPermission(state)
}))

class MakeupApply extends React.Component<any, any> {
    state = {
        table: {
            list: [],
            // 分页的数据
            pageNo: 1,
            pageSize: 10,
            totalSize: 0,
        },
        dataSource: [],
        pageNo: 1,
        pageSize: 10,
        totalNo: 0,
        totalSize: 0,
        // tab切换
        tabId: '1',
        defaultActiveKey: '1',
        activeKey: '1',
        status: null,
        babyName: null,
        date: null,
        previewDateBegin: '', // 试听日期筛选框开始
        previewDateEnd: '',   // 试听日期筛选框结束
        attendanceStatus: ''  // 课程状态
    };

    // 路由代码块
    private routes: Array<any> = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: 'teaching'
        }, {
            name: '申请管理',
            path: '',
            link: '#',
            id: 'contractManagement'
        }
    ];

    componentDidMount() {
        this.handleSearch({});
    }

    /**
     * 改变tab key
     */
    onChangeTab = (activeKey) => {
        if (activeKey === '1') {
        } else if (activeKey === '2') {
            history.push(Routes.请假申请.path)
        } else if (activeKey === '3') {
            history.push(Routes.gymguard.path)
        }
    };

    onCancel = () => {
        this.setState({
            visible: false,
            id: ''
        })
    };

    onOk = () => {
        this.setState({
            visible: false,
        });

    };

    /**
     * 查询列表
     */
    handleSearch = (body: any) => {
        this.setState({
            status: body.status ? body.status : null,
            previewDateBegin: body.date ? moment(body.date[0]).startOf('day').valueOf() : null,
            previewDateEnd: body.date ? moment(body.date[1]).endOf('day').valueOf() : null,
            babyName: body.babyName,
            attendanceStatus: body.attendanceStatus,
            pageNo: 1,
            pageSize: 10
        });

        const postData = {
            "babyName": body.babyName ? body.babyName : null,
            "currentCenterId": User.currentCenterId,
            "previewDateBegin": body.date ? moment(body.date[0]).startOf('day').valueOf() : null,
            "previewDateEnd": body.date ? moment(body.date[1]).endOf('day').valueOf() : null,
            "pageNo": 1,
            "pageSize": 10,
            "status": body.status ? body.status : null,
            "attendanceStatus": body.attendanceStatus
        };

        getMakeupList(postData).then(
            (res) => {
                this.setState({
                    dataSource: res.list,
                    pageNo: res.pageNo,
                    pageSize: res.pageSize,
                    totalNo: res.totalNo,
                    totalSize: res.totalSize,
                },()=>{
                })
            },
            (err) => {
                // 返回请求reject
                message.error(err.msg)
            })
    };

    /**
     * 查询
     */
    handleSearchApply = (values: any) => {
        this.handleSearch(values)
    };

    // 导出
    export = () => {
        const {babyName, previewDateBegin, previewDateEnd, status, attendanceStatus} = this.state;
        const postData = {
            babyName, previewDateBegin, previewDateEnd, status, attendanceStatus,
            currentCenterId: User.currentCenterId,
        };
        exportMakeupList(postData)
    }

    /**
     * 分页变化
     * @param pageInfo
     */
    handleChangePageApply = (pageInfo: any) => {
        this.setState({
            pageNo: pageInfo.pageNo,
            pageSize: pageInfo.pageSize,
        });

        const postData = {
            "babyName": this.state.babyName,
            "currentCenterId": User.currentCenterId,
            "previewDateBegin": this.state.previewDateBegin,
            "previewDateEnd": this.state.previewDateEnd,
            "pageNo": pageInfo.pageNo,
            "pageSize": pageInfo.pageSize,
            "status": this.state.status,
            "attendanceStatus": this.state.attendanceStatus
        };

        /**
         * 试听申请列表
         * @param someParam<>
         * @method post
         * @response  res<>
         */
        getMakeupList(postData).then(
            (res) => {
                this.setState({
                    dataSource: res.list,
                    pageNo: res.pageNo,
                    pageSize: res.pageSize,
                    totalNo: res.totalNo,
                    totalSize: res.totalSize,
                })
            },
            (err) => {
                // 返回请求reject
                message.error(err.msg)
            }
        )
    };

    /**
     * 权限控制
     * @param func key
     */
    isExist = (funcId) => {
        const permissionList = User.permissionList;
        return permissionList.includes(funcId)
    };

    columns = ()=>{
        const {approvalPermission} = this.props;
        return ([
            {
                title: '宝宝姓名',
                dataIndex: 'babyName',
                key: 'babyName',
            }, {
                title: '试听时间',
                dataIndex: 'previewTime',
                key: 'previewTime'
            }, {
                title: '试听课程',
                dataIndex: 'courseCode',
                key: 'courseCode'
            }, {
                title: '教室',
                dataIndex: 'classroom',
                key: 'classroom',
            }, {
                title: 'INS',
                dataIndex: 'ins',
                key: 'ins'
            }, {
                title: 'GB',
                dataIndex: 'gb',
                key: 'gb',
            }, {
                title: '审批状态',
                dataIndex: 'status',
                key: 'status',
                render(text: string, record: any) {
                    return (
                        <div className="activity-approval-status">
                            <span
                                className={record.status === '待审批' ? 'contract-colorGray' : record.status === '未通过' ? 'contract-colorRed' : 'contract-colorGreen'}>
                            </span>
                            <span>{text}</span>
                        </div>
                    )
                }
            }, {
                title: '课程状态',
                dataIndex: 'attendanceStatus',
                key: 'attendanceStatus'
            }, {
                title: '出现方式',
                dataIndex: 'appearanceType',
                key: 'appearanceType'
            }, {
                title: '渠道来源',
                dataIndex: 'channelType',
                key: 'channelType'
            }, {
                title: '签约状态',
                dataIndex: 'signStatus',
                key: 'signStatus'
            }, {
                title: '签约日期',
                dataIndex: 'signTime',
                key: 'signTime'
            }, {
                title: '审批时间',
                dataIndex: 'operateTime',
                key: 'operateTime',
                render(text) {
                    if (!text || text == null) {
                        return ''
                    } else {
                        return moment(text).format('YYYY-MM-DD HH:mm:ss');
                    }
                }
            }, {
                title: 'LeadsID',
                dataIndex: 'leadsId',
                key: 'leadsId'
            }, {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (text: string, record: any, index: number) => (
                    <div>
                        {
                            //审批人
                            (approvalPermission.previewApproval && record.status === '待审批') &&
                            <Link to={`${Routes.试听申请审批.link}${CommonUtils.stringify({
                                leadsId: record.leadsId,
                                id: record.id
                            })}`} className='span-link'>
                                <button className='gym-button-xxs gym-button-white'>审批</button>
                            </Link>
                        }
                        {
                            //已审批
                            (approvalPermission.previewApproval && (record.status === '未通过' || record.status === '已通过')) &&
                            <Link to={`${Routes.试听申请查看.link}${CommonUtils.stringify({
                                leadsId: record.leadsId,
                                id: record.id
                            })}`} className='span-link'>
                                <button className='gym-button-xxs gym-button-white'>查看</button>
                            </Link>
                        }
                        {
                            //其他人只有查看权限
                            (!approvalPermission.previewApproval && (record.status === '未通过' || record.status === '已通过' || record.status === '待审批')) &&
                            <Link to={`${Routes.试听申请查看.link}${CommonUtils.stringify({
                                leadsId: record.leadsId,
                                id: record.id
                            })}`} className='span-link'>
                                <button className='gym-button-xxs gym-button-white'>查看</button>
                            </Link>
                        }
                    </div>)
            }
        ])
    }

    render() {
        const {dataSource, pageNo, pageSize, totalSize} = this.state;
        return (
            <div id={`gym-contract-receive`}>
                <BreadCrumb routes={this.routes}/>
                <div className='gym-contract gym-apply-manage'>
                    <Tabs
                        defaultActiveKey={this.state.defaultActiveKey}
                        onChange={this.onChangeTab}
                        activeKey={this.state.activeKey}
                        type="card"
                        tabBarGutter={10}
                    >
                        {
                            this.isExist(`${FUNC[`试听申请`]}`) &&
                            <TabPane tab="试听申请" key="1">
                                <div className='page-wrap gym-apply-manage-tab-content'>
                                    <SearchForm
                                        items={searchConfig}
                                        onSearch={this.handleSearchApply}
                                    />
                                    <FullScreen
                                        handleDownLoadExcel={this.export}
                                        canDownload={dataSource && dataSource.length>0}
                                    >
                                        <TablePagination
                                            style={{marginTop: '-5px'}}
                                            columns={this.columns()}
                                            rowKey={'id'}
                                            dataSource={dataSource.length?dataSource:[]}
                                            totalSize={totalSize}
                                            pageSize={pageSize}
                                            handleChangePage={this.handleChangePageApply}
                                            pageNo={pageNo}
                                        />
                                    </FullScreen>
                                </div>
                            </TabPane>
                        }
                        {
                            this.isExist(`${FUNC[`请假申请`]}`) &&
                            <TabPane tab="请假申请" key="2">
                                <div>
                                </div>
                            </TabPane>
                        }
                        {
                            this.isExist(`${FUNC[`GYM Guard`]}`) &&
                            <TabPane tab="Gym Guard" key="3">
                                <div>
                                </div>
                            </TabPane>
                        }
                    </Tabs>
                </div>
            </div>
        )
    }
}

export {MakeupApply}
