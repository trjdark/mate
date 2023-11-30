/**
 * desc: 修改中心
 * Date: 2018/8/15
 * Time: 上午9:58
 */

import React, {Fragment} from 'react';
import {Row, Col, Form, Input, Select} from "antd";
import {form} from "../../../../../common/decorator/form";
import {SearchArea} from "../../../../component/searchArea/index";
import {CommonUtils} from "../../../../../common/utils/commonUtils";
import {connect} from "../../../../../common/decorator/connect";
import {CancelButton} from "../../../../component/cancelButton";
import {getCenter, updateCenter, getPopList} from "@redux-actions/setting/center";
import {
    selectCenterCityLevel, selectCenterArea,
    selectCenterCity, selectCenterProvince,
    selectCenterType
} from "../../../../../saga/selectors/setting/center";
import {Routes} from "@/router/enum/routes";
import {CenterStatus, FinancialAdjust} from "../../enum/centerInfo";
import {handleValidate, Validation} from "../../../../../common/utils/validate";
import {User} from "../../../../../common/beans/user";
import {Message} from "@/ui/component/message/message";
import {BreadCrumb} from "@/ui/component/breadcrumb";
const FormItem = Form.Item;
const SelectOption = Select.Option;

@form()
@connect((state:any) => ({
    cityLevel: selectCenterCityLevel(state),
    centerArea: selectCenterArea(state),
    centerProvince: selectCenterProvince(state),
    centerCity: selectCenterCity(state),
    centerType: selectCenterType(state)
}), {})
class CenterEdit extends React.Component<any, any> {
    centerId:string;
    form:any;
    private routes:Array<any> = [
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
            name: '编辑中心',
            path: '',
            link: '#',
            id: 'course-edit'
        }
    ];
    constructor(props:any){
        super(props)
        if(CommonUtils.hasParams(props)){
            this.centerId = CommonUtils.parse(props).id
        };
        this.state = {
            center: {},
            popList: []
        }
    }
    componentDidMount(){
        Promise.all([
            getCenter({
                id:this.centerId,
                currentCenterId: User.currentCenterId
            }),
            getPopList({currentCenterId: User.currentCenterId})
        ]).then((res:any) => {
            this.setState({
                center: res[0],
                popList: res[1]
            })
        })
    }
    /**
     * 提交
     * @param e
     */
    onSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err){
                updateCenter(Object.assign({}, {
                    id:this.centerId,
                    currentCenterId: User.currentCenterId
                }, values)).then(() => {
                    Message.success("修改成功");
                })
            }
        })
    };
    getFields = (config:any) => {
        const inputNodes = [
            {
                label: '中心代号',
                required: true,
                type: 'text',
                placeholder: '中心代号' ,
                name: 'centerCode',
                disabled:true,
                initialValue: config.center.centerCode
            },{
                label: '中心名称',
                required: true,
                type: 'text',
                placeholder: '中心名称' ,
                name: 'centerName',
                initialValue: config.center.centerName
            },{
                label: '中心简称',
                required: true,
                type: 'text',
                placeholder: '中心简称',
                name: 'abbreviation',
                initialValue: config.center.abbreviation
            },{
                label: '中心类型',
                required: true,
                type: 'select',
                placeholder: '中心类型',
                name: 'type',
                selectChildren:config.centerType,
                initialValue: config.center.type
            },{
                label: '联系人',
                required: true,
                type: 'text',
                placeholder: '联系人',
                name: 'contact',
                initialValue: config.center.contact
            },{
                label: '联系电话',
                required: false,
                type: 'text',
                placeholder: '联系电话',
                name: 'telephone',
                initialValue: config.center.telephone
            },{
                label: '邮编',
                required: false,
                type: 'text',
                placeholder: '邮编',
                name: 'postCode',
                initialValue: config.center.postCode
            },{
                label: 'Email',
                required: false,
                type: 'text',
                placeholder: 'Email',
                name: 'email',
                initialValue: config.center.email
            },{
                label: '传真',
                required: false,
                type: 'text',
                placeholder: '传真',
                name: 'fax',
                initialValue: config.center.fax
            }
        ];
        return this.createNode(inputNodes)
    };
    getOtherFields = (config:any) => {
        const {popList} = this.state;
        const newPopList = popList.map((pop) => ({
            id:pop.id,
            codeValue: pop.username,
            code:pop.id
        }));
        const inputNodes = [
            {
                label: '城市等级',
                required: true,
                type: 'select',
                placeholder: '城市等级',
                name: 'cityLevel',
                selectChildren: config.cityLevel,
                initialValue: config.center.cityLevel
            }, {
                label: '中心GI',
                required: false,
                type: 'text',
                placeholder: '中心GI',
                name: 'GI',
            },{
                label: '中心POP',
                required: false,
                type: 'select',
                placeholder: '中心POP',
                name: 'focStaffId',
                selectChildren: newPopList,
                initialValue: config.center.focStaffId
            },
            {
                label: '启用状态',
                required: false,
                type: 'select',
                name: 'isEnabled',
                enum:'number',
                selectChildren:config.CenterStatus,
                initialValue: config.center.isEnabled
            },
        ];
        // 只有在总部HQ001下可以设置
        if(User.isHQ){
            inputNodes.push({
                label: '财务调整',
                required: false,
                type: 'select',
                name: 'isFinancialAdjust',
                enum:'number',
                selectChildren:config.FinancialAdjust,
                initialValue: config.center.isFinancialAdjust
            })
        }
        return this.createNode(inputNodes);
    }
    createNode = (option:Array<any>) => {
        const children = [];
        const { getFieldDecorator } = this.props.form;
        for ( let i = 0, len = option.length; i < len; i++){
            children.push(
                <Col span={8} key={i}>
                    <FormItem label={option[i].label}>
                        {
                            getFieldDecorator(option[i].name,{
                                rules: [
                                    option[i].name!=='centerCode' && {required: option[i].required, message: `请输入${option[i].label}!`,
                                        whitespace:true, transform:(val)=>(val? val.toString() : "")},
                                    option[i].name==='centerCode' && {validator:handleValidate[Validation.英文数字]},
                                    option[i].name==='centerCode' && {required:true,message:`请输入${option[i].label}!`},
                                    option[i].name === 'email' && {validator:handleValidate[Validation.可为空邮箱]},
                                ],
                                initialValue: option[i].initialValue
                            })(
                                option[i].type === 'text'
                                    ? <Input placeholder={option[i].placeholder} className='gym-center-add-input' disabled={option[i].disabled}/>
                                    : option[i].type === 'select'
                                    ? (
                                        <Select
                                            showSearch
                                            optionFilterProp="children"
                                            className='gym-center-add-select'
                                            filterOption={(input, option:any) => option.props.children.indexOf(input) >= 0}
                                        >
                                            {
                                                (option[i].selectChildren||[]).map((item:any) =>
                                                    <SelectOption key={item.id} value={item.code}>{item.codeValue}</SelectOption>
                                                )
                                            }
                                        </Select>
                                    )
                                    : null
                            )}
                    </FormItem>
                </Col>)
        }
        return children;
    };
    render(){
        const{form} = this.props;
        const { getFieldDecorator } = form;
        const{cityLevel, centerArea, centerProvince, centerCity, centerType} = this.props;
        const {center} = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routes}/>
                <div className='gym-center-add'>
                    <Form onSubmit={this.onSubmit} ref={(ref:any) => this.form = ref}>
                        <div className='ml45'>
                            <Row>{this.getFields({center, centerArea, centerProvince, centerCity, centerType})}</Row>
                        </div>
                        <div className='ml45'>
                            <SearchArea
                                form={form}
                                centerArea={centerArea}
                                defaultArea={center.districtId}
                                centerProvince={centerProvince}
                                defaultProvince={center.provinceId}
                                centerCity={centerCity}
                                defaultCity={center.cityId}
                                require={true}
                            />
                        </div>
                        <div className='ml45'>
                            <Row>{this.getOtherFields({center, cityLevel, CenterStatus, FinancialAdjust})}</Row>
                        </div>
                        <div className='ml45'>
                            <Row>
                                <FormItem label='地址'>
                                    {
                                        getFieldDecorator('address',{
                                            rules:[{required: true,message: '请填写中心地址'}],
                                            initialValue: center.address
                                        })(
                                            <Input className='gym-center-add-input long' placeholder='如需使用电子合同，请完善中心地址'/>
                                        )
                                    }
                                </FormItem>
                            </Row>
                        </div>
                        <Row>
                            <Col span={24}>
                                <CancelButton form={form}  goBackLink={Routes.中心管理列表.path}/>
                            </Col>
                        </Row>

                    </Form>
                </div>
            </Fragment>

        )
    }
}

export {CenterEdit}
