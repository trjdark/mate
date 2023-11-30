/**
 * desc: 改包
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/12/4
 * Time: 上午10:07
 */
import React from 'react';
import { Row, Col, Form, message, Alert, Radio, DatePicker} from "antd";
import {InputNumber, TextArea} from "../../../../component/input";
import {Select, Option} from "../../../../component/select";
import {form} from "@/common/decorator/form";
import {Routes} from "@/router/enum/routes";
import {ConfirmCheck} from "@/ui/component/confirmCheck";
import {CancelButton} from "@/ui/component/cancelButton";
import {approvalChangePkg, getCourseListByCourseType, updateChangePkg} from "@redux-actions/contract";
import history from "@/router/history";
import {connect} from "@/common/decorator/connect";
import {selectChangePkgTypes} from "@/saga/selectors/contract";
import {Thumbnail} from "@/ui/component/thumbnail";
import {UploadImg} from "@/ui/component/uploadImg";
import moment from "moment";
import {User} from "@/common/beans/user";
import {SafeCalculate} from "@/common/utils/commonUtils";

const FormItem = Form.Item;

declare interface ChangePkgProps {
    content:any,
    status:string,
    courseInfo:any,
    form?:any,
    changePkgStatusList?:Array<any>
    contractInfo:any,
    isElectronic?:any, // 创建时是否选择电子合同
    contractType:string,
}

@connect((state:any) => ({
    changePkgStatusList: selectChangePkgTypes(state),
}))
@form()
class ChangePkg extends React.Component<ChangePkgProps, any>{
    DEFAULT_PACKAGE_TYPE = 1;
    state = {
        packageList: [],
        differencePrice: (this.props.content.lastTotalCoursePrice && this.props.content.oldTotalCoursePrice) && (this.props.content.lastTotalCoursePrice - this.props.content.oldTotalCoursePrice).toFixed(2),
        packageNum: this.props.content.lastTotalCourseNum?this.props.content.lastTotalCourseNum:undefined,
        leaveCourseNum: this.props.content.lastLeaveTime?this.props.content.lastLeaveTime: undefined,
        isETC: 0, // 选择电子合同
    };

