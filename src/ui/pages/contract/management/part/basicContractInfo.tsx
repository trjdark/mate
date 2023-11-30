/**
 * desc: 合同基本信息
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/13
 * Time: 下午2:26
 */
/// <reference path="../.h/contract.d.ts" />

import React from 'react';
import {Link} from 'react-router-dom';
import { Col, Row, Upload, Button,Icon} from "antd";
import moment from 'moment';
import {CourseType} from "../../../setting/enum/course";
import {
    selectContractTypes, selectContractStatus,
    selectPaymentStatus, selectContractApprovalStatus
} from "@/saga/selectors/contract";
import { SetApi } from "@/api/settingApi";
import { saveAttachment } from '@/redux-actions/contract';
import {connect} from "@/common/decorator/connect";
import { User } from '@/common/beans/user';
import {downloadFile} from '@/redux-actions/contract'
import {CommonUtils} from "@/common/utils/commonUtils";
import {CustomerRoutes} from "@/router/enum/customerRoutes";
import {selectBusinessSourceList} from "@/saga/selectors/home";

/**
 * 计算课程优惠
 * @param {number} num
 * @param {number} total
 * @returns {number}
 */
const calculateDate = (num:number, total:number):string => `（${(num/(num + total) * 100).toFixed(2)}%优惠）`;
/**
 * 计算价格优惠
 * @param {number} num
 * @param {number} total
 * @returns {string}
 */
const calculatePrice = (num:number, total:number):string => `（${ ( (total -num) / total * 100).toFixed(2)}%优惠）`;

declare interface BasicContractInfoProps {
    contractInfo:basicContractInfo,
    emitNext?:(fileList:Array<any>) => void
    contractType?:Array<any>,
    contractStatus?:Array<any>,
    paymentStatus?:Array<any>,
    approvalStatus?:Array<any>,
    uploading?:Array<any>,
    [propsName:string]:any
}

@connect((state:any) => ({
    contractType: selectContractTypes(state),
    contractStatus: selectContractStatus(state),
    paymentStatus: selectPaymentStatus(state),
    approvalStatus: selectContractApprovalStatus(state),
    businessSourceMap: selectBusinessSourceList(state)
}))
class BasicContractInfo extends React.Component<BasicContractInfoProps, any>{
    eleUpload;
    constructor(props:BasicContractInfoProps){
        super(props)
    }

