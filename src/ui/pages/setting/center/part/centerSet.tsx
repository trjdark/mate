/**
 * desc: 中心设置
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2018/8/15
 * Time: 上午9:58
 */
import React, {Fragment} from 'react';
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {PageTitle} from "../../../../component/pageTitle";
import {Form, InputNumber, Checkbox, Row, Col} from "antd";
import {form} from "../../../../../common/decorator/form";
import {SelectGoroup, IsCheckSelect} from "./selectGoroup";
import {connect} from "../../../../../common/decorator/connect";
import {
    getCenterConfig, updateCenterConfig, getCenterEmployeeList,
} from "@redux-actions/setting/center";
import {CancelButton} from "../../../../component/cancelButton";
import {Routes} from "@/router/enum/routes";
import {User} from "../../../../../common/beans/user";
import {selectBusinessSourceList, selectTotalEmployeeList} from "../../../../../saga/selectors/home";
import {Select, Option} from "@/ui/component/select";
import { PriceInput} from "@/ui/pages/setting/center/part/priceInput";
import {validPeriodList, businessStatusList} from "../../enum/centerInfo";
import {BreadCrumb} from "@/ui/component/breadcrumb";

const FormItem = Form.Item;

const CheckboxGroup = Checkbox.Group;

const checkboxFormat = (obj:any) => {
    if(typeof obj !== 'object'){
        return;
    }
    for (let key in obj){
        if( typeof obj[key] === 'boolean'){
            obj[key] ? obj[key] = 1: obj[key] = 0
        }else if(typeof obj[key]==='undefined'){
            obj[key]='';
        }
    }
    return obj
};
// 在职员工
const selectOption = {
    workingStatus: "1",
};

@form()
@connect((state:any) => ({
    staffList: selectTotalEmployeeList(state, selectOption),
    businessSourceMap:selectBusinessSourceList(state)
}), {updateCenterConfig})
class CenterSet extends React.Component<any, any>{
    centerId:string;
    interval:any;
    private routes:Array<any>;
    private IsCheckSelectItems = [
        {
            checkLabel: '试听是否需要审批',
            selectLabel: '试听审批人员',
            checkName: 'enablePreviewApproval',
            selectName: 'previewApprovalStaffId'
        },{
            checkLabel: '合同赠课需要审批',
            selectLabel: '合同赠课审批人员',
            checkName: 'enableFreeCourseApproval',
            selectName: 'freeCourseApprovalStaffId'
        },{
            checkLabel: '合同延期需要审批',
            selectLabel: '合同延期审批人员',
            checkName: 'enableExtendContractApproval',
            selectName: 'extendContractApprovalStaffId'
        },{
            checkLabel: '请假次数变更需要审批',
            selectLabel: '请假次数变更审批人员',
            checkName: 'enableModifyLeaveTimesApproval',
            selectName: 'modifyLeaveTimesApprovalStaffId'
        }
    ];
    private SelectItems = [
        {
            label: '市场渠道审批人员',
            name: 'marketingActivityApprovalStaffId'
        },{
            label: '会员活动审批人员',
            name: 'memberActivityApprovalStaffId'
        },{
            label: '合同新增审批人员',
            name: 'createContractApprovalStaffId'
        },{
            label: '合同退课审批人员',
            name: 'refundApprovalStaffId'
        },{
            label: '合同转中心审批人员',
            name: 'transferCenterApprovalStaffId'
        },{
            label: '合同改包审批人员',
            name: 'modifyPackageApprovalStaffId'
        }
    ];