    componentDidMount(){
        this.getCourseList(this.DEFAULT_PACKAGE_TYPE)
    }
    /**
     * 获取课程包
     * @param {number} type
     */
    getCourseList = (type:number) => {
        getCourseListByCourseType({currentCenterId: User.currentCenterId, packageType: type})
            .then((res:any) => {
                this.setState({packageList: res})
            })
    };
    /**
     * 格式化审批状态
     * @param {string} status
     * @returns {string}
     */
    formStatus = (status:string) => {
        const {changePkgStatusList} = this.props;
        const outStatus = changePkgStatusList.filter((item:any) => item.code === status);
        return outStatus.length > 0 ? outStatus[0].codeValue : '-'
    };
    /**
     * 审批改包申请
     * @param {string} value
     */
    approvalContract = (value:string) => {
        const {content} = this.props;
        approvalChangePkg({
            status: value,
            id: content.id,
            currentCenterId: User.currentCenterId,
            contractId: content.contractId
        }).then(() => {
            message.success("审批成功");
            history.push(Routes.合同操作列表改包.path)
        })
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
     * 上传图片
     */
    handleUploadImg = (file:any, fileList:Array<any>) => {
        const {setFieldsValue} = this.props.form;
        setFieldsValue({attachmentList: fileList.map((item:any) => item.response.data)})
    };
    /**
     * 选中课程
     */
    selectCourse = (packageId:string) => {
        const {packageList} = this.state;
        const {setFieldsValue} = this.props.form;
        const selectedPackage = packageList.filter((item:any) => item.id === packageId)[0];
        this.setState({
            selectedPackage: selectedPackage,
            packageNum: selectedPackage.packageNum,
            leaveCourseNum: selectedPackage.allowAbsenceTimes,
        });
        setFieldsValue({
            lastPackageCourseNum: selectedPackage.packageNum,
            lastPackageCoursePrice:selectedPackage.actualPrice !== null ? selectedPackage.actualPrice : selectedPackage.packagePrice,
            lastFreeCourseNum: selectedPackage.freeCourseNum, // 新包的赠课数可以修改
        })
    };
    /**
     * 选择改包收付款时间
     */
    disabledDate = (current) => {
        return current < moment().startOf('day');
    };
    /**
     * 选择是否使用电子合同
     * @param
     */
    handleSelectISETC = (value: any) => {
        this.setState({
            isETC: value
        })
    }
    render(){
        const { content = {}, status, form, courseInfo, isElectronic, contractType } = this.props;
        const {getFieldDecorator, getFieldValue} = form;
        const { packageList, packageNum, leaveCourseNum, isETC} = this.state;
        const fileList = (content.attachmentList || []).map((item:any) => ({
            url:`${location.protocol}//${location.host}/api/mate-basic/basic/file/fileView?fileId=${item.photoPath}&token=${User.getToken}`,
            status: 'done',
            uid: item.id,
            name: item.photoName,
            response: Object.assign({}, {}, {data: item})

        }));
        return(
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Row className='gym-contract-table-tbody gym-contract-table-top gym-contract-table-thead-left gym-contract-table-thead-right'>
                        {
                            status === "edit"
                                ?
                                <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-thead-left gym-contract-table-required-label'>
                                    <span className='gym-contract-table-required'>*</span>
                                    <span>新课程包名称:</span>
                                </Col>
                                :
                                <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-thead-left'>
                                    <span>新课程包名称:</span>
                                </Col>
                        }
                        <Col span={8} className='gym-contract-table-tbody-form'>
                            {
                                status === "edit"
                                    ? <FormItem className='gym-act-modal-form'>
                                        {
                                            getFieldDecorator('lastPackageId',{
                                                rules: [
                                                    {required: true, message:'请选择新课程包'}
                                                ],
                                                initialValue:content.lastPackageId
                                            })(
                                                <Select
                                                    className='gym-form-item-select'
                                                    onSelect={this.selectCourse}
                                                >
                                                    {
                                                        packageList.map((item:any) =>
                                                            <Option
                                                                key={`pay_type_${item.id}`}
                                                                value={item.id}
                                                            >
                                                                {item.packageName}
                                                            </Option>
                                                        )
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                    : <FormItem className='gym-act-modal-form'>
                                        {content.lastPackageName}
                                    </FormItem>
                            }
                        </Col>
                        {
                            status === "edit"
                                ?
                                <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-required-label'>
                                    <span className='gym-contract-table-required'>*</span>
                                    <span>新课程包实收价:</span>
                                </Col>
                                :
                                <Col span={4} className='gym-contract-table-tbody-label'>
                                    <span>新课程包实收价:</span>
                                </Col>
                        }
                        <Col span={8} className='gym-contract-table-tbody-form'>
                            {
                                status === "edit"
                                    ? <FormItem className='gym-act-modal-form'>
                                        {
                                            getFieldDecorator('lastPackageCoursePrice',{
                                                rules: [
                                                    {required: true, message:'请输入新课程包实收价'}
                                                ],
                                                initialValue:content.lastTotalCoursePrice
                                            })(
                                                <InputNumber min={0} step={1} precision={2}/>
                                            )
                                        }
                                    </FormItem>
                                    : <FormItem className='gym-act-modal-form'>
                                        {content.lastTotalCoursePrice && content.lastTotalCoursePrice.toFixed(2)}
                                    </FormItem>
                            }
                        </Col>
                    </Row>
                    <Row className='gym-contract-table-tbody'>
                        <Col span={4} className='gym-contract-table-tbody-label'>
                            <span>新课时数:</span>
                        </Col>
                        <Col span={8} className='gym-contract-table-tbody-value gym-contract-table-thead-right'>
                            <span>{packageNum?packageNum:content.lastTotalCourseNum}</span>
                        </Col>
                        <Col span={4} className='gym-contract-table-tbody-label'>
                            <span>差额:</span>
                        </Col>
                        {
                            status === "edit"
                                ?
                                <Col span={8} className='gym-contract-table-tbody-value'>
                                    {
                                        getFieldValue('lastPackageCoursePrice')
                                            ? SafeCalculate.sub(getFieldValue('lastPackageCoursePrice'), courseInfo.courseAmount)
                                            : ''
                                    }
                                </Col>
                                :
                                <Col span={8} className='gym-contract-table-tbody-value'>
                                    <span>{(content.difference || content.difference === 0) ? content.difference.toFixed(2): ''}</span>
                                </Col>
                        }
                    </Row>
                    <Row className='gym-contract-table-tbody'>
                        <Col span={4} className={`gym-contract-table-tbody-label ${status === "edit" && 'gym-contract-table-required-label'}`}>
                            {status === "edit" && <span className='gym-contract-table-required'>*</span>}
                            <span>新赠课时数:</span>
                        </Col>
                        <Col span={8} className='gym-contract-table-tbody-form'>
                            {
                                // todo
                                status === "edit"
                                    ? <FormItem className='gym-act-modal-form'>
                                        {
                                            getFieldDecorator('lastFreeCourseNum',{
                                                rules: [
                                                    {required: true, message:'请输入新赠课时数'}
                                                ],
                                                initialValue:content.lastFreeCourseNum
                                            })(
                                                <InputNumber min={0}/>
                                            )
                                        }
                                    </FormItem>
                                    : <FormItem className='gym-act-modal-form'>
                                        {content.lastFreeCourseNum}
                                    </FormItem>
                            }
                        </Col>
                        <Col span={4} className='gym-contract-table-tbody-label'>
                            <span>新到期日:</span>
                        </Col>
                        <Col span={8} className='gym-contract-table-tbody-value'>
                            <span>{moment(content.lastPeriodOfValidity).format("YYYY-MM-DD")}</span>
                        </Col>
                    </Row>
                    <Row className='gym-contract-table-tbody'>
                        <Col span={4} className='gym-contract-table-tbody-label'>
                            <span>新请假次数:</span>
                        </Col>
                        <Col span={8} className='gym-contract-table-tbody-value'>
                            <span>{leaveCourseNum?leaveCourseNum:content.lastLeaveTime}</span>
                        </Col>
                        <Col span={4} className='gym-contract-table-tbody-label'>
                            <span>审批状态:</span>
                        </Col>
                        <Col span={8} className='gym-contract-table-tbody-value'>
                            <span>{this.formStatus(content.approvalStatus)}</span>
                        </Col>
                    </Row>
                    <Row className='gym-contract-table-tbody gym-contract-table-top gym-contract-table-thead-left gym-contract-table-thead-right'>
                        {
                            status === "edit"
                                ?
                                <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-thead-left gym-contract-table-required-label'>
                                    <span className='gym-contract-table-required'>*</span>
                                    <span>是否使用电子合同:</span>
                                </Col>
                                :
                                <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-thead-left'>
                                    <span>是否使用电子合同:</span>
                                </Col>
                        }
                        <Col span={8} className='gym-contract-table-tbody-form'>
                            {
                                status === "edit"
                                    ? <FormItem className='gym-act-modal-form'>
                                        {
                                            getFieldDecorator('electronicFlag', {
                                                rules: [
                                                    { required: true, message: '请选择是否使用电子合同' }
                                                ],
                                                initialValue: content.electronicFlag
                                            })(
                                                <Radio.Group onChange={(e) => this.handleSelectISETC(e.target.value)}>
                                                    <Radio value={1} disabled={(isElectronic === 0 || contractType==="17004")? true : false}>是</Radio>
                                                    <Radio value={0}>否</Radio>
                                                </Radio.Group>
                                            )
                                        }
                                    </FormItem>
                                    : <FormItem className='gym-act-modal-form'>
                                        {content.electronicFlag===0?'否':'是'}
                                    </FormItem>
                            }
                        </Col>
                        {
                            ((content.electronicFlag === 1 && isETC !== 0) || isETC === 1  )&&
                        <div>
                            {
                                status === "edit"
                                    ?
                                    <Col span={4} className='gym-contract-table-tbody-label gym-contract-table-required-label'>
                                        <span className='gym-contract-table-required'>*</span>
                                        <span>约定收付款时间:</span>
                                    </Col>
                                    :
                                    <Col span={4} className='gym-contract-table-tbody-label'>
                                        <span>约定收付款时间:</span>
                                    </Col>
                            }
                            <Col span={8} className='gym-contract-table-tbody-form'>
                                {
                                    status === "edit"
                                        ? <FormItem className='gym-act-modal-form'>
                                            {
                                                getFieldDecorator('expectFinancialTime', {
                                                    rules: [
                                                        { required: true, message: '请选择约定收付款时间' }
                                                    ],
                                                    initialValue: content.expectFinancialTime&&moment(content.expectFinancialTime)
                                                })(
                                                    <DatePicker
                                                        format='YYYY-MM-DD'
                                                        disabledDate={this.disabledDate}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                        : <FormItem className='gym-act-modal-form'>
                                            {moment(content.expectFinancialTime).format('YYYY-MM-DD')}
                                        </FormItem>
                                }
                            </Col>
                        </div>
                        }
                    </Row>
                    <Row className='gym-contract-table-tbody'>
                        {
                            status === "edit"
                                ?
                                <Col span={4} className='gym-contract-table-tbody-form-label gym-contract-table-required-label'>
                                    <span className='gym-contract-table-required'>*</span>
                                    <span>改包原因说明:</span>
                                </Col>
                                :
                                <Col span={4} className='gym-contract-table-tbody-form-label'>
                                    <span>改包原因说明:</span>
                                </Col>
                        }
                        <Col span={20} className='gym-contract-table-tbody-form-value'>
                            {
                                status === "edit"
                                    ? <FormItem className='gym-act-modal-form'>
                                        {
                                            getFieldDecorator('remark',{
                                                rules: [
                                                    {required: true, message:'请输入改包原因说明'}
                                                ],
                                                initialValue:content.remark
                                            })(
                                                <TextArea
                                                    style={{width:'650px'}}
                                                    placeholder='请输入原因说明'
                                                    minLength={5}
                                                    autosize={{minRows: 2, maxRows: 3}}
                                                />
                                            )
                                        }
                                    </FormItem>
                                    : <span className='gym-act-modal-form'>
                                        {content.remark}
                                    </span>
                            }
                        </Col>
                    </Row>
                    <Row className='gym-contract-table-tbody gym-contract-table-tbody-left gym-contract-table-tbody-right'>
                        <Col span={4} className='gym-contract-table-tbody-form-label gym-contract-table-tbody-left gym-contract-table-tbody-form-attachment'>
                            <span>附件:</span>
                        </Col>
                        <Col span={20} className='gym-contract-table-tbody-form-value gym-contract-table-tbody-right'>
                            {
                                status === "edit"
                                    ? <FormItem className='span'>
                                        {
                                            getFieldDecorator('attachmentList', {
                                                initialValue: content.attachmentList
                                            })(<span/>)
                                        }
                                        <UploadImg fileList={fileList} onChange={this.handleUploadImg} maxFileLength={5}/>
                                    </FormItem>
                                    :<FormItem className='gym-act-modal-form'>
                                        {
                                            (content.attachmentList || []).map((item:any) =>
                                                <Thumbnail key={item.id} imgSrc={`${location.protocol}//${location.host}/api/mate-basic/basic/file/fileView?fileId=${item.photoPath}&token=${User.getToken}`}/>
                                            )
                                        }
                                    </FormItem>
                            }
                        </Col>
                    </Row>
                    <Row>
                        <br/>
                        <Alert className='gym-alert' message="原合同有赠课申请将会自动做废，如有需要可在改包完成后重新提交赠课申请！" type="error" />
                        <br/>
                        <Alert className='gym-alert' message="进行不同业务来源的改包操作前请确认课包的预占课时为0，改包后，不允许历史课程使用反签到操作。" type="warning" />
                    </Row>
                    {
                        status === 'edit' &&
                        <CancelButton
                            form={form}
                            submitText='提交'
                        />
                    }
                </Form>
                {
                    status === 'approve' &&
                    <Row>
                        <div className='gym-contract-table-bottoms'>
                            <ConfirmCheck
                                contentText={"确认同意此申请？"}
                                item={{}}
                                ensure={() => this.approvalContract('23003')}
                                button={<button className='gym-button-default gym-button-xs gym-contract-table-bottoms-button'>同意</button>}
                            />
                            <ConfirmCheck
                                contentText={"确认不同意此申请？"}
                                item={{}}
                                ensure={() => this.approvalContract('23002')}
                                button={<button className='gym-button-white gym-button-xs gym-contract-table-bottoms-button'>不同意</button>}
                            />
                        </div>
                    </Row>
                }
            </div>

        )
    }
}

export {ChangePkg};
