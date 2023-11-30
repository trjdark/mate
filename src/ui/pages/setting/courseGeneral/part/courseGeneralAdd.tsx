/**
 * desc: 添加/修改总课程包
 * Date: 2018/8/11
 * Time: 下午5:27
 */
import React from 'react';
import {Form, Row, Col, Checkbox, Button, message, Radio} from "antd";
import {form} from "../../../../../common/decorator/form";
import {
    CourseType,
    CourseStatus,
    CourseFrequency,
    CourseValidityPeriod_2,
    CourseApplicationDateOption
} from "../../enum/course";
import {Input, InputNumber} from "@/ui/component/input";
import {Select, Option} from "@/ui/component/select";
import {PageTitle} from "../../../../component/pageTitle";
import {
    getHqPackageListInfo,createHqPackageList,
    updateHqPackageList
} from "@redux-actions/setting/courseGeneral";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {CourseGeneralSelectCenter} from "./courseGeneralSelectCenter";
import {Routes} from "@/router/enum/routes";
import {CancelButton} from "../../../../component/cancelButton";
import {User} from "@/common/beans/user";
import {Icon} from "../../../../component/icon";
import {ListModal} from "@/ui/component/listModal";
import {connect} from "@/common/decorator/connect";
import {selectBusinessSourceList} from "@/saga/selectors/home";

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

@connect((state) => ({
    businessSourceMap: selectBusinessSourceList(state)
}))

@form()

class CourseGeneralAdd extends React.Component<any, any>{
    pid = CommonUtils.hasParams(this.props)? CommonUtils.parse(this.props).id : null;
    DEFAULT_BUSINESS_SOURCE = "75001";
    DEFAULT_IS_GYM_APP_SHOW = 1;
    constructor(props:any){
        super(props);
        this.state = {
            isChanged:false,
            addCenterFlag:false,
            enableFrequency:'',
            hqPackageInfo: {},              // 总部课程包信息
            centerList: [],                 // 适用中心
        }
    }
    componentDidMount(){
        if(this.pid){//编辑
            Promise.all([
                getHqPackageListInfo({
                    id: this.pid,
                    currentCenterId: User.currentCenterId
                }),
            ]).then((res:any) => {
                const [packageListInfo] = res;
                this.setState({
                    hqPackageInfo: packageListInfo,
                    centerList: packageListInfo.hqPackageCenterList,
                    enableFrequency: packageListInfo.isUpperOrLower === 1,
                })
            });
        }
    }
    operateAddCenterFlag(){
        this.setState({addCenterFlag:!this.state.addCenterFlag})
    }

    /**
     * 删除适用中心
     * @param key
     */
    deleteCenterRow(key:number){
        const {centerList} = this.state;
        this.setState({
            centerList: centerList.filter((item:any, index:number) => index !== key)
        })
    }
    /**
     * 添加适用中心
     * @param selectedCenter
     */
    handleAddCenter(selectedCenter){
        const {centerList} = this.state;
        this.setState({
            centerList: [...centerList, ...selectedCenter]
        });
    }

    /**
     * 勾选适用日
     * @param checkedList
     */
    dayOnChange(checkedList){
        this.setState({checkedList});
    }
    operateFrequency(value){
        if(value===0){//否
            this.setState({enableFrequency:false});
            this.props.form.setFieldsValue({'courseFrequency':0})
        }else{
            this.setState({enableFrequency:true})
        }
    }

