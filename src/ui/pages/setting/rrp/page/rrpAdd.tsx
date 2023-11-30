/**
 * desc: description
 * User: colin.lu
 * Date: 2018/9/01
 * Time: 上午10:00
 */

import '../style/index'
import React from 'react';
import {Form, Row, Col, message} from "antd";
import {form} from "@/common/decorator/form";
import {Input} from "@/ui/component/input";
import {Select, Option} from "@/ui/component/select";
import {Routes} from "@/router/enum/routes";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Map} from "immutable";
import {CommonUtils} from "@/common/utils/commonUtils";
import Immutable from "immutable";
import history from "@/router/history";
import {DetailCollapse} from "../part/detailCollapse";
import {CancelButton} from "@/ui/component/cancelButton";
import {User} from "@/common/beans/user";
import {getRRPTemplateList, addRRPTemplate} from "@redux-actions/setting/lessonMaterialActions";
import {lessonMatType} from "@/saga/selectors/setting/lessonMat";
import {connect} from "@/common/decorator/connect";
import {cloneDeep} from 'lodash';

declare interface RRPAddProps {
    productList: Array<any>,
    form?:any,
    getLessonMatType:any,
    lessonMatType:any,
    value:any,
    handleSelect:(res:any) => void,
    giftList?:Array<any>
}

const FormItem = Form.Item;

const lessonMaterialType = [
    {
        key: '93001',
        value: '93001',
        name: '四代教具'
    },
    {
        key: '93002',
        value: '93002',
        name: '五代教具'
    }
];

@connect((state)=>({
    lessonMatType:lessonMatType(state),
}), {})
@form()
class RRPAdd extends React.Component<RRPAddProps, any> {
    private routes:Array<any> = [
        {
            name: '设置',
            path: '',
            link: '#',
            id: 'contract'
        },{
            name: 'RRP模板管理',
            path: '',
            link: '#',
            id: 'contractManagement'
        }
    ];

    static getDerivedStateFromProps(props) {
        // 如果用户并没有操作过表单，把当前表单的值初始化成oldValues，用于与新值的比较
        const isChanged = props.form.isFieldsTouched();
        if (!isChanged) {
            return {
                oldValues: props.form.getFieldsValue()
            }
        }
        return null
    }

    constructor(props: any) {
        super(props);
        this.state = {
            courseTypeId: "", // 选择的课程分类typeId
            courseTypeCode: "", // 选择的课程分类typeCOde
            lessonDetailList: [],
            lessonSelectType: [],
            lessonMaterialVersionSelectTypes: [],
            statusSelectTypes: [],
            panelDataList: [], // RRP手风琴数据
            templateListData: [] // RRP提交数据
        }
    }

    componentDidMount() {

    }
    /**
     * 修改课程分类，获取新的升班课程
     * @param value
     * @param option
     */
    onSelectType = (value:any, option:any) => {
        this.setState({
            courseTypeId: option.key,
            courseTypeCode: option.props.children,
        },            ()=>{
            this.getTemplateList();
        });
        this.props.form.setFieldsValue({nextCourseId:"",lessonPlanName:"",teachPropCode:""});
    };

    /**
     * 获取模板列表
     */
    getTemplateList(){
        const {courseTypeId} = this.state;
        const postData ={
            "courseTypeId": courseTypeId,
            "currentCenterId": User.currentCenterId
        };
        getRRPTemplateList(postData).then((res) => {
            // 初始化数据时，拷贝一份模板列表数据，并在最后提交时重新赋值
            let templateListData = [];
            for(let i = 0; i < res.length; i++){
                let rowData = {
                    "courseId": "",
                    "id": "",
                    "subjectName": "",
                    "prepare": "",
                    "recap": "",
                    "review": ""
                };
                rowData.courseId = res[i].courseId;
                rowData.id = res[i].rrp ? res[i].rrp.id : '';
                rowData.subjectName = res[i].rrp ? res[i].rrp.subjectName : '';
                rowData.prepare = res[i].rrp ? res[i].rrp.prepare : '';
                rowData.recap = res[i].rrp ? res[i].rrp.recap : '';
                rowData.review = res[i].rrp ? res[i].rrp.review : '';
                templateListData.push(rowData)
            }
            this.setState({
                panelDataList: res,
                templateListData
            },            ()=>{
            });
        },                                (err) => {
            message.error(err.msg);
        })
    }

    save = () => {

        // 如果提交后并不跳转，那么还有可能继续更改数据，要把现有数据先保存起来，方便再次提交时对比
        this.setState({
            oldValues: this.props.form.getFieldsValue(),
            treeData: this.props.form.getFieldsValue().functions
        });

    };

