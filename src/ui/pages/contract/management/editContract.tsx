/**
 * desc: 修改合同
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/14
 * Time: 下午4:40
 */
import React from 'react';
import {BreadCrumb} from "../../../component/breadcrumb";
import {Col, Form, Input, Row,Radio} from "antd";
import {form} from "../../../../common/decorator/form";
import {Select, Option} from "../../../component/select";
import {InputNumber, TextArea} from "../../../component/input";
import {DateInput} from "../../../component/datePicker";
import {CourseType} from "../../setting/enum/course";
import {User} from "../../../../common/beans/user";
import {CancelButton} from "../../../component/cancelButton";
import {Routes} from "@/router/enum/routes";
import {PrAddButton} from "./part/prAddButton";
import {getProductListNoPages} from "@redux-actions/setting/productActions";
import {CommonUtils} from "../../../../common/utils/commonUtils";
import {
    getCourseListByCourseType,
    updateContract, getContractDetailInfo,
    getRelatedContract
} from "@redux-actions/contract";
import { checkBabyInfo } from "@redux-actions/contract";
import moment from 'moment';
import history from "../../../../router/history";
import {selectContractApprovalStatus, selectContractTypes} from "../../../../saga/selectors/contract";
import {connect} from "../../../../common/decorator/connect";
import {Message} from "@/ui/component/message/message";
import { getClientInfo } from '@/redux-actions/teaching/chooseLesson';
import {CustomerRoutes} from "@/router/enum/customerRoutes";
import {SettingRoutes} from "@/router/enum/settingRoutes";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import {selectBusinessSourceList, selectTotalEmployeeList} from "@/saga/selectors/home";
import {SafeCalculate} from "@/common/utils/commonUtils";

const FormItem = Form.Item;

const isPostTransRole = User.permissionList.includes(FUNC['岗位转角色（非业务使用）'])

const selectOption = isPostTransRole ? {
    workingStatus: "1",
    roleList: ["GB","HGB", "GA", 'HGA', 'INS', 'HI', 'CD']
}:{
    workingStatus: "1",
    postName: ["GB","HGB", "GA", 'HGA', 'INS', 'HI', 'CD']
};

@connect((state:any) => ({
    contractTypes: selectContractTypes(state),
    approvalStatus: selectContractApprovalStatus(state),
    staffList: selectTotalEmployeeList(state, selectOption),
    businessSourceMap: selectBusinessSourceList(state)
}))
@form()
class EditContract extends React.Component<any, any> {
    private routes:Array<any> = [
        {
            name: '合同',
            path: '',
            link: '#',
            id: 'contract'
        },{
            name: '合同管理',
            path: '',
            link: '#',
            id: 'contractManagement'
        },{
            name: '编辑合同',
            path: '',
            link: '#',
            id: 'editContract'
        }
    ];
    contractCode:string;
    contractId:string;
    leadsId:string;

    constructor(props:any){
        super(props)
        if(CommonUtils.hasParams(props)){
            this.contractCode = CommonUtils.parse(props).contractCode;
            this.contractId = CommonUtils.parse(props).contractId;
            this.leadsId = CommonUtils.parse(props).leadsId;
        }
        this.state = {
            contract:{},
            packageList: [],
            course: {},
            productList: [],
            lead:{},
            isShowContract: "",
            relationContract: [],
            sigmaAuth:'',
            a: '',
        }
    }
    componentDidMount(){
        Promise.all([
            getContractDetailInfo({
                currentCenterId: User.currentCenterId,
                contractCode: this.contractCode,
                contractId: this.contractId,
            }),
            getRelatedContract({
                cid: User.currentCenterId,
                leadsID: this.leadsId,
            }),
            getClientInfo({
                currentCenterId: User.currentCenterId,
                leadsId: this.leadsId
            }),
            getProductListNoPages({currentCenterId: User.currentCenterId}),
        ]).then(res => {
            const [contractDetail, relationContract, info, productList] = res;
            const {contract} = contractDetail;
            this.getCourseList(contractDetail.packageType)
            this.setState({
                contract:contract,
                lead: contractDetail.lead,
                isShowContract: contract.businessSource,
                course: {
                    packageNum: contract.totalCourseNum,
                    cpackageId: contract.cpackageId,
                    packagePrice: contract.totalCoursePrice,
                    freeCourseNum: contract.reallyFreeCourseNum,
                    reallyAfterDiscountPrice: contract.reallyAfterDiscountPrice,
                    periodOfValidity: contract.periodOfValidity,
                    endTime: contract.endTime,
                },
                relationContract:relationContract,
                contactList: info.babyInfo.contactInfos,
                productList: productList

            });
        })
    }

