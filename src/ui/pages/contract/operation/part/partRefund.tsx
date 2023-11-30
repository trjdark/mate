/**
 * desc: 部分退费
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2023/8/17
 * Time: 11:01
 */
import React, {Fragment} from 'react';
import { Row, Col, message} from "antd";
import {form} from "@/common/decorator/form";
import {ConfirmCheck} from "@/ui/component/confirmCheck";
import {downloadFile, updateChangePkg} from "@redux-actions/contract";
import history from "@/router/history";
import {connect} from "@/common/decorator/connect";
import {selectPartRefundDetailTypes} from "@/saga/selectors/contract";
import {User} from "@/common/beans/user";
import {SafeCalculate} from "@/common/utils/commonUtils";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {Message} from "@/ui/component/message/message";
import {approvePartRefund} from "@redux-actions/payOrReceiveContract";

declare interface ChangePkgProps {
    id:string,
    contractId:string,
    contractContent:any,
    partRefundStatusList?:Array<any>
    content:any,
}

@connect((state:any) => ({
    partRefundStatusList: selectPartRefundDetailTypes(state),
}))
@form()
class PartRefund extends React.Component<ChangePkgProps, any>{
    state = {

    };
    /**
     * 修改
     * @param e
     */
    handleSubmit = (e:any) => {
        e.preventDefault();
        const {validateFields} = this.props.form;
        validateFields((err:any, values) => {
            if(!err){
                updateChangePkg(Object.assign({}, values, {
                    currentCenterId: User.currentCenterId,
                    contractId: this.props.content.contractId,
                    id: this.props.content.id,
                    lastPackageCourseNum: this.state.packageNum?this.state.packageNum:this.props.content.lastTotalCourseNum
                })).then(() => {
                    message.success("修改成功");
                    history.goBack()
                })
            }
        })
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
     * 审批
     * @param {0 | 1} type
     * @param {0 | 1} value
     */
    handleApprove = (type: 0 | 1, flag: 0 | 1) => {
        const {id, contractId} = this.props;
        const param = {
            id: id,
            contractId: contractId,
            currentCenterId: User.currentCenterId,
            approvalFlag: flag,
            approvalType: type
        }
        approvePartRefund(param).then((res) => {
            Message.success('操作成功！', 3, () => {
                this.goBack();
            })
        });
    };
    goBack = () => {
        history.goBack();
    };
    download = (node) => {
        downloadFile({fileId:node.photoPath, fileName:node.photoName})
    };
    render(){
        const { content = {},} = this.props;
        return(
            <div>
                <div className='gym-contract-table'>
                    <div>
                        <Row className='gym-contract-table-thead'>
                            <Col span={4}  className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                <span className='gym-contract-table-thead-label'>宝宝姓名:</span>
                            </Col>
                            <Col span={8}  className=''>
                                <span className='gym-contract-table-thead-babyName'>{content.customerName}</span>
                            </Col>
                        </Row>
                        <Row className='gym-contract-table-tbody'>
                            <Col span={4}  className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                <span className='gym-contract-table-thead-label'>中心号：</span>
                            </Col>
                            <Col span={8}  className=''>
                                <span className='gym-contract-table-thead-babyName'>{content.centerCode}</span>
                            </Col>
                            <Col span={4}  className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                <span className='gym-contract-table-thead-label'>审批状态：</span>
                            </Col>
                            <Col span={8}  className=''>
                                <span className='gym-contract-table-thead-babyName'>{content.approvalStatus}</span>
                            </Col>
                        </Row>
                        <Row className='gym-contract-table-tbody'>
                            <Col span={4}  className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                <span className='gym-contract-table-thead-label'>合同号：</span>
                            </Col>
                            <Col span={8}  className=''>
                                <span className='gym-contract-table-thead-babyName'>{content.contractCode}</span>
                            </Col>
                            <Col span={4}  className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                <span className='gym-contract-table-thead-label'>提交人：</span>
                            </Col>
                            <Col span={8}  className=''>
                                <span className='gym-contract-table-thead-babyName'>{content.applyByName}</span>
                            </Col>
                        </Row>
                        <Row className='gym-contract-table-thead no-radius'>
                            <Col span={4}  className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                <span className='gym-contract-table-thead-label'>部分退费明细</span>
                            </Col>
                            <Col span={8}  className='gym-contract-table-thead-label'>
                                <span className='gym-contract-table-thead-babyName'>目前系统剩余</span>
                            </Col>
                            <Col span={4}  className='gym-contract-table-thead-label'>
                                <span className='gym-contract-table-thead-babyName'>本次退费</span>
                            </Col>
                            <Col span={8}  className='gym-contract-table-thead-label'>
                                <span className='gym-contract-table-thead-babyName'>退费后剩余</span>
                            </Col>
                        </Row>
                        <Row className='gym-contract-table-tbody'>
                            <Col span={4}  className='gym-contract-table-tbody-label'>
                                <span>正课课时:</span>
                            </Col>
                            <Col span={8}  className='gym-contract-table-tbody-value'>
                                <span>{content.currentSystemCourseNum}</span>
                            </Col>
                            <Col span={4}  className='gym-contract-table-tbody-value'>
                                <span>{content.partRefundCourseNum}</span>
                            </Col>
                            <Col span={8}  className='gym-contract-table-tbody-value'>
                                <span>{SafeCalculate.newPlus(content.currentSystemCourseNum, content.partRefundCourseNum)}</span>
                            </Col>
                        </Row>
                        <Row className='gym-contract-table-tbody'>
                            <Col span={4}  className='gym-contract-table-tbody-label'>
                                <span>赠课课时:</span>
                            </Col>
                            <Col span={8}  className='gym-contract-table-tbody-value'>
                                <span>{content.currentSystemFreeCourseNum}</span>
                            </Col>
                            <Col span={4}  className='gym-contract-table-tbody-value'>
                                <span>{content.partRefundFreeCourseNum}</span>
                            </Col>
                            <Col span={8}  className='gym-contract-table-tbody-value'>
                                <span >{SafeCalculate.newPlus(content.currentSystemFreeCourseNum, content.partRefundFreeCourseNum)}</span>
                            </Col>
                        </Row>
                        <Row className='gym-contract-table-tbody'>
                            <Col span={4}  className='gym-contract-table-tbody-label'>
                                <span>剩余金额:</span>
                            </Col>
                            <Col span={8}  className='gym-contract-table-tbody-value'>
                                <span>{content.currentSystemCoursePrice}</span>
                            </Col>
                            <Col span={4}  className='gym-contract-table-tbody-value'>
                                <span>{content.partRefundCoursePrice}</span>
                            </Col>
                            <Col span={8}  className='gym-contract-table-tbody-value'>
                                <span >{SafeCalculate.newPlus(content.currentSystemCoursePrice, content.partRefundCoursePrice)}</span>
                            </Col>
                        </Row>
                        <Row className='gym-contract-table-tbody'>
                            <Col span={4}  className='gym-contract-table-tbody-label'>
                                <span>原因说明:</span>
                            </Col>
                            <Col span={20}  className='gym-contract-table-tbody-value'>
                                <span>{content.remark}</span>
                            </Col>
                        </Row>
                        <Row className='gym-contract-table-tbody'>
                            <Col span={4}  className='gym-contract-table-tbody-label'>
                                <span>附件:</span>
                            </Col>
                            <Col span={20}  className='gym-contract-table-tbody-value'>
                                {
                                    (content.attachmentList || []).map((item) => (
                                        <span className='mr15 cDefault' key={item.id} onClick={() => this.download(item)}>{item.photoName}</span>
                                    ))
                                }
                            </Col>
                        </Row>
                        <div className='text-c mt20'>
                            {
                                (
                                    User.permissionList.includes(FUNC['部分退费-中心财务审批']) &&
                                    this.formatReviseStatus(content.partRefundStatus) === '待中心财务审批'
                                )
                                && (
                                    <Fragment>
                                        <ConfirmCheck
                                            button={<button className='gym-button-default gym-button-xs mr15'>同意</button>}
                                            ensure={() => this.handleApprove(0 , 1)}
                                            contentText='确认同意此申请'
                                            item={content}
                                        />
                                        <ConfirmCheck
                                            button={<button className='gym-button-error gym-button-xs mr15'>拒绝</button>}
                                            ensure={() => this.handleApprove(0, 0)}
                                            contentText='确认拒绝此申请'
                                            item={content}
                                        />
                                    </Fragment>
                                )
                            }
                            <button className='gym-button-white gym-button-xs mr15' onClick={this.goBack}>返回</button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export {PartRefund};

