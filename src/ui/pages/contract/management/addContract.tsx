/**
 * desc: 新建合同
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/11/3
 * Time: 上午9:37
 */
import React from 'react';
import {BreadCrumb} from "../../../component/breadcrumb";
import {Form, Input, Row, Col,Radio,} from "antd";
import {form} from "../../../../common/decorator/form";
import {Select, Option} from "../../../component/select";
import {InputNumber, TextArea} from "../../../component/input";
import {DateInput} from "../../../component/datePicker";
import {CourseType} from "../../setting/enum/course";
import {User} from "../../../../common/beans/user";
import {CancelButton} from "../../../component/cancelButton";
import {PrAddButton} from "./part/prAddButton";
import {getProductListNoPages} from "@redux-actions/setting/productActions";
import {CommonUtils} from "../../../../common/utils/commonUtils";
import { checkBabyInfo } from "@redux-actions/contract";
import { Modal } from "@/ui/component/customerCreateModal";
import {
    getleadInfo, getCourseListByCourseType,
    creatContract,
    getRelatedContract,
    isSelectContract,
    getBabyByleads
} from "@redux-actions/contract";
import { CustomerRoutes } from "@/router/enum/customerRoutes";
import { SettingRoutes } from "@/router/enum/settingRoutes"
import { getClientInfo } from '@/redux-actions/teaching/chooseLesson';
import moment from 'moment';
import history from '../../../../router/history';
import {connect} from "../../../../common/decorator/connect";
import {selectContractTypes} from "../../../../saga/selectors/contract";
import {Routes} from "@/router/enum/routes";
import {FUNC} from "@/ui/pages/setting/enum/functions";
import { message } from 'antd';
import {selectBusinessSourceList, selectTotalEmployeeList} from "@/saga/selectors/home";
import {SafeCalculate} from "@/common/utils/commonUtils";
import {Modal} from "@/ui/component/customerCreateModal";


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
    staffList: selectTotalEmployeeList(state, selectOption),
    businessSourceMap: selectBusinessSourceList(state)
}))
@form()
class AddContract extends React.Component<any, any> {
    private routes:Array<any> = [
        {
            name: '客户360',
            path: '',
            link: '#',
            id: 'contractManagement'
        },{
            name: '新建合同',
            path: '',
            link: '#',
            id: 'addContract'
        }
    ];
    DEFAULT_PACKAGE_TYPE = 1;     // 默认课程包类型
    DEFAULT_BUSINESS_TYPE = "75001"; // 默认为金宝贝课包
    leadsId:string;
    submitRequestId:string;
    constructor(props:any){
        super(props)
        if(CommonUtils.hasParams(props)){
            this.leadsId = CommonUtils.parse(props).leadsId;
        }
        this.submitRequestId = CommonUtils.generateGuid();
        this.state = {
            lead:{},
            packageList: [],
            relationContract: [],     // 西格玛关联合同
            course:{},
            productList: [],
            isShowContract: "75001",
            type: '',                 // 合同类型
            contactInfos: '',         // 联系人
            isElectronic: '',
            babyNumber: 1,            // 宝宝个数
            visible: false,           // 设置客户信息
            isETC: '',                // 是否电子合同,
            leadsInfo: {},            // leads信息
            isChecked: false,
            checkVisible: false,
            msg: ''
        }
    }
    componentDidMount(){
        Promise.all([
            isSelectContract({currentCenterId: User.currentCenterId}),
            getBabyByleads({id: this.leadsId, currentCenterId: User.currentCenterId}),
            getleadInfo({currentCenterId: User.currentCenterId, leadsId: this.leadsId}),
            getCourseListByCourseType({currentCenterId: User.currentCenterId, packageType: this.DEFAULT_PACKAGE_TYPE}),
            getProductListNoPages({currentCenterId: User.currentCenterId}),
            getClientInfo({currentCenterId: User.currentCenterId, leadsId: this.leadsId}),
        ]).then((res) => {
            this.setState({
                isElectronic: res[0].elecSigningCenter,
                babyNumber: res[1],
                lead: res[2],
                packageList: res[3],
                productList: res[4],
                contactList: res[5].babyInfo.contactInfos.filter((item: any) => item.isLegalGuardian === 1),
                leadsInfo: res[5].babyInfo.leadsInfo
            })
        })

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
     * 提交表单
     */
    handleSubmit = (e:any) => {
        e.preventDefault();
        const { type, isETC, isElectronic} = this.state;
        this.props.form.validateFields((err:any, values:any) => {
            if(!err){
                if(values.businessSource){
                    values.businessSource = values.businessSource.toString();
                    values.actualTotalPrice = values.reallyAfterDiscountPrice + (values.bindingActualPrice || 0)
                }
                let arg = {};
                if (isETC === 1){
                    arg = Object.assign({}, values, {
                        leadsId: this.leadsId,
                        signCenterId: User.currentCenterId,
                        currentCenterId: User.currentCenterId,
                    });
                } else if (isETC === 0 || isElectronic === false || type === '17001' || type === '17002' || type === '17003'){
                     arg = Object.assign({}, values, {
                        contractCode: `${User.centerCode}-${values.contractCode}`,
                        leadsId: this.leadsId,
                        signCenterId: User.currentCenterId,
                        currentCenterId: User.currentCenterId,
                    });
                }
                //
                if(!this.state.isChecked){
                    const {isErr, str} = this.showErrorMsg(values.reallyAfterDiscountPrice, values.registeredFee, values.freeCourseNum);
                    if(isErr){
                        this.setState({checkVisible:true, msg: str, isChecked: true})
                        return;
                    }
                }
                creatContract(arg, this.submitRequestId).then(() => {
                    history.push(Routes.合同管理列表.path)
                })
            }
        })
    };
    /**
     *
     * @param {number} price（合同金额）
     * @param {number} registered（注册费）
     * @param {number} num（赠课数量）
     */
    showErrorMsg = (price:number = 0, registered:number = 0, num:number = 0 ) => {
        let str = '', isErr = false;
        const type = this.props.form.getFieldValue('contractType');
        if(type === '17001'){
            if(registered <= 1000 && num <=30){
                return { isErr, str};
            }else {
                isErr = true;
                if(num > 30){
                    if(registered <= 1000){
                        str = '您填写的赠送课时存在过大的风险，如无异常麻烦再次提交，谢谢！';
                    }else {
                        str = '请检查，您填写的金额及课时均存在风险，如无异常麻烦再次提交，谢谢！'
                    }
                } else {
                    if(registered > 1000){
                        str = '请检查，您填写的金额存在过大的风险，如无异常麻烦再次提交，谢谢！'
                    }
                }
                return {isErr, str}
            }
        }else{
            if(price >= 1000 && price <= 40000 && registered <= 1000 && num <=30){
                return { isErr, str};
            }else {
                isErr = true;
                if(num > 30){
                    if(price >= 1000 && price <= 40000 && registered <= 1000){
                        str = '您填写的赠送课时存在过大的风险，如无异常麻烦再次提交，谢谢！';
                    }else {
                        str = '请检查，您填写的金额及课时均存在风险，如无异常麻烦再次提交，谢谢！'
                    }
                } else {
                    if(registered <= 1000){
                        if(price > 40000){
                            str = '请检查，您填写的金额存在过大的风险，如无异常麻烦再次提交，谢谢！'
                        }else if(price < 1000) {
                            str = '请检查，您填写的金额存在过小的风险，如无异常麻烦再次提交，谢谢！'
                        }
                    } else {
                        if(price > 40000 || price < 1000){
                            str = '请检查，您填写的金额均存在风险，如无异常麻烦再次提交，谢谢！'
                        }else{
                            str = '请检查，您填写的金额存在过大的风险，如无异常麻烦再次提交，谢谢！'
                        }
                    }
                }
                return {isErr, str}
            }
        }
    };
    /**
     * 选择合同类型
     * @param {string} value
     */
    selectContractType = (value:string) => {
        const {contractTypes, form} = this.props;
        const {course} = this.state;
        const {setFieldsValue} = form;
        this.setState({type: value})
        const FREE = contractTypes.filter((item:any) => item.codeValue === '赠送')[0] && contractTypes.filter((item:any) => item.codeValue === '赠送')[0].code;
        if(value === FREE){
            setFieldsValue({
                reallyAfterDiscountPrice: 0
            })
        }else{
            setFieldsValue({
                reallyAfterDiscountPrice: course.actualPrice ? course.actualPrice : course.packagePrice
            })
        }
    }
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
        this.setState({course:{}})
    };
    /**
     * 选择课程包
     * @param value
     */
    selectCourse = (value:string) => {
        const {form, contractTypes} = this.props;
        const FREE = contractTypes.filter((item:any) => item.codeValue === '赠送')[0] && contractTypes.filter((item:any) => item.codeValue === '赠送')[0].code;
        const {setFieldsValue, getFieldValue} = form;
        const {packageList} = this.state;
        const pkg = (packageList || []).filter((item:any) => item.id === value)[0];
        if(pkg.isGymAppShow === 0){
            setFieldsValue({
                reallyAfterDiscountPrice: getFieldValue('contractType') === FREE ? 0 : pkg.actualPrice ? pkg.actualPrice :pkg.packagePrice,
                freeCourseNum: pkg.freeCourseNum,
                electronicFlag:0,
                hasBindingContract: 0,
                bindingActualPrice: null,
                bindingContractMonth:null
            })
        }else{
            setFieldsValue({
                reallyAfterDiscountPrice: getFieldValue('contractType') === FREE ? 0 : pkg.actualPrice ? pkg.actualPrice :pkg.packagePrice,
                freeCourseNum: pkg.freeCourseNum,
            })
        }
        this.setState({course:pkg})
    };
    /**
     * 选择法定监护人
     * @param value
     */
    selectLegal = (value:string) => {
        const {form} = this.props;
        const { getFieldValue} = form;
        if (value && (getFieldValue('electronicFlag')===1||this.state.isETC===1)){
            const params = {
                currentCenterId: User.currentCenterId,
                leadsId: this.leadsId,
                contactId: value
            };
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
                        message.warning('您没有中心管理权限，请联系管理员配置！')
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
    /**
     * 选择业务来源
     * @param
     */
    selectCourseFromType = (value:any) => {
        const {form} = this.props;
        this.setState({isShowContract:value})
        form.setFieldsValue({
            freeCourseNum: null,
            reallyAfterDiscountPrice:null,
            cpackageId:null,
            contractType:null,
            electronicFlag: null,
        })
        // 如果 西格玛业务，需要查询关联合同
        if(value==="75002"){
            getRelatedContract({
                cid: User.currentCenterId,
                leadsID: this.leadsId
            }).then((res=>{
                this.setState({relationContract:res})
            }))
        }
    }
    /**
     * 选择礼物
     * @param gifts
     */
    selectGifts = (gifts:any) => {
        const {form} = this.props;
        form.setFieldsValue({freeGiftList: gifts})

    }
    /**
     * 选择是否使用电子合同
     * @param
     */
    handleSelectISETC = (value:any) => {
        const {form} = this.props;
        const { getFieldValue} = form;
        this.setState({
            isETC: value
        })
        const params = {
            currentCenterId: User.currentCenterId,
            leadsId: this.leadsId,
            contactId: getFieldValue('legalGuardian')
        }
        if (value === 1 && getFieldValue('legalGuardian')!==undefined){
            checkBabyInfo(params).then((res:any)=>{
            },(err)=>{
                if (err.code === 11001||err.code===11002||err.code===11003||err.code===11004){
                    this.setState({ visible: true });
                }
            })
        }
    }
    /**
     * 选增绑定合同
     */
    handleChangeBindContract = (e) => {
        const {setFieldsValue} = this.props.form;
        if(!e.target.value){
            setFieldsValue({
                bindingActualPrice: null,
                bindingContractMonth: null
            })
        }else{
            setFieldsValue({
                bindingActualPrice: 0,
                bindingContractMonth: 1
            })
        }
    }
    /**
     *
     */
    onCancel = () => {
        this.setState({ visible: false });
    }
    // 去设置信息
    toSet = () =>{
        const {form} = this.props;
        const { getFieldValue} = form
        const params = {
            currentCenterId: User.currentCenterId,
            leadsId: this.leadsId,
            contactId: getFieldValue('legalGuardian')
        }
        checkBabyInfo(params).then((res: any) => {
            this.setState({ visible: false })
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
                    message.warning('您没有中心管理权限，请联系管理员配置！')
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

    render(){
        const {
            lead, packageList, course, productList, isShowContract, relationContract,
            type, isETC, contactList, isElectronic, babyNumber, visible, leadsInfo,
            checkVisible, msg
        } = this.state;
        const {form, contractTypes, staffList, businessSourceMap} = this.props;
        const businessType = isShowContract.toString();
        const newPackageList = packageList.filter((item:any) => item.businessSource === businessType)
        const {getFieldDecorator, getFieldValue} = form;
        const newContractTypes = contractTypes.map((item:any) => ({postCode:item.code, postName:item.codeValue}));
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
                                        <span title={lead.babyNames}>{(lead.babyNames && lead.babyNames.length > 20) ? (`${lead.babyNames.substr(0,20)}...`) : lead.babyNames}</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='月龄' className='topRight contract-thead contract-thead-right ht50'>
                                        <span>{lead.monthValues}</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                {
                                    ((isETC !== 1 || isElectronic !== true || babyNumber>3 ) && (['17001', '17002', '17003'].includes(type)))&&
                                    <Col span={12}>
                                        <FormItem label='合同编号' className='gym-contract-add-form-required validate-form'>
                                            {
                                                getFieldDecorator('contractCode', {
                                                    rules: [{required: true, message: '请输入合同编号'}],
                                                })(
                                                    <div className='gym-contract-add-form-wrap-code'>
                                                        <span style={{ width: `${(User.centerCode.length + 7) * 6}px` }} className='gym-contract-add-form-wrap-code-centerId'>{`${User.centerCode} -`}</span>
                                                        <Input className='gym-contract-add-form-wrap-code-text' placeholder='请输入' />
                                                    </div>

                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                }
                                <Col span={12}>
                                    <FormItem label='业务来源' className='gym-contract-add-form-required validate-form'>
                                        {
                                            getFieldDecorator('businessSource', {
                                                initialValue:this.DEFAULT_BUSINESS_TYPE,
                                                rules: [
                                                    {required: true, message:'请选择业务来源'}
                                                ],
                                            })(
                                                <Select
                                                    style={{width:'200px'}}
                                                    className='gym-form-item-select'
                                                    onSelect={this.selectCourseFromType}
                                                    placeholder='请选择'
                                                >
                                                    {
                                                        businessSourceMap.map((item:any) =>
                                                            <Option
                                                                key={`pay_type_${item.value}`}
                                                                value={item.businessSourceCode}
                                                                disabled={!User.businessSource.map(item => item.businessSourceCode).includes(item.businessSourceCode)}
                                                            >
                                                                {item.businessSourceValue}
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
                                    <FormItem label='课程包类型' className='gym-contract-add-form-required validate-form'>
                                        {
                                            getFieldDecorator('courseType', {
                                                initialValue:this.DEFAULT_PACKAGE_TYPE,
                                                rules: [
                                                    {required: true, message:'请选择课程包类型'}
                                                ],
                                            })(
                                                <Select
                                                    style={{width:'200px'}}
                                                    className='gym-form-item-select'
                                                    onSelect={this.selectCourseType}
                                                    placeholder='请选择'
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
                                    <FormItem label='合同类型' className='gym-contract-add-form-required validate-form'>
                                        {
                                            getFieldDecorator('contractType', {
                                                rules: [
                                                    {required: true, message:'请选择合同类型'}
                                                ],
                                            })(
                                                <Select
                                                    style={{width:'200px'}}
                                                    className='gym-form-item-select'
                                                    onChange={this.selectContractType}
                                                    placeholder='请选择'
                                                >
                                                    {
                                                        // todo 17002代表新合约，17003代表续约, 17004代表转入
                                                        newContractTypes.filter((item:any) => item.postCode !== '17004')
                                                            .map((item:any) =>
                                                                <Option
                                                                    key={`pay_type_${item.postCode}`}
                                                                    value={item.postCode}
                                                                    disabled={lead.hasContract ? item.postCode === '17002': item.postCode === '17003'}
                                                                >{item.postName}</Option>
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
                                        <FormItem label='课程包名称' className='gym-contract-add-form-required validate-form'>
                                            {
                                                getFieldDecorator('cpackageId',{
                                                    rules: [
                                                        {required: true, message:'请填写课程包名称'}
                                                    ],
                                                })(
                                                    <Select
                                                        style={{width:'200px'}}
                                                        className='gym-form-item-select'
                                                        onSelect={this.selectCourse}
                                                        placeholder='请选择'
                                                    >
                                                        {
                                                            newPackageList.map((item:any) =>
                                                                <Option
                                                                    key={`pay_type_${item.id}`}
                                                                    value={item.id}
                                                                >{item.packageName}</Option>
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
                                        <span>{course.packagePrice || 0}</span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='赠送课时数'>
                                        {
                                            getFieldDecorator('freeCourseNum')(
                                                <InputNumber
                                                    min={0}
                                                    precision={0}
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
                                            getFieldDecorator('registeredFee')(
                                                <InputNumber precision={2} min={0} placeholder='请输入'/>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='课程包实收价' className='gym-contract-add-form-required validate-form'>
                                        {
                                            getFieldDecorator('reallyAfterDiscountPrice', {
                                                rules: [
                                                    {required: true, message:'请填写课程包实收价'}
                                                ],
                                                initialValue: course.packagePrice
                                            })(
                                                <InputNumber
                                                    precision={2}
                                                    disabled={getFieldValue('contractType') === FREE}
                                                    min={0}
                                                    placeholder='请输入'
                                                />
                                            )
                                        }
                                    </FormItem>
                                </Col>

                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='签约日' className='gym-contract-add-form-required validate-form'>
                                        {
                                            getFieldDecorator('signTime',{
                                                rules: [
                                                    {required: true, message:'请输入签约日'}
                                                ],
                                                initialValue: moment()
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
                                                    {required: true, message:'请选择签约人'}
                                                ],
                                                initialValue:leadsInfo.primaryGbStaffId
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
                                            {getFieldValue('signTime') && getFieldValue('signTime').format("YYYY-MM-DD")}
                                        </span>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='有效期长度'>
                                        <span>{course.validityPeriod && `${course.validityPeriod}个月${course.freeValidityPeriod ? `+${course.freeValidityPeriod}个月` : ''}`}</span>
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
                                                course.validityPeriod &&
                                                getFieldValue('signTime') && (getFieldValue('signTime').clone().subtract('days',1)).add((course.validityPeriod + (course.freeValidityPeriod ? course.freeValidityPeriod : 0)), 'M').format("YYYY-MM-DD")
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
                                    <FormItem label='PR礼品'>
                                        {
                                            (getFieldValue('freeGiftList') || []).map((item:any) =>
                                                <div className='gym-contract-add-form-wrap-gift' key={item.freeGiftId || (new Date()).valueOf()}>
                                                    {`${item.freeGiftName?item.freeGiftName:'其他'}*${item.freeGiftNum}`}
                                                </div>
                                            )
                                        }
                                        {getFieldDecorator('freeGiftList')(<span/>)}
                                        <PrAddButton
                                            productList={productList}
                                            handleSelect={this.selectGifts}
                                        />
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label='审批状态'>
                                        <span>待审批</span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='PR总价'>
                                        <span>
                                            {
                                                (getFieldValue('freeGiftList') || []).map((item:any) =>
                                                    item.freeGiftNum * item.freeGiftPrice).reduce((a, b) => a + b, 0)
                                            }
                                        </span>
                                    </FormItem>
                                </Col>
                                {
                                    isShowContract === "75002"&&
                                    <Col span={12}>
                                        <FormItem label='关联合同' className='gym-contract-add-form-required validate-form'>
                                            {
                                                getFieldDecorator('relatedContracts',{

                                                })(
                                                    <Select
                                                        style={{width:'200px'}}
                                                        className='gym-form-item-select'
                                                        placeholder='请选择'
                                                        mode="multiple"
                                                    >
                                                        {
                                                            relationContract.map((item) =>
                                                                <Option value={item.refundContractID} key={item.refundContractID}>
                                                                    {item.refundcontractCode}
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
                                                rules:[
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
                                                        contactList&&contactList.map((item,index) =>
                                                            <Option value={item.id} key={item.id}>
                                                                {item.contactName}（{item.familyRelationValue}）
                                                            </Option>
                                                        )
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                        <FormItem label='是否使用电子合同' className='gym-contract-add-form-required validate-form'>
                                            {
                                                getFieldDecorator('electronicFlag', {
                                                    initialValue: (isElectronic === false || babyNumber > 3 || type === '17001' || course.isGymAppShow === 1 || isShowContract === '75003') ? 0 : '',
                                                    rules: [
                                                        { required: true, message: '请选择是否使用电子合同' }
                                                    ],
                                                })(
                                                    <Radio.Group onChange={(e) => this.handleSelectISETC(e.target.value)}>
                                                        <Radio
                                                            value={1}
                                                            disabled={(isElectronic === false || babyNumber > 3 || type === '17001' || course.isGymAppShow === 0 || isShowContract === '75003') ? true : false}
                                                        >是</Radio>
                                                        <Radio value={0}>否</Radio>
                                                    </Radio.Group>
                                                )
                                            }
                                        </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem label='所属GB' className='gym-contract-add-form-required validate-form'>
                                        <span>{lead.gb}</span>
                                    </FormItem>
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
                                                initialValue: 0
                                            })(
                                                <Radio.Group onChange={this.handleChangeBindContract}>
                                                    <Radio
                                                        value={1}
                                                        disabled={course.isGymAppShow === 0}
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
                                            getFieldDecorator('bindingActualPrice')(
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
                                            getFieldDecorator('bindingContractMonth')(
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
                            <FormItem label='备注' style={{height:'70px'}} className='bottomLeft bottomRight'>
                                {
                                    getFieldDecorator('remark')(
                                        <TextArea
                                            style={{marginTop:'10px'}}
                                            placeholder='请输入内容'
                                            autosize={{minRows: 2, maxRows: 2}}
                                        />
                                    )
                                }
                            </FormItem>
                        </div>
                        <CancelButton
                            form={form}
                            submitText='新建'
                        />
                        <Modal
                            visible={visible}
                            handleOk={this.toSet}
                            handleCancel={this.onCancel}
                            contentText='数据信息不完善，请前往设置！'
                        />
                    </Form>
                    <Modal
                        visible={checkVisible}
                        contentText={msg}
                        footer={false}
                    >
                        <button
                            className='gym-button-default gym-button-xs footButton'
                            style={{}}
                            onClick={() => {this.setState({checkVisible:false, msg: ''})}}
                        >知道了</button>
                    </Modal>
                </div>
            </div>
        )
    }
}

export {AddContract}
