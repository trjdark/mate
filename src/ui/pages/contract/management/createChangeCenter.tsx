/**
 * desc: 转中心页面
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/28
 * Time: 下午2:06
 */
import React from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Form, Row, Col} from "antd";
import {form} from "@/common/decorator/form";
import {InputNumber} from "@/ui/component/input";
import {Select, Option} from "../../../component/select";
import {CancelButton} from "@/ui/component/cancelButton";
import {UploadImg} from "@/ui/component/uploadImg";
import {Routes} from "@/router/enum/routes";
import {CommonUtils, SafeCalculate} from "@/common/utils/commonUtils";
import {createChangeCenter} from "@redux-actions/contract";
import history from "../../../../router/history";
import {User} from "@/common/beans/user";
import { getContractDetail, getContractInfo, checkGetRollInCenter} from "@redux-actions/contract";
import {TextArea} from "@/ui/component/input";
import {Message} from "@/ui/component/message/message";
import {BasicContractInfo} from "@/ui/pages/contract/management/part/basicContractInfo";
import {changeTypes} from "@/ui/pages/contract/enum/enum";

const FormItem = Form.Item;


@form()

class CreateChangeCenter extends React.Component<any, any> {
    contractId: string;
    contractCode: string;
    private routes: Array<any> = [
        {
            name: '合同',
            path: '',
            link: '#',
            id: 'contract'
        }, {
            name: '合同管理',
            path: '',
            link: '#',
            id: 'contractManagement'
        }, {
            name: '查看合同',
            path: '',
            link: '#',
            id: 'contractManagementApprovalFlow'
        }, {
            name: '申请转中心',
            path: '',
            link: '#',
            id: 'createChangeCenter'
        }
    ];

    constructor(props: any) {
        super(props);
        if (CommonUtils.hasParams(props)) {
            this.contractId = CommonUtils.parse(props).contractId;
            this.contractCode = CommonUtils.parse(props).contractCode;
        }
        this.state = {
            centerList: [],
            contractInfo: {},
            isChangeNum: false,
            contractBasicInfo: {},
        }
    }