    /**
     * 合同审批状态
     * @param type
     * @returns {string}
     */
    formatApprovalStatus = (type:any):string => {
        const {approvalStatus} = this.props;
        const res = approvalStatus.filter((item:any) => item.code === type);
        return res.length > 0 ? res[0].codeValue : '未知';
    };
    /**
     * 合同状态
     * @param type
     * @returns {string}
     */
    formatPaymentStatus = (type:any):string => {
        const {paymentStatus} = this.props;
        const res = paymentStatus.filter((item:any) => item.code === type);
        return res.length > 0 ? res[0].codeValue : '未知';
    };
    /**
     * 合同状态
     * @param type
     * @returns {string}
     */
    formatContractStatus = (type:any):string => {
        const {contractStatus} = this.props;
        const res = contractStatus.filter((item:any) => item.code === type);
        return res.length > 0 ? res[0].codeValue : '未知';
    };
    /**
     * 格式化业务来源
     * @param type
     * @returns {string}
     */
    formatContractType = (type:any):string => {
        const {contractType} = this.props;
        const res = contractType.filter((item:any) => item.code === type);
        return res.length > 0 ? res[0].codeValue : '未知';
    };
    /**
     * 格式化课程包类型
     */
    formatPackageType = (type:any):string => {
        const res = CourseType.filter((item:any) => item.value === type);
        return res.length > 0 ? res[0].name : '-';
    };
    /**
     * 限制宝宝名字的长度
     */
    lengthFormat = (key:string) => {
        if(key && key.length > 20){
            return (`${key.substr(0,20)}...`)
        }else{
            return key
        }
    };
    beforeUpload=(file:any,fileList:Array<any>)=>{
        return true
   }
   /**
    * 获取业务来源
    */
   getBusinessSource = (text:string) => {
       const {businessSourceMap} = this.props;
       let res = businessSourceMap.filter(item => item.businessSourceCode === text);
       return res.length > 0 ? res[0].businessSourceValue : '-'
   };
    render(){
        const { contractInfo} = this.props;
        return(
            <div id={`gym-contract-basic-info`}>
                <div className='gym-contract-add-form'>
                    <div className='gym-contract-table'>
                    {
                                <div>
                                    <Row className='gym-contract-table-thead'>
                                        <Col span={4} className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                            <span className='gym-contract-table-thead-label'>宝宝姓名:</span>
                                        </Col>
                                        <Col span={8} className=''>
                                            <Link to={`${CustomerRoutes.客户360.link}${CommonUtils.stringify({leadsId:contractInfo.leadsId})}`} target='_blank'>
                                                <span title={contractInfo.babyName} className='gym-contract-table-thead-babyName'>
                                                    {this.lengthFormat(contractInfo.babyName)}
                                                </span>
                                            </Link>

                                        </Col>
                                        <Col span={4} className='gym-contract-table-thead-babyName'>
                                            <span className='gym-contract-table-thead-label'>月龄:</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-thead-right'>
                                            <span className='gym-contract-table-thead-babyName'>{contractInfo.monthAge}</span>
                                        </Col>
                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>合同编号:</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>{contractInfo.contractCode}</span>
                                        </Col>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>业务来源:</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>
                                                {this.getBusinessSource(contractInfo.businessSource)}
                                            </span>
                                        </Col>

                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>课程包类型:</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>{this.formatPackageType(contractInfo.packageType)}</span>
                                        </Col>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>合同类型:</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>{this.formatContractType(contractInfo.contractType)}</span>
                                        </Col>

                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>课时数:</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>{contractInfo.totalCourseNum}</span>
                                        </Col>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>课程包名称:</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>{contractInfo.packageName}</span>
                                        </Col>

                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>课程包定价:</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>{contractInfo.totalCoursePrice && contractInfo.totalCoursePrice.toFixed(2)}</span>
                                        </Col>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>赠送课时数:</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>
                                                {contractInfo.reallyFreeCourseNum || 0}
                                            </span>
                                            <span className='gym-contract-add-form-wrap-preferential'>
                                                {!!contractInfo.reallyFreeCourseNum && calculateDate(contractInfo.reallyFreeCourseNum, contractInfo.totalCourseNum)}
                                            </span>
                                        </Col>

                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>注册费:</span>
                                        </Col>
                                        {/*Todo 后期排课*/}
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>{contractInfo.registeredFee ? contractInfo.registeredFee.toFixed(2) : 0}</span>
                                        </Col>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>课程包实收价:</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>{contractInfo.reallyAfterDiscountPrice && contractInfo.reallyAfterDiscountPrice.toFixed(2)}</span>
                                            <span className='gym-contract-add-form-wrap-preferential'>
                                                {!!contractInfo.reallyAfterDiscountPrice && calculatePrice(contractInfo.reallyAfterDiscountPrice, contractInfo.totalCoursePrice)}
                                            </span>
                                        </Col>

                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>签约日:</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>{contractInfo.signTime && moment(contractInfo.signTime).format('YYYY-MM-DD')}</span>
                                        </Col>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>签约人:</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>{contractInfo.salesStaffName}</span>
                                        </Col>

                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>起始日:</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>{contractInfo.effectiveTime && moment(contractInfo.effectiveTime).format('YYYY-MM-DD')}</span>
                                        </Col>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>有效期长度:</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>{contractInfo.periodOfValidity}</span>
                                        </Col>

                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>所属中心:</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>{`${contractInfo.centerCode}-${contractInfo.centerName}`}</span>
                                        </Col>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>到期日:</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>{contractInfo.endTime && moment(contractInfo.endTime).format('YYYY-MM-DD')}</span>
                                        </Col>

                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>合同状态:</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>{this.formatContractStatus(contractInfo.contractStatus)}</span>
                                        </Col>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>付款状态:</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>{this.formatPaymentStatus(contractInfo.paymentStatus)}</span>
                                        </Col>

                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>PR礼品:</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            {
                                                (contractInfo.freeGiftUsedInfoList || []).map((item: any, index: number) =>
                                                    <span key={item.freeGiftId}>
                                                        {`${index !== 0 ? '，' : ''}${item.freeGiftName ? item.freeGiftName : '其他'}*${item.freeGiftNum}`}
                                                    </span>
                                                )
                                            }
                                        </Col>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>审批状态:</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>{this.formatApprovalStatus(contractInfo.approvalStatus)}</span>
                                        </Col>
                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>PR总价:</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>
                                                {
                                                    (contractInfo.freeGiftUsedInfoList || []).map((item: any) =>
                                                        item.freeGiftNum * (item.freeGiftPrice || 0)).reduce((a, b) => a + b, 0)
                                                }
                                            </span>
                                        </Col>
                                        {
                                            contractInfo.businessSource === "75002" &&
                                            <div>
                                                <Col span={4} className='gym-contract-table-tbody-label'>
                                                    <span>关联合同:</span>
                                                </Col>
                                                <Col span={8} className='gym-contract-table-tbody-value'>
                                                    {
                                                        (contractInfo.relatedContracts || []).map((item: any, index: number) =>
                                                            <span key={item.relatedContractId}>
                                                                {`${index !== 0 ? '，' : ''}${item.relatedContractCode}`}
                                                            </span>
                                                        )
                                                    }
                                                </Col>
                                            </div>
                                        }
                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>所属GB:</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>{contractInfo.gbstaffname}</span>
                                        </Col>
                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>法定监护人</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>
                                                {contractInfo.legalGuardianName}
                                            </span>
                                        </Col>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>是否使用电子合同</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>
                                                {contractInfo.electronicFlag === 1 ? '是' : '否'}
                                            </span>
                                        </Col>
                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <div style={{ display: "flex", alignItems:'center' }}>
                                            <div className='gym-contract-table-tbody-label'>
                                                <span>上传附件</span>
                                            </div>
                                            <div >
                                                <Upload
                                                    action={'/api' + SetApi.文件上传}
                                                    beforeUpload={this.beforeUpload}
                                                    headers={
                                                        Object.assign({}, {
                                                            token: User.getToken,
                                                            centerCode: User.centerCode,
                                                            userId: User.userId,
                                                            userName: User.userName
                                                        })
                                                    }
                                                    accept='.pdf'
                                                    name='file'
                                                    onChange={(info) => {
                                                        if (info.file.status === 'done') {
                                                            const response = info.file.response.data
                                                            saveAttachment({
                                                                recordRequests: [{
                                                                    fileId: response.id,
                                                                    fileName: response.fileName
                                                                }],
                                                                contractId: contractInfo.contractId,
                                                                currentCenterId: User.currentCenterId
                                                            }).then(()=>{
                                                                this.eleUpload.state.fileList = []
                                                                this.props.emitNext([...this.props.contractInfo.records,{
                                                                    fileId: response.id,
                                                                    fileName: response.fileName
                                                                }])
                                                            })
                                                    }
                                                    }}
                                                    ref={el => this.eleUpload = el }
                                                >
                                                    <Button
                                                        className='ml5'
                                                        disabled={(contractInfo.approvalStatus === '19005' && contractInfo.paymentStatus==='20003')?false:true}
                                                    >
                                                        <Icon type="upload"  />
                                                    </Button>
                                                </Upload>
                                                <div>
                                                    {
                                                        (this.props.contractInfo.records || []).map(item => (
                                                            <div key={item.fileId} style={{
                                                                display:"flex",
                                                                lineHeight:"100%",
                                                                color:"#009cbd",
                                                                margin:"5px"
                                                            }}>
                                                                <p>{item.fileName}</p>
                                                                <Icon type="arrow-down" style={{color:"#ccc",marginLeft:"5px"}} onClick={()=>{
                                                                    downloadFile(item)
                                                                }}/>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </Row>


                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>是否绑定其他合同</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>
                                                {contractInfo.hasBindingContract ? '是': '否'}
                                            </span>
                                        </Col>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>其他绑定合同实收价</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>
                                                {contractInfo.bindingActualPrice}
                                            </span>
                                        </Col>
                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>合同实收总价</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>
                                                {contractInfo.actualTotalPrice}
                                            </span>
                                        </Col>
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            <span>合同绑定月份</span>
                                        </Col>
                                        <Col span={8} className='gym-contract-table-tbody-value'>
                                            <span>
                                                {contractInfo.bindingContractMonth}个月
                                            </span>
                                        </Col>
                                    </Row>
                                    <div className='gym-contract-table-tbody gym-contract-table-tbody-bottom footer'>
                                        <div className='gym-contract-table-tbody-label gym-contract-table-tbody-left'>
                                            <span>备注:</span>
                                        </div>
                                        <div className='gym-contract-table-tbody-value gym-contract-table-tbody-right'>
                                            <span>{contractInfo.remark}</span>
                                        </div>
                                    </div>
                                </div>
                    }

                    </div>
                </div>
            </div>
        )
    }
}

export {BasicContractInfo}
