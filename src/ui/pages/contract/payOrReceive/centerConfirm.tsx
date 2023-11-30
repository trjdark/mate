/**
 * desc: 确认收款 付款页面
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */

import React from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {PageTitle} from "@/ui/component/pageTitle";
import {Row, Col, Form, Select, DatePicker, Checkbox, message, Button} from 'antd';
import {CommonUtils} from "@/common/utils/commonUtils";
import {CancelButton} from "@/ui/component/cancelButton";
import {Modal} from '@/ui/component/customerCreateModal'
import {User} from "@/common/beans/user";
import {contract_type__format, moneyType_format} from "../filter/contractFilter";
import {form} from "@/common/decorator/form";
import {
    getContractDetail
} from '@redux-actions/contract';
import {
    getContractDetailAmount, confirmReceive, confirmPay
} from '@redux-actions/payOrReceiveContract';
import moment from "moment";
import {payTypes} from "../enum/contract";
import {Routes} from "@/router/enum/routes";
import history from "../../../../router/history";
const FormItem = Form.Item;
const SelectOption = Select.Option;


//form装饰器
@form()

class CenterConfirm extends React.Component<any, any> {
    submitRequestId = CommonUtils.generateGuid();
    state = {
        //路由
        routes: [
            {
                name: '合同',
                path: '',
                link: '#',
                id: 'contract'
            },{
                name: '收付款管理',
                path: '',
                link: '#',
                id: 'contractManagement'
            },{
                name: '',
                path: '',
                link: '#',
                id: 'contractManagementPay'
            },{
                name: '',
                path: '',
                link: '#',
                id: 'contractManagementRecord'
            }
        ],
        //上传文件列表
        approvalStatus: 'inApproval', //view 查看 edit 编辑 outApproval转出审批 inApproval转入审批
        showAmount: 0,
        allAmount: 0,
        deposit: 0,
        ifChecked:true,
        basicInfo: {
            babyName: null,
            monthAge: null,
            gbstaffname: null,
            gastaffname: null,
            contractCode: null,
            contractId: null,
            contractType: null,
            packageName: null,
            packageType: null,
            reallyAfterDiscountPrice: null,
            totalCoursePrice: null,
            totalCourseNum: null,
            remainingCourseNum: null,
            remainingCoursePrice:null,
            effectiveTime: null,
            endTime: null
        },
        amountInfo: {
            cid: null,
            financialMode: null,
            estimatedAmount: null,
            earnestList: [],
            hasPayment: null,
            operatorStaffName: null,
            reason: null,
            type: '',
            date: '',
            amount: null,//定金
            financialContentAmount: null,//收付款总金额
            ifChecked: true,
            id: '',
            lastUpdateDate: null,
            mode: null,
            payDate: null
        },
        visible: false
    };

    //初始化路由参数
    routeParams = CommonUtils.hasParams(this.props)? CommonUtils.parse(this.props) : {};


    componentDidMount() {
        this.setRoutes();
        this.getBasicInfo();
    }

    /**
     * 设置路由显示
     */
    setRoutes = () => {
        if(window.location.href.indexOf('/confirmReceive') > -1) {
            this.setState({
                routes:[
                    {
                        name: '合同',
                        path: '',
                        link: '#',
                        id: 'contract'
                    },{
                        name: '收付款管理',
                        path: '',
                        link: '#',
                        id: 'contractManagement'
                    },{
                        name: '收款管理',
                        path: '',
                        link: '#',
                        id: 'contractManagementPay'
                    },{
                        name: '确认收款',
                        path: '',
                        link: '#',
                        id: 'contractManagementRecord'
                    }
                ]
            });
        }else if(window.location.href.indexOf('/confirmPay') > -1){
            this.setState({
                routes:[
                    {
                        name: '合同',
                        path: '',
                        link: '#',
                        id: 'contract'
                    },{
                        name: '收付款管理',
                        path: '',
                        link: '#',
                        id: 'contractManagement'
                    },{
                        name: '付款管理',
                        path: '',
                        link: '#',
                        id: 'contractManagementPay'
                    },{
                        name: '确认付款',
                        path: '',
                        link: '#',
                        id: 'contractManagementRecord'
                    }
                ]
            });
        }
    };

