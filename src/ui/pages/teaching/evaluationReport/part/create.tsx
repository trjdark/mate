/**
 * desc: 测评新建
 * User: Vicky
 * Date: 2020/8/5
 * Time: 14:30
 */
import React from 'react';
import { BreadCrumb } from "@/ui/component/breadcrumb";
import { Form, Row, Col, message, Select, Tabs, Checkbox } from "antd";
import { form } from "@/common/decorator/form";
import { CancelButton } from "@/ui/component/cancelButton";
import { UploadImg } from "@/ui/component/uploadImg";
import { Routes } from "@/router/enum/routes";
import { Modal } from "@/ui/component/customerCreateModal";
import { getUserfulMonths, getInitLib, createReport, evluateRepeat } from '@redux-actions/teaching/evaluationReport';
import { User } from '@/common/beans/user';
import moment from 'moment';
import { TextArea } from "@/ui/component/input";
import history from "@/router/history";
import { CommonUtils } from "@/common/utils/commonUtils";
import '../style/index.scss';

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;
// 递归遍历
const traversalId = (obj: object) => {
    let newObj = [];
    for (let key in obj) {
        // 遍历拿到数组的每一项键名
        const val = obj[key]; // 键名所对应的值
        if (val && typeof val === "object") {
            if (val.hasOwnProperty('targetName')) {
                newObj.push({ id: val.id, name: `${val.targetName}**${val.itemName}` })
            }
            newObj = [...newObj, ...traversalId(val)];
        }
    }
    return newObj;
}

