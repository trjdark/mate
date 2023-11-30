/**
 * desc: 合同列表
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */

import React from 'react';
import {Link} from 'react-router-dom';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {SearchForm} from "@/ui/component/searchForm";
import {TablePagination} from "@/ui/component/tablePagination";
import {Routes} from "@/router/enum/routes";
import {CommonUtils} from "@/common/utils/commonUtils";
import {connect} from "@/common/decorator/connect";
import {getContractList, deleteContract, getContractDetail} from "@redux-actions/contract";
import {User} from "@/common/beans/user";
import {selectContractApprovalStatus, selectPaymentStatus} from "@/saga/selectors/contract";
import {selectApprovalPermission} from "@/saga/selectors/home";
import {ConfirmCheck} from "@/ui/component/confirmCheck";
import moment from 'moment';
import {message} from "antd";
import {Tooltip} from "@/ui/component/toolTip";
import {CustomerRoutes} from "@/router/enum/customerRoutes";

@connect((state:any) => ({
    approvalStatus: selectContractApprovalStatus(state),
    approvalPermission: selectApprovalPermission(state),
    payStatus: selectPaymentStatus(state),
}), {})
class ContractManagementList extends React.Component<any, any> {
    private routes:Array<any> = [
        {
            name: '合同',
            path: '',
            link: '#',
            id: 'contract'
        },{
            name: '合同管理',
            path: '',
            link: '#',
            id: 'contractManagement'
        },{
            name: '合同管理列表',
            path: '',
            link: '#',
            id: 'contractManagementList'
        }
    ];