    /**
     * 查询基础信息数据
     */
    getBasicInfo = () => {
        //是合同收款
        if(window.location.href.indexOf('confirmReceive') > -1){
            const postData ={
                "aparId":this.routeParams.aparId,
                "financialContent":33003,
                "leadsId":this.routeParams.leadsId
            };

            //查询收款信息
            getContractDetailAmount(postData).then((res) => {
                this.setState({
                    amountInfo:res
                });
                if(res.earnestList.length !== 0){
                    this.state.showAmount = this.routeParams.estimatedAmount - (res.earnestList[0].amount?res.earnestList[0].amount:0);
                }else{
                    this.state.showAmount = this.routeParams.estimateAmount
                }

            }, (err) => {
                //返回请求reject
                message.error(err.msg)
            });
        }else{
            let postData ={
                "aparId":this.routeParams.aparId,
                "financialContent":35003,
                "leadsId":this.routeParams.leadsId
            };

            //查询收款信息
            getContractDetailAmount(postData).then((res) => {
                this.setState({
                    amountInfo:res
                });
                if(res.earnestList.length !== 0){
                    this.state.showAmount = this.routeParams.estimatedAmount - (res.earnestList[0].amount?res.earnestList[0].amount:0);
                }else{
                    this.state.showAmount = this.routeParams.estimateAmount
                }

            }, (err) => {
                //返回请求reject
                message.error(err.msg)
            });
        }

        //查询合同信息基本信息
        getContractDetail({
            currentCenterId: User.currentCenterId,
            contractCode: this.routeParams.contractCode,
            contractId: this.routeParams.contractId,
        }).then((res:any)=>{
            this.setState({
                basicInfo: res
            });
        },(err:any)=>{
            message.error(err.msg);
        })
    };


    handleChange = ({file, fileList}) => {
        this.setState({fileList});
    };

    /**
     * 非合同（无定金）确认付款或者收款
     */
    confirm = (e:any) => {
        e.preventDefault();
        this.props.form.validateFields((err) => {
            if(!err){
                //转中心同意或者取消

            }
        });
    };

    /**
     * 勾选定金
     */
    checkDeposit = (e) => {
        this.setState({
            ifChecked: e.target.checked
        });

        if(e.target.checked){
            this.state.showAmount = this.routeParams.estimatedAmount - parseInt(this.state.amountInfo.amount);
            this.setState({
                showAmount:this.state.showAmount
            })
        }else{
            this.state.showAmount = this.routeParams.estimatedAmount;
            this.setState({
                showAmount:this.state.showAmount
            })
        }
    };

    /**
     * 选择时间
     */
    disabledDate = (current) => {
        // Can not select days before today and today
        return current && current > moment().endOf('day');
    };