@form()
class EvaluationReportAdd extends React.Component<any, any>{
    babyId:string;
    leadsId:string;
    courseId: string;
    private routes: Array<any> = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: 'teaching'
        }, {
            name: '教学管理',
            path: '',
            link: '#',
            id: 'evaTeach'
        }, {
            name: '到访测评',
            path: '',
            link: '#',
            id: 'evaReport'
        },
        {
            name: '测评',
            path: '',
            link: '#',
            id: 'evaluationReportCreate'
        },
    ];
    constructor(props:any) {
        super(props);
        this.state = {
            monthsSelect: [],
            babyInfo: {},
            projectList:[], //
            itemList: [],
            key: '', // tab key
            visible: false,
            targetList: [],
            repeatList: [], // 重复列表展示
            questionIndex: 0, // index 是否为0
            targetTextList: [], // 选中的
        }
    }

    componentDidMount() {
        this.leadsId = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).leadsId : '';
        this.babyId = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).babyId : '';
        this.courseId = CommonUtils.hasParams(this.props) ? CommonUtils.parse(this.props).id : '';
        getUserfulMonths({ currentCenterId: User.currentCenterId, babyId: this.babyId, leadsId: this.leadsId}).then((res:any) => {
            this.setState({ monthsSelect: res});
        })
        this.getInitData();
    }
    getInitData = () => {
        getInitLib({
            currentCenterId: User.currentCenterId,
            courseId: this.courseId,
            leadsId: this.leadsId,
            babyId: this.babyId,
        }).then((res:any) => {
            this.setState({
                babyInfo: res,
                projectListData: res.projectList,
                projectList: res.projectList.filter((item: any) => item.isEnabled === 1),
                targetList: traversalId(res.projectList.filter((item) => item.isEnabled)),
                itemList: res.projectList.map((item: any) => item.itemList)
            })
        })
    }
    onSelect = (value:any) => {
        this.setState({visible:true,courseId: value})
    }
    onOk = () => {
        getInitLib({
            currentCenterId: User.currentCenterId,
            courseId: this.state.courseId,
            leadsId: this.leadsId,
            babyId: this.babyId,
        }).then((res: any) => {
            this.setState({
                babyInfo: res,
                projectListData: res.projectList,
                targetList: traversalId(res.projectList),
                projectList: res.projectList.filter((item: any) => item.isEnabled === 1),
                itemList: res.projectList.map((item: any) => item.itemList),
                visible: false
            })
        })
    }
    onCancel = () => {
        this.setState({visible: false});
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const {targetList, projectListData, targetTextList} = this.state;
        const projectCode = [];
        projectListData.map((item:any) => {
            projectCode.push(item.projectId)
        })
        const { validateFields } = this.props.form;
        validateFields((err: any, values) => {
            if (!err) {
                if (values.photoList !== undefined){
                    const photoList = [];
                    values.photoList&&values.photoList.map((item: any, i: any) => {
                        const photoArr:any = {};
                        photoArr.photoId = item.id
                        photoArr.photoName = item.fileName,
                        photoArr.photoUrl = item.fileUrl,
                        photoArr.orderNum = i + 1
                        photoList.push(photoArr)
                    })
                    values.photoList = photoList;
                }else {
                    //
                }
                const params = {
                    leadsId: this.leadsId,
                    babyId: this.babyId,
                    courseId: this.state.courseId ? this.state.courseId : this.courseId,
                    projectList: projectCode,
                    currentCenterId: User.currentCenterId,
                    targetList: targetList.filter((item) => targetTextList.includes(item.name)).map(item => item.id),
                }
                createReport(Object.assign({}, values, params)).then((res:any) => {
                    message.success('测评成功')
                    history.push(`${Routes.测评报告详情.link}${CommonUtils.stringify({ id: res })}`)
                },(err) => {
                    message.error(err.msg);
                })
            }
        })
    };
    /**
     * 上传图片
     * @param file
     */
    handleUploadImg = (file: any, fileList: Array<any>) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({ photoList: fileList.map((item: any) => item.response.data) })
    }
    // 勾选达成项
    onCheck = (projectIndex: number, itemIndex: number, targetIndex: number, id: string,name:string,itemName:string) => {
        const { targetList } = this.state;
        if (targetList.includes(id)) {
            this.setState(prevState => ({
                targetList: prevState.targetList.filter(item => item !== id),
                targetTextList: prevState.targetTextList.filter(item => item !== `${name}**${itemName}`)
            }))
        } else {
            this.setState(prevState => ({
                targetList: [...prevState.targetList, id],
                targetTextList: [...prevState.targetTextList, `${name}**${itemName}`],
            }))
        }
    };
    /**
     * 重复列表
     */
    repeatDetail = (projectIndex,itemIndex) => {
        const { projectList } = this.state;
        const item = projectList[projectIndex].itemList[itemIndex];
        const projectId = projectList[projectIndex].projectId;
        const param = {
            courseId: this.state.courseId ? this.state.courseId : this.courseId,
            itemName: item.itemName,
            currentCenterId: User.currentCenterId
        };
        evluateRepeat(param).then((res: any) => {
            const repeatProjectList = (res.projectList || []).filter(item => item.projectId !== projectId);
            this.setState(prevState => {
                // 根据projectIndex, itemIndex) 将重复项目插入projectList
                const newprojectList = prevState.projectList.map((question, questionIndex) =>
                    questionIndex === projectIndex
                        ? Object.assign({}, question, {
                            itemList:
                                (question.itemList || []).map((item, index) => index === itemIndex
                                    ? Object.assign({}, item, { repeatList: repeatProjectList })
                                    : item)
                        })
                        : Object.assign({}, question, {
                            itemList:
                                (question.itemList || []).map((item, index) => index === itemIndex
                                    ? Object.assign({}, item)
                                    : item)
                        }));
                return {
                    projectList: newprojectList
                }
            })
        });
    }
    render() {
        const { form } = this.props;
        const { monthsSelect, babyInfo = {}, projectList = [], visible, targetList,targetTextList} = this.state;
        const { getFieldDecorator } = form;
        return (
            <div id='gym-contract-create-leave'>
                <BreadCrumb routes={this.routes} />
                <div className='page-wrap gym-add-application'>
                    <Form onSubmit={this.handleSubmit} className='gym-contract-add-form'>
                        <div className='gym-contract-add-form-wrap'>
                            <Row className='gym-contract-table-thead'>
                                <Col span={6} className='gym-baby-name'>
                                    <span className='gym-contract-table-thead-label'>宝宝姓名:</span>
                                    <span className='gym-contract-table-thead-babyName'>{babyInfo.babyName}</span>
                                </Col>
                                <Col span={6}>
                                    <span className='gym-contract-table-thead-label'>性别:</span>
                                    <span className='gym-contract-table-thead-babyName'>{babyInfo.gender}</span>
                                </Col>
                                <Col span={6} >
                                    <span className='gym-contract-table-thead-label'>出生日期:</span>
                                    <span className='gym-contract-table-thead-babyName'>{moment(babyInfo.birthday).format('YYYY-MM-DD')}</span>
                                </Col>
                                <Col span={6}>
                                    <span className='gym-contract-table-thead-label'>月龄:</span>
                                    <span className='gym-contract-table-thead-babyName'>{babyInfo.babyMonth}</span>
                                </Col>
                            </Row>
                            <FormItem label='选择月龄' className='span gym-contract-add-form-required gym-contract-add-required'>
                                {
                                    getFieldDecorator('courseId', {
                                        initialValue: this.courseId,
                                        rules: [
                                            { required: true, message: '请选择月龄!' }
                                        ]
                                    })(
                                        <Select
                                            placeholder='请选择'
                                            style={{width:'20%'}}
                                            onSelect={this.onSelect}
                                        >
                                            {
                                                monthsSelect && monthsSelect.map((item: any) =>
                                                <Option
                                                    value={item.courseId}
                                                    key={item.courseId}
                                                    disabled={item.assessed === 1 ? true : false}
                                                >
                                                    {`${item.courseCode}-(${item.beginMonth}-${item.endMonth}个月)`}
                                                </Option>
                                                )
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                            <FormItem label='测评记录' style={{ height: '70px' }} className='bottomLeft bottomRight'>
                                {
                                    getFieldDecorator('assessRecord', {
                                        initialValue: ''
                                    })(
                                        <TextArea style={{ marginTop: '10px' }} autosize={{ minRows: 2, maxRows: 2 }} placeholder='请输入' maxLength={5000} />
                                    )
                                }
                            </FormItem>
                            <FormItem label='上传图片' className='span'>
                                {
                                    getFieldDecorator('photoList')(<span />)
                                }
                                <UploadImg onChange={this.handleUploadImg} maxFileLength={9} />
                            </FormItem>
                        </div>
                        <div id="gym-call-baby-info-card" className="gym-call-baby-info-card">
                            <Tabs type="card" className="gym-call-baby-info-card-tabs">
                                {
                                    (projectList || []).map((item: any, index:any) => (
                                        <TabPane tab={item.projectName} key={`project_${index}`} >
                                            <div>
                                                {
                                                    (item.itemList || []).map((i: any, index2) => (
                                                        <div id='gym-contract-create-leave' key={`item_${index2}`}>
                                                            <div className='gym-add-application'>
                                                                <div className='gym-contract-add-form-wrap'>
                                                                    <Row className='gym-contract-table-thead'>
                                                                        <Col span={4} className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                                                            <span className='gym-contract-table-thead-label'>测查项目:</span>
                                                                        </Col>
                                                                        <Col span={8} className={i.isRepeated === 1?'color-red':''}>
                                                                            <span className='gym-contract-table-thead-babyName' style={{ cursor: 'pointer' }} onClick={() => this.repeatDetail(index,index2)}>{i.itemName} {i.isRepeated===1?'(重复项)':''}</span>
                                                                        </Col>
                                                                        <Col span={4} className='gym-contract-table-thead-babyName'>
                                                                            <span className='gym-contract-table-thead-label'>沟通要点:</span>
                                                                        </Col>
                                                                        <Col span={8} className='gym-contract-table-thead-right'>
                                                                            <span className='gym-contract-table-thead-babyName'>{i.point}</span>
                                                                        </Col>
                                                                    </Row>
                                                                    <div className="gym-project-item gym-project-item-operation-line">
                                                                        <div className="gym-project-item-label">
                                                                            <span>操作方法：</span>
                                                                        </div>
                                                                        <div className="gym-project-item-operation-line-content">
                                                                            <span>{i.method}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="gym-project-item">
                                                                        <div className="complete-content">
                                                                            <span>达成分解指标：</span>
                                                                        </div>
                                                                        <div className="gym-project-item-content">
                                                                            {
                                                                                i.targetList.map((itemT, index3) => (
                                                                                    getFieldDecorator('targetList', {
                                                                                        initialValue: targetList.map((item: any) => item.id)
                                                                                    })(
                                                                                        <div key={`target_${index3}`}>
                                                                                            <Checkbox
                                                                                                checked={targetTextList.includes(`${itemT.targetName}**${itemT.itemName}`)}
                                                                                                className="gym-project-checkbox"
                                                                                                onChange={() => this.onCheck(index, index2, index3, itemT.id,itemT.targetName,itemT.itemName)}
                                                                                            />
                                                                                            <span>{itemT.targetName}</span>
                                                                                        </div>
                                                                                    )
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    {
                                                                        (i.repeatList || []).map((repeatItem, repeatIndex) => (
                                                                            <div key={`content_${index}_item_${index2}_repeat_${repeatIndex}`}>
                                                                                <div className='gym-repeat-title'>
                                                                                    {repeatItem.projectName}
                                                                                </div>
                                                                                {
                                                                                    (repeatItem.itemList || []).map((repeatContentItem, repeatContentIndex) => (
                                                                                        <div key={`content_${index}_item_${index2}_repeat_${repeatIndex}_item_${repeatContentIndex}`}>
                                                                                            <Row className='gym-contract-table-thead'>
                                                                                                <Col span={4} className='gym-contract-table-thead-babyName gym-contract-table-thead-left'>
                                                                                                    <span className='gym-contract-table-thead-label'>测查项目:</span>
                                                                                                </Col>
                                                                                                <Col span={8}>
                                                                                                    <span className='gym-contract-table-thead-babyName' style={{ cursor: 'pointer' }}>{repeatContentItem.itemName}</span>
                                                                                                </Col>
                                                                                                <Col span={4} className='gym-contract-table-thead-babyName'>
                                                                                                    <span className='gym-contract-table-thead-label'>沟通要点:</span>
                                                                                                </Col>
                                                                                                <Col span={8} className='gym-contract-table-thead-right'>
                                                                                                    <span className='gym-contract-table-thead-babyName'>{repeatContentItem.point}</span>
                                                                                                </Col>
                                                                                            </Row>
                                                                                            <div className="gym-project-item gym-project-item-operation-line">
                                                                                                <div className="gym-project-item-label">
                                                                                                    <span>操作方法：</span>
                                                                                                </div>
                                                                                                <div className="gym-project-item-operation-line-content">
                                                                                                    <span>{repeatContentItem.method}</span>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="gym-project-item">
                                                                                                <div className="complete-content">
                                                                                                    <span>达成分解指标：</span>
                                                                                                </div>
                                                                                                <div className="gym-project-item-content">
                                                                                                    {
                                                                                                        repeatContentItem.targetList.map((itemT, index3) => (
                                                                                                            getFieldDecorator('targetList', {
                                                                                                                initialValue: targetList.map((item: any) => item.id)
                                                                                                            })(
                                                                                                                <div key={`target_${index3}`}>
                                                                                                                    <Checkbox
                                                                                                                        checked={targetTextList.includes(`${itemT.targetName}**${itemT.itemName}`)}
                                                                                                                        className="gym-project-checkbox"
                                                                                                                        onChange={() => this.onCheck(index, index2, index3, itemT.id,itemT.targetName,itemT.itemName)}
                                                                                                                    />
                                                                                                                    <span>{itemT.targetName}</span>
                                                                                                                </div>
                                                                                                            )
                                                                                                        ))
                                                                                                    }
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>

                                                                                    ))
                                                                                }

                                                                            </div>
                                                                        ))
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </TabPane>
                                    ))
                                }
                            </Tabs>
                        </div>
                        <CancelButton
                            form={form}
                            goBackLink={`${Routes.测评报告列表.path}`}
                            submitText='保存'
                        />
                    </Form>
                    <Modal
                        visible={visible}
                        handleOk={this.onOk}
                        handleCancel={this.onCancel}
                        contentText={`请确认是否切换月龄？`}
                    />
                </div>
            </div>
        )
    }
}

export {EvaluationReportAdd}
