/**
 * desc: 部分退费确认付款页面
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2023/8/29
 * Time: 16:39
 */
import React from 'react'
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {PageTitle} from "@/ui/component/pageTitle";
import {CommonUtils, SafeCalculate} from "@/common/utils/commonUtils";
import {connect} from "@/common/decorator/connect";
import {selectPartRefundDetailTypes} from "@/saga/selectors/contract";
import {Row, Col, Form, Select, DatePicker} from 'antd';
import {downloadFile, getPartRefundDetail, payPartRefund} from "@redux-actions/contract";
import {User} from "@/common/beans/user";
import {payTypes} from "@/ui/pages/contract/enum/contract";
import {form} from "@/common/decorator/form";
import {moneyType_format} from "@/ui/pages/contract/filter/contractFilter";
import moment from 'moment';
import {Routes} from "@/router/enum/routes";
import {CancelButton} from "@/ui/component/cancelButton";
import history from "@/router/history";
import {Message} from "@/ui/component/message/message";
import {getContractDetailAmount} from "@redux-actions/payOrReceiveContract";
import {FUNC} from "@/ui/pages/setting/enum/functions";

const FormItem = Form.Item;
const SelectOption = Select.Option;


@connect((state:any) => ({
    partRefundStatusList: selectPartRefundDetailTypes(state),
}))
@form()
class PartRefundConfirm extends React.Component <any, any> {
    private routes = [
        {name: '合同', path: '', link: '#', id: 'contract'},
        {name: '收付款管理', path: '', link: '#', id: 'contractManagement'},
        {name: '付款管理', path: '', link: '#', id: 'contractManagementPay'},
        {name: '部分退费确认付款', path: '', link: '#', id: 'contractManagementRecord'}
    ];
    id:string;
    contractId:string;
    contractCode: string;
    status: string;
    aparId: string;
    leadsId: string
    constructor(props){
        super(props)
        if(CommonUtils.hasParams(props)){
            this.id = CommonUtils.parse(props).id;
            this.contractId = CommonUtils.parse(props).contractId;
            this.contractCode = CommonUtils.parse(props).contractCode;
            this.aparId = CommonUtils.parse(props).aparId;
            this.leadsId = CommonUtils.parse(props).leadsId;
            this.status = CommonUtils.parse(props).status;
        }
        this.state = {
            content: {},
            payContent: {}
        }
    }
    componentDidMount() {
        this.getDetail();
    }
    getDetail = () => {
        const param = {
            id:this.id,
            currentCenterId:User.currentCenterId,
            contractCode: this.contractCode,
            contractId: this.contractId
        };
        const postData ={
            "aparId":this.aparId,
            "financialContent":35011,
            "leadsId":this.leadsId
        };
        Promise.all([
            getPartRefundDetail(param),
            getContractDetailAmount(postData),
        ]).then((res) => {
            const [content, payContent] = res;
            this.setState({content: content, payContent})
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
     * 选择时间
     */
    disabledDate = (current) => {
        return current && current > moment().endOf('day');
    };
    confirmSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if(!err){
                const param = {
                    currentCenterId:User.currentCenterId,
                    contractId: this.contractId,
                    id: this.id,
                    financialMode: values.packagePayType,
                    financialDate: moment(values.receiveDate).valueOf()
                }
                payPartRefund(param).then(res => {
                    Message.success('付款成功！', 3, () => {
                        history.push(`${Routes.合同付款管理.link}${CommonUtils.stringify({type: 'partRefund'})}`)
                    })
                })
            }
        })

    };
    /**
     * 下载附件
     * @param file
     */
    download = (file) => {
        const param = {fileId: file.id, fileName:file.photoName};
        downloadFile(param)
    };
    render () {
        const {content, payContent} = this.state;
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <div id=''>
                <BreadCrumb routes={this.routes} />
                <div className='page-wrap'>
                    <PageTitle title={`基本信息`}/>
                    <div className='gym-contract-table'>
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
                                <span>调整原因说明:</span>
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
                    </div>
                </div>
                <div className='page-wrap'>
                    <PageTitle title={`付款信息`}/>
                    <Form onSubmit={this.confirmSubmit}>
                        <Row
                            className='gym-contract-table-tbody gym-contract-table-top gym-contract-table-thead-left gym-contract-table-thead-right'>
                            <Col span={4}
                                 className='gym-contract-table-tbody-label gym-contract-table-thead-left'>
                                <span>原由:</span>
                            </Col>
                            <Col span={8} className='gym-contract-table-tbody-form'>
                                <FormItem className='gym-act-modal-form'>
                                    部分退费
                                </FormItem>
                            </Col>
                            <Col span={4} className='gym-contract-table-tbody-label  gym-contract-table-required-label'>
                                <div>
                                    <span className='gym-contract-table-required'>*</span>
                                    <span>付款方式:</span>
                                </div>
                            </Col>
                            <Col span={8}
                                 className='gym-contract-table-tbody-form gym-contract-table-thead-right'>
                                {
                                    payContent.hasPayment === 0 ?
                                    <FormItem className='gym-act-modal-form gym-contract-date'>
                                        {
                                            getFieldDecorator('packagePayType', {
                                                initialValue: '',
                                                rules: [
                                                    {required: true, message: '请选择付款方式!'}
                                                ]
                                            })(
                                                <Select className='gym-employee-add-select' style={{width:200}}>
                                                    {
                                                        payTypes.map((item: any) => (
                                                            <SelectOption key={item.postCode} value={item.postCode}>
                                                                {item.postName}
                                                            </SelectOption>
                                                        ))
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                    :<FormItem className='gym-act-modal-form'>
                                            <span>{moneyType_format(payContent.financialMode)}</span>
                                        </FormItem>
                                }

                            </Col>
                        </Row>
                        <Row className='gym-contract-table-tbody gym-contract-table-tbody-left gym-contract-table-tbody-right'>
                            <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-tbody-left gym-contract-table-required-label'>
                                <div>
                                    <span className='gym-contract-table-required'>*</span>
                                    <span>付款日期:</span>
                                </div>
                            </Col>
                            <Col span={8} className='gym-contract-table-tbody-form'>
                                {
                                    payContent.hasPayment === 0 ?
                                    <FormItem className='gym-act-modal-form gym-contract-date'>
                                        {
                                            getFieldDecorator('receiveDate', {
                                                initialValue: null,
                                                rules: [
                                                    {required: true, message: '请选择日期!'}
                                                ]
                                            })(
                                                <DatePicker
                                                    style={{width: 200}}
                                                    disabledDate={this.disabledDate}
                                                />
                                            )
                                        }
                                    </FormItem>
                                    :
                                    <FormItem className='gym-act-modal-form'>
                                        <span>{content.paymentRefundTime  ? moment(content.paymentRefundTime).format('YYYY-MM-DD') : '-'}</span>
                                    </FormItem>
                                }
                            </Col>
                            <Col span={4} className='gym-contract-table-tbody-label '>
                                <span>付款人:</span>
                            </Col>
                            <Col span={8} className='gym-contract-table-tbody-form gym-contract-table-tbody-right'>
                                <FormItem className='gym-act-modal-form'>
                                    {payContent.hasPayment === 0 ? `${User.chineseName} ${User.englishName}`  :content.paymentRefundByName}
                                </FormItem>
                            </Col>
                        </Row>
                        {
                            payContent.hasPayment === 0 &&
                            <Row className='gym-contract-confirm-content'>
                                <Col span={10}>
                                    <span className='gym-contract-confirm-label'>本次付款金额:</span>
                                    <span className='gym-contract-confirm-value'>{content.partRefundCoursePrice}</span>
                                </Col>
                            </Row>
                        }
                        {
                            (payContent.hasPayment === 0) &&
                            <Row>
                                <Col span={24}>
                                    <CancelButton submitText='付款' form={form} goBackLink={`${Routes.合同付款管理.link}${CommonUtils.stringify({type: 'partRefund'})}`}/>
                                </Col>
                            </Row>
                        }
                    </Form>
                </div>
            </div>
        )
    }
}

export {PartRefundConfirm}
