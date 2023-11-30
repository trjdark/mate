/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2021/5/21
 * Time: 上午10:59
 */
import React, {Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Form, Row, Col} from "antd";
import {form} from "@/common/decorator/form";
import {User} from "@/common/beans/user";
import {CommonUtils} from "@/common/utils/commonUtils";
import {getContractReviseDetail, approveContractReviseDetail} from "@redux-actions/contract";
import {connect} from "@/common/decorator/connect";
import {selectContractReviseStatus, selectContractReviseType} from "@/saga/selectors/contract";
import {TextArea} from "@/ui/component/input";
import {ConfirmCheck} from "@/ui/component/confirmCheck";
import {Message} from "@/ui/component/message/message";
import history from '@/router/history';
import {downloadFile} from "@redux-actions/contract";
import {FUNC} from "@/ui/pages/setting/enum/functions";

const FormItem = Form.Item;
@form()
@connect((state:any) => ({
    reviseStatus: selectContractReviseStatus(state),
    reviseType: selectContractReviseType(state)
}), {})
class ContractReviseDetail extends React.Component<any, any>{
    private routes:Array<any> = [
        {name: '合同调整', path: '', link: '#', id: 'contractRevise'},
        {name: '调整申请记录', path: '', link: '#', id: 'applyReviseRecord'},
    ];
    contractId:string;
    contractCode:string;
    id:string;
    adjStatus:string;
    constructor(props){
        super(props)
        this.id = CommonUtils.parse(props).id;
        this.adjStatus = CommonUtils.parse(props).adjStatus;
        this.state = {
            contractInfo: {}
        }
    }
    componentDidMount(){
        const param = {
            id: this.id,
            currentCenterId: User.currentCenterId
        };
        getContractReviseDetail(param).then((res) => {
            this.setState({contractInfo: res})
        })
    }
    /**
     * 申请调整类型
     * @param type
     * @returns {string}
     */
    formatAdjType = (type:any):string => {
        const {reviseType} = this.props;
        const res = reviseType.filter((item:any) => item.code === type);
        return res.length > 0 ? res[0].codeValue : '未知';
    };
    /**
     * 申请调整审批状态
     * @param type
     * @returns {string}
     */
    formatAdjStatus = (status:any):string => {
        const {reviseStatus} = this.props;
        const res = reviseStatus.filter((item:any) => item.code === status);
        return res.length > 0 ? res[0].codeValue : '未知';
    };
    /**
     * 审批
     * @param {string} arg
     */
    handleApprove = (arg:string) => {
        const {form} = this.props;
        form.validateFields((err, values) => {
                if (!err) {
                    const param = Object.assign({}, values, {
                        currentCenterId: User.currentCenterId,
                        operate: arg,
                        id: this.id,
                    })
                    approveContractReviseDetail(param).then(() => {
                        Message.success('审批成功！', 3, () => {
                            history.goBack();
                        })
                    })
                }
            }
        )
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
     * 格式化审批状态
     * @param {string} status
     * @returns {any}
     */
    formatReviseStatus = (status:string) => {
        const {reviseStatus} = this.props;
        const date = (reviseStatus || []).filter(item => item.code === status);
        return date.length > 0 ? date[0].codeValue : '-';
    };
    /**
     * 返回上一页
     */
    goBack = () => {
        history.goBack();
    };
    render(){
        const {form, reviseStatus} = this.props;
        const {contractInfo} = this.state;
        const {getFieldDecorator} = form;
        const NONE_APPROVED = (reviseStatus).filter(item => item.codeValue === '待审批')[0] || '';

        return (
            <div id='gym-contract-revise-detail'>
                <BreadCrumb routes={this.routes}/>
                <div className='page-wrap gym-add-application'>
                    <Form  className='gym-contract-add-form'>
                        <div className='gym-contract-add-form-wrap mt30'>
                            <Row className='gym-contract-table-thead'>
                                <Col span={4} className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                    <span className='gym-contract-table-thead-label'>宝宝姓名：</span>
                                </Col>
                                <Col span={8} className=''>
                                    <span  className='gym-contract-table-thead-babyName'>{contractInfo.babyName}</span>
                                </Col>
                            </Row>
                            <FormItem label={'调整类型：'} className='span gym-contract-add-form-required gym-contract-add-required'>
                                <span>{this.formatAdjType(contractInfo.adjType)}</span>
                            </FormItem>
                            <Row>
                                <Col span={12}>
                                    <FormItem label={'中心号'}>
                                        <span>{contractInfo.centerCode}</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label={'审批状态'}>
                                        <span>{this.formatAdjStatus(contractInfo.adjStatus)}</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label={'提交人'}>
                                        <span>{contractInfo.createBy}</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label={'合同号'}>
                                        <span>{contractInfo.contractCode}</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-thead no-radius'>
                                <Col span={6} className='gym-contract-table-thead-babyName-value '>
                                    <span className=''>调整明细</span>
                                </Col>
                                <Col span={6} className='gym-contract-table-thead-babyName-value'>
                                    <span className=''>目前系统剩余</span>
                                </Col>
                                <Col span={6} className='gym-contract-table-thead-babyName-value'>
                                    <span className=''>调整数值</span>
                                </Col>
                                <Col span={6} className='gym-contract-table-thead-babyName-value'>
                                    <span className=''>调整后剩余</span>
                                </Col>
                            </Row>
                            <Row className=''>
                                <Col span={12} >
                                    <FormItem label={'正课课时'}>
                                        <div className='text-c'>{contractInfo.preCourseNum}</div>
                                    </FormItem>
                                </Col>
                                <Col span={12} className='gym-contract-table-thead-col'>
                                    <Col span={6}><div className='text-c'>{contractInfo.adjustCourseNum}</div></Col>
                                    <Col span={18}><div className='text-c'>{contractInfo.afterCourseNum}</div></Col>
                                </Col>
                            </Row>
                            <Row className=''>
                                <Col span={12} >
                                    <FormItem label={'赠课课时'}>
                                        <div className='text-c'>{contractInfo.preFreeCourseNum}</div>
                                    </FormItem>
                                </Col>
                                <Col span={12} className='gym-contract-table-thead-col'>
                                    <Col span={6}><div className='text-c'>{contractInfo.adjustFreeCourseNum}</div></Col>
                                    <Col span={18}><div className='text-c'>{contractInfo.afterFreeCourseNum}</div></Col>
                                </Col>
                            </Row>
                            <Row className=''>
                                <Col span={12} >
                                    <FormItem label={'剩余金额'}>
                                        <div className='text-c'>{contractInfo.preCoursePrice}</div>
                                    </FormItem>
                                </Col>
                                <Col span={12} className='gym-contract-table-thead-col'>
                                    <Col span={6}><div className='text-c'>{contractInfo.adjustCoursePrice}</div></Col>
                                    <Col span={18}><div className='text-c'>{contractInfo.afterCoursePrice}</div></Col>
                                </Col>
                            </Row>

                            <FormItem label={'调整原因说明'} className='span gym-contract-add-form-required gym-contract-add-required'>
                                <Row>
                                    {contractInfo.remark}
                                </Row>
                            </FormItem>
                            <FormItem label={'附件'} className='span'>
                                {
                                    (contractInfo.attachmentList || []).map((item) => (
                                        <span className='mr15 cDefault' key={item.id} onClick={() => this.download(item)}>{item.photoName}</span>
                                    ))
                                }
                            </FormItem>
                            <FormItem label='中心审批意见' >
                                <div>{contractInfo.centerApprovalComments}</div>
                            </FormItem>
                            <FormItem label='审批意见' >
                                {
                                    // 如果是待审核的状态
                                    (contractInfo.adjStatus === NONE_APPROVED.code || (
                                        User.permissionList.includes(FUNC['总部财务审批']) &&
                                        this.formatReviseStatus(contractInfo.adjStatus) === '待总部审批'
                                    ))
                                    ? getFieldDecorator('approvalComments', {
                                            rules: [
                                                {required: true, message:'请填写审批意见!'}
                                            ],
                                        })(<TextArea/>)
                                    : <div>{contractInfo.approvalComments}</div>
                                }
                            </FormItem>
                        </div>
                        <div className='text-c'>
                            {
                                // 待审批 有同意拒绝按钮
                                (contractInfo.adjStatus === NONE_APPROVED.code || (
                                    User.permissionList.includes(FUNC['总部财务审批']) &&
                                    this.formatReviseStatus(contractInfo.adjStatus) === '待总部审批'
                                ))
                                    ? (
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
                                    : null
                            }
                            <button className='gym-button-white gym-button-xs mr15' onClick={this.goBack}>返回</button>
                        </div>

                    </Form>
                </div>
            </div>
        )
    }
}

export {ContractReviseDetail}
