/**
 * desc: 合同调整申请
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/6/1
 * Time: 下午2:27
 */
import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {message} from 'antd';
import moment from "moment";
import {TablePagination} from "@/ui/component/tablePagination";
import {SearchForm} from "@/ui/component/searchForm";
import {
    getContractReviseListFromCenter,
    exportContractReviseListFromCenter,
    cancelContractRevise
} from "@redux-actions/contract";
import {connect} from "@/common/decorator/connect";
import {selectContractReturnStatus, selectContractReviseType, selectContractReviseStatus} from "@/saga/selectors/contract";
import {User} from "@/common/beans/user";
import {selectApprovalPermission} from "@/saga/selectors/home";
import {CommonUtils} from "@/common/utils/commonUtils";
import {Routes} from "@/router/enum/routes";
import {ConfirmCheck} from "@/ui/component/confirmCheck";
import {Message} from "@/ui/component/message/message";
import {FUNC} from "@/ui/pages/setting/enum/functions";

@connect((state:any) => ({
    returnApprovalStatusList: selectContractReturnStatus(state),
    approvalPermission: selectApprovalPermission(state),
    reviseTypes: selectContractReviseType(state),
    reviseStatus: selectContractReviseStatus(state),
}))
class ContractActionListSpecial extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            searchOption : {
                pageNo: 1,
                pageSize: 10,
                babyName: null,             // 宝宝姓名
                contractCode: null,         // 合同编号
                adjType: null,              // 调整类型
                contactName: null,          // 联系人姓名
                approvalStartTime:null,
                approvalEndTime:null,
                currentCenterId: User.currentCenterId
            },
            contractReturnDate:{},          //合同调整列表
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
                approvalStartTime:values.approvalDate != null ? values.approvalDate[0].startOf('day').valueOf() : null,
                approvalEndTime:values.approvalDate != null ? values.approvalDate[1].endOf('day').valueOf() : null,
                applyStartTime:values.applyDate != null ? values.applyDate[0].startOf('day').valueOf() : null,
                applyEndTime:values.applyDate != null ? values.applyDate[1].endOf('day').valueOf() : null,
                pageNo:1,
                pageSize:this.state.searchOption.pageSize,
            })}, () => {
            let postData = {
                ...values,
                approvalStartTime:values.approvalDate != null ? values.approvalDate[0].startOf('day').valueOf() : null,
                approvalEndTime:values.approvalDate != null ? values.approvalDate[1].endOf('day').valueOf() : null,
                applyStartTime:values.applyDate != null ? values.applyDate[0].startOf('fday').valueOf() : null,
                applyEndTime:values.applyDate != null ? values.applyDate[1].endOf('day').valueOf() : null,
                pageNo:1,
                pageSize:this.state.searchOption.pageSize,
            };
            this.handleSearch(postData);
        });
    };
    /**
     * 获取
     * @param body
     */
    handleSearch = (body:any = {}) => {
        if(body.approvalEndTime < body.approvalStartTime){
            message.error('请选择正确的起始结束时间！');
            return false
        }

        const params = Object.assign({}, this.state.searchOption, {pageNo:1})
        getContractReviseListFromCenter(Object.assign({}, params, body))
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
     * 关闭
     * @param pageInfo
     */
    onCancel = () => {
        this.setState({
            visible: false,
            id: '',
            contractId: '',
        })
    };

    /**
     *检查状态
     */
    checkStatusEdit = (record:any) => {

    };

    /**
     *检查状态
     */
    checkStatusView = (record:any) => {

    };
    /**
     * 取消
     * @param node
     */
    cancel = (node) => {
        const param = {
            id: node.id,
            currentCenterId: User.currentCenterId
        };
        cancelContractRevise(param).then(() => {
            Message.success('取消成功！', 3, () => {
                this.handleSearch({})
            })
        })
    }
    /**
     * 搜索配置
     * @returns {Array<any>}
     */
    searchConfig = ():Array<any> => {
        const {reviseTypes} = this.props;
        const newApprovalStatusList = reviseTypes.map((item:any) => ({postCode: item.code, postName: item.codeValue}))
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
                label: '调整类型',
                name: 'adjType',
                options: newApprovalStatusList,
                placeholder: '请选择'
            },{
                type: 'rangePicker',
                label: '审批日期',
                name:  'approvalDate'
            },
            {
                type: 'rangePicker',
                label: '申请日期',
                name:  'applyDate'
            }
        ];
    };
    /**
     * 格式化审批状态
     * @param {string} status
     * @returns {any}
     */
    formatReviseStatus = (status:string) => {
        const {reviseStatus} = this.props;
        const date = reviseStatus.filter(item => item.code === status);
        return date.length > 0 ? date[0].codeValue : '-';
    };
    /**
     * 表头配置
     * @returns {({title: string; dataIndex: string; key: string; width: number} | {title: string; dataIndex: string; key: string; width: number; render: (num: number) => string} | {title: string; dataIndex: string; key: string; width: number; render: (text: string, record: any) => any} | {title: string; dataIndex: string; key: string; width: number; render: (text: string, record: any) => (string | string)} | {title: string; dataIndex: string; key: string; align: string; width: number; render: (text: string, record: any, index: number) => any})[]}
     */
    columns = () => {
        const {reviseTypes, reviseStatus} = this.props;
        return [{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
            width: 120,
        }, {
            title: '合同编号',
            dataIndex: 'contractCode',
            key: 'contractCode',
            width: 150,
            render: (text, record) => (
                    <Link className='cDefault' target='_blank' to={`${Routes.合同详情.link}${CommonUtils.stringify({contractCode:record.contractCode, contractId:record.contractId})}`}>
                        {text}
                    </Link>
                )

        }, {
            title: '调整类型',
            dataIndex: 'adjType',
            width: 120,
            render:(type:string) => {
                const date = reviseTypes.filter(item => item.code === type);
                return date.length > 0 ? date[0].codeValue : '-';
            }
        }, {
            title: '调整正课',
            dataIndex: 'adjustCourseNum',
            width: 100,
        }, {
            title: '调整赠课',
            dataIndex: 'adjustFreeCourseNum',
            width: 100,
        }, {
            title: '调整金额',
            dataIndex: 'adjustCoursePrice',
            width: 120,
        }, {
            title: '审批日期',
            dataIndex: 'approvalTime',
            width: 140,
            render: (time:number) => time ? moment(time).format("YYYY-MM-DD"): '-'
        }, {
            title: '审批结果',
            dataIndex: 'adjStatus',
            width: 100,
            render:(status:string) => {
                const date = reviseStatus.filter(item => item.code === status);
                return date.length > 0 ? date[0].codeValue : '-';
            }
        },{
            title: '申请人',
            dataIndex: 'applyBy',
            width: 150,
        },{
            title: '申请日期',
            dataIndex: 'applyDate',
            width: 140,
            render: (time:number) => time ? moment(time).format("YYYY-MM-DD"): '-'
        }, {
            title: '操作',
            dataIndex: 'action',
            align: 'left',
            width: 140,
            render: (text: string, record: any) =>
                <Fragment>
                    {
                        (this.formatReviseStatus(record.adjStatus) === '待中心审批')
                        ? (
                                <Fragment>
                                    <Link to={`${Routes.合同操作详情调整.link}${CommonUtils.stringify({id: record.id})}`}>
                                        <button className="gym-button-xxs gym-button-white mr5" >
                                            {User.permissionList.includes(FUNC['中心财务审批']) ? '审批' : '查看'}
                                        </button>
                                    </Link>
                                    {
                                        User.userId === record.applyById &&
                                            <ConfirmCheck
                                                item={record}
                                                button='取消'
                                                ensure={this.cancel}
                                                contentText='是否取消次申请？'
                                            />
                                    }
                                </Fragment>
                        )
                        : (
                            <Link to={`${Routes.合同操作详情调整.link}${CommonUtils.stringify({id: record.id})}`}>
                                <button className="gym-button-xxs gym-button-white" >查看</button>
                            </Link>
                        )
                    }
                </Fragment>

        }];
    };
    /**
     * 导出
     */
    handleExport = () => {
        const params = this.state.searchOption;
        exportContractReviseListFromCenter(params);

    };
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

export {ContractActionListSpecial}
