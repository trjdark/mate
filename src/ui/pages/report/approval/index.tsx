/**
 * desc: 审批管理
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2022/2/23
 * Time: 下午6:00
 */
import React from 'react';
import moment from "moment";
import {SearchForm} from "@/ui/component/searchForm";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {TablePagination} from "@/ui/component/tablePagination";
import {getApprovalList, getApprovalDetail, updateApprovalDetail} from "../../../../redux-actions/report/approve";
import {User} from "@/common/beans/user";
import {connect} from "@/common/decorator/connect";
import {selectTotalEmployeeList} from "@/saga/selectors/home";
import {Modal} from 'antd';
import {PageTitle} from "@/ui/component/pageTitle";
import {Message} from "@/ui/component/message/message";
import {dateFields} from "@/ui/pages/customer/clientCenter/enum";
import {ConfirmCheck} from "@/ui/component/confirmCheck";
import {CommonUtils} from "@/common/utils/commonUtils";


const selectAllOption = {
    leaveDate: moment().subtract(0.5, 'y').startOf('days').valueOf(),
};

@connect((state) => ({
    allList: selectTotalEmployeeList(state, selectAllOption),
}), {})
class Approval extends React.Component<any, any> {
    private routes:Array<any> = [
        {
            name: "单中心报表",
            id: 'report'
        }, {
            name: "其他",
            id: 'other'
        },{
            name: '审批报表导出申请',
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
            applyInfo: {},
            promotorList: [],
            tmkList: [],
            packageList: []
        }
    }
    componentDidMount() {
        this.handleSearch();
    }
    searchItem = ():any => {
        const {allList} = this.props;
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
            }, {
                type: 'select',
                label: '申请事项',
                name: 'approvalItems',
                options:[{postCode:'1', postName: '数据导出'}],

            }, {
                type: 'select',
                label: '申请人',
                name: 'staffId',
                options: (allList || []).map(staff => ({postCode:staff.staffId, postName: `${staff.englishName} ${staff.chineseName}`})),
            },
        ];
    };
    columns = [
        {
            title: '申请中心',
            dataIndex: 'centerId',
        }, {
            title: '申请事项',
            dataIndex: 'approvalItems',
        }, {
            title: '申请人',
            dataIndex: 'approvalStaff',
        },{
            title: '角色',
            dataIndex: 'roleName',
        }, {
            title: '申请理由',
            dataIndex: 'approvalReason',
            width: 300
        }, {
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
                    <button className=" gym-button-xxs gym-button-white" onClick={()=>this.showDetail(record)}>{record.approvalStatus === '待审批' ? '审批' : '详情'}</button>
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
        let {
            pageNo, pageSize, createDateBegin, createDateEnd, approvalStatus, approvalItem, staffId
        } = this.state;
        createDateBegin = createDateBegin?moment(createDateBegin).valueOf():'';
        createDateEnd = createDateEnd?moment(createDateEnd).valueOf():'';
        getApprovalList({
            pageNo, pageSize,createDateBegin, createDateEnd, approvalStatus, approvalItem, staffId,
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
     * 关闭导出弹层
     */
    close = () => {
        this.setState({applyFlag: false})
    };
    /**
     * 审批
     * @param {boolean} flag
     */
    handleApprove = (id:string, flag:string) => {
        const param = {
            id:id,
            approvalStatus: flag,
            currentCenterId: User.currentCenterId
        }
        updateApprovalDetail(param).then((res) => {
            this.setState({
                applyFlag: false,
                applyInfo: {}
            }, () => {
                Message.success('审批成功！');
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
                            <div><span className='c333'>角色：</span>{CommonUtils.cutstr(applyInfo.roleName, 10) }</div>
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
                                            ensure={() => this.handleApprove(applyInfo.id, '1')}
                                            button={(
                                                <button className='gym-button-xs gym-button-default mr15'>审批通过</button>
                                            )}
                                            contentText="是否审批通过这条申请？"
                                        />
                                        <ConfirmCheck
                                            item={{}}
                                            ensure={() => this.handleApprove(applyInfo.id, '2')}
                                            button={(
                                                <button className='gym-button-xs gym-button-default'>拒绝</button>
                                            )}
                                            contentText="是否拒绝这条申请？"
                                        />

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

export {Approval}
