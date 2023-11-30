/**
 * desc: 部分退费
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2023/8/16
 * Time: 18:15
 */
import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {message} from 'antd';
import moment from "moment";
import {TablePagination} from "@/ui/component/tablePagination";
import {SearchForm} from "@/ui/component/searchForm";
import {getPartRefundList, approvePartRefund} from "@redux-actions/payOrReceiveContract";
import {connect} from "@/common/decorator/connect";
import {
    selectContractReturnStatus, selectExpireContractTypes,
    selectContractPartRefundTypes
} from "@/saga/selectors/contract";
import {User} from "@/common/beans/user";
import {CommonUtils} from "@/common/utils/commonUtils";
import {Routes} from "@/router/enum/routes";
import history from "@/router/history";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {ConfirmCheck} from "@/ui/component/confirmCheck";
import {Message} from "@/ui/component/message/message";
import {exportContractPartRefundListFromCenter} from "@redux-actions/contract";

@connect((state:any) => ({
    returnApprovalStatusList: selectContractReturnStatus(state),
    expireContractStatus: selectExpireContractTypes(state),
    partRefundStatus:selectContractPartRefundTypes(state),
}))
class ContractActionListPartRefund extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            searchOption : {
                pageNo: 1,
                pageSize: 10,
                babyName: "",             // 宝宝姓名
                contractCode: "",                 // 合同编号
                approvalStatus: null,             // 审批状态
                contactName: "",           // 联系人姓名
                approvalStartDate:null,
                approvalEndDate:null,
                currentCenterId: User.currentCenterId
            },
            contractReturnDate:{},          // 请假列表对象
            visible: false,
            id: '',
            contractId: ''
        }
    }

    componentDidMount() {
        this.handleSearch({})
    }
    /**
     * 搜索条件
     * @param 搜索
     */
    onSearch = (values:any) => {
        this.setState({ searchOption: Object.assign({}, this.state.searchOption, {
                ...values,
                approvalStartDate:values.approvalDate != null ? values.approvalDate[0].startOf('day').valueOf() : null,
                approvalEndDate:values.approvalDate != null ? values.approvalDate[1].endOf('day').valueOf() : null,
                pageNo:1,
                pageSize:this.state.searchOption.pageSize,
            })});

        let postData = {
            ...values,
            approvalStartDate:values.approvalDate != null ? values.approvalDate[0].startOf('day').valueOf() : null,
            approvalEndDate:values.approvalDate != null ? values.approvalDate[1].endOf('day').valueOf() : null,
            pageNo:1,
            pageSize:this.state.searchOption.pageSize,
        };
        this.handleSearch(postData);
    };
    /**
     * 获取
     * @param body
     */
    handleSearch = (body:any = {}) => {
        if(body.approvalEndDate < body.approvalStartDate){
            message.error('请选择正确的起始结束时间！');
            return false
        }
        const params = Object.assign({}, this.state.searchOption, {pageNo:1})
        getPartRefundList(Object.assign({}, params, body))
            .then((res:any) => {
                this.setState({contractReturnDate: res})
            })
    };

    /**
     * 合同分页搜索搜索
     * @param pageInfo
     */
    handleChangePage = (pageInfo:any) => {
        this.setState({searchOption: Object.assign({}, this.state.searchOption, pageInfo)});
        this.handleSearch(pageInfo);
    };

    /**
     *检查状态
     */
    checkStatus = (record:any, name: 'view' | 'edit' | 'approve') => {

        history.push(`${Routes.合同操作详情部分退费.link}${CommonUtils.stringify({
            id:record.id,
            contractId:record.contractId,
            contractCode: record.contractCode,
            status: name
        })}`)
    };

    /**
     * 显示操作
     */
    renderAction =(node:any) => {
        return (
            <Fragment>
                {
                    (node.partRefundStatus === '1206001' &&  User.permissionList.includes(FUNC['部分退费-中心财务审批']))
                        ? <Fragment>
                            <Link to={`${Routes.合同操作详情部分退费.link}${CommonUtils.stringify({id:node.id, contractId: node.contractId, contractCode: node.contractCode})}`}>
                                <button className="gym-button-xxs gym-button-white mr5" >
                                    审批
                                </button>
                            </Link>
                            <ConfirmCheck
                                item={node}
                                button='拒绝'
                                ensure={this.cancel}
                                contentText='是否拒绝此申请？'
                            />
                        </Fragment>
                        :
                        <Link to={`${Routes.合同操作详情部分退费.link}${CommonUtils.stringify({id:node.id, contractId: node.contractId, contractCode:node.contractCode})}`}>
                            <button className="gym-button-xxs gym-button-white mr5" >
                                查看
                            </button>
                        </Link>
                }
            </Fragment>
        )
    };
    /**
     * 搜索配置
     * @returns {Array<any>}
     */
    searchConfig = ():Array<any> => {
        const { partRefundStatus} = this.props;
        const newApprovalStatusList = (partRefundStatus || []).map((item:any) => ({postCode: item.code, postName: item.codeValue}))
        return [
            {
                type: 'text',
                label: '宝宝姓名',
                name: 'babyName',
                placeholder: '请输入'
            },{
                type: 'text',
                label: '合同编号',
                name: 'contractCode',
                placeholder: '请输入'
            },{
                type: 'select',
                label: '审批状态',
                name: 'approvalStatus',
                options: newApprovalStatusList,
                placeholder: '请选择'
            },{
                type: 'rangePicker',
                label: '审批日期',
                name:  'approvalDate'
            }
        ];
    };
    /**
     * 表头配置
     * @returns {({title: string; dataIndex: string; key: string; width: number} | {title: string; dataIndex: string; key: string; width: number; render: (num: number) => string} | {title: string; dataIndex: string; key: string; width: number; render: (text: string, record: any) => any} | {title: string; dataIndex: string; key: string; width: number; render: (text: string, record: any) => (string | string)} | {title: string; dataIndex: string; key: string; align: string; width: number; render: (text: string, record: any, index: number) => any})[]}
     */
    columns = () => {
        return [{
            title: '宝宝姓名',
            dataIndex: 'customerName',
        }, {
            title: '合同编号',
            dataIndex: 'contractCode',
        }, {
            title: '课程包',
            dataIndex: 'centerPackageName',
        }, {
            title: '部分退费正课',
            dataIndex: 'partRefundCourseNum',
        }, {
            title: '部分退费赠课',
            dataIndex: 'partRefundFreeCourseNum',
        }, {
            title: '部分退费金额',
            dataIndex: 'partRefundCoursePrice',
        },{
            title: '审批状态',
            dataIndex: 'approvalStatus',
        }, {
            title: '审批日期',
            dataIndex: 'approvalDate',
            render: (text:number) => text ? moment(text).format("YYYY-MM-DD") : '-'
        }, {
            title: '付款状态',
            dataIndex: 'paymentStatus',
        }, {
            title: 'GB',
            dataIndex: 'gbName',
        },{
            title: 'GA',
            dataIndex: 'gaName',
        },{
            title: '操作',
            dataIndex: 'action',
            align: 'left',
            width: 200,
            render: (text: string, record: any) => this.renderAction(record)
        }];
    };
    /**
     * 拒绝部分审批
     * @param record
     */
    cancel = (record) => {
        const param = {
            id: record.id,
            contractId: record.contractId,
            approvalType: 0,
            currentCenterId: User.currentCenterId,
            approvalFlag: 0,
        };
        approvePartRefund(param).then((res) => {
            Message.success('操作成功！', 3, () => {
                this.handleSearch({})
            })
        });
    };
    handleExport = () => {
        const params = this.state.searchOption;
        exportContractPartRefundListFromCenter(params);
    }
    render() {
        const {searchOption, contractReturnDate} = this.state;

        return (
            <div className='page-wrap mt2 gym-contract-operation-tab-content'>
                <SearchForm items={this.searchConfig()}
                            onSearch={this.onSearch}
                />
                <div className="mb25 ml25">
                    <button className="gym-button-default gym-button-xs" onClick={this.handleExport}>导出</button>
                </div>
                <TablePagination
                    columns={this.columns()}
                    rowKey={'id'}
                    dataSource={contractReturnDate.list || []}
                    totalSize={contractReturnDate.totalSize}
                    pageSize={searchOption.pageSize}
                    handleChangePage={this.handleChangePage}
                    pageNo={searchOption.pageNo}
                    scroll={{x : 'max-content'}}
                />
            </div>
        )
    }
}

export {ContractActionListPartRefund}
