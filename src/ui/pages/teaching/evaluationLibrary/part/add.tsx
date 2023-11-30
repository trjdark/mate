/**
 * desc:到访测评新增
 * User: Vicky
 * Date: 2020/7/31
 * Time: 上午11:00
 */
import React, {Fragment} from 'react';
import { Form, Row, Col, message } from 'antd';
import { Select, Option } from "@/ui/component/select";
import {form } from "@/common/decorator/form";
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {ProjectList} from "./projectList";
import { cloneDeep } from 'lodash';
import { Routes } from "@/router/enum/routes";
import { CancelButton } from "@/ui/component/cancelButton";
import { getProjectList, createEvaluationLib, getCourseMonths } from '../../../../../redux-actions/teaching/evaluationReport';
import { User } from '@/common/beans/user';
import history from "@/router/history";
const FormItem = Form.Item;

@form()
class EvaluationLibarayAdd extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            currentCenterId: User.currentCenterId,
            months: [],
            project: [],
            itemList: [
                {
                    order: '',
                    itemName: '', // 测查项目
                    point: '', // 沟通要点
                    method: '', // 操作方法
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
        this.getMonth();
        this.getProject();
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
                // 获取目标、沟通要点、操作方法
                let filterFieldsList_basic = itemList.map(element => {
                    let {itemName, method } = element
                    return { itemName, method }
                })
                let filterFieldsList_map = [] // 所有分解目标的集合
                itemList.forEach(element => {
                    let {targetList } = element
                    let targetNames = targetList.map(list => list.targetName)
                    filterFieldsList_map = filterFieldsList_map.concat(targetNames)
                })
                let valuesList = []
                filterFieldsList_basic.forEach(element => {
                   valuesList = valuesList.concat(Object.values(element))
                })
                if (Object.values(valuesList).includes('')) {
                    message.warning('测查目标、操作方法数据不完整，请先完善！')
                } else if (filterFieldsList_map.includes('')) {
                    message.warning('达成分解指标数据不完整，请先完善！')
                } else {
                    itemList.map((item, index) => {
                        item.order = index
                        item && item.targetList.map((i, index) => { i.order = index })
                    });
                    createEvaluationLib(Object.assign({}, values, { currentCenterId: User.currentCenterId })).then((res: any) => {
                        message.success('新建成功');
                        history.goBack()
                        }, (err) => {
                            message.error(err.msg);
                    });
                }
            }
        })

    };
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
    handleProjectChange = (e,i) => {
        const itemList = cloneDeep(this.state.itemList);
        itemList[i].itemName = e.target.value;
        this.setState({ itemList })
    }
    handlePointChange = (e,index) => {
        const itemList = cloneDeep(this.state.itemList);
        itemList[index].point = e.target.value;
        this.setState({ itemList })
    }
    handleOperate = (e,index) => {
        const itemList = cloneDeep(this.state.itemList);
        itemList[index].method = e.target.value;
        this.setState({ itemList })
    }
    handleGoal = (e,index) => {
        const itemList = cloneDeep(this.state.itemList);
        itemList.map((item, index) => {
            key === index && (item.targetList = e)
        })
        this.setState({ itemList })
    }
    render(){
        const {form} = this.props;
        const { getFieldDecorator } = form;
        const { itemList, project, months} = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routes} />
                <div id='gym-evaluate-add' className="gym-review-add page-wrap">
                    <Form >
                        <Row>
                            <Col span={8}>
                                <FormItem label={'月龄'} {...this.formItemLayout}>
                                    {
                                        getFieldDecorator('courseId', {
                                            rules: [
                                                { required: true, message: '请选择月龄', }
                                            ],
                                            initialValue: ''

                                        })(
                                            <Select placeholder={`请选择`} className="inputWidth">
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
                                            initialValue: ''

                                        })(

                                            <Select placeholder={`请选择`} className="inputWidth" >
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
                                            initialValue: ''
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
                                            key={`itemList_${index}`}
                                            index={index}
                                            handlePointChange={this.handlePointChange}
                                            handleProjectChange={this.handleProjectChange}
                                            handleOperate={this.handleOperate}
                                            emitGoalInput={this.handleGoal}
                                            form={form}
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

export {EvaluationLibarayAdd}
