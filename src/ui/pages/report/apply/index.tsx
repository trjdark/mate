/**
 * desc: 申请管理
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2022/3/21
 * Time: 上午9:15
 */
import React from 'react';
import moment from "moment";
import {Link} from 'react-router-dom';
import {Modal} from 'antd';
import {PageTitle} from "@/ui/component/pageTitle";
import {SearchForm} from "@/ui/component/searchForm";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {TablePagination} from "@/ui/component/tablePagination";
import {getApplyList, getApprovalDetail, updateApprovalDetail} from "../../../../redux-actions/report/approve";
import {User} from "@/common/beans/user";
import {Message} from "@/ui/component/message/message";
import {Routes} from "@/router/enum/routes";
import {ConfirmCheck} from "@/ui/component/confirmCheck";
import {dateFields} from "@/ui/pages/customer/clientCenter/enum";
import {CommonUtils} from "@/common/utils/commonUtils";


class Apply extends React.Component<any, any> {
    private routes:Array<any> = [
        {
            name: "单中心报表",
            id: 'report'
        }, {
            name: "其他",
            id: 'other'
        },{
            name: '查看审批报表导出申请进度',
            path: '',
            link: '#',
            id: 'approval'
        }
    ];
    constructor(props: any) {
        super(props)
        this.state = {
            pageNo: 1,
            pageSize: 10,
            dataSource: [],
            totalSize: 0,
            applyFlag: false,
            applyInfo: {}
        }
    }
    componentDidMount() {
        this.handleSearch();
    }
    searchItem = ():any => {
        return [
            {
                type: 'dates',
                label: '申请日期',
                name: {
                    start: 'createDateBegin',
                    end: 'createDateEnd',
                },
            }, {
                type: 'select',
                label: '审批状态',
                name: 'approvalStatus',
                options:[
                    {postCode:'', postName: '全部'},
                    {postCode:'0', postName: '待审批'},
                    {postCode:'1', postName: '审批通过'},
                    {postCode:'2', postName: '未通过'},
                    {postCode:'3', postName: '已过期'},
                    {postCode:'4', postName: '已撤回'},
                ],
            },
        ];
    };
    columns = [
        {
            title: '申请中心',
            dataIndex: 'centerId',
        },
        {
            title: '申请事项',
            dataIndex: 'approvalItems',
        },
        {
            title: '申请人',
            dataIndex: 'approvalStaff',
        },{
            title: '角色',
            dataIndex: 'roleName',
        },
        {
            title: '申请理由',
            dataIndex: 'approvalReason',
            width: 300

        },
        {
            title: '申请日期',
            dataIndex: 'createDate',
        },
        {
            title: '审批状态',
            dataIndex: 'approvalStatus',
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <button className="gym-button-xxs gym-button-white mr5" onClick={()=>this.showDetail(record)}>{record.approvalStatus === '待审批' ? '撤回' : '详情'}</button>
                    <Link to={Routes.多中心导出下载.path}>
                        <button className=" gym-button-xs gym-button-white" >去下载</button>
                    </Link>
                </div>
            ),
        }];
    onSearch = (values) => {
        values.createDateBegin = values.createDateBegin && moment(values.createDateBegin).startOf('day').valueOf();
        values.createDateEnd = values.createDateEnd && moment(values.createDateEnd).endOf('day').valueOf();

        this.setState({
            ...values,
            pageNo: 1,
        }, this.handleSearch);
    };
    /**
     * 分页搜索
     * @param pageInfo
     */
    handleChangePage = (pageInfo: any) => {
        this.setState(pageInfo, this.handleSearch);
    };
    /**
     * 获取数据
     * @param body
     */
    handleSearch = () => {
        const {
            pageNo, pageSize, createDateBegin, createDateEnd, approvalStatus,
        } = this.state;

        getApplyList({
            pageNo, pageSize,createDateBegin, createDateEnd, approvalStatus,
            currentCenterId: User.currentCenterId,
        }).then((res:any) => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        });
    };
    /**
     * 查看详情
     */
    showDetail = (record:any) => {
        const param = {
            id: record.id,
            currentCenterId: User.currentCenterId,
        };
        getApprovalDetail(param).then((res) => {
            this.setState({
                applyFlag: true,
                applyInfo: res
            })
        })
    };
    /**
     * 撤回
     */
    recall = (record:any) => {
        const param = {
            id: record.id,
            currentCenterId: User.currentCenterId,
            approvalStatus: '4'
        };
        updateApprovalDetail(param).then((res) => {
            this.setState({
                applyFlag: false,
                applyInfo: {}
            }, () => {
                Message.success('撤回成功！');
                this.handleSearch();
            })

        })
    };
    /**
     * 字段转换位
     * @param {Array<any>} arr
     */
    selectDateFieldName = (arr:Array<any> = []) => {
        let result = [];
        result = [
            {label: '宝宝名', dataIndex: 'babyName'},
            {label: '昵称', dataIndex: 'nickname'},
            ...dateFields()
        ].filter((item) => arr.includes(item.dataIndex)).map(item => item.label);
        return result;
    };
    /**
     * 关闭
     */
    close = () => {
        this.setState({
            applyFlag: false,
            applyInfo: {}
        })
    }
    render(){
        const {dataSource, totalSize, pageSize, pageNo, applyFlag, applyInfo} = this.state;
        return(
            <div >
                <BreadCrumb routes={this.routes}/>
                <div className='text-r'>
                    功能需求反馈请邮件：<span className='cDefault'>mate.report@gymboglobal.com</span>，
                    本页使用说明请点击上方<span className='cDefault'>【帮助】</span>
                </div>
                <div className='page-wrap'>
                    <SearchForm items={this.searchItem()} onSearch={this.onSearch}/>
                    <TablePagination
                        columns={this.columns}
                        rowKey={'id'}
                        dataSource={dataSource}
                        totalSize={totalSize}
                        pageSize={pageSize}
                        handleChangePage={this.handleChangePage}
                        pageNo={pageNo}
                    />
                    <Modal
                        visible={applyFlag}
                        onCancel={this.close}
                        footer={false}
                    >
                        <PageTitle title='申请导出'/>
                        <div className='gym-client-center-export-modal-item'>
                            <div><span className='c333'>中文名：</span>{applyInfo.staffChineseName}</div>
                            <div><span className='c333'>英文名：</span>{applyInfo.staffEnglishName}</div>
                            <div><span className='c333'>角色：</span>{CommonUtils.cutstr(applyInfo.roleName, 10)}</div>
                        </div>
                        <div className='gym-client-center-export-modal-item'>
                            <div><span className='c333'>申请事项：</span>数据导出</div>
                        </div>
                        <div className='gym-client-center-export-modal-item'>
                            <div style={{width: '100%'}}><span className='c333'>查询条件：</span>{applyInfo.selectParams}</div>
                        </div>
                        <div className='gym-client-center-export-modal-item'>
                            <div><span className='c333'>涉及中心（1）：</span>{applyInfo.involveCId}</div>
                        </div>
                        <div className='gym-client-center-export-modal-item'>
                            <div style={{width: '100%'}}><span className='c333'>导出字段：</span>{this.selectDateFieldName(applyInfo.columns).join('/')}</div>
                        </div>
                        <div className='gym-client-center-export-modal-item block'>
                            <div><span className='c333'>审批状态：</span>{applyInfo.approvalStatus}</div>
                        </div>
                        <div className='gym-client-center-export-modal-item block'>
                            <div><span className='c333'>申请理由：</span>{applyInfo.approvalReason}</div>
                        </div>
                        {
                            applyInfo.approvalStatus === '待审批'
                                ?(
                                    <div className='text-c'>
                                        <ConfirmCheck
                                            item={{}}
                                            ensure={() => this.recall(applyInfo)}
                                            button={(
                                                <button className='gym-button-xs gym-button-default mr15'>撤回</button>
                                            )}
                                            contentText="是否撤回这条申请？"
                                        />
                                        <button className='gym-button-xs gym-button-default' onClick={this.close}>取消</button>

                                    </div>
                                )
                                : null

                        }

                    </Modal>
                </div>
            </div>
        )
    }
}

export {Apply}
