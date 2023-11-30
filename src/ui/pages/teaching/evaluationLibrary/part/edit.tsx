/**
 * desc:到访测评编辑
 * User: Vicky
 * Date: 2020/7/31
 * Time: 上午11:00
 */
import React, {Fragment} from 'react';
import { Form, Row, Col,  message } from 'antd';
import { Select, Option } from "@/ui/component/select";
import {form } from "@/common/decorator/form";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {ProjectList} from "./projectList";
import { cloneDeep } from 'lodash';
import { Routes } from "@/router/enum/routes";
import { CancelButton } from "@/ui/component/cancelButton";
import { getProjectList, getCourseMonths, getEvaluationLibDetail, editEvaluationLib } from '../../../../../redux-actions/teaching/evaluationReport';
import { User } from '@/common/beans/user';
import history from "@/router/history";
import { CommonUtils } from "@/common/utils/commonUtils";

const FormItem = Form.Item;

@form()
class EvaluationLibarayEdit extends React.Component<any, any> {
    id:any;
    constructor(props: any) {
        super(props);
        this.state = {
            months: [],
            project: [],
            info: {}, // 详情
            itemList: [
                {
                    order: '',
                    itemName: '', // 测查项目
                    point: '', // 沟通要点
                    targetList: [
                        {
                            targetName: '',
                            order: '',
                        }
                    ], // 达成指标
                }
            ],
        }
    }
    private routes:Array<any> = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: 'teaching'
        }, {
            name: '教学管理',
            path: '',
            link: '#',
            id: 'teachingManage'
        }, {
            name: '到访测评设置',
            path: '',
            link: '#',
            id: 'evaluationAdd'
        }
    ];
    private enabledStatus = [
        {
            value: 0,
            key: 0,
            name: '禁用',
        },
        {
            value: 1,
            key: 1,
            name: '启用',

        }
    ];
    private formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 4 },
        },
    };
    componentDidMount () {
        this.id = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).id : '';
        this.getMonth();
        this.getProject();
        getEvaluationLibDetail({
            id: this.id,
            currentCenterId: User.currentCenterId,
        }).then((res: any) => {
            this.setState({
                info: res,
                itemList: res.itemList,
                targetList: res.itemList.map((item,index)=> item.targetList),
            })
        })
    }
    getProject = () => {
        getProjectList({ currentCenterId: User.currentCenterId }).then((res: any) => {
            this.setState({ project: res })
        })
    }
    getMonth = () => {
        getCourseMonths({ currentCenterId: User.currentCenterId}).then((res:any) =>{
            this.setState({months: res})
        })
    }
    onSubmit = (e) => {
        const { validateFields } = this.props.form;
        validateFields((err: any, values) => {
            if (!err) {
                const { itemList} = this.state;
                itemList.map((item, index) => {
                    item.order = index
                    item && item.targetList.map((i, index) => { i.order=index})
                });
                editEvaluationLib(Object.assign({},values, {currentCenterId: User.currentCenterId})).then((res:any) => {
                    message.success('编辑成功');
                    history.goBack()
                },(err) => {
                    message.error(err.msg)
                });
            }
        })

    }
    // 添加一块项目
    addProjectList = (e) => {
        e.preventDefault();
        const itemList = cloneDeep(this.state.itemList);
        itemList.push({
            itemName: '',
            point: '',
            method: '',
            targetList: [],
        });
        this.setState({
            itemList
        })
    }
    // 删除一块项目
    deleteItem = (value, i) => {
        const { itemList} = this.state;
        const projectListClone = cloneDeep(itemList);
        const newProjectList = projectListClone.filter((item:any, index:number) => index!==i);
        this.setState({ itemList: newProjectList})
    }
    handleProjectChange = (e,index) => {
        e.preventDefault();
        const itemList = cloneDeep(this.state.itemList);
        itemList[index].itemName = e.target.value;
        this.setState({ itemList })
    }
    handlePointChange = (e,index) => {
        e.preventDefault();
        const itemList = cloneDeep(this.state.itemList);
        itemList[index].point = e.target.value;
        this.setState({ itemList })
    }
    handleOperate = (e,index) => {
        e.preventDefault();
        const itemList = cloneDeep(this.state.itemList);
        itemList[index].method = e.target.value;
        this.setState({ itemList })
    }
    /**
     *
     * @param e 达成分解指标
     * @param key
     */
    handleGoal = (e,key) => {
        e.preventDefault();
        const itemList = cloneDeep(this.state.itemList);
        itemList.map((item,index)=>{
            key === index && (item.targetList = e)
        })
        this.setState({ itemList })
    }
    render(){
        const {form} = this.props;
        const { getFieldDecorator } = form;
        const { itemList, project, months, info} = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routes} />
                <div id='gym-evaluate-add' className="gym-review-add page-wrap">
                    <Form>
                        <Row>
                            <Col span={8}>
                                <FormItem label={'月龄'} {...this.formItemLayout}>
                                    {
                                        getFieldDecorator('courseId', {
                                            rules: [
                                                { required: true, message: '请选择月龄', }
                                            ],
                                            initialValue: info.courseId

                                        })(
                                            <Select placeholder={`请选择`} className="inputWidth" disabled={true}>
                                                {
                                                    months&&months.map(item => (
                                                        <Option value={item.courseId} key={item.courseId}>
                                                            {item.courseCode}-({item.beginMonth}-{item.endMonth}-个月)
                                                        </Option>
                                                    ))
                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label={'领域'} {...this.formItemLayout}>
                                    {
                                        getFieldDecorator('projectCode', {
                                            rules: [
                                                { required: true, message: '请选择领域', }
                                            ],
                                            initialValue: info.projectCode

                                        })(

                                            <Select placeholder={`请选择`} className="inputWidth" disabled={true}>
                                                {
                                                    project&&project.map(item => (
                                                        <Option value={item.projectCode} key={item.projectCode}>
                                                            {item.projectName}
                                                        </Option>
                                                    ))

                                                }
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem label={'启用状态'} {...this.formItemLayout} className="gym-item-enable">
                                    {
                                        getFieldDecorator('enabled', {
                                            rules: [
                                                { required: true, message: '请选择启用状态', }
                                            ],
                                            initialValue: info.enabled
                                        })(
                                            <Select className="inputWidth">
                                                {
                                                    (this.enabledStatus || []).map((item: any) =>
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
                        <div>
                            {getFieldDecorator('itemList', { initialValue: itemList })(<span/>)}
                        </div>
                        <div>
                            <button className="gym-button-default gym-button-xs market-list-add mb20" onClick={this.addProjectList}> + 新建</button>
                        </div>
                        <div>
                            {
                                itemList && itemList.map((item, index) => {
                                    return (
                                        <ProjectList
                                            deleteItem={this.deleteItem}
                                            value={item}
                                            key={index}
                                            index={index}
                                            handlePointChange={this.handlePointChange}
                                            handleProjectChange={this.handleProjectChange}
                                            handleOperate={this.handleOperate}
                                            emitGoalInput={this.handleGoal}
                                            id={this.id}
                                        />
                                    )
                                })
                            }
                        </div>
                        <CancelButton
                            handleSubmit={this.onSubmit}
                            form={form}
                            goBackLink={`${Routes.测评库列表.path}`}
                            submitText={'保存'}
                        />
                    </Form>
                </div>
            </Fragment>

        )
    }
}

export { EvaluationLibarayEdit}