    constructor(props: any) {
        super(props);
        this.state = {
            pageNo: 1,
            pageSize: 10,
            contractCode: "",             // 合同编号
            babyName: "",                 // 宝宝姓名
            paymentStatus: "",             // 支付状态
            approvalStatus: "",           // 审批状态
            contactName: "",              // 联系人姓名
            isChangeCode:false,           // 是否变更code
            APPROVED:null,                // 合同已通过code
            TODO_APPROVED:null,           // 合同待审批code
            RETURN:null,                  // 合同驳回code
            INVALID:null,                 // 合同作废code
            SIGNING: null,                // 合同签署中code
            dataSource: [],
            totalSize: 0,
        };
    }
    componentDidMount() {
        this.handleSearch({})
    }
    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.approvalStatus.length > 0 && !prevState.isChangeCode){
            const {approvalStatus} = nextProps;
            const APPROVED = approvalStatus.filter((item:any) => item.codeValue === '已通过')[0] &&
                approvalStatus.filter((item:any) => item.codeValue === '已通过')[0].code;
            const TODO_APPROVED = approvalStatus.filter((item:any) => item.codeValue === '待审批')[0] &&
                approvalStatus.filter((item:any) => item.codeValue === '待审批')[0].code;
            const RETURN = approvalStatus.filter((item:any) => item.codeValue === '驳回')[0] &&
                approvalStatus.filter((item:any) => item.codeValue === '驳回')[0].code;
            const INVALID = approvalStatus.filter((item:any) => item.codeValue === '已作废')[0] &&
                approvalStatus.filter((item:any) => item.codeValue === '已作废')[0].code;
            const SIGNING = approvalStatus.filter((item: any) => item.codeValue === '签署中')[0] &&
                approvalStatus.filter((item: any) => item.codeValue === '签署中')[0].code;
            return {
                APPROVED,
                TODO_APPROVED,
                RETURN,
                INVALID,
                SIGNING,
                isChangeCode: true
            }
        }
        return null;
    }
    getColumns = (props) => {
        const {payStatus, approvalStatus} = props;
        let result;
        const columns = [{
            title: '宝宝姓名',
            dataIndex: 'babyName',
            key: 'babyName',
            render: (text: string, record:any) => (
                <Tooltip title={text}>
                    <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:record.leadsId})}`} target='_blank'>
                        {CommonUtils.cutstr(text, 20)}
                    </Link>
                </Tooltip>
            )
        }, {
            title: '课程包',
            dataIndex: 'packageName',
            key: 'packageName',
        }, {
            title: '合同编号',
            dataIndex: 'contractCode',
            key: 'contractCode',
        }, {
            title: '课程包实付金额',
            dataIndex: 'reallyAfterDiscountPrice',
            key: 'reallyAfterDiscountPrice',
            render: (text: number) => (text ? text : 0).toFixed(2),
        }, {
            title: '注册费',
            dataIndex: 'registeredFee',
            key: 'registeredFee',
            render: (text: number) => (text ? text : 0).toFixed(2),
        }, {
            title: '签约日期',
            dataIndex: 'signTime',
            key: 'signTime',
            render: (text: number) => moment(text).format("YYYY-MM-DD"),
        }, {
            title: '审批状态',
            dataIndex: 'approvalStatus',
            key: 'approvalStatus',
            render: (text:string, record:any) => {
                const res = approvalStatus.filter((item:any) => item.code === text);
                return (
                    <div className="activity-approval-status">
                        <span className={record.approvalStatus === '19002' ? 'contract-colorGray' : record.approvalStatus === '19004' ? 'contract-colorRed' : record.approvalStatus === '19006' ? 'contract-colorOrange' : 'contract-colorGreen'}>
                        </span>
                        <span>{res.length > 0 ? res[0].codeValue : '-'}</span>
                    </div>
                )
            }
        }, {
            title: '付款状态',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            render: (text:string) => {
                const res = payStatus.filter((item:any) => item.code === text);
                return res.length > 0 ? res[0].codeValue : '-';
            }
        }, {
            title: 'GB',
            dataIndex: 'gbstaffname',
            key: 'gbstaffname',
        }, {
            title: 'GA',
            dataIndex: 'gastaffname',
            key: 'gastaffname',
        }, {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text:string, record:any) => (
                <div>{this.renderAction(record)}</div>
            )
        }];
        if(User.hasPayment[0] && User.hasPayment[0].paymentCenterFlag === 1){
            result = [
                ...columns.slice(0, 7),
                {
                    title: '合同来源',
                    dataIndex: 'contractSource',
                    width: 100,
                    render(text:any) {
                        if(text === '74001'){
                            return '线上开单';
                        }else{
                            return 'Mate来源';
                        }
                    }

                },
                ...columns.slice(7),
            ]
        }else{
            result = columns;
        }
        return result;
    }
    /**
     * 搜索
     * @param body
     */
    handleSearch = (body:any) => {
        const params = {
            pageNo: 1,
            pageSize: this.state.pageSize,
            currentCenterId: User.currentCenterId,
            contractCode: this.state.contractCode,
            babyName: this.state.babyName,
            paymentStatus: this.state.paymentStatus,
            approvalStatus: this.state.approvalStatus,
            contactName: this.state.contactName,
        };
        getContractList(Object.assign({}, params, body))
            .then((res:any) => {
                this.setState({
                    dataSource: res.list,
                    totalSize: res.totalSize
                })
            })
    };
    /**
     *  查询
     */
    handleChange = (values:any) => {
        this.setState({
            ...values,
            pageNo:1,
            pageSize:this.state.pageSize,
        });
        this.handleSearch(values)
    };
    /**
     * 分页
     */
    handleChangePage = (pageInfo:any) => {
        this.setState(pageInfo)
        this.handleSearch(pageInfo)
    };
    /**
     * 删除合同
     */
    cancelContract = async(data:any) => {
        const {TODO_APPROVED, RETURN} = this.state;
        const params = {
            contractCode: data.contractCode,
            contractId: data.contractId,
            currentCenterId: User.currentCenterId
        };
        try {
            const res = await getContractDetail(params, true);
            if(res.approvalStatus === TODO_APPROVED || res.approvalStatus === RETURN){
                deleteContract({contractId: data.contractId, currentCenterId: User.currentCenterId})
                    .then((res:any) => {
                        this.handleSearch({pageNo: this.state.pageNo})
                    })
            }else{
                message.warn('合同状态已变更');
                this.handleSearch({});
            }
        }catch (e) {
            this.handleSearch({});
        }


    };
    /**
     * 验证是否审批
     * @param node
     */
    checkApprove = async (node:any) => {
        const {TODO_APPROVED} = this.state;
        const params = {
            contractCode: node.contractCode,
            contractId: node.contractId,
            currentCenterId: User.currentCenterId
        };
        try {
            const res = await getContractDetail(params, true);
            if(res.approvalStatus === TODO_APPROVED){
                CommonUtils.newWin(`${Routes.审批合同.link}${CommonUtils.stringify({contractCode:node.contractCode, contractId:node.contractId})}`, 'contractApprove');

            }else{
                message.warn('合同状态已变更');
                this.handleSearch({});
            }
        }catch (e) {
            this.handleSearch({});
        }
    };
    /**
     * 验证是否编辑
     * @param node
     */
    checkEdit = async (node:any) => {
        const {TODO_APPROVED, RETURN} = this.state;
        const params = {
            contractCode: node.contractCode,
            contractId: node.contractId,
            currentCenterId: User.currentCenterId
        };
        try {
            const res = await getContractDetail(params, true);
            if(res.approvalStatus === TODO_APPROVED || res.approvalStatus === RETURN){
                CommonUtils.newWin(`${Routes.修改合同.link}${CommonUtils.stringify({contractCode:node.contractCode, contractId:node.contractId, leadsId: node.leadsId})}`, 'contractEdit');

            }else{
                message.warn('合同状态已变更');
                this.handleSearch({});
            }
        }catch (e) {
            this.handleSearch({});
        }
    };
    /**
     * 验证是否查看
     * @param node
     * @returns {Promise<void>}
     */
    checkView = async (node:any) => {
        const params = {
            contractCode: node.contractCode,
            contractId: node.contractId,
            currentCenterId: User.currentCenterId
        };
        try {
            await getContractDetail(params, true);
            CommonUtils.newWin(`${Routes.合同详情.link}${CommonUtils.stringify({contractCode:node.contractCode, contractId:node.contractId})}`, 'contract');
        }catch (e) {
            this.handleSearch({});
        }
    };
    /**
     * 显示操作
     * @param node
     * @returns {any}
     */
    renderAction = (node:any) => {
        const { approvalPermission} = this.props;
        const {APPROVED, TODO_APPROVED, RETURN, INVALID,SIGNING} = this.state;
        const options:any = new Map([
            // 待审批
            [TODO_APPROVED, (id:string) => {
                return <div>
                    {
                        approvalPermission.createContractApproval &&
                            <button className='gym-button-xxs gym-button-white mr5' onClick={() => this.checkApprove(node)}>审批</button>
                    }
                    {
                        id === User.userId &&
                            <button className='gym-button-xxs gym-button-white mr5' onClick={() => this.checkEdit(node)}>编辑</button>
                    }
                    {
                        (approvalPermission.createContractApproval || id === User.userId)
                        ? <ConfirmCheck
                                button={'删除'}
                                item={node}
                                ensure={this.cancelContract}
                                contentText={'是否删除此合同？'}
                            />
                        : <button className='gym-button-xxs gym-button-white mr5' onClick={() => this.checkView(node)}>查看</button>
                    }
                </div>
            }],
            // 已通过
            [APPROVED, (id:string) => {
                return <button className='gym-button-xxs gym-button-white mr5' onClick={() => this.checkView(node)}>查看</button>
            }],
            [SIGNING,()=>{
                return <button className='gym-button-xxs gym-button-white mr5' onClick={() => this.checkView(node)}>查看</button>
            }],
            // 驳回
            [RETURN, (id:string) => {
                return <div>
                    {
                        id !== User.userId &&
                        <button className='gym-button-xxs gym-button-white mr5' onClick={() => this.checkView(node)}>查看</button>
                    }
                    {
                        id === User.userId &&
                        <button className='gym-button-xxs gym-button-white mr5' onClick={() => this.checkEdit(node)}>编辑</button>
                    }
                    {
                        (approvalPermission.createContractApproval || id === User.userId)
                            ? <ConfirmCheck
                                button={'删除'}
                                item={node}
                                ensure={this.cancelContract}
                                contentText={'是否删除此合同？'}
                            />
                            :
                            null
                    }
                </div>
            }],
            // 已作废
            [INVALID, () => {
                return <button className='gym-button-xxs gym-button-white mr5' onClick={() => this.checkView(node)}>查看</button>
            }],
        ]);
        return options.get(node.approvalStatus) && options.get(node.approvalStatus)(node.createBy)
    }
    /**
     * 搜索配置
     */
    searchConfig = ():Array<any> => {
        const {payStatus, approvalStatus} = this.props;
        const newApprovalStatus = approvalStatus.map((item:any) => ({postCode: item.code, postName:item.codeValue}));
        const newPayStatus = payStatus.map((item:any) => ({postCode: item.code, postName:item.codeValue}));
        return [
            {
                label: '宝宝姓名',
                required: false,
                type: 'text',
                placeholder: '请输入',
                name: 'babyName'
            },{
                label: '合同编号',
                required: false,
                type: 'text',
                placeholder: '请输入' ,
                name: 'contractCode'
            },{
                label: '付款状态',
                required: false,
                type: 'select',
                name: 'paymentStatus',
                placeholder: '请选择',
                options: newPayStatus
            }, {
                label: '审批状态',
                required: false,
                type: 'select',
                name: 'approvalStatus',
                placeholder: '请选择',
                options: newApprovalStatus
            }, {
                label: '联系人',
                required: false,
                type: 'text',
                placeholder: '请输入' ,
                name: 'contactName'
            },
        ];
    };
    render() {
        const {pageNo, pageSize, dataSource, totalSize} = this.state;
        return (
            <div id={`gym-contract-list`}>
                <BreadCrumb routes={this.routes} />
                <div className='page-wrap-no-title' style={{paddingTop:'30px'}}>
                    <SearchForm items={this.searchConfig()}
                                onSearch={this.handleChange}
                    />
                    <TablePagination
                        style={{marginTop:'-5px'}}
                        columns={this.getColumns(this.props)}
                        rowKey={'contractId'}
                        dataSource={dataSource}
                        totalSize={totalSize}
                        pageSize={pageSize}
                        handleChangePage={this.handleChangePage}
                        pageNo={pageNo}
                        scroll={{x : 'max-content'}}
                    />
                </div>
            </div>
        )
    }
}

export {ContractManagementList}
