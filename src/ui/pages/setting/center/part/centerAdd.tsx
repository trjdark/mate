/**
 * desc: 中心基本信息
 * Date: 2018/8/13
 * Time: 下午6:18
 */
import React, {Fragment} from 'react';
import {Row, Col, Form} from "antd";
import {Select,Option as SelectOption} from "@/ui/component/select";
import {Input} from "@/ui/component/input";
import {form} from "@/common/decorator/form";
import {SearchArea} from "@/ui/component/searchArea";
import {CancelButton} from "@/ui/component/cancelButton";
import {
    selectCenterCityLevel, selectCenterArea,
    selectCenterCity, selectCenterProvince,
    selectCenterType
} from "@/saga/selectors/setting/center";
import {connect} from "@/common/decorator/connect";
import {addCenter, getPopList} from "@redux-actions/setting/center";
import {Routes} from "@/router/enum/routes";
import {CenterStatus,DefaultCenterStatus, FinancialAdjust, DefaultFinancialAdjust} from "../../enum/centerInfo";
import {handleValidate, Validation} from "@/common/utils/validate";
import {User} from "@/common/beans/user";
import {Message} from "@/ui/component/message/message";
import {BreadCrumb} from "@/ui/component/breadcrumb";

const FormItem = Form.Item;


@form()
@connect((state:any) => ({
    cityLevel: selectCenterCityLevel(state),
    centerArea: selectCenterArea(state),
    centerProvince: selectCenterProvince(state),
    centerCity: selectCenterCity(state),
    centerType: selectCenterType(state)
}),{})
class CenterAdd extends React.Component<any, any> {
    state = {
        popList: []
    }
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
            name: '新建中心',
            path: '',
            link: '#',
            id: 'course-add'
        }
    ];
    componentDidMount(){
        getPopList({currentCenterId: User.currentCenterId})
            .then((res:any) => {
                this.setState({popList: res})
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
                addCenter(Object.assign({}, values, {currentCenterId: User.currentCenterId}))
                    .then(() => {
                        Message.success("添加中心成功");
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
                name: 'centerCode'
            },{
                label: '中心名称',
                required: true,
                type: 'text',
                placeholder: '中心名称' ,
                name: 'centerName'
            },{
                label: '中心简称',
                required: true,
                type: 'text',
                placeholder: '中心简称',
                name: 'abbreviation'
            },{
                label: '中心类型',
                required: true,
                type: 'select',
                placeholder: '中心类型',
                name: 'type',
                selectChildren:config.centerType
            },{
                label: '联系人',
                required: true,
                type: 'text',
                placeholder: '联系人',
                name: 'contact'
            },{
                label: '联系电话',
                required: false,
                type: 'text',
                placeholder: '联系电话',
                name: 'telephone'
            },{
                label: '邮编',
                required: false,
                type: 'text',
                placeholder: '邮编',
                name: 'postCode'
            },{
                label: 'Email',
                required: false,
                type: 'text',
                placeholder: 'Email',
                name: 'email'
            },{
                label: '传真',
                required: false,
                type: 'text',
                placeholder: '传真',
                name: 'fax'
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
                initialValue: null
            },{
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
            }, {
                label: '启用状态',
                required: false,
                type: 'select',
                name: 'isEnabled',
                selectChildren: CenterStatus,
                initialValue: DefaultCenterStatus
            }, {
                label: '财务调整',
                required: false,
                type: 'select',
                name: 'isFinancialAdjust',
                enum:'number',
                selectChildren:FinancialAdjust,
                initialValue: DefaultFinancialAdjust
            }
        ];
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
                                    ? <Input
                                        placeholder={option[i].placeholder}
                                        className='gym-center-add-input'
                                        autoComplete={'off'}/>
                                    : option[i].type === 'select'
                                    ? (
                                        <Select className='gym-center-add-select'>
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
    }
    render(){
        const {cityLevel, centerArea, centerProvince, centerCity, centerType, form} = this.props;
        const { getFieldDecorator } = form;
        return (
            <Fragment>
                <BreadCrumb routes={this.routes}/>
                <div className='gym-center-add'>
                    <Form onSubmit={this.onSubmit}>
                        <Row>{this.getFields({centerArea, centerProvince, centerCity, centerType })}</Row>
                        <SearchArea
                            form={form}
                            centerArea={centerArea}
                            centerProvince={centerProvince}
                            centerCity={centerCity}
                            require={true}
                        />
                        <Row>{this.getOtherFields({cityLevel})}</Row>
                        <Row>
                            <FormItem label={'地址'}
                                      labelCol={{xs: {span: 8}, sm: {span:8}}}
                                      wrapperCol = {{xs:{span:16}, sm: {span: 16}}}
                            >
                                {
                                    getFieldDecorator('address')(
                                        <Input  className='gym-center-add-input long'/>
                                    )
                                }
                            </FormItem>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <CancelButton form={form} goBackLink={Routes.中心管理列表.path}/>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Fragment>

        )
    }
}

export {CenterAdd}