    constructor(props:any){
        super(props)
        if(CommonUtils.hasParams(props)){
            this.centerId = CommonUtils.parse(props).id;
        }
        this.state = {
            checkedList: [],  // 选中的可用业务
            centerConfig: {}, // 中心配置
            employeeList: [], // 在总部设置下获取中心员工列表
            businessSourceList: [], // 业务来源列表
        }
        this.routes = [
            {
                name: '设置',
                path: '',
                link: '#',
                id: 'setting'
            },{
                name: '运营管理',
                path: '',
                link: '#',
                id: 'operation'
            },{
                name: '中心管理',
                path: '',
                link: '#',
                id: 'course'
            },{
                name: `设置中心(${CommonUtils.parse(props).code}-${CommonUtils.parse(props).name})`,
                path: '',
                link: '#',
                id: 'course-set'
            }
        ];
    }
    componentDidMount(){
        Promise.all([
            getCenterConfig({
                centerId: this.centerId,
                currentCenterId: User.currentCenterId
            }),
            User.currentCenterId === "C_HQ001" && getCenterEmployeeList({centerId: this.centerId, currentCenterId: User.currentCenterId}),
        ]).then((res:any) => {
            const [centerConfig, employeeList] = res;
            const {businessSourceMap} = this.props;
            centerConfig.appAllowLeave = {
                appAllowLeaveSetting:centerConfig.appAllowLeaveSetting,
                appAllowLeaveUnit:centerConfig.appAllowLeaveUnit
            };
            centerConfig.businessSourceConfigList = centerConfig.businessSourceConfigList.map(item => item.businessSourceCode);
            delete centerConfig.appAllowLeaveSetting
            delete centerConfig.appAllowLeaveUnit
            this.setState({
                centerConfig,
                employeeList: (employeeList || []).filter((item:any) => item.workingStatus === "1"), // 在职员工
                businessSourceList: businessSourceMap.map(item => ({
                    label: item.businessSourceValue,
                    value: item.businessSourceCode,
                    disabled:item.businessSourceCode === '75001'
                }))
            });
        })
    }
    componentWillUnmount(){
        if(this.interval){
            clearInterval(this.interval)
        }
    }
    /**
     * 保存修改信息
     * @param e
     */
    handleSubmit = (e) => {
        e.preventDefault();
        const {centerConfig} = this.state;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.appAllowLeaveSetting = values.appAllowLeave.appAllowLeaveSetting
                values.appAllowLeaveUnit = values.appAllowLeave.appAllowLeaveUnit
                delete values.appAllowLeave;
                const data = Object.assign({}, centerConfig, checkboxFormat(values));
                this.props.updateCenterConfig(Object.assign({}, data, {
                    currentCenterId: User.currentCenterId,
                }));
            }
        });
    };
    /**
     * 清除联动输入框
     * @param e
     * @param {string} name
     */
    handleClean = (e, name:string,require?:boolean) => {
        if(!e.target.checked){
            let result=require? 0 : undefined;
            this.props.form.setFieldsValue({[name]: result})
        }else{
            this.props.form.setFieldsValue({[name]: 0});
            if(name==='autoConfirmType'){
                this.props.form.setFieldsValue({[name]: 'day'});
            }
            if(name==='maxWaitingNum'){
                this.props.form.setFieldsValue({[name]: 8});
            }
        }
    };
    render(){
        const {staffList, form, code, name} = this.props;
        const {centerConfig, employeeList, businessSourceList} = this.state;
        const {getFieldDecorator, getFieldValue, setFieldsValue} = form;
        for(let key in centerConfig){
            centerConfig[key] = centerConfig[key] === null ? "" : centerConfig[key];
        }
        const staffs = User.currentCenterId === "C_HQ001" ? employeeList : staffList;
        return(
            <Fragment>
                <BreadCrumb routes={this.routes}/>
                <div className='gym-center-set'>
                    {
                        centerConfig.id &&
                        <Form onSubmit={this.handleSubmit}>
                            <div className='page-wrap gym-center'>
                                <div className='ml30' >
                                    <div style={{marginLeft:"-15px"}}>
                                        <PageTitle title={'mate参数设置'}/>
                                    </div>
                                    {
                                        User.isHQ &&
                                        <Row>
                                            <FormItem label='中心营业状态：' className='gym-center-set-form-item'>
                                                {
                                                    getFieldDecorator('businessStatus',{
                                                        initialValue: centerConfig.businessStatus || 0
                                                    })(
                                                        <Select>
                                                            {
                                                                businessStatusList.map((item:any, index:number) =>
                                                                    <Option value={item.value} key={`periodOption_${index}`}>
                                                                        {item.name}
                                                                    </Option>
                                                                )
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem>
                                        </Row>
                                    }
                                    <Row>
                                        <FormItem label={`距离任务截止`} className='gym-center-set-form-item'>
                                            {
                                                getFieldDecorator('remindTime',{
                                                    initialValue: centerConfig.remindTime || ""
                                                })(
                                                    <InputNumber min={0} precision={0} placeholder={`min`} maxLength={3}/>
                                                )

                                            }
                                            <span className='gym-unit'>（min）时间提醒</span>
                                        </FormItem>
                                    </Row>
                                    <Row>
                                        <FormItem label='渠道有效期：' className='gym-center-set-form-item'>
                                            {
                                                getFieldDecorator('channelProtectPeriodDay',{
                                                    initialValue: centerConfig.channelProtectPeriodDay || 30
                                                })(
                                                    <Select>
                                                        {
                                                            validPeriodList.map((item:any, index:number) =>
                                                                <Option value={item.value} key={`periodOption_${index}`}>
                                                                    {item.name}
                                                                </Option>
                                                            )
                                                        }
                                                    </Select>
                                                )
                                            }
                                            <span className='gym-unit'>（天）</span>
                                        </FormItem>
                                    </Row>
                                    <Row>
                                        <FormItem label='名单分配后名单是否需要领取' className='gym-center-set-form-item'>
                                            {
                                                getFieldDecorator('enableReceive', {
                                                    initialValue: centerConfig.enableReceive
                                                })(
                                                    <Checkbox defaultChecked={centerConfig.enableReceive === 1}/>
                                                )
                                            }
                                        </FormItem>
                                    </Row>
                                    <Row>
                                        <Col span={4}>
                                            <span className='ant-row ant-form-item gym-center-set-form-item-span'>回收潜在客户:</span>
                                        </Col>
                                        <Col span={6}>
                                            <FormItem className='gym-center-set-form-item'>
                                                {
                                                    getFieldDecorator('enableRecycleNoReceive', {
                                                        initialValue: centerConfig.enableRecycleNoReceive === 1
                                                    })(
                                                        <Checkbox
                                                            onChange={(e) => this.handleClean(e, 'recycleNoReceiveTime',true)}
                                                            defaultChecked={centerConfig.enableRecycleNoReceive === 1}
                                                        />
                                                    )
                                                }
                                                <span>长时间不领取回收</span>
                                            </FormItem>
                                        </Col>
                                        <Col span={6}>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('recycleNoReceiveTime', {
                                                        rules:[{
                                                            required:true,message:'请输入天数'
                                                        }],
                                                        initialValue: centerConfig.recycleNoReceiveTime || 0
                                                    })(
                                                        <InputNumber
                                                            min={0}
                                                            precision={0}
                                                            maxLength={3}
                                                            disabled={!(getFieldValue(`enableRecycleNoReceive`))}
                                                            placeholder='day'/>
                                                    )
                                                }
                                                <span className='gym-unit'> 单位：天</span>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={6} offset={4}>
                                            <FormItem className='gym-center-set-form-item'>
                                                {
                                                    getFieldDecorator('enableRecycleNoContact', {
                                                        initialValue: centerConfig.enableRecycleNoContact === 1
                                                    })(
                                                        <Checkbox
                                                            onChange={(e) => this.handleClean(e, 'recycleNoContactTime',true)}
                                                            defaultChecked={centerConfig.enableRecycleNoContact === 1}
                                                        />
                                                    )
                                                }
                                                <span>分配后领取未联系回收</span>
                                            </FormItem>
                                        </Col>
                                        <Col span={6}>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('recycleNoContactTime',{
                                                        rules:[{
                                                            required:true,message:'请输入天数'
                                                        }],
                                                        initialValue: centerConfig.recycleNoContactTime || 0
                                                    })(
                                                        <InputNumber
                                                            precision={0}
                                                            min={0}
                                                            maxLength={3}
                                                            disabled={!(getFieldValue(`enableRecycleNoContact`))}
                                                            placeholder='day'/>
                                                    )
                                                }
                                                <span className='gym-unit'> 单位：天</span>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={6} offset={4}>
                                            <FormItem className='gym-center-set-form-item'>
                                                {
                                                    getFieldDecorator('enableLongtimeUncontact', {
                                                        initialValue: centerConfig.enableLongtimeUncontact === 1
                                                    })(
                                                        <Checkbox
                                                            onChange={(e) => this.handleClean(e, 'enableLongtimeUncontactDays',true)}
                                                            defaultChecked={centerConfig.enableLongtimeUncontact === 1}
                                                        />
                                                    )
                                                }
                                                <span>领取后长期不联系回收</span>
                                            </FormItem>
                                        </Col>
                                        <Col span={6}>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('enableLongtimeUncontactDays', {
                                                        rules:[{
                                                            required:true,message:'请输入天数'
                                                        }],
                                                        initialValue: centerConfig.enableLongtimeUncontactDays || 0
                                                    })(
                                                        <InputNumber
                                                            precision={0}
                                                            min={0}
                                                            maxLength={3}
                                                            disabled={!(getFieldValue(`enableLongtimeUncontact`))}
                                                            placeholder='day'/>
                                                    )
                                                }
                                                <span className='gym-unit'> 单位：天</span>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={6} offset={4}>
                                            <FormItem className='gym-center-set-form-item'>
                                                {
                                                    getFieldDecorator('enableLongtimeUnsignin', {
                                                        initialValue:centerConfig.enableLongtimeUnsignin === 1
                                                    })(
                                                        <Checkbox
                                                            onChange={(e) => this.handleClean(e, 'enableLongtimeUnsigninMonths',true)}
                                                            defaultChecked={centerConfig.enableLongtimeUnsignin === 1 }
                                                        />
                                                    )
                                                }
                                                <span>分配后长期未签约回收</span>
                                            </FormItem>
                                        </Col>
                                        <Col span={6}>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('enableLongtimeUnsigninMonths',{
                                                        rules:[{
                                                            required:true,message:'请输入天数'
                                                        }],
                                                        initialValue: centerConfig.enableLongtimeUnsigninMonths || 0
                                                    })(
                                                        <InputNumber
                                                            precision={0}
                                                            min={0}
                                                            maxLength={3}
                                                            disabled={!(getFieldValue(`enableLongtimeUnsignin`))}
                                                            placeholder='month'/>
                                                    )
                                                }
                                                <span className='gym-unit'> 单位：月</span>
                                            </FormItem>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <FormItem label='新会员到老会员转化天数'>
                                            {
                                                getFieldDecorator('newToOldTransferDays', {
                                                    initialValue: centerConfig.newToOldTransferDays || 100
                                                })(
                                                    <InputNumber min={0} precision={0} maxLength={3}/>
                                                )
                                            }
                                            <span className='gym-unit'> 单位:天 如果不设置，则默认新会员100天后转化为老会员</span>
                                        </FormItem>
                                    </Row>
                                    <Row>
                                        <Col span={6}>
                                            <FormItem label='开课前'>
                                                {
                                                    getFieldDecorator('allowLeaveEarlyDay', {
                                                        initialValue: centerConfig.allowLeaveEarlyDay
                                                    })(
                                                        <InputNumber min={0} precision={0} maxLength={3}/>
                                                    )
                                                }
                                                <span className='gym-unit'> 天</span>
                                            </FormItem>
                                        </Col>
                                        <Col span={6}>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('allowLeaveEarlyHour', {
                                                        initialValue: centerConfig.allowLeaveEarlyHour
                                                    })(
                                                        <InputNumber min={0} precision={0} max={23} maxLength={2}/>
                                                    )
                                                }
                                                <span className='gym-unit'> 点后不允许请假</span>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Item label="开课前">
                                                {
                                                    getFieldDecorator('delWaitingTime', {
                                                        initialValue: centerConfig.delWaitingTime,
                                                        rules:[{required:true,message:"请选择时间1-7"}]
                                                    })(
                                                        <InputNumber min={1} max={7} precision={0} maxLength={1} />
                                                    )
                                                }
                                                <span className='gym-unit'> 小时 清除等位队列</span>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={6}>
                                            <FormItem label='选课是否允许等待'>
                                                {
                                                    getFieldDecorator('enableWaiting', {
                                                        initialValue: centerConfig.enableWaiting
                                                    })(
                                                        <Checkbox
                                                            defaultChecked={centerConfig.enableWaiting === 1}
                                                            onChange={(e) => this.handleClean(e, 'maxWaitingNum')}/>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={6}>
                                            <FormItem>
                                                {
                                                    getFieldDecorator('maxWaitingNum', {
                                                        initialValue: (centerConfig.maxWaitingNum===0 || centerConfig.maxWaitingNum)? centerConfig.maxWaitingNum : 8
                                                    })(
                                                        <InputNumber min={0} precision={0}  disabled={!(getFieldValue(`enableWaiting`))} placeholder=''/>
                                                    )
                                                }
                                                <span className='gym-unit'> 如果不设置，则默认8人</span>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={6}>
                                            <FormItem label='即将过期'>
                                                {
                                                    getFieldDecorator(`soonOverdueContract`,{
                                                        initialValue: centerConfig.soonOverdueContract || ""
                                                    })(
                                                        <InputNumber max={100} min={1} maxLength={3}/>
                                                    )
                                                }
                                                <span className='gym-unit'> %</span>
                                            </FormItem>
                                        </Col>
                                        <Col span={6}>
                                            <FormItem label='即将完成'>
                                                {
                                                    getFieldDecorator(`soonTerminatedContract`,{
                                                        initialValue: centerConfig.soonTerminatedContract || ""
                                                    })(
                                                        <InputNumber max={100} min={1} maxLength={3}/>
                                                    )
                                                }
                                                <span className='gym-unit'> %</span>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    {/* 只用总部可以设置 */}{
                                    User.currentCenterId === "C_HQ001" &&
                                    <Fragment>
                                        <Row>
                                            <Col>
                                                <FormItem label='可用业务' className='gym-center-set-form-item'>
                                                    {
                                                        getFieldDecorator('businessSourceConfigList', {
                                                            initialValue: centerConfig.businessSourceConfigList
                                                        })(
                                                            <CheckboxGroup  options={businessSourceList} />

                                                        )
                                                    }
                                                </FormItem>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <FormItem label='是否开启部分退费' className='gym-center-set-form-item'>
                                                    {
                                                        getFieldDecorator('isPartRefund', {
                                                            initialValue: centerConfig.isPartRefund
                                                        })(
                                                            <Checkbox
                                                                defaultChecked={centerConfig.isPartRefund === 1}
                                                            />
                                                        )
                                                    }
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Fragment>

                                }
                                </div>
                            </div>
                            <div className='page-wrap gym-center'>
                                <div className='ml30' >
                                    <div style={{marginLeft:"-15px"}}>
                                        <PageTitle title={'审批设置'}/>
                                    </div>
                                    <SelectGoroup
                                        getFieldDecorator={getFieldDecorator}
                                        items={this.SelectItems}
                                        staffList={staffs}
                                        centerConfig={centerConfig}/>
                                    <IsCheckSelect
                                        getFieldDecorator={getFieldDecorator}
                                        setFieldsValue={setFieldsValue}
                                        getFieldValue={getFieldValue}
                                        items={this.IsCheckSelectItems}
                                        staffList={staffs}
                                        centerConfig={centerConfig}/>
                                </div>
                            </div>
                            <div className='page-wrap gym-center'>
                                <div className='ml30' >
                                    <div style={{marginLeft:"-15px"}}>
                                        <PageTitle title={'启蒙APP参数设置'}/>
                                    </div>
                                    <Row>
                                        <Col span={6}>
                                            <Form.Item label={"APP会员约课开放:"}>
                                                {
                                                    getFieldDecorator('appBookingLessonCycle',{
                                                        initialValue:centerConfig.appBookingLessonCycle,
                                                        rules:[{required:true,message:"请选择时间" }]

                                                    })(
                                                        <InputNumber min={1}
                                                                     precision={0}
                                                                     maxLength={3}/>
                                                    )
                                                }
                                                <span> 周</span>
                                            </Form.Item>
                                        </Col>
                                        <Col span={5}>
                                            <Form.Item label={"换课开放:"}>
                                                {
                                                    getFieldDecorator('appExchangeLessonCycle',{
                                                        initialValue:centerConfig.appExchangeLessonCycle,
                                                        rules:[{required:true,message:"请选择时间" }]
                                                    })(
                                                        <InputNumber min={1}
                                                                     precision={0}
                                                                     maxLength={3} disabled/>
                                                    )
                                                }
                                                <span> 周</span>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Item label="启蒙App设置：">
                                                <span>开课前：</span>
                                                {getFieldDecorator('appAllowLeave', {
                                                    initialValue: { appAllowLeaveSetting:centerConfig.appAllowLeave.appAllowLeaveSetting,appAllowLeaveUnit:centerConfig.appAllowLeave.appAllowLeaveUnit },
                                                    rules:[{
                                                        validator:(rule, value, callback) => {
                                                            if (  value.appAllowLeaveUnit === '1001004' && value.appAllowLeaveSetting < form.getFieldValue('delWaitingTime')) {
                                                                callback('允许请假时间必须大于等于等位清空时间');
                                                            }else{
                                                                return callback();
                                                            }
                                                        },required:true,message:"允许请假时间必须大于等于等位清空时间"
                                                    }],
                                                })(<PriceInput optionList={['1001003','1001004']}/>)}
                                                <span>不允许请假</span>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    {
                                        User.isHQ &&
                                        <Row>
                                            <Col>
                                                <Form.Item label="App是否展示合同信息：">
                                                    {
                                                        getFieldDecorator('appContractDisabled',{
                                                            initialValue:centerConfig.appContractDisabled === 1
                                                        })(
                                                            <Checkbox
                                                                onChange={(e) => this.handleClean(e, 'appContractDisabled',true)}
                                                                defaultChecked={centerConfig.appContractDisabled === 1}
                                                            />
                                                        )
                                                    }
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    }

                                </div>
                            </div>
                            <Row>
                                <Col span={24}>
                                    <CancelButton form={form}  goBackLink={Routes.中心管理列表.path}/>
                                </Col>
                            </Row>
                        </Form>
                    }
                </div>
            </Fragment>

        )
    }
}

export {CenterSet}
