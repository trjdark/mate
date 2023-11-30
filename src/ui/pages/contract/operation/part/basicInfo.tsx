/**
 * desc: basicInfo 详情中的基础信息
 * User: colin.lu
 * Date: 2018/11/07
 * Time: 上午10:00
 */

import React from 'react';
import { Row, Col} from "antd";
import {PageTitle} from "../../../../component/pageTitle";
import moment from 'moment';
import {connect} from "../../../../../common/decorator/connect";
import {selectContractTypes} from "../../../../../saga/selectors/contract";
import {selectBusinessSourceList} from "@/saga/selectors/home";

declare interface BasicInfoProps {
    contractInfo: any,
    contractTypes?: Array<any>
    businessSourceMap?:any[]
}

@connect((state:any) => ({
    contractTypes: selectContractTypes(state),
    businessSourceMap: selectBusinessSourceList(state)
}))
class BasicInfo extends React.Component<BasicInfoProps, any> {
    formatContractTypes = (type:string) => {
        const {contractTypes} = this.props;
        const outStatus = (contractTypes).filter((item:any) => item.code === type);
        return outStatus.length > 0 ? outStatus[0].codeValue : '-'
    }
    /**
     * 获取业务来源
     */
    getBusinessSource = (text:string) => {
        const {businessSourceMap} = this.props;
        let res = businessSourceMap.filter(item => item.businessSourceCode === text);
        return res.length > 0 ? res[0].businessSourceValue : '-'
    };
    render() {
        const {contractInfo} = this.props;
        return (
            <div id={`gym-basic-info`}>
                <PageTitle title={`基本信息`}/>
                <div>
                    <div className='gym-contract-table'>
                        <div>
                            <Row className='gym-contract-table-thead'>
                                <Col span={4}  className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                    <span className='gym-contract-table-thead-label'>宝宝姓名:</span>
                                </Col>
                                <Col span={8}  className=''>
                                    <span className='gym-contract-table-thead-babyName'>{contractInfo.babyName}</span>
                                </Col>
                                <Col span={4}  className='gym-contract-table-thead-babyName'>
                                    <span className='gym-contract-table-thead-label'>月龄:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-thead-right'>
                                    <span className='gym-contract-table-thead-babyName'>{contractInfo.monthAge}</span>
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-tbody'>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>GB:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{contractInfo.gbstaffname}</span>
                                </Col>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>GA:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{contractInfo.gastaffname}</span>
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-tbody'>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>合同编号:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{contractInfo.contractCode}</span>
                                </Col>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>合同类型:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{this.formatContractTypes(contractInfo.contractType)}</span>
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-tbody'>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>课程包类型:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>课次产品</span>
                                </Col>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>课程包名称:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{contractInfo.packageName}</span>
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-tbody'>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>业务来源:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{this.getBusinessSource(contractInfo.businessSource)}</span>
                                </Col>
                                {
                                    contractInfo.businessSource === "75002" &&
                                    <Col span={4}  className='gym-contract-table-tbody-label'>
                                        <span>关联合同:</span>
                                    </Col>
                                }

                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                {
                                    (contractInfo.relatedContracts || []).map((item:any, index:number) =>
                                        <span key={item.relatedContractId}>
                                            {`${index !== 0 ? '，': ''}${item.relatedContractCode}`}
                                        </span>
                                    )
                                }
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-tbody'>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>课程数:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{contractInfo.totalCourseNum}</span>
                                </Col>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>课程包实收价:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{contractInfo.reallyAfterDiscountPrice && contractInfo.reallyAfterDiscountPrice.toFixed(2)}</span>
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-tbody'>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>剩余课程:</span>
                                </Col>
                                {/*Todo 后期排课*/}
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{contractInfo.remainingCourseNum != null ? contractInfo.remainingCourseNum : '--'}</span>
                                </Col>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>剩余金额:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{contractInfo.remainingCoursePrice != null ? contractInfo.remainingCoursePrice.toFixed(2) : '--'}</span>
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-tbody gym-contract-table-tbody-bottom'>
                                <Col span={4}  className='gym-contract-table-tbody-label gym-contract-table-tbody-left'>
                                    <span>起始日:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{moment(contractInfo.effectiveTime).format("YYYY-MM-DD")}</span>
                                </Col>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>到期日:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value gym-contract-table-tbody-right'>
                                    <span>{moment(contractInfo.endTime).format("YYYY-MM-DD")}</span>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export {BasicInfo}
