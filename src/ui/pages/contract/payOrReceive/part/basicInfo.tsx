/**
 * desc: basicInfo 详情中的基础信息
 * User: colin.lu
 * Date: 2018/11/07
 * Time: 上午10:00
 */

import React from 'react';
import { Row, Col} from "antd";
import {PageTitle} from "@/ui/component/pageTitle";

declare interface BasicInfoProps {
    form:any
}

class BasicInfo extends React.Component<BasicInfoProps, any> {
    constructor(props: any) {
        super(props);
        this.state = {}
    }
    render() {
        const {form} = this.props;

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
                                    <span className='gym-contract-table-thead-babyName'>{this.props.form.babyName}</span>
                                </Col>
                                <Col span={4}  className='gym-contract-table-thead-babyName'>
                                    <span className='gym-contract-table-thead-label'>月龄:</span>
                                </Col>
                                <Col span={8}  className='gym-contract-table-thead-right'>
                                    <span className='gym-contract-table-thead-babyName'>{this.props.form.monthAge}</span>
                                </Col>
                            </Row>
                            {
                                //其他类型原由基础信息只展示3个值
                                form.type === '1' || form.type === '3' || form.type === '4' && form.financialContent === 33006 &&
                                <div>
                                    <Row className='gym-contract-table-tbody gym-contract-table-tbody-bottom'>
                                        <Col span={4}  className='gym-contract-table-tbody-label gym-contract-table-tbody-left'>
                                            <span>GB:</span>
                                        </Col>
                                        <Col span={20}  className='gym-contract-table-tbody-value'>
                                            <span>{this.props.form.gbstaffname}</span>
                                        </Col>
                                    </Row>
                                </div>
                            }
                            {
                                //其他类型原由基础信息只展示3个值
                                form.type === '2' && form.financialContent != 33006 &&
                                <div>
                                    <Row className='gym-contract-table-tbody gym-contract-table-tbody-bottom'>
                                        <Col span={4}  className='gym-contract-table-tbody-label gym-contract-table-tbody-left'>
                                            <span>GB:</span>
                                        </Col>
                                        <Col span={20}  className='gym-contract-table-tbody-value'>
                                            <span>{this.props.form.gastaffname}</span>
                                        </Col>
                                    </Row>
                                </div>
                            }
                            {
                                //只有原由是注册费的收款的其他/合同收款/改包/转中心 才展示完整的基础信息
                                form.finicalContent === 33009 || form.finicalContent === 33002 || form.finicalContent === 33008 || form.finicalContent === 33003 &&
                                <div>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4}  className='gym-contract-table-tbody-label'>
                                            <span>GB:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value'>
                                            <span>{this.props.form.gbstaffname}</span>
                                        </Col>
                                        <Col span={4}  className='gym-contract-table-tbody-label'>
                                            <span>GA:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value'>
                                            <span>{this.props.form.gastaffname}</span>
                                        </Col>
                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4}  className='gym-contract-table-tbody-label'>
                                            <span>合同编号:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value'>
                                            <span>{this.props.form.contractCode}</span>
                                        </Col>
                                        <Col span={4}  className='gym-contract-table-tbody-label'>
                                            <span>合同类型:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value'>
                                            <span>{this.props.form.contractType}</span>
                                        </Col>
                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4}  className='gym-contract-table-tbody-label'>
                                            <span>课程包类型:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value'>
                                            <span>{this.props.form.packageType}</span>
                                        </Col>
                                        <Col span={4}  className='gym-contract-table-tbody-label'>
                                            <span>课程包名称:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value'>
                                            <span>{this.props.form.packageName}</span>
                                        </Col>
                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4}  className='gym-contract-table-tbody-label'>
                                            <span>课程数:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value'>
                                            <span>{this.props.form.totalCourseNum}</span>
                                        </Col>
                                        <Col span={4}  className='gym-contract-table-tbody-label'>
                                            <span>课程包实收价:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value'>
                                            <span>{this.props.form.reallyAfterDiscountPrice}</span>
                                        </Col>
                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4}  className='gym-contract-table-tbody-label'>
                                            <span>剩余课程:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value'>
                                            <span>{this.props.form.remainingCourseNum}</span>
                                        </Col>
                                        <Col span={4}  className='gym-contract-table-tbody-label'>
                                            <span>剩余金额:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value'>
                                            <span>{this.props.form.remainingCoursePrice}</span>
                                        </Col>
                                    </Row>
                                    <Row className='gym-contract-table-tbody gym-contract-table-tbody-bottom'>
                                        <Col span={4}  className='gym-contract-table-tbody-label gym-contract-table-tbody-left'>
                                            <span>起始日:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value'>
                                            <span>{this.props.form.effectiveTime}</span>
                                        </Col>
                                        <Col span={4}  className='gym-contract-table-tbody-label'>
                                            <span>到期日:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value gym-contract-table-tbody-right'>
                                            <span>{this.props.form.endTime}</span>
                                        </Col>
                                    </Row>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export {BasicInfo}