    componentDidMount() {
        // 查找临转中心转回时唯一的可转中心
        const postData ={
            id: this.contractId,
            currentCenterId: User.currentCenterId
        };
        Promise.all([
            checkGetRollInCenter(postData),
            getContractDetail({
                currentCenterId: User.currentCenterId,
                contractId: this.contractId,
                contractCode: this.contractCode
            }),
            getContractInfo({
                currentCenterId: User.currentCenterId,
                contractCode: this.contractCode,
                contractId: this.contractId
            }),
        ]).then( res => {
            const [centerList, detail, info] = res;
            let transObj = [];
            (centerList && centerList.rollInCenterId) && transObj.push({
                centerCode: centerList.rollInCenterCode,
                centerName: centerList.rollInCenterName,
                id: centerList.rollInCenterId
            });
            this.setState({
                centerList: centerList,
                contractInfo: detail,
                contractBasicInfo: info.detail,

            })

        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {validateFields} = this.props.form;
        validateFields((err: any, values) => {
            if (!err) {
                createChangeCenter(Object.assign({}, values, {
                    currentCenterId: User.currentCenterId,
                    contractId: this.contractId
                })).then(
                    () => {
                        history.goBack()
                    },
                    (err) => {
                        Message.error(err.msg)
                    })
            }
        })
    };
    /**
     * 上传图片
     * @param file
     */
    handleUploadImg = (file: any, fileList: Array<any>) => {
        const {setFieldsValue} = this.props.form;
        setFieldsValue({attachmentList: fileList.map((item: any) => item.response.data)})
    };
    filter = (input, option) => {
        return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    };
    /**
     * 转出类型（全转，临转）
     * @param {number} value
     */
    onSelectType = (value: number) => {
        const {setFieldsValue} = this.props.form;
        const {contractInfo} = this.state;
        // 全转为1
        if (value === 1) {
            setFieldsValue({
                rollOutCourseNum: contractInfo.remainingCourseNum - (contractInfo.remainingFreeCourseNum || 0),
                rollOutPackageCoursePrice: contractInfo.remainingCoursePrice
            });
            this.setState({isChangeNum: true})
        } else {
            this.setState({isChangeNum: false})
        }
    };

    render() {
        const { form} = this.props;
        const {getFieldDecorator} = form;
        const { contractInfo, contractBasicInfo, centerList, isChangeNum} = this.state;
        return (
            <div id='gym-contract-create-cancel-class'>
                <BreadCrumb routes={this.routes}/>
                <div className='page-wrap gym-add-application'>
                    <BasicContractInfo
                        contractInfo={contractBasicInfo}
                        emitNext={(records)=>{
                            this.setState(preState => {
                                return {
                                    contractBasicInfo:Object.assign(preState.contractBasicInfo,{records})
                                }
                            })
                        }}
                    />
                    <Form onSubmit={this.handleSubmit} className='gym-contract-add-form'>
                        <div className='gym-contract-add-form-wrap gym-contract-add-center mt30'>
                            <FormItem
                                label='转课方式'
                                className='span gym-contract-add-form-required gym-contract-add-required'
                            >
                                {
                                    getFieldDecorator('transferCenterType', {
                                        rules: [
                                            {required: true, message: '请选择转课方式'}
                                        ],
                                    })(
                                        <Select
                                            onChange={this.onSelectType}
                                            style={{width: 200}}
                                        >
                                            {
                                                changeTypes.map((item: any) =>
                                                    <Option key={`type_${item.id}`} value={item.code}>
                                                        {item.name}
                                                    </Option>
                                                )
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='转出中心'>
                                        <span>{`${User.centerCode}-${User.currentCenterName}`}</span>
                                    </FormItem>
                                </Col>
                                {/*{*/}
                                    {/*isShowAllCenter && contractInfo.businessSource === '75001' &&*/}
                                    {/*<Col span={12}>*/}
                                        {/*<FormItem*/}
                                            {/*label='转入中心'*/}
                                            {/*className='span gym-contract-add-form-required gym-contract-add-required'*/}
                                        {/*>*/}
                                            {/*{*/}
                                                {/*getFieldDecorator("rollInCenterId", {*/}
                                                    {/*rules: [*/}
                                                        {/*{required: true, message: '请选择转入中心'}*/}
                                                    {/*],*/}
                                                {/*})(*/}
                                                    {/*<Select*/}
                                                        {/*showSearch={true}*/}
                                                        {/*style={{width: 200}}*/}
                                                        {/*filterOption={this.filter}*/}
                                                    {/*>*/}
                                                        {/*{*/}
                                                            {/*centerList.map((item: any) =>*/}
                                                                {/*<Option*/}
                                                                    {/*key={item.id}*/}
                                                                    {/*value={item.id}*/}
                                                                    {/*title={`${item.centerCode}-${item.centerName}`}*/}
                                                                {/*>*/}
                                                                    {/*{`${item.centerCode}-${item.centerName}`}*/}
                                                                {/*</Option>*/}
                                                            {/*)*/}
                                                        {/*}*/}
                                                    {/*</Select>*/}
                                                {/*)*/}
                                            {/*}*/}
                                        {/*</FormItem>*/}
                                    {/*</Col>*/}
                                {/*}*/}
                                {/*{*/}
                                    {/*!isShowAllCenter && contractInfo.businessSource === '75001' &&*/}
                                    {/*<Col span={12}>*/}
                                        {/*<FormItem*/}
                                            {/*label='转入中心'*/}
                                            {/*className='span gym-contract-add-form-required gym-contract-add-required'*/}
                                        {/*>*/}
                                            {/*{*/}
                                                {/*getFieldDecorator("rollInCenterId", {*/}
                                                    {/*rules: [*/}
                                                        {/*{required: true, message: '请选择转入中心'}*/}
                                                    {/*],*/}
                                                    {/*initialValue: onlyOneCenterOption.length > 0 ?onlyOneCenterOption[0].rollInCenterId: ''*/}
                                                {/*})(*/}
                                                    {/*<Select*/}
                                                        {/*disabled={true}*/}
                                                        {/*showSearch={true}*/}
                                                        {/*style={{width: 200}}*/}
                                                        {/*filterOption={this.filter}*/}
                                                    {/*>*/}
                                                        {/*{*/}
                                                            {/*onlyOneCenterOption.map((item: any) =>*/}
                                                                {/*<Option*/}
                                                                    {/*key={item.rollInCenterId}*/}
                                                                    {/*value={item.rollInCenterId}*/}
                                                                    {/*title={`${item.rollInCenterCode}-${item.rollInCenterName}`}*/}
                                                                    {/*disabled={item.rollInCenterId === '411' || item.rollInCenterId === '242'}*/}
                                                                {/*>*/}
                                                                    {/*{`${item.centerCode}-${item.centerName}`}*/}
                                                                {/*</Option>*/}
                                                            {/*)*/}
                                                        {/*}*/}
                                                    {/*</Select>*/}
                                                {/*)*/}
                                            {/*}*/}
                                        {/*</FormItem>*/}
                                    {/*</Col>*/}
                                {/*}*/}
                                {/*{*/}
                                    {/*isShowAllCenter && contractInfo.businessSource === '75002' &&*/}
                                    {/*<Col span={12}>*/}
                                        {/*<FormItem*/}
                                            {/*label='转入中心'*/}
                                            {/*className='span gym-contract-add-form-required gym-contract-add-required'*/}
                                        {/*>*/}
                                            {/*{*/}
                                                {/*getFieldDecorator("rollInCenterId", {*/}
                                                    {/*rules: [*/}
                                                        {/*{ required: true, message: '请选择转入中心' }*/}
                                                    {/*],*/}
                                                {/*})(*/}
                                                    {/*<Select*/}
                                                        {/*showSearch={true}*/}
                                                        {/*style={{ width: 200 }}*/}
                                                        {/*filterOption={this.filter}*/}
                                                    {/*>*/}
                                                        {/*{*/}
                                                            {/*sigamaCenterList.map((item: any) =>*/}
                                                                {/*<Option*/}
                                                                    {/*key={item.id}*/}
                                                                    {/*value={item.id}*/}
                                                                    {/*title={`${item.centerCode}-${item.centerName}`}*/}
                                                                {/*>*/}
                                                                    {/*{`${item.centerCode}-${item.centerName}`}*/}
                                                                {/*</Option>*/}
                                                            {/*)*/}
                                                        {/*}*/}
                                                    {/*</Select>*/}
                                                {/*)*/}
                                            {/*}*/}
                                        {/*</FormItem>*/}
                                    {/*</Col>*/}
                                {/*}*/}
                                {/*{*/}
                                    {/*!isShowAllCenter && contractInfo.businessSource === '75002' &&*/}
                                    {/*<Col span={12}>*/}
                                        {/*<FormItem*/}
                                            {/*label='转入中心'*/}
                                            {/*className='span gym-contract-add-form-required gym-contract-add-required'*/}
                                        {/*>*/}
                                            {/*{*/}
                                                {/*getFieldDecorator("rollInCenterId", {*/}
                                                    {/*rules: [*/}
                                                        {/*{ required: true, message: '请选择转入中心' }*/}
                                                    {/*],*/}
                                                    {/*initialValue: onlyOneCenterOption.length > 0 ? onlyOneCenterOption[0].id : ''*/}
                                                {/*})(*/}
                                                    {/*<Select*/}
                                                        {/*disabled={true}*/}
                                                        {/*showSearch={true}*/}
                                                        {/*style={{ width: 200 }}*/}
                                                        {/*filterOption={this.filter}*/}
                                                    {/*>*/}
                                                        {/*{*/}
                                                            {/*onlyOneCenterOption.map((item: any) =>*/}
                                                                {/*<Option*/}
                                                                    {/*key={item.id}*/}
                                                                    {/*value={item.id}*/}
                                                                    {/*title={`${item.centerCode}-${item.centerName}`}*/}
                                                                    {/*disabled={item.id === '411' || item.id === '242'}*/}
                                                                {/*>*/}
                                                                    {/*{`${item.centerCode}-${item.centerName}`}*/}
                                                                {/*</Option>*/}
                                                            {/*)*/}
                                                        {/*}*/}
                                                    {/*</Select>*/}
                                                {/*)*/}
                                            {/*}*/}
                                        {/*</FormItem>*/}
                                    {/*</Col>*/}
                                {/*}*/}
                                <Col span={12}>
                                    <FormItem
                                        label='转入中心'
                                        className='span gym-contract-add-form-required gym-contract-add-required'
                                    >
                                        {
                                            getFieldDecorator("rollInCenterId", {
                                                rules: [
                                                    {required: true, message: '请选择转入中心'}
                                                ],
                                            })(
                                                <Select
                                                    showSearch={true}
                                                    style={{width: 200}}
                                                    filterOption={this.filter}
                                                >
                                                    {
                                                        centerList.map((item: any) =>
                                                            <Option
                                                                key={item.rollInCenterId}
                                                                value={item.rollInCenterId}
                                                                title={`${item.rollInCenterCode}-${item.rollInCenterName}`}
                                                            >
                                                                {`${item.rollInCenterCode}-${item.rollInCenterName}`}
                                                            </Option>
                                                        )
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='转出课时' className='gym-contract-add-required'>
                                        {
                                            getFieldDecorator('rollOutCourseNum', {
                                                rules: [
                                                    {required: true, message: '请输入转出课时'}
                                                ]
                                            })(
                                                <InputNumber
                                                    precision={0}
                                                    disabled={isChangeNum}
                                                    max={
                                                        isChangeNum
                                                            ? (contractInfo.remainingCourseNum - (contractInfo.remainingFreeCourseNum || 0))
                                                            : (contractInfo.remainingCourseNum - (contractInfo.remainingFreeCourseNum || 0) - 1)
                                                    }
                                                    min={1}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='转出金额' className='gym-contract-add-required'>
                                        {
                                            getFieldDecorator('rollOutPackageCoursePrice', {
                                                rules: [
                                                    {required: true, message: '请输入转出金额'}
                                                ]
                                            })(
                                                <InputNumber
                                                    disabled={isChangeNum}
                                                    max={isChangeNum
                                                            ? contractInfo.remainingCoursePrice
                                                            : SafeCalculate.sub(contractInfo.remainingCoursePrice, 0.01)}
                                                    min={1}
                                                    step={1}
                                                    precision={2}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>

                            <FormItem
                                label='原因说明'
                                className='span gym-contract-add-form-required gym-contract-add-required'
                            >
                                {
                                    getFieldDecorator('remark', {
                                        rules: [
                                            {required: true, message: '请输入原因说明'}
                                        ],
                                    })(
                                        <TextArea
                                            placeholder='请输入原因说明'
                                            autosize={{minRows: 2, maxRows: 3}}
                                            style={{width: '80%'}}
                                        />
                                    )
                                }
                            </FormItem>
                            <FormItem label='上传图片' className='span'>
                                {
                                    getFieldDecorator('attachmentList')(<span/>)
                                }
                                <UploadImg onChange={this.handleUploadImg} maxFileLength={5}/>
                            </FormItem>

                        </div>
                        <CancelButton
                            form={form}
                            goBackLink={`${Routes.合同详情.link}${CommonUtils.stringify({
                                contractCode: this.contractCode,
                                contractId: this.contractId
                            })}`}
                            submitText='提交'
                        />
                    </Form>
                </div>
            </div>
        )
    }
}

export {CreateChangeCenter}