    /**
     * 提交表单
     * @param e
     */
    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                const {centerList} = this.state;
                const param = Object.assign({}, values, {
                    id:this.pid,
                    currentCenterId: User.currentCenterId,
                    mondayOk: values.applicationDate.includes('mondayOk') ? 1 : 0,
                    tuesdayOk: values.applicationDate.includes('tuesdayOk') ? 1 : 0,
                    wednesdayOk: values.applicationDate.includes('wednesdayOk') ? 1 : 0,
                    thursdayOk: values.applicationDate.includes('thursdayOk') ? 1 : 0,
                    fridayOk: values.applicationDate.includes('fridayOk') ? 1 : 0,
                    saturdayOk: values.applicationDate.includes('saturdayOk') ? 1 : 0,
                    sundayOk: values.applicationDate.includes('sundayOk') ? 1 : 0,
                    centerIdList: centerList.map((item:any) => item.centerId)
                });
                if(this.pid){
                    updateHqPackageList(param).then(() => {
                        message.success("更新成功！")
                    })
                }else{
                    createHqPackageList(param).then(() => {
                        message.success("创建成功！")
                    })
                }
            }
        });
    };
    /**
    * 获取课程包类型
    * @returns {any}
    */
    getCourseType = () => {
        const {hqPackageInfo} = this.state;
        return (hqPackageInfo.packageType === 1 || hqPackageInfo.packageType === 3) ? hqPackageInfo.packageType : '时段产品'
    };
    /**
     * 格式化单位
     */
    getUnit = (type:string) => {
        const options = new Map([
            ["51001", "日"],
            ["51002", "周"],
            ["51003", "月"],
            ["default", "月"],
        ]);
        return options.get(type) ? options.get(type): options.get("default")
    };
    render(){
        const {form, businessSourceMap} = this.props;
        const {hqPackageInfo, centerList} = this.state;
        // 解析选中日
        const workDay = CourseApplicationDateOption
            .filter((item:any) => hqPackageInfo[item.value] === 1)
            .map((item:any) => item.value);

        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {};

        let enableFrequency = this.state.enableFrequency;
        if(hqPackageInfo.isUpperOrLower === 1 && !form.isFieldsTouched()){//后台返回固定合约频次：是，且表格未更新
            enableFrequency = true
        }
        // const isAvailable = this.pid ? (hqPackageInfo||{}).packageType === 1 : true;
        return(
            <div id='gym-general-course-create' className='gym-general-course-create'>
                <PageTitle title='课程包基本资料' className='gym-setting-page-title'/>
                <Form onSubmit={this.onSubmit} className='gym-general-course-create-form'>
                    <Row>
                        <Col span={12}>
                            <FormItem label={'课程包代码'} {...formItemLayout}>
                                {
                                    getFieldDecorator('packageCode', {
                                        rules: [
                                            {required: true, message: '请输入课程包代码', whitespace:true, transform:(val)=>(val? val.toString() : "")}
                                        ],
                                        initialValue:hqPackageInfo.packageCode
                                })(<Input placeholder={`课程包代码`} maxLength={50}/>)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label={'课程包名称'} {...formItemLayout}>
                                {
                                    getFieldDecorator('packageName', {
                                        rules: [
                                            {required: true, message: '请输入课程包名称', whitespace:true, transform:(val)=>(val? val.toString() : "")}
                                        ],
                                        initialValue:hqPackageInfo.packageName
                                    })(
                                        <Input placeholder={`课程包名称`} maxLength={20}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label={'课程包类型'} {...formItemLayout}>
                                {
                                    getFieldDecorator('packageType', {
                                        rules: [
                                            {required: true, message: '请输入课程包类型'}
                                        ],
                                        initialValue: this.pid ? this.getCourseType(): ''
                                    })(
                                        <Select style={{width: 200}}>
                                            {
                                                (CourseType || []).map((item:any) =>
                                                    <Option key={item.key} value={item.value} disabled={item.disabled}>
                                                        {item.name}
                                                    </Option>
                                                )
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label={'启用状态'} {...formItemLayout}>
                                {
                                    getFieldDecorator('isEnabled', {
                                        rules: [
                                            {required: true, message: '请输入课程包状态',}
                                        ],
                                        initialValue: hqPackageInfo.isEnabled
                                    })(
                                        <Select style={{width: 200}}>
                                            {
                                                (CourseStatus || []).map((item:any) =>
                                                    <Option key={item.key} value={item.value}>
                                                        {item.name}
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
                            <FormItem label={'固定合约频次'} {...formItemLayout}>
                                {
                                    getFieldDecorator('isUpperOrLower', {
                                        rules: [
                                            {required: true, message: '固定合约频次',}
                                        ],
                                        initialValue: (hqPackageInfo.isUpperOrLower)|| 0
                                    })(
                                        <Select style={{width: 200}} onChange={this.operateFrequency.bind(this)}>
                                            {
                                                (CourseFrequency || []).map((item:any) =>
                                                    <Option key={item.key} value={item.value}>
                                                        {item.name}
                                                    </Option>
                                                )
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label={'合约频次'} {...formItemLayout}>
                                {
                                    getFieldDecorator('nc', {
                                        rules: [
                                            {required: true, message: '请输入课程包类型',}
                                        ],
                                        initialValue: hqPackageInfo.nc || 0
                                    })(
                                        <InputNumber disabled={!enableFrequency} min={0} precision={0} max={999999999}/>
                                    )
                                }
                                <span className='gym-unit'>次/周</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label={'有效期单位'} {...formItemLayout}>
                                {

                                    getFieldDecorator('unit', {
                                        rules: [
                                            {required: true, message: '请输入有效期单位',}
                                        ],
                                        initialValue: (hqPackageInfo.unit) || "51003"
                                    })(
                                        <Select style={{width: 200}}>
                                            {
                                                (CourseValidityPeriod_2 || []).map((item:any) =>
                                                    <Option key={item.key} value={item.value}>
                                                        {item.name}
                                                    </Option>
                                                )
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label={'标准有效期长度'} {...formItemLayout}>
                                {
                                    getFieldDecorator('validity', {
                                        rules: [
                                            {required: true, message: '请输入课程包标准有效期长度',}
                                        ],
                                        initialValue: hqPackageInfo.validityPeriod
                                    })(
                                        <InputNumber  min={1} precision={0} max={999999999}/>
                                    )
                                }
                                <span className='gym-unit'>{this.getUnit(hqPackageInfo.unit)}</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label={'课时数'} {...formItemLayout}>
                                {
                                    getFieldDecorator('packageNum',{
                                        rules:[
                                            {required: true, message: '请输入课时数',}
                                        ],
                                        initialValue: hqPackageInfo.packageNum
                                    })(
                                        <InputNumber  min={1} max={999999999} precision={0} disabled={!!this.pid}/>
                                    )
                                }
                                <span className='gym-unit'>课时</span>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label={'标准请假次数'} {...formItemLayout}>
                                {
                                    getFieldDecorator('leaveTimes', {
                                        rules: [
                                            {required: true, message: '请输入课程包标标准请假次数',}
                                        ],
                                        initialValue: (hqPackageInfo.leaveTimes)

                                    })(
                                        <InputNumber min={0} max={999999999} precision={0}  disabled={!!this.pid}/>
                                    )
                                }
                                <span className='gym-unit'>次数</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label={'课程包业务来源'} {...formItemLayout}>
                                {
                                    getFieldDecorator('businessSourceCode', {
                                        rules: [
                                            {required: true, message: '请选择课程包业务来源',}
                                        ],
                                        initialValue: (hqPackageInfo.businessSource) || this.DEFAULT_BUSINESS_SOURCE

                                    })(
                                        <Select disabled={!!this.pid}>
                                            {
                                                (businessSourceMap || []).map((item:any) =>
                                                    <Option key={item.id} value={item.businessSourceCode}>
                                                        {item.businessSourceValue}
                                                    </Option>
                                                )
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label='在金宝贝早教APP展示' {...formItemLayout}>
                                {
                                    getFieldDecorator('isGymAppShow', {
                                        initialValue: (hqPackageInfo.isGymAppShow === 1) ? this.DEFAULT_IS_GYM_APP_SHOW : hqPackageInfo.isGymAppShow
                                    })(
                                        <RadioGroup>
                                            <Radio value={1} >是</Radio>
                                            <Radio value={0} >否</Radio>
                                        </RadioGroup>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                        <FormItem label={'适用日'} {...formItemLayout}>
                            {
                                getFieldDecorator('applicationDate',{
                                    initialValue: workDay
                                })(
                                    <CheckboxGroup onChange={this.dayOnChange.bind(this)} options={CourseApplicationDateOption} />
                                )
                            }
                        </FormItem>
                        </Col>
                    </Row>

                <PageTitle title='适用中心' className='gym-setting-page-title'/>
                <div className='plr30'>
                    <Row gutter={16}>
                        {
                            (centerList).map((center,key)=>{
                                return (
                                    <Col lg={8} xxl={6} key={key}>
                                        <div className='mb10 gym-button-block gym-center-add'>
                                            <span style={{verticalAlign:'middle'}}>{center.centerCode}-{center.centerName}</span>
                                            <span className='icon delete gym-center-add-icon cDDD size20'
                                                  onClick={this.deleteCenterRow.bind(this, key)}>
                                                <Icon type={`close`}/>
                                            </span>
                                        </div>
                                    </Col>
                                )
                            })
                        }

                    </Row>
                    <Row gutter={16}>
                        <Col lg={8} xxl={6}>
                            <Button className='gym-center-add-plus' block onClick={this.operateAddCenterFlag.bind(this)}>+ 添加中心</Button>
                        </Col>
                        <Col lg={8} xxl={6}/>
                    </Row>
                </div>
                <Row>
                    <Col span={24}>
                        <CancelButton form={form} goBackLink={Routes.总部课程包列表.path}/>
                    </Col>
                </Row>
                </Form>
                <ListModal visible={this.state.addCenterFlag}
                           width={`calc(100% - 100px)`}
                           destroyOnClose={true}
                           closable={true}
                           maskClosable={true}
                           footer={null}
                           onCancel={this.operateAddCenterFlag.bind(this)}
                >
                    <CourseGeneralSelectCenter
                        pid={this.pid}
                        onAddCenter={this.handleAddCenter.bind(this)}
                        closeAddCenter={this.operateAddCenterFlag.bind(this)}
                    />
                </ListModal>
            </div>
        )
    }
}

export {CourseGeneralAdd}
