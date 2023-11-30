/**
 * desc: 调整申请详情
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/6/7
 * Time: 下午3:57
 */

import React, {Fragment} from 'react';
import {BreadCrumb} from "../../../../component/breadcrumb";
import { Row, Col} from "antd";
import {CommonUtils} from "@/common/utils/commonUtils";
import {cancelContractRevise, downloadFile, getContractReviseDetail, approveContractReviseDetail} from "@redux-actions/contract";
import {User} from "@/common/beans/user";
import {connect} from "@/common/decorator/connect";
import {selectContractReviseType, selectContractReviseStatus} from "@/saga/selectors/contract";
import history from "@/router/history";
import {ConfirmCheck} from "@/ui/component/confirmCheck";
import {Message} from "@/ui/component/message/message";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {TextArea} from "@/ui/component/input";

@connect((state:any) => ({
    reviseTypes: selectContractReviseType(state),
    reviseStatus: selectContractReviseStatus(state),
}))
class ContractActionDetailSpecial extends React.Component<any, any> {
    //路由代码块
    private id:string;
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
            name: '查看合同',
            path: '',
            link: '#',
            id: 'contractManagementDetail'
        },{
            name: '合同调整申请记录',
            path: '',
            link: '#',
            id: 'contractManagementRecordRevise'
        }
    ];
    constructor(props){
        super(props)
        this.state = {
            contractInfo : {},
            comment: ''
        }
        this.id = CommonUtils.parse(props).id;
    }
    componentDidMount(){
        const param = {
            id: this.id,
            currentCenterId: User.currentCenterId
        };
        getContractReviseDetail(param).then((res) => {
            this.setState({contractInfo: res});
        })
    }

    /**
     * 返回上一页
     */
    goBack = () => {
        history.goBack();
    };
    /**
     * 取消
     */
    handleCancel = () => {
        const param = {
            id: this.id,
            currentCenterId: User.currentCenterId
        };
        cancelContractRevise(param).then(() => {
            Message.success('取消成功！', 3, () => {
                window.location.reload();
            })
        })
    };
    /**
     * 格式化调整类型
     * @param {string} type
     * @returns {any}
     */
    formatReviseType = (type:string) => {
        const {reviseTypes} = this.props;
        const date = reviseTypes.filter(item => item.code === type);
        return date.length > 0 ? date[0].codeValue : '-';
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
     * 下载附件
     * @param file
     */
    download = (file) => {
        const param = {fileId: file.id, fileName:file.photoName};
        downloadFile(param)
    };
    /**
     * 变化审批意见
     * @param e
     */
    handleChangeText = (e) => {
        this.setState({comment: e.target.value})
    };
    /**
     * 中心审批
     * @param {"1" | "0"} st
     */
    handleApprove = (st: '1' | '0') => {
        if(!this.state.comment){
            Message.warning('请填写审批意见！', 3)
            return;
        }
        const param = {
            id: this.id,
            currentCenterId: User.currentCenterId,
            operate: st,
            centerApprovalComments: this.state.comment
        };
        approveContractReviseDetail(param).then(() => {
            Message.success('审批成功！', 3, () => {
                history.goBack();
            })
        })
    };
    /**
     * 取消
     * @param node
     */
    cancel = (node) => {

    };
    render(){
        const {contractInfo, comment} = this.state;
        return(
            <div id='gym-contract-revise'>
                <BreadCrumb routes={this.routes} />
                <div className='page-wrap'>
                    <div className='gym-contract-table'>
                        <div>
                            <Row className='gym-contract-table-thead'>
                                <Col span={4}  className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                    <span className='gym-contract-table-thead-label'>宝宝姓名:</span>
                                </Col>
                                <Col span={20}  className=''>
                                    <span className='gym-contract-table-thead-babyName'>{contractInfo.babyName}</span>
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-tbody'>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>调整类型:</span>
                                </Col>
                                <Col span={20}  className='gym-contract-table-tbody-value'>
                                    <span>{this.formatReviseType(contractInfo.adjType)}</span>
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-tbody'>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>中心号:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{contractInfo.centerCode}</span>
                                </Col>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>审批状态:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{this.formatReviseStatus(contractInfo.adjStatus)}</span>
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-tbody'>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>提交人:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{contractInfo.createBy}</span>
                                </Col>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>合同号:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{contractInfo.contractCode}</span>
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-thead no-radius'>
                                <Col span={4}  className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                    <span className='gym-contract-table-thead-label'>调整明细</span>
                                </Col>
                                <Col span={8}  className=''>
                                    <span className='gym-contract-table-thead-babyName'>目前系统剩余</span>
                                </Col>
                                <Col span={4}  className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                    <span className='gym-contract-table-thead-label'>调整数值</span>
                                </Col>
                                <Col span={8}  className=''>
                                    <span className='gym-contract-table-thead-babyName'>调整后剩余</span>
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-tbody'>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>正课课时:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{contractInfo.preCourseNum}</span>
                                </Col>
                                <Col span={4}  className='gym-contract-table-tbody-value'>
                                    <span>{contractInfo.adjustCourseNum}</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{contractInfo.afterCourseNum}</span>
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-tbody'>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>赠课课时:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{contractInfo.preFreeCourseNum}</span>
                                </Col>
                                <Col span={4}  className='gym-contract-table-tbody-value'>
                                    <span>{contractInfo.adjustFreeCourseNum}</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span >{contractInfo.afterFreeCourseNum}</span>
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-tbody'>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>剩余金额:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{contractInfo.preCoursePrice}</span>
                                </Col>
                                <Col span={4}  className='gym-contract-table-tbody-value'>
                                    <span>{contractInfo.adjustCoursePrice}</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span >{contractInfo.afterCoursePrice}</span>
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-tbody'>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>调整原因说明:</span>
                                </Col>
                                <Col span={20}  className='gym-contract-table-tbody-value'>
                                    <span>{contractInfo.remark}</span>
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-tbody'>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>附件:</span>
                                </Col>
                                <Col span={20}  className='gym-contract-table-tbody-value'>
                                    {
                                        (contractInfo.attachmentList || []).map((item) => (
                                            <span className='mr15 cDefault' key={item.id} onClick={() => this.download(item)}>{item.photoName}</span>
                                        ))
                                    }
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-tbody flex'>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span className='c-error'>*</span><span>中心财务审批意见:</span>
                                </Col>
                                {
                                    this.formatReviseStatus(contractInfo.adjStatus) === '待中心审批'
                                    ? (
                                        <Col span={20}  className='gym-contract-table-tbody-value'>
                                            <TextArea onChange={this.handleChangeText} value={comment}/>
                                        </Col>
                                    )
                                    : (
                                        <Col span={20}  className='gym-contract-table-tbody-value'>
                                            <span>{contractInfo.centerApprovalComments}</span>
                                        </Col>
                                    )
                                }

                            </Row>
                            <Row className='gym-contract-table-tbody flex'>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>总部财务审批意见:</span>

                                </Col>
                                <Col span={20}  className='gym-contract-table-tbody-value'>
                                    <span>{contractInfo.approvalComments}</span>
                                </Col>
                            </Row>
                            <div className='text-c mt20'>
                                {
                                    (
                                        User.permissionList.includes(FUNC['中心财务审批']) &&
                                        this.formatReviseStatus(contractInfo.adjStatus) === '待中心审批'
                                    )
                                    && (
                                        <Fragment>
                                            <ConfirmCheck
                                                button={<button className='gym-button-default gym-button-xs mr15'>同意</button>}
                                                ensure={() => this.handleApprove('1')}
                                                contentText='确认同意此申请'
                                                item={contractInfo}
                                            />
                                            <ConfirmCheck
                                                button={<button className='gym-button-error gym-button-xs mr15'>拒绝</button>}
                                                ensure={() => this.handleApprove('0')}
                                                contentText='确认拒绝此申请'
                                                item={contractInfo}
                                            />
                                        </Fragment>
                                    )
                                }
                                <button className='gym-button-white gym-button-xs mr15' onClick={this.goBack}>返回</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export {ContractActionDetailSpecial}