    /**
     * 确认收款
     */
    confirmSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if(!err){
                if(parseInt(values.startMonth) > parseInt(values.endMonth)){
                    message.warning("月龄起止错误！");
                    return null;
                }

                //弹窗展示二次确认
                this.setState({
                    visible: true
                });
            }
        })
    };

    handleOk = () => {
        let postParams = {
            "aparId": this.routeParams.aparId,
            "centerId": User.currentCenterId,
            "contractId": this.routeParams.contractId,
            "financialMode": this.props.form.getFieldsValue().packagePayType,
            "financialDate": moment(this.props.form.getFieldsValue().receiveDate).format('YYYY-MM-DD'),
            "financialRecordIdList": []
        };

        let payPostParams = {
            "aparId": this.routeParams.aparId,
            "centerId": User.currentCenterId,
            "contractId": this.routeParams.contractId,
            "financialMode": this.props.form.getFieldsValue().packagePayType,
            "financialDate": moment(this.props.form.getFieldsValue().receiveDate).format('YYYY-MM-DD')
        };

        if(this.state.ifChecked){
            postParams.financialRecordIdList.push(this.state.amountInfo.id);
        }else{
            postParams.financialRecordIdList = [];
        }

        /**
         * 确认合同收款
         * @param someParam<>
         * @method post
         * @response  res<>
         */
        if(window.location.href.indexOf('confirmReceive') > -1){
            confirmReceive(postParams, this.submitRequestId).then(() => {
                message.success('收款成功!');
                // history.push(Routes.合同收款管理转中心.path)
                history.push(`${Routes.合同收款管理.link}${CommonUtils.stringify({type: 'trans'})}`)
            }, (err) => {
                //返回请求reject
                message.error(err.msg);
            })
        }else{
            confirmPay(payPostParams, this.submitRequestId).then(() => {
                message.success('付款成功!');
                // history.push(Routes.合同付款管理转中心.path)
                history.push(`${Routes.合同付款管理.link}${CommonUtils.stringify({type: 'trans'})}`)
            }, (err) => {
                //返回请求reject
                message.error(err.msg);
            })
        }
    };

    handleCancel = () => {
        this.setState({
            visible: false
        })
    };

    /**
     * 返回收款页面
     */
    returnToReceive = () => {
        if(window.location.href.indexOf('confirmReceive') > -1){
            // history.push(Routes.合同收款管理转中心.path)
            history.push(`${Routes.合同收款管理.link}${CommonUtils.stringify({type: 'trans'})}`)
        }else{
            // history.push(Routes.合同付款管理转中心.path)
            history.push(`${Routes.合同付款管理.link}${CommonUtils.stringify({type: 'trans'})}`)

        }
    };

    /**
     * 截取字符串
     */
    lengthFormat = (key:string) => {
        if(key && key.length > 20){
            return (`${key.substr(0,20)}...`)
        }else{
            return key
        }
    };

    render() {
        const {amountInfo, basicInfo} = this.state;
        const {form} = this.props;
        const {getFieldDecorator} = this.props.form;

        let matchReceive = window.location.href.indexOf('/confirmReceive') > -1;
        let matchPay = window.location.href.indexOf('/confirmPay') > -1;

        return (
            <div id={`gym-contract-receive`}>
                <BreadCrumb routes={this.state.routes} />
                <div className='gym-add-application'>
                    {/*基础信息部分*/}
                    <div className='page-wrap gym-contract-content'>
                        <PageTitle title={`基本信息`}/>
                        <div>
                            <div className='gym-contract-table'>
                                <div>
                                    <Row className='gym-contract-table-thead'>
                                        <Col span={4}  className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                            <span className='gym-contract-table-thead-label'>宝宝姓名:</span>
                                        </Col>
                                        <Col span={8}  className=''>
                                            <span className='gym-contract-table-thead-babyName'>{basicInfo.babyName}</span>
                                        </Col>
                                        <Col span={4}  className='gym-contract-table-thead-babyName'>
                                            <span className='gym-contract-table-thead-label'>月龄:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-thead-right'>
                                            <span className='gym-contract-table-thead-babyName'>{basicInfo.monthAge}</span>
                                        </Col>
                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4}  className='gym-contract-table-tbody-label'>
                                            <span>GB:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value'>
                                            <span>{basicInfo.gbstaffname}</span>
                                        </Col>
                                        <Col span={4}  className='gym-contract-table-tbody-label'>
                                            <span>GA:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value'>
                                            <span>{basicInfo.gastaffname}</span>
                                        </Col>
                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4}  className='gym-contract-table-tbody-label'>
                                            <span>合同编号:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value'>
                                            <span>{basicInfo.contractCode}</span>
                                        </Col>
                                        <Col span={4}  className='gym-contract-table-tbody-label'>
                                            <span>合同类型:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value'>
                                            <span>{contract_type__format(basicInfo.contractType)}</span>
                                        </Col>
                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4}  className='gym-contract-table-tbody-label'>
                                            <span>课程包类型:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value'>
                                            <span>{(basicInfo.packageType === 1)? '课次产品' : '时段产品'}</span>
                                        </Col>
                                        <Col span={4}  className='gym-contract-table-tbody-label'>
                                            <span>课程包名称:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value'>
                                            <span>{basicInfo.packageName}</span>
                                        </Col>
                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4}  className='gym-contract-table-tbody-label'>
                                            <span>课程数:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value'>
                                            <span>{basicInfo.totalCourseNum}</span>
                                        </Col>
                                        <Col span={4}  className='gym-contract-table-tbody-label'>
                                            <span>课程包实收价:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value'>
                                            <span>{basicInfo.reallyAfterDiscountPrice}</span>
                                        </Col>
                                    </Row>
                                    <Row className='gym-contract-table-tbody'>
                                        <Col span={4}  className='gym-contract-table-tbody-label'>
                                            <span>剩余课程:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value'>
                                            <span>{basicInfo.remainingCourseNum}</span>
                                        </Col>
                                        <Col span={4}  className='gym-contract-table-tbody-label'>
                                            <span>剩余金额:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value'>
                                            <span>{basicInfo.remainingCoursePrice}</span>
                                        </Col>
                                    </Row>
                                    <Row className='gym-contract-table-tbody gym-contract-table-tbody-bottom'>
                                        <Col span={4}  className='gym-contract-table-tbody-label gym-contract-table-tbody-left'>
                                            <span>起始日:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value'>
                                            <span>{moment(basicInfo.effectiveTime).format('YYYY-MM-DD')}</span>
                                        </Col>
                                        <Col span={4}  className='gym-contract-table-tbody-label'>
                                            <span>到期日:</span>
                                        </Col>
                                        <Col span={8}  className='gym-contract-table-tbody-value gym-contract-table-tbody-right'>
                                            <span>{moment(basicInfo.endTime).format('YYYY-MM-DD')}</span>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*收款详情以及定金部分*/}
                    <div className='page-wrap gym-contract-content'>
                        {
                            matchReceive &&
                            <PageTitle title={`收款信息`}/>
                        }
                        {
                            matchPay &&
                            <PageTitle title={`付款信息`}/>
                        }
                        <div>
                            <Form onSubmit={this.confirmSubmit}>
                                <Row
                                    className='gym-contract-table-tbody gym-contract-table-top gym-contract-table-thead-left gym-contract-table-thead-right'>
                                    <Col span={4}
                                         className='gym-contract-table-tbody-label gym-contract-table-thead-left'>
                                        <span>原由:</span>
                                    </Col>
                                    <Col span={8} className='gym-contract-table-tbody-form'>
                                        <FormItem className='gym-act-modal-form'>
                                            转中心
                                        </FormItem>
                                    </Col>
                                    {
                                        amountInfo.hasPayment === 0 &&
                                        <Col span={4} className='gym-contract-table-tbody-label  gym-contract-table-required-label'>
                                            {
                                                matchReceive &&
                                                <div>
                                                    <span className='gym-contract-table-required'>*</span>
                                                    <span>收款方式:</span>
                                                </div>
                                            }
                                            {
                                                matchPay &&
                                                <div>
                                                    <span className='gym-contract-table-required'>*</span>
                                                    <span>付款方式:</span>
                                                </div>
                                            }
                                        </Col>
                                    }
                                    {
                                        amountInfo.hasPayment === 1 &&
                                        <Col span={4} className='gym-contract-table-tbody-label'>
                                            {
                                                matchReceive &&
                                                <span>收款方式:</span>
                                            }
                                            {
                                                matchPay &&
                                                <span>付款方式:</span>
                                            }
                                        </Col>
                                    }
                                    <Col span={8}
                                         className='gym-contract-table-tbody-form gym-contract-table-thead-right'>
                                        {
                                            amountInfo.hasPayment === 0 &&
                                            <FormItem className='gym-act-modal-form gym-contract-date'>
                                                {
                                                    getFieldDecorator('packagePayType', {
                                                        initialValue: '',
                                                        rules: [
                                                            {required: true, message: matchReceive?'请选择收款方式!':'请选择付款方式!'}
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
                                        }
                                        {
                                            amountInfo.hasPayment  === 1 &&
                                            <FormItem className='gym-act-modal-form'>
                                                <span>{moneyType_format(amountInfo.financialMode)}</span>
                                            </FormItem>
                                        }
                                    </Col>
                                </Row>
                                <Row className='gym-contract-table-tbody'>
                                    {
                                        amountInfo.hasPayment === 0 &&
                                        <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-tbody-left gym-contract-table-required-label'>
                                            {
                                                matchReceive &&
                                                <div>
                                                    <span className='gym-contract-table-required'>*</span>
                                                    <span>收款日期:</span>
                                                </div>
                                            }
                                            {
                                                matchPay &&
                                                <div>
                                                    <span className='gym-contract-table-required'>*</span>
                                                    <span>付款日期:</span>
                                                </div>
                                            }
                                        </Col>
                                    }
                                    {
                                        amountInfo.hasPayment === 1 &&
                                        <Col span={4}
                                             className='gym-contract-table-tbody-label gym-contract-table-tbody-left'>
                                            {
                                                matchReceive &&
                                                <span>收款日期:</span>
                                            }
                                            {
                                                matchPay &&
                                                <span>付款日期:</span>
                                            }
                                        </Col>
                                    }
                                    <Col span={8} className='gym-contract-table-tbody-form'>
                                        {
                                            amountInfo.hasPayment === 0 &&
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
                                        }
                                        {
                                            amountInfo.hasPayment === 1 &&
                                            <FormItem className='gym-act-modal-form'>
                                                {
                                                    getFieldDecorator('receiveDate', {
                                                    })(
                                                        <span>
                                                           {amountInfo.payDate !== '' ?moment(amountInfo.payDate).format('YYYY-MM-DD'):''}
                                                       </span>
                                                    )
                                                }
                                            </FormItem>
                                        }

                                    </Col>
                                    <Col span={4} className='gym-contract-table-tbody-label '>
                                        {
                                            matchReceive &&
                                            <span>收款人:</span>
                                        }
                                        {
                                            matchPay &&
                                            <span>付款人:</span>
                                        }
                                    </Col>
                                    <Col span={8} className='gym-contract-table-tbody-form'>
                                        <FormItem className='gym-act-modal-form'>
                                            {
                                                amountInfo.hasPayment === 1 &&
                                                `${amountInfo.operatorStaffName}`
                                            }
                                            {
                                                amountInfo.hasPayment === 0 &&
                                                `${User.englishName} ${User.chineseName}`
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <div>
                                    {
                                        amountInfo.hasPayment === 0 &&
                                        <div>
                                            <Row className='gym-contract-confirm-content'>
                                                <Col span={10}>
                                                    {
                                                        matchReceive &&
                                                        <span className='gym-contract-confirm-label'>本次收款金额:</span>
                                                    }
                                                    {
                                                        matchPay &&
                                                        <span className='gym-contract-confirm-label'>本次付款金额:</span>
                                                    }

                                                    {
                                                        !this.state.ifChecked &&
                                                        <span className='gym-contract-confirm-value'>{this.routeParams.estimatedAmount.toFixed(2)}</span>
                                                    }
                                                    {
                                                        this.state.ifChecked &&
                                                        <span className='gym-contract-confirm-value'>{(this.routeParams.estimatedAmount - (this.state.amountInfo.earnestList.length && this.state.amountInfo.earnestList.length > 0?this.state.amountInfo.earnestList[0].amount: 0)).toFixed(2)}</span>
                                                    }
                                                </Col>
                                                {
                                                    this.state.amountInfo.earnestList.length > 0 &&
                                                    <div>
                                                        <Col span={1} className='gym-contract-confirm-check-box'>
                                                            <span>
                                                                <Checkbox defaultChecked={true} onChange={this.checkDeposit}/>
                                                            </span>
                                                        </Col>
                                                        <Col span={13}>
                                                            <div>
                                                                <span className='gym-contract-confirm-check-label'>
                                                                    使用会员当前可用定金:
                                                                </span>
                                                                <span className='gym-contract-confirm-check-value'>
                                                                    {amountInfo.earnestList.length > 0 ? amountInfo.earnestList[0].amount : 0}
                                                                </span>
                                                                <span className='gym-contract-confirm-check-time'>
                                                                    {`(${moment(amountInfo.date).format('YYYY-MM-DD')})`}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className='gym-contract-confirm-check-tip'>将定金金额勾选后，就可以抵扣课程的费用</span>
                                                            </div>
                                                        </Col>
                                                    </div>
                                                }
                                            </Row>
                                            <Row>
                                                <Col span={24}>
                                                    {
                                                        matchReceive &&
                                                        <CancelButton submitText='收款' form={form} goBackLink={`${Routes.合同收款管理.link}${CommonUtils.stringify({type: 'trans'})}`}/>
                                                    }
                                                    {
                                                        matchPay &&
                                                        <CancelButton submitText='付款' form={form} goBackLink={`${Routes.合同付款管理.link}${CommonUtils.stringify({type: 'trans'})}`}/>
                                                    }
                                                </Col>
                                            </Row>
                                        </div>
                                    }
                                    {
                                        amountInfo.hasPayment === 1 &&
                                        <div>
                                            <Row className='gym-contract-confirm-content'>
                                                <Col span={10}>
                                                    {
                                                        matchReceive &&
                                                        <span className='gym-contract-confirm-label'>本次收款金额:</span>
                                                    }
                                                    {
                                                        matchPay &&
                                                        <span className='gym-contract-confirm-label'>本次付款金额:</span>
                                                    }
                                                    <span className='gym-contract-confirm-value'>{amountInfo.estimatedAmount.toFixed(2)}</span>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24} className='gym-contract-close-btn'>
                                                    <Button
                                                        htmlType="button"
                                                        className="gym-button-default gym-button-xs"
                                                        onClick={()=>this.returnToReceive()}
                                                    >
                                                        关闭
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    }
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
                <Modal
                    visible={this.state.visible}
                    handleOk={this.handleOk}
                    handleCancel={this.handleCancel}
                    contentText={`确定要给${this.lengthFormat(basicInfo.babyName)}进行${matchReceive?'转中心的收款吗？':'转中心的付款吗？'}`}
                />
            </div>
        )
    }
}

export {CenterConfirm}