    cancel = () => {
        const oldValues = Map(CommonUtils.TraversalObject(this.state.oldValues));
        const newValues = Map(CommonUtils.TraversalObject(this.props.form.getFieldsValue()));
        // 只修改过表单区域
        if (Immutable.is(oldValues, newValues)) {
            // 修改过角色 treeData
            history.goBack()
        } else {
            // 修改过
            this.setState({visibleSave: true})
        }
    };

    onCancel = () => {
        this.setState({visibleSave: false})
    };

    onSure = () => {
        this.setState({visibleSave: false});
        history.goBack()
    };

    onSubmit = (e) => {
        const {templateListData} = this.state;
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if(!err){
                let transData = cloneDeep(templateListData);
                for(let k = 0; k < transData.length; k++){
                    transData[k].subjectName = values[`subjectName-${k}`];
                    transData[k].prepare = values[`prepare-${k}`];
                    transData[k].recap = values[`recap-${k}`];
                    transData[k].review = values[`review-${k}`];
                }
                // @todo设置提交form 在transData中去除subjectName是PSS的对象
                const postData = Object.assign({},values,{
                    rrpList: transData, // 筛选过的数据
                    currentCenterId: User.currentCenterId
                });

                /**
                 * 新建rrp模板
                 */
                addRRPTemplate(postData).then((res) => {
                    message.success('新建成功!');
                    history.push(Routes.RRP课程类型列表.path)
                },                            (err) => {
                    message.error(err.msg);
                })

            }
        })
    };
    render() {
        const {form, lessonMatType} = this.props;
        const {getFieldDecorator} = form;
        const { panelDataList} = this.state;
        const lessonMatOptions = lessonMatType.map((item: any) => ({
            postCode: item.id,
            postName: item.courseTypeName
        }));
        // 时时渲染的响应式部分
        const formItemLayout = {
            labelCol: {
                sm: { span: 6},
                lg: { span: 6}
            },
            wrapperCol: {
                sm: { span: 18},
                lg: { span: 18}
            }
        };

        return (
            <div id={`gym-rrp-add-edit`}>
                <BreadCrumb routes={this.routes}/>
                <div className='page-wrap gym-add-application'>
                    <div>
                        <Form onSubmit={this.onSubmit}>
                            <div>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label={'课程类型:'} {...formItemLayout}>
                                            {
                                                getFieldDecorator('courseTypeId', {
                                                    rules: [
                                                        {required: true, message:'请选择课程类型'}
                                                    ],
                                                })(
                                                    <Select
                                                        onChange={(value, option) => {this.onSelectType(value, option)}}
                                                        style={{width:200}}
                                                    >
                                                        {
                                                            (lessonMatOptions || []).map((item:any) =>
                                                                <Option key={item.postCode} value={item.postCode}>
                                                                    {item.postName}
                                                                </Option>
                                                            )
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label={'教案名称:'} {...formItemLayout}>
                                            {
                                                getFieldDecorator('lessonPlanName', {
                                                    rules: [
                                                        {required: true, message:'请填写教案名称!'}
                                                    ],
                                                })(
                                                    <Input maxLength={50}/>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label={'启用状态:'} {...formItemLayout}>
                                            {
                                                getFieldDecorator('isEnable', {
                                                    initialValue: 1,
                                                    rules: [
                                                        {required: true, message:'请选择启用状态!'}
                                                    ],
                                                })(
                                                    <Select
                                                        style={{width:200}}
                                                    >
                                                        <Option value={1}>启用</Option>
                                                        <Option value={0}>停用</Option>
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    {/*只有Play课程类型才需要展示选择教具代数*/}
                                    {
                                        this.state.courseTypeCode === 'Play' &&
                                        <Col span={12}>
                                            <FormItem label={'教具代数:'} {...formItemLayout}>
                                                {
                                                    getFieldDecorator('teachPropCode', {
                                                        rules: [
                                                            {required: true, message:'请选择教具代数!'}
                                                        ],
                                                    })(
                                                        <Select
                                                            style={{width:200}}
                                                        >
                                                            {
                                                                lessonMaterialType.map((item:any) =>
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
                                    }
                                </Row>
                            </div>
                            <div>
                                {
                                    (panelDataList || []).map((item:any,index:number)=> {
                                        return(
                                            <DetailCollapse
                                                form={form}
                                                isExpand={index === 0} // 只有第一个collapse展开
                                                word={'展开'}
                                                firstWord={'收起'}
                                                mainTheme={item.rrp && item.rrp.subjectName}
                                                title={item.courseCode}
                                                prepare={item.rrp && item.rrp.prepare}
                                                recap={item.rrp && item.rrp.recap}
                                                review={item.rrp && item.rrp.review}
                                                index={index}
                                                key={index}
                                            />
                                        )
                                    })
                                }
                            </div>
                            <div>
                                <CancelButton
                                    form={form}
                                    goBackLink={Routes.RRP课程类型列表.path}
                                    submitText={'保存'}
                                />
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

export {RRPAdd}