    /**
     * 获取课程包列表
     * @param {number} type
     */
    getCourseList = (type:number) => {
        getCourseListByCourseType({currentCenterId: User.currentCenterId, packageType: type})
            .then((res:any) => {
                this.setState({
                    packageList: res,
                })
            })
    };
    /**
     * 选择业务来源
     * 来源为西格玛清空赠送课时数
     * @param gifts
     */
    selectCourseFromType = (value:any) => {
        const {form} = this.props;
        const {contract} = this.state;
        const leadsID = contract&&contract.leadsId;
        this.setState({
            isShowContract:value,
            course: {}
        });

        form.setFieldsValue({
            freeCourseNum: null,
            cpackageId:null,
            contractType:null,
            reallyAfterDiscountPrice:null,
        })
        if(value==="75002"){
            getRelatedContract({
                cid: User.currentCenterId,
                leadsID: leadsID
            }).then((res=>{
                this.setState({relationContract:res})
            }))
        }
    }
    /**
     * 提交表单
     */
    handleSubmit = (e:any) => {
        e.preventDefault()
        this.props.form.validateFields((err:any, values:any) => {
            if(!err){
                const {contract} = this.state;
                values.actualTotalPrice = values.reallyAfterDiscountPrice + (values.bindingActualPrice || 0)
                updateContract(Object.assign({}, values, {
                    contractId: contract.contractId,
                    contractCode:`${User.centerCode}-${values.contractCode}`,
                    leadsId: contract.leadsId,
                    signCenterId: User.currentCenterId,
                    currentCenterId: User.currentCenterId,
                })).then((res:any) => {
                    // todo success
                    history.push(Routes.合同管理列表.path)
                }, (err) => {
                    Message.error(err.msg)
                })
            }
        })
    };
   /**
    * 选择是否使用电子合同
    * @param
    */
    handleSelectISETC = (value: string) => {
        this.setState({isETC: value})
    }
    /**
     * 选择课程包
     * @param value
     */
    selectCourse = (value:string) => {
        const {form, contractTypes} = this.props;
        const {setFieldsValue, getFieldValue} = form;
        const {packageList} = this.state;
        const FREE = contractTypes.filter((item:any) => item.codeValue === '赠送')[0] && contractTypes.filter((item:any) => item.codeValue === '赠送')[0].code;
        const pkg = (packageList || []).filter((item:any) => item.id === value)[0];

        if(pkg.isGymAppShow === 0){
            setFieldsValue({
                reallyAfterDiscountPrice: getFieldValue('contractType') === FREE ? 0 : pkg.actualPrice ? pkg.actualPrice :pkg.packagePrice,
                electronicFlag:0,
                hasBindingContract: 0,
                bindingActualPrice: null,
                bindingContractMonth:null
            });
        }else{
            setFieldsValue({
                reallyAfterDiscountPrice: getFieldValue('contractType') === FREE ? 0 : pkg.actualPrice ? pkg.actualPrice :pkg.packagePrice,
            });
        }
        this.setState({course:pkg})

    };
    selectGifts = (gifts:any) => {
        const {form} = this.props;
        form.setFieldsValue({freeGiftList: gifts})
    };
    /**
     * 选择课程报类型，获取对应课程列表
     * @param value
     */
    selectCourseType = (value:number) => {
        const {form} = this.props;
        this.getCourseList(value);
        form.setFieldsValue({
            cpackageId:'',
            reallyAfterDiscountPrice: null
        });
        this.setState({course: {}})
    };
    /**
     * 选在合同类型
     * @param {string} value
     */
    selectContractType = (value:string) => {
        const {contractTypes, form} = this.props;
        const {course} = this.state;
        const {setFieldsValue} = form;
        this.setState({ type: value })
        const FREE = contractTypes.filter((item:any) => item.codeValue === '赠送')[0] && contractTypes.filter((item:any) => item.codeValue === '赠送')[0].code;
        if(value === FREE){
            setFieldsValue({
                reallyAfterDiscountPrice: 0
            })
        }else{
            const {packageList, contract} = this.state;
            const oldCourse = packageList.filter((item:any) => contract.cpackageId === item.id)[0];
            setFieldsValue({
                // 有促销价格，用促销价格，否则用定价。没有课程报
                reallyAfterDiscountPrice: course
                    ? (course.actualPrice ? course.actualPrice : course.packagePrice)
                    : (oldCourse.actualPrice ? oldCourse.actualPrice : oldCourse.packagePrice)
            })
        }
    };
    /**
     * 选增绑定合同
     */
    handleChangeBindContract = (e) => {
        const {setFieldsValue} = this.props.form;
        if(!e.target.value){
            setFieldsValue({
                bindingActualPrice: null,
                bindingContractMonth:null
            })
        }else{
            setFieldsValue({
                bindingActualPrice: 0,
                bindingContractMonth: 1
            })
        }
    }
    /**
     * 选择关联合同
     * @param value
     */
    selectRelationContract = (value:string) => {
        const {form} = this.props;
        form.setFieldsValue({relatedContracts:null})
    }
    /**
     * 合同审批状态
     * @param type
     * @returns {string}
     */
    formatApprovalStatus = (type:any):string => {
        const {approvalStatus} = this.props;
        const res = approvalStatus.filter((item:any) => item.code === type);
        return res.length > 0 ? res[0].codeValue : ' ';
    };
    /**
     * 选择法定监护人
     * @param value
     */
    selectLegal = (value: string) => {
        const { form } = this.props;
        const {contract} = this.state;
        const { getFieldValue } = form;
        if (value && (getFieldValue('electronicFlag') === 1 || this.state.isETC === 1)) {
            const params = {
                currentCenterId: User.currentCenterId,
                leadsId: contract.leadsId,
                contactId: value
            }
            checkBabyInfo(params).then((res: any) => {
            }, (err) => {
                if (err.code === 11001) {
                    const param = {
                        leadsId: this.leadsId,
                        title: 2,
                    };
                    window.open(`${CustomerRoutes.客户360基本信息.link}/${CommonUtils.stringify(param)}`)
                } else if (err.code === 11002) {
                    const param = {
                        leadsId: this.leadsId,
                        title: 0,
                    };
                    window.open(`${CustomerRoutes.客户360基本信息.link}/${CommonUtils.stringify(param)}`)
                } else if (err.code === 11004) {
                    const params = {
                        currentCenterId: User.currentCenterId,
                        id: User.currentCenterId,
                    }
                    if (User.permissionList.includes(FUNC[`中心管理`]) === true) {
                        window.open(`${SettingRoutes.修改中心管理.link}${CommonUtils.stringify(params)}`)
                    } else {
                        Message.warning('您没有中心管理权限，请联系管理员配置！')
                    }
                } else {
                    const param = {
                        leadsId: this.leadsId,
                        title: 1,
                    };
                    window.open(`${CustomerRoutes.客户360基本信息.link}/${CommonUtils.stringify(param)}`)
                }
            })
        }
    }
    render(){
        const { contract, packageList, course, productList, lead, isShowContract, relationContract, contactList, type} = this.state;
        const {form, contractTypes, staffList, businessSourceMap} = this.props;
        const relatedContracts = contract.relatedContracts;
        const sigMa = [];
        relatedContracts&&relatedContracts.map((item:any) =>{
            sigMa.push(item.relatedContractId)
        })
        const businessType = isShowContract;
        const newPackageList = packageList.filter((item:any) => item.businessSource === businessType);
        const newContractTypes = contractTypes.map((item:any) => ({postCode:item.code, postName:item.codeValue}));
        const {getFieldDecorator, getFieldValue} = form;
        const FREE = contractTypes.filter((item:any) => item.codeValue === '赠送')[0] && contractTypes.filter((item:any) => item.codeValue === '赠送')[0].code;
        return (
            <div id='gym-contract-add'>
                <BreadCrumb routes={this.routes} />
                <div className='page-wrap gym-contract-add'>
                    <Form onSubmit={this.handleSubmit} className='gym-contract-add-form'>
                        <div className='gym-contract-add-form-wrap' style={{display: 'inherit'}}>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='宝宝姓名' className='topLeft contract-thead contract-thead-left ht50'>
                                        <span>{contract.babyName}</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='月龄' className='topRight contract-thead contract-thead-right ht50'>
                                        <span>{contract.monthAge}</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='合同编号' className='gym-contract-add-form-required validate-form'>
                                        <div className='gym-contract-add-form-wrap-code'>
                                            <span className='gym-contract-add-form-wrap-code-centerId'>{`${User.centerCode}-`}</span>
                                            {
                                                getFieldDecorator('contractCode', {
                                                    rules: [
                                                        {required: true, message:'请填写合同编号'}
                                                    ],
                                                    initialValue:type !=='17001'? (contract.contractCode || '').replace(`${User.centerCode}-`, ''): ''
                                                })(
                                                    <Input className='gym-contract-add-form-wrap-code-text' disabled={(contract.electronicFlag === 1 && type !== '17001' )?true:false}/>
                                                )
                                            }
                                        </div>
                                    </FormItem>
                                </Col>
                                {/*{*/}
                                    {/*contract.electronicFlag === 0&&*/}
                                    {/*<Col span={12}>*/}
                                        {/*<FormItem label='业务来源' className='gym-contract-add-form-required validate-form'>*/}
                                            {/*{*/}
                                                {/*getFieldDecorator('businessSource', {*/}
                                                    {/*initialValue:contract.businessSource,*/}

                                                    {/*rules: [*/}
                                                        {/*{required: true, message:'请选择业务来源!'}*/}
                                                    {/*],*/}
                                                {/*})(*/}
                                                    {/*<Select*/}
                                                        {/*style={{width:'200px'}}*/}
                                                        {/*className='gym-form-item-select'*/}
                                                        {/*onSelect={this.selectCourseFromType}*/}
                                                        {/*placeholder='请选择'*/}
                                                    {/*>*/}
                                                        {/*{*/}
                                                            {/*courseFromType.map((item:any) =>*/}
                                                                {/*<Option*/}
                                                                    {/*key={`pay_type_${item.value}`}*/}
                                                                    {/*value={item.value}*/}
                                                                    {/*disabled={User.isSigmaCenter.status === false ? item.value === "75002": null}*/}
                                                                {/*>{item.name}*/}
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
                                    {/*contract.electronicFlag === 1 &&*/}
                                    {/*<Col span={12}>*/}
                                        {/*<FormItem label='业务来源' className='gym-contract-add-form-required validate-form'>*/}
                                            {/*{*/}
                                                {/*getFieldDecorator('businessSource', {*/}
                                                    {/*initialValue: contract.businessSource,*/}

                                                    {/*rules: [*/}
                                                        {/*{ required: true, message: '请选择业务来源!' }*/}
                                                    {/*],*/}
                                                {/*})(*/}
                                                    {/*<Select*/}
                                                        {/*style={{ width: '200px' }}*/}
                                                        {/*className='gym-form-item-select'*/}
                                                        {/*onSelect={this.selectCourseFromType}*/}
                                                        {/*placeholder='请选择'*/}
                                                    {/*>*/}
                                                        {/*{*/}
                                                            {/*courseFromType.map((item: any) =>*/}
                                                                {/*<Option*/}
                                                                    {/*key={`pay_type_${item.value}`}*/}
                                                                    {/*value={item.value}*/}
                                                                    {/*disabled={contract.electronicFlag===1?true: false}*/}
                                                                {/*>{item.name}*/}
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
                                    <FormItem label='业务来源' className='gym-contract-add-form-required validate-form'>
                                        {
                                            getFieldDecorator('businessSource', {
                                                initialValue: contract.businessSource,
                                                rules: [
                                                    { required: true, message: '请选择业务来源!' }
                                                ],
                                            })(
                                                <Select
                                                    style={{ width: '200px' }}
                                                    className='gym-form-item-select'
                                                    onSelect={this.selectCourseFromType}
                                                    placeholder='请选择'
                                                >
                                                    {
                                                        businessSourceMap.map((item: any) =>
                                                            <Option
                                                                key={`pay_type_${item.businessSourceCode}`}
                                                                value={item.businessSourceCode}
                                                                disabled={!User.businessSource.map(i => i.businessSourceCode).includes(item.businessSourceCode)}
                                                            >{item.businessSourceValue}
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
                                    <FormItem label='课程包类型'>
                                        {
                                            getFieldDecorator('packageType', {
                                                initialValue: (contract.packageType && contract.packageType === 1) ? contract.packageType : null,
                                                rules: [
                                                    {required: true, message:'请选择课程包类型!'}
                                                ],
                                            })(
                                                <Select
                                                    style={{width:'200px'}}
                                                    className='gym-form-item-select'
                                                    onSelect={this.selectCourseType}
                                                >
                                                    {
                                                        CourseType.map((item:any) =>
                                                            <Option
                                                                key={`pay_type_${item.value}`}
                                                                value={item.value}
                                                                disabled={item.disabled}
                                                            >{item.name}</Option>
                                                        )
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='合同类型'>
                                        {
                                            getFieldDecorator('contractType', {
                                                initialValue: contract.contractType,
                                                rules: [
                                                    {required: true, message:'请选择合同类型!'}
                                                ],
                                            })(
                                                <Select style={{width:'200px'}} className='gym-form-item-select' onChange={this.selectContractType}>
                                                    {
                                                        // todo 17002代表新合约，17003代表续约, 17004代表转入 17001 赠送
                                                        newContractTypes
                                                            .filter((item:any) => item.postCode !== '17004')
                                                            .map((item:any) =>
                                                                <Option
                                                                    key={`pay_type_${item.postCode}`}
                                                                    value={item.postCode}
                                                                    disabled={
                                                                        lead.hasContract ? item.postCode === '17002': item.postCode === '17003'
                                                                    }
                                                                >
                                                                    {item.postName}
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
                                    <FormItem label='课时数'>
                                        <span>{course.packageNum}</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='课程包名称'>
                                        {
                                            getFieldDecorator('cpackageId',{
                                                initialValue:course.cpackageId,
                                                rules: [{required: true, message:'请填写课程包名称!'}]
                                            })(
                                                <Select
                                                    style={{width:'200px'}}
                                                    className='gym-form-item-select'
                                                    onSelect={this.selectCourse}
                                                >
                                                    {
                                                        newPackageList.map((item:any) =>
                                                            <Option
                                                                key={`pay_type_${item.id}`}
                                                                value={item.id}
                                                                disabled={!User.businessSource.map(i => i.businessSourceCode).includes(item.businessSource)}
                                                            >
                                                            {item.packageName}
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
                                    <FormItem label='课程包定价'>
                                        <span>{ course.packagePrice}</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='赠送课时数'>
                                        {
                                            getFieldDecorator('freeCourseNum', {
                                                initialValue: course.freeCourseNum
                                            })(
                                                <InputNumber
                                                    precision={0}
                                                    min={0}
                                                    placeholder='请输入'
                                                    disabled={isShowContract === '75003'}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>

                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='注册费'>
                                        {
                                            getFieldDecorator('registeredFee', {
                                                initialValue: contract.registeredFee
                                            })(
                                                <InputNumber min={0} precision={2}/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='课程包实收价' className='validate-form'>
                                        {
                                            getFieldDecorator('reallyAfterDiscountPrice', {
                                                initialValue: course.reallyAfterDiscountPrice,
                                                rules: [
                                                    {required: true, message:'请填写课程包实收价!'}
                                                ],
                                            })(
                                                <InputNumber min={0} precision={2}  disabled={getFieldValue('contractType') === FREE}/>
                                            )
                                        }
                                    </FormItem>
                                </Col>

                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='签约日' className='validate-form'>
                                        {
                                            getFieldDecorator('signTime',{
                                                initialValue: ((contract && contract.signTime !== '')?moment(contract.signTime):''),
                                                rules: [{required: true, message:'请输入签约日!'}],
                                            })(
                                                <DateInput
                                                    placeholder='请选择日期'
                                                    className='gym-date-packer'
                                                    format={"YYYY/MM/DD"}
                                                    allowClear={false}
                                                    showToday={false}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='签约人'>
                                        {
                                            getFieldDecorator('salesStaffId',{
                                                rules: [
                                                    {required: true, message:'请选择签约人!'}
                                                ],
                                                initialValue:contract.salesStaffId
                                            })(
                                                <Select
                                                    showSearch
                                                    style={{width:'200px'}}
                                                    className='gym-form-item-select'
                                                    placeholder='请选择'
                                                    filterOption={
                                                        (input:any, option:any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    {
                                                        staffList.map((item:any) =>
                                                            <Option
                                                                key={`pay_type_${item.staffId}`}
                                                                value={item.staffId}
                                                            >{`${item.englishName} ${item.chineseName}`}</Option>
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
                                    <FormItem label='起始日'>
                                        <span>
                                            {
                                                getFieldValue('signTime').format("YYYY-MM-DD")
                                            }
                                        </span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='有效期长度'>
                                        <span>{
                                            course.validityPeriod
                                                ? `${course.validityPeriod}个月${course.freeValidityPeriod ? `+${course.freeValidityPeriod}个月` : ''}`
                                                :  course.periodOfValidity
                                            }
                                        </span>
                                    </FormItem>
                                </Col>

                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='所属中心'>
                                        <span>{`${User.centerCode}-${User.currentCenterName}`}</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='到期日'>
                                        <span>
                                            {
                                                course.validityPeriod
                                                ? (getFieldValue('signTime').clone().subtract('days',1)).add((course.validityPeriod + (course.freeValidityPeriod ? course.freeValidityPeriod : 0)), 'M').format("YYYY-MM-DD")
                                                :
                                                    course.endTime ? moment(course.endTime).format('YYYY-MM-DD'): ''
                                            }
                                        </span>
                                    </FormItem>
                                </Col>

                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='合同状态'>
                                        <span>正常</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='付款状态'>
                                        <span>未付款</span>
                                    </FormItem>
                                </Col>

                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='PR礼品' >
                                        {
                                            (getFieldValue('freeGiftList') || contract.freeGiftUsedInfoList || []).map((item:any) =>
                                                <div
                                                    className='gym-contract-add-form-wrap-gift'
                                                    key={item.freeGiftId || (new Date()).valueOf()}
                                                >
                                                    {`${item.freeGiftName?item.freeGiftName:'其他'}*${item.freeGiftNum}`}
                                                </div>
                                            )
                                        }
                                        {
                                            getFieldDecorator('freeGiftList', {
                                                initialValue: contract.freeGiftUsedInfoList
                                            })(
                                                <PrAddButton
                                                    productList={productList}
                                                    handleSelect={this.selectGifts}
                                                    giftList={contract.freeGiftUsedInfoList}
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='审批状态'>
                                        <span>{this.formatApprovalStatus(contract.approvalStatus)}</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='PR总价' style={{height:'50px'}}>
                                        <span>
                                            {
                                                getFieldValue('freeGiftList')
                                                    ? (getFieldValue('freeGiftList') || []).map((item:any) => item.freeGiftNum * item.freeGiftPrice).reduce((a, b) => a + b, 0)
                                                    : (contract.freeGiftUsedInfoList || []).map((item:any) => item.freeGiftNum * item.freeGiftPrice).reduce((a, b) => a + b, 0)
                                            }
                                        </span>
                                    </FormItem>
                                </Col>
                                {
                                    isShowContract==="75002"&&
                                        <Col span={12}>
                                            <FormItem label='关联合同' className='gym-contract-add-form-required validate-form'>
                                                {
                                                    relationContract.length>0&&
                                                    getFieldDecorator('relatedContracts',{
                                                        initialValue: sigMa||[]
                                                    })(
                                                        <Select
                                                            style={{width:'200px'}}
                                                            className='gym-form-item-select'
                                                            onSelect={this.selectRelationContract}
                                                            placeholder='请选择'
                                                            mode="multiple"
                                                        >
                                                            {
                                                               relationContract.map((item) =>
                                                                     <Option value={item.refundContractID} key={item.refundContractID}>
                                                                        <span>{item.refundcontractCode}</span>
                                                                     </Option>
                                                                )
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                }
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='法定监护人' className='gym-contract-add-form-required validate-form'>
                                        {
                                            getFieldDecorator('legalGuardian', {
                                                initialValue: contract.legalGuardian,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择法定监护人'
                                                    }
                                                ]
                                            })(
                                                <Select
                                                    style={{ width: '200px' }}
                                                    className='gym-form-item-select'
                                                    onSelect={this.selectLegal}
                                                    placeholder='请选择'
                                                >
                                                    {
                                                        contactList && contactList.map((item, index) =>
                                                            <Option value={item.id} key={item.id}>
                                                                {item.contactName}({item.familyRelationValue})
                                                            </Option>
                                                        )
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    {
                                        <FormItem label='是否使用电子合同' className='gym-contract-add-form-required validate-form'>
                                            {
                                                getFieldDecorator('electronicFlag', {
                                                    initialValue: type !== '17001' ? contract.electronicFlag : 0
                                                })(
                                                    <Radio.Group onChange={(e) => this.handleSelectISETC(e.target.value)}>
                                                        <Radio value={1} disabled={true}>是</Radio>
                                                        <Radio value={0} disabled={true}>否</Radio>
                                                    </Radio.Group>
                                                )
                                            }
                                        </FormItem>
                                    }
                                </Col>
                            </Row>
                            {/************Todo**********/}
                            <Row>
                                <Col span={24}>
                                    <div className='gym-contract-add-info'>
                                        如家长绑定购买了其它课程（例如APP早教核心课），以下选项请选择“是”，并填写对应的其它绑定合同的实收价，电子合同中将显示绑定合同实收总价。
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='是否绑定其他合同' className='gym-contract-add-form-required validate-form'>
                                        {
                                            getFieldDecorator('hasBindingContract', {
                                                initialValue: contract.hasBindingContract
                                            })(
                                                <Radio.Group onChange={this.handleChangeBindContract}>
                                                    <Radio
                                                        value={1}
                                                        disabled={course && course.isGymAppShow === 0}
                                                    >是</Radio>
                                                    <Radio value={0}>否</Radio>
                                                </Radio.Group>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='其他绑定合同实收价' className='gym-contract-add-form-required validate-form'>
                                        {
                                            getFieldDecorator('bindingActualPrice',{
                                                initialValue: contract.bindingActualPrice
                                            })(
                                                <InputNumber
                                                    precision={2}
                                                    min={0}
                                                    disabled={getFieldValue('hasBindingContract') !== 1}
                                                    placeholder='请输入'
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='合同实收总价' className='gym-contract-add-form-required validate-form'>
                                        <span>
                                            {
                                                (getFieldValue('reallyAfterDiscountPrice') && getFieldValue('bindingActualPrice'))
                                                    ? SafeCalculate.add(getFieldValue('reallyAfterDiscountPrice'), getFieldValue('bindingActualPrice'))
                                                    : getFieldValue('reallyAfterDiscountPrice')
                                            }</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='合同绑定月份' className='gym-contract-add-form-required validate-form'>
                                        {
                                            getFieldDecorator('bindingContractMonth',{
                                                initialValue: contract.bindingContractMonth

                                            })(
                                                <InputNumber
                                                    precision={0}
                                                    min={1}
                                                    disabled={getFieldValue('hasBindingContract') !== 1}
                                                    placeholder='请输入'
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='所属GB' className='gym-contract-add-form-required validate-form'>
                                        <span>{contract.gbstaffname}</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem label='备注' style={{height:'70px'}} className='bottomLeft bottomRight'>
                                        {
                                            getFieldDecorator('remark',{
                                                initialValue: contract.remark
                                            })(
                                                <TextArea style={{marginTop:'10px'}} autosize={{minRows: 2, maxRows: 2}} placeholder='请输入内容'/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </Row>
                        </div>
                        <CancelButton
                            form={form}
                            goBackLink={Routes.合同管理列表.path}
                            submitText='重新提交'
                        />
                    </Form>
                </div>
            </div>
        )
    }
}

export {EditContract}
