/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2023/8/29
 * Time: 14:35
 */
import React, {Fragment} from 'react';
import {Link} from "react-router-dom";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {CommonUtils, SafeCalculate} from "@/common/utils/commonUtils";
import {Row, Col} from 'antd';
import {User} from "@/common/beans/user";
import {contractInit, downloadFile, getPartRefundDetail} from "@redux-actions/contract";
import {PageTitle} from "@/ui/component/pageTitle";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {connect} from "@/common/decorator/connect";
import {selectContractPartRefundTypes, selectPartRefundDetailTypes} from "@/saga/selectors/contract";
import {Message} from "@/ui/component/message/message";
import {approvePartRefund} from "@redux-actions/payOrReceiveContract";
import {ConfirmCheck} from "@/ui/component/confirmCheck";
import history from "@/router/history";


@connect((state:any) => ({
    partRefundStatusList: selectContractPartRefundTypes(state),
    partRefundDetailStatusList: selectPartRefundDetailTypes(state),
}), {contractInit})
class RefundDetail extends React.Component <any, any> {
    id:string;
    contractId:string;
    contractCode: string;
    private routes:Array<any> = [
        {name: '合同调整', path: '', link: '#', id: 'contractRevision'},
        {name: '部分退费-总部财务审批', path: '', link: '#', id: 'partRefund'},
        {name: '部分退费申请记录', path: '', link: '#', id: 'applyPartRefund'},
    ];
    constructor(props: any) {
        super(props);
        if(CommonUtils.hasParams(props)){
            this.id = CommonUtils.parse(props).id;
            this.contractId = CommonUtils.parse(props).contractId;
            this.contractCode = CommonUtils.parse(props).contractCode;
        }
        this.state = {
            applyContent:{},      // 申请内容
            contractContent: {},  // 合同内容
        }
    }
    componentDidMount() {
        this.props.contractInit();
        this.getDetail();
    }
    /**
     * 获取信息
     */
    getDetail = () => {
        const param = {
            id:this.id,
            currentCenterId:User.currentCenterId,
            contractCode: this.contractCode,
            contractId: this.contractId
        };

        getPartRefundDetail(param).then((res:any) => {
            this.setState({
                applyContent: res,
            })
        })
    };
    /**
     * 判断状态
     */
    formatReviseStatus = (status:string):string => {
        const {partRefundStatusList, partRefundDetailStatusList} = this.props;
        const res = [...partRefundStatusList, ...partRefundDetailStatusList].filter(item => item.code === status);
        return res.length > 0 ? res[0].codeValue : '';
    };
    /**
     * 审批
     * @param {0 | 1} type
     * @param {0 | 1} value
     */
    handleApprove = (type: 0 | 1, flag: 0 | 1) => {
        const param = {
            id: this.id,
            contractId: this.contractId,
            currentCenterId: User.currentCenterId,
            approvalFlag: flag,
            approvalType: type
        }
        approvePartRefund(param).then((res) => {
            Message.success('操作成功！', 3, () => {
                history.goBack()
            })
        });
    };
    download = (node) => {
        downloadFile({fileId:node.photoPath, fileName:node.photoName})
    };
    goBack = () => {
        history.goBack();
    }
    render(){
        const {applyContent} = this.state;
        return (
            <div id=''>
                <BreadCrumb routes={this.routes}/>
                <div className='page-wrap'>
                    <PageTitle title='申请信息'/>
                    <div>
                        <Row className='gym-contract-table-thead'>
                            <Col span={4}  className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                <span className='gym-contract-table-thead-label'>宝宝姓名:</span>
                            </Col>
                            <Col span={8}  className=''>
                                <span className='gym-contract-table-thead-babyName'>{applyContent.customerName}</span>
                            </Col>
                        </Row>
                        <Row className='gym-contract-table-tbody'>
                            <Col span={4}  className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                <span className='gym-contract-table-thead-label'>中心号：</span>
                            </Col>
                            <Col span={8}  className=''>
                                <span className='gym-contract-table-thead-babyName'>{applyContent.centerCode}</span>
                            </Col>
                            <Col span={4}  className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                <span className='gym-contract-table-thead-label'>审批状态：</span>
                            </Col>
                            <Col span={8}  className=''>
                                <span className='gym-contract-table-thead-babyName'>{applyContent.approvalStatus}</span>
                            </Col>
                        </Row>
                        <Row className='gym-contract-table-tbody'>
                            <Col span={4}  className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                <span className='gym-contract-table-thead-label'>合同号：</span>
                            </Col>
                            <Col span={8}  className=''>
                                <span className='gym-contract-table-thead-babyName'>{applyContent.contractCode}</span>
                            </Col>
                            <Col span={4}  className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                <span className='gym-contract-table-thead-label'>提交人：</span>
                            </Col>
                            <Col span={8}  className=''>
                                <span className='gym-contract-table-thead-babyName'>{applyContent.applyByName}</span>
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
                                <span>{applyContent.currentSystemCourseNum}</span>
                            </Col>
                            <Col span={4}  className='gym-contract-table-tbody-value'>
                                <span>{applyContent.partRefundCourseNum}</span>
                            </Col>
                            <Col span={8}  className='gym-contract-table-tbody-value'>
                                <span>{SafeCalculate.newPlus(applyContent.currentSystemCourseNum, applyContent.partRefundCourseNum)}</span>
                            </Col>
                        </Row>
                        <Row className='gym-contract-table-tbody'>
                            <Col span={4}  className='gym-contract-table-tbody-label'>
                                <span>赠课课时:</span>
                            </Col>
                            <Col span={8}  className='gym-contract-table-tbody-value'>
                                <span>{applyContent.currentSystemFreeCourseNum}</span>
                            </Col>
                            <Col span={4}  className='gym-contract-table-tbody-value'>
                                <span>{applyContent.partRefundFreeCourseNum}</span>
                            </Col>
                            <Col span={8}  className='gym-contract-table-tbody-value'>
                                <span >{SafeCalculate.newPlus(applyContent.currentSystemFreeCourseNum, applyContent.partRefundFreeCourseNum)}</span>
                            </Col>
                        </Row>
                        <Row className='gym-contract-table-tbody'>
                            <Col span={4}  className='gym-contract-table-tbody-label'>
                                <span>剩余金额:</span>
                            </Col>
                            <Col span={8}  className='gym-contract-table-tbody-value'>
                                <span>{applyContent.currentSystemCoursePrice}</span>
                            </Col>
                            <Col span={4}  className='gym-contract-table-tbody-value'>
                                <span>{applyContent.partRefundCoursePrice}</span>
                            </Col>
                            <Col span={8}  className='gym-contract-table-tbody-value'>
                                <span >{SafeCalculate.newPlus(applyContent.currentSystemCoursePrice, applyContent.partRefundCoursePrice)}</span>
                            </Col>
                        </Row>
                        <Row className='gym-contract-table-tbody'>
                            <Col span={4}  className='gym-contract-table-tbody-label'>
                                <span>原因说明:</span>
                            </Col>
                            <Col span={20}  className='gym-contract-table-tbody-value'>
                                <span>{applyContent.remark}</span>
                            </Col>
                        </Row>
                        <Row className='gym-contract-table-tbody'>
                            <Col span={4}  className='gym-contract-table-tbody-label'>
                                <span>附件:</span>
                            </Col>
                            <Col span={20}  className='gym-contract-table-tbody-value'>
                                {
                                    (applyContent.attachmentList || []).map((item) => (
                                        <span className='mr15 cDefault' key={item.id} onClick={() => this.download(item)}>{item.photoName}</span>
                                    ))
                                }
                            </Col>
                        </Row>
                        <div className='text-c mt20'>
                            {
                                (
                                    User.permissionList.includes(FUNC['部分退费-总部财务审批']) &&
                                    this.formatReviseStatus(applyContent.partRefundStatus) === '待总部财务审批'
                                )
                                && (
                                    <Fragment>
                                        <ConfirmCheck
                                            button={<button className='gym-button-default gym-button-xs mr15'>同意</button>}
                                            ensure={() => this.handleApprove(1 , 1)}
                                            contentText='确认同意此申请'
                                            item={applyContent}
                                        />
                                        <ConfirmCheck
                                            button={<button className='gym-button-error gym-button-xs mr15'>拒绝</button>}
                                            ensure={() => this.handleApprove(1, 0)}
                                            contentText='确认拒绝此申请'
                                            item={applyContent}
                                        />
                                    </Fragment>
                                )
                            }
                            <button className='gym-button-white gym-button-xs' onClick={this.goBack}>返回</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export {RefundDetail}
