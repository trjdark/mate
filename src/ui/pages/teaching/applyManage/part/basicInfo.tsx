/**
 * desc: basicInfo 详情中的基础信息
 * User: colin.lu
 * Date: 2018/11/07
 * Time: 上午10:00
 */

import React from 'react';
import { Row, Col} from "antd";
import {PageTitle} from "../../../../component/pageTitle";

declare interface BasicInfoProps {
    applyInfo: any,
    contractTypes?: Array<any>
}

class BasicInfo extends React.Component<BasicInfoProps, any> {

    render() {
        const {applyInfo} = this.props;
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
                                    <span className='gym-contract-table-thead-babyName'>{applyInfo.previewApplyInfo ? applyInfo.previewApplyInfo.babyName: ''}</span>
                                </Col>
                                <Col span={4}  className='gym-contract-table-thead-babyName'>
                                    <span className='gym-contract-table-thead-label'>月龄:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-thead-right'>
                                    <span className='gym-contract-table-thead-babyName'>{applyInfo.previewApplyInfo ?applyInfo.previewApplyInfo.monthValue : ''}</span>
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-tbody'>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>课程时间:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{applyInfo.previewApplyInfo ? applyInfo.previewApplyInfo.previewTime :''}</span>
                                </Col>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>审批状态:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{applyInfo.previewApplyInfo ? applyInfo.previewApplyInfo.statusValue : ''}</span>
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-tbody'>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>课程:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{applyInfo.previewApplyInfo ? applyInfo.previewApplyInfo.courseCode : ''}</span>
                                </Col>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>教室:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{applyInfo.previewApplyInfo ? applyInfo.previewApplyInfo.classroom : ''}</span>
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-tbody'>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>INS:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{applyInfo.previewApplyInfo ? applyInfo.previewApplyInfo.ins : ''}</span>
                                </Col>
                                <Col span={4}  className='gym-contract-table-tbody-label'>
                                    <span>容量:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-tbody-value'>
                                    <span>{applyInfo.previewApplyInfo ? applyInfo.previewApplyInfo.capacity : ''}</span>
                                </Col>
                            </Row>
                            <Row className='gym-contract-table-tbody gym-contract-table-tbody-bottom'>
                                <Col className='gym-contract-table-tbody-value width20 gym-contract-table-tbody-left'>
                                    <span>R:{applyInfo.previewApplyInfo ? applyInfo.previewApplyInfo.regular : ''}</span>
                                </Col>
                                <Col className='gym-contract-table-tbody-value width20'>
                                    <span>M:{applyInfo.previewApplyInfo ? applyInfo.previewApplyInfo.makeUp : ''}</span>
                                </Col>
                                <Col className='gym-contract-table-tbody-value width20'>
                                    <span>P:{applyInfo.previewApplyInfo ? applyInfo.previewApplyInfo.preview : ''}</span>
                                </Col>
                                <Col className='gym-contract-table-tbody-value width20'>
                                    <span>空余:{applyInfo.previewApplyInfo ? (applyInfo.previewApplyInfo.capacity - applyInfo.previewApplyInfo.regular - applyInfo.previewApplyInfo.makeUp - applyInfo.previewApplyInfo.preview) : ''}</span>
                                </Col>
                                <Col className='gym-contract-table-tbody-value width20 gym-contract-table-tbody-right'>
                                    <span>W:{applyInfo.previewApplyInfo ? applyInfo.previewApplyInfo.queuing : ''}</span>
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
