/**
 * desc: 部分退费申请列表
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2023/8/17
 * Time: 16:49
 */
import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {Routes} from "@/router/enum/routes";
import {SearchForm} from "@/ui/component/searchForm";
import {TablePagination} from "@/ui/component/tablePagination";
import {getPartRefundListFromHQ, exportPartRefundListForCenter} from "@redux-actions/contractRevise";
import {User} from "@/common/beans/user";
import {connect} from "@/common/decorator/connect";
import {selectContractPartRefundTypes} from "@/saga/selectors/contract";
import {CommonUtils} from "@/common/utils/commonUtils";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import moment from 'moment';
import {BreadCrumb} from "@/ui/component/breadcrumb";


@connect((state:any) => ({
    partRefundStatusList: selectContractPartRefundTypes(state),
}))
class ContractRevisionRefundList extends React.Component <any, any> {
    private routes:Array<any> = [
        {name: '合同调整', path: '', link: '#', id: 'contractRevision'},
        {name: '部分退费-总部财务审批', path: '', link: '#', id: 'partRefund'}
    ];
    constructor(props){
        super(props)
        this.state = {
            pageNo: 1,
            pageSize: 10,
            totalSize: 0,
            dataSource: [],
        }
    }
    componentDidMount(){
        this.queryDate();
    }

    /**
     * 获取数据
     */
    queryDate = () => {
        const {
            pageNo ,pageSize,
            babyName, centerCode, contractCode,
            approveStatus, approvalStartDate, approvalEndDate,
        } = this.state;
        const param = Object.assign({}, {
            pageNo, pageSize, babyName, contractCode, approveStatus,
            approvalStartDate, approvalEndDate, centerCode,
            currentCenterId: User.currentCenterId,
        });
        getPartRefundListFromHQ(param).then(res => {
            this.setState({
                dataSource: res.list,
                totalSize:res.totalSize
            })
        })

    };
    /**
     * 搜索配置
     * @returns {({type: string; label: string; name: string; placeholder: string} | {type: string; label: string; name: string; options: any; placeholder: string} | {type: string; label: string; name: {start: string; end: string}})[]}
     */
    searchConfig = () => {
        const {partRefundStatusList} = this.props;
        return [
            {
                type: 'text',
                label: '中心号',
                name: 'centerCode',
                placeholder: '请输入'

            },
            {
                type: 'text',
                label: '宝宝姓名',
                name: 'babyName',
                placeholder: '请输入'

            },
            {
                type: 'text',
                label: '合同编号',
                name: 'contractCode',
                placeholder: '请输入'
            },
            {
                type: 'select',
                label: '审批状态',
                name: 'approveStatus',
                options: partRefundStatusList
                    .map(item => ({postCode:item.code, postName:item.codeValue})),      // 不包含审批中，流程取消两个状态
                placeholder: '请选择'
            },
            {
                type: 'dates',
                label: '审批日期',
                name: {
                    start: 'approvalStartDate',
                    end: 'approvalEndDate'
                }
            },
        ];
    };
    /**
     * 判断状态
     */
    formatReviseStatus = (status:string):string => {
        const {partRefundStatusList} = this.props;
        const res = (partRefundStatusList || []).filter(item => item.code === status);
        return res.length > 0 ? res[0].codeValue : '';

    };
    /**
     * 表头设置
     * @returns {({title: string; dataIndex: string} | {title: string; dataIndex: string; render: (status: string) => any} | {title: string; dataIndex: string; render: (status: string) => any} | {title: string; dataIndex: string; render: (time: number) => string} | {title: string; dataIndex: string; render: (text, record) => (string | any)})[]}
     */
    columnsConfig = () => {
        const {partRefundStatusList} = this.props;
        return [
            {
                title: '中心号',
                dataIndex: 'centerCode'
            },
            {
                title: '宝宝姓名',
                dataIndex: 'customerName'
            },
            {
                title: '合同编号',
                dataIndex: 'contractCode'
            },
            {
                title: '课程包',
                dataIndex: 'centerPackageName'
            },
            {
                title: '部分退费正课',
                dataIndex: 'partRefundCourseNum'
            },
            {
                title: '部分退费赠课',
                dataIndex: 'partRefundFreeCourseNum'
            },
            {
                title: '部分退费金额',
                dataIndex: 'partRefundCoursePrice'
            },

            {
                title: '审批状态',
                dataIndex: 'approvalStatus',
            },
            {
                title: '付款状态',
                dataIndex: 'paymentStatus',
            },
            {
                title: '审批日期',
                dataIndex: 'approvalDate',
                render:(time:number) => time ? moment(time).format('YYYY-MM-DD') : '-',

            },
            {
                title: 'GB',
                dataIndex: 'gbName',
            },
            {
                title: 'GA',
                dataIndex: 'gaName',
            },
            {
                title: '操作',
                dataIndex: 'action',
                render: (text, record) => {
                    // 待审批单子，可以取消
                    const NONE_APPROVED = partRefundStatusList.filter(item => item.codeValue === '待总部财务审批')[0];
                    if(!NONE_APPROVED){
                        return '-'
                    }
                    return <Link to={`${Routes.部分退费详情.link}${CommonUtils.stringify({
                        id: record.id,
                        contractId: record.contractId,
                        contractCode: record.contractCode
                    })}`}>
                        <button className='gym-button-xxs gym-button-white'>{
                            (record.partRefundStatus === NONE_APPROVED.code || (
                                User.permissionList.includes(FUNC['部分退费-总部财务审批']) &&
                                this.formatReviseStatus(record.partRefundStatus) === '待总部财务审批'
                            ))
                                ? '审批'
                                : '查看'
                        }</button>
                    </Link>
                }
            },
        ];
    };
    /**
     * 搜索
     * @param arg
     */
    onSearch = (arg) => {
        this.setState({
            pageNo:1,
            ...arg
        }, this.queryDate);
    };
    /**
     * 导出
     */
    handleExport = () => {
        const {
            babyName, centerCode, contractCode,
            approveStatus, approvalStartDate, approvalEndDate,
        } = this.state;
        const param = Object.assign({}, {
            babyName, contractCode, approvalStartDate,
            approvalEndDate, centerCode, approveStatus,
            currentCenterId: User.currentCenterId,

        });
        exportPartRefundListForCenter(param, '部分退费列表')
    };
    /**
     * 分页
     * @param pageInfo
     */
    handleChangePage = (pageInfo) => {
        this.setState({
            pageNo: pageInfo.pageNo,
            pageSize: pageInfo.pageSize,
        }, this.queryDate);
    };
    render(){
        const {dataSource, pageNo, pageSize, totalSize} = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routes}/>
                <div className='page-wrap'>
                    <SearchForm
                        items={this.searchConfig()}
                        onSearch={this.onSearch}
                    />
                    <div className='mb15'>
                        <button className='gym-button-default-sm'
                                onClick={this.handleExport}
                        >导出</button>
                    </div>
                    <TablePagination
                        columns={this.columnsConfig()}
                        dataSource={dataSource}
                        pageNo={pageNo}
                        pageSize={pageSize}
                        totalSize={totalSize}
                        scroll={{x: 'max-content'}}
                        rowKey='id'
                        handleChangePage={this.handleChangePage}

                    />
                </div>
            </Fragment>
        )
    }
}

export {ContractRevisionRefundList}
