/**
 * desc: 课程等级控件
 * User: colin.lu
 * Date: 2019/6/21
 * Time: 上午10:00
 */

import React from 'react';
import {Col, Form, Row, Button, message} from "antd";
import {InputNumber} from "@/ui/component/input";
import {Input, TextArea} from "@/ui/component/input";
import {Option, Select} from "@/ui/component/select";
import {cloneDeep} from 'lodash';
import {handleValidate, Validation} from "@/common/utils/validate";
import {UploadImg} from "@/ui/component/uploadImg";
import {form} from "@/common/decorator/form";
import {User} from "@/common/beans/user";
import {
    getUpgradeMatInfo,
    getLessonLevel,
    getCurrentLessonMatInfo
} from "@redux-actions/setting/lessonMaterialActions";
import {PageTitle} from "@/ui/component/pageTitle";
import {LessonFieldSet} from "../part/lessonTypeFieldSet";
import _ from 'lodash';

declare interface LessonContentProps {
    pid: string | undefined,
    form: any
    fileList?:any
    files?: any
    getLessonMatInfo?:any,
    getLessonMatType?:any,
    getUpgradeMatInfo?:any,
    receiveTypeList?:any,
    setImgSrc?:any,

    applyForm?:any,
    lessonMatInfo?:any,
    lessonMatType?:any,
    upgradeLesson?:any,
    type: String,
    configList?: any,
    setLevelList: any
}

const FormItem = Form.Item;
// 固定样式
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
const uniqItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};
const initialWidth = 10;

@form()

class LessonContent extends React.Component<LessonContentProps, any> {
    private lessonMatInfo:any;
    private uploadImgOption:any;
    constructor(props:any){
        super(props);
        this.lessonMatInfo = props.lessonMatInfo;
        const fileList= (this.lessonMatInfo && this.lessonMatInfo.coursePicPath)? [{
            url:(`${location.protocol}//${location.host}/api/mate-basic/basic/file/fileView?fileId=${this.lessonMatInfo.coursePicPath}&token=${User.getToken}`),
            status:'done',
            uid:'-1',
            name:'file'
        }] : [];
        this.uploadImgOption = {
            name:'file',
            fileList:fileList,
            onChange:props.setImgSrc,
        };

        this.state = {
            courseTypeId:"",
            nextCourseId:"",
            picUrl:"",
            receiveTypeList: [],       // 收入类型列表
            companyList:[],            // 归属公司列表
            isChangeCompanyList:false, // 是否修改过归属公司列表
            projectList: [],           // 项目列表
            lessonInfoList: [],           // 课程RRP详情列表
            visibleAdd: false,
            visibleEdit: false,
            addLessonMonthAge: '',
            lessonMonthAge: '',
            lessonLevelDataList:[],
            lessonLevelList: [],
            upgradeLesson: []
        }
    }

    componentDidMount(){
        const { setLevelList} = this.props;
        if(this.props.pid){
            // 不是新增获取详情的数据
            getCurrentLessonMatInfo({id: this.props.pid, currentCenterId: User.currentCenterId}).then((res) => {
                this.setState({
                    lessonLevelDataList: res.levelLists,
                    courseTypeId: res.courseTypeId
                }, () => {
                    this.getLessonLevel(res.courseTypeId);
                    this.getUpgradeLessonfunc();
                });
                // 将页面初始化的lessonList数据从子控件传到父控件
                setLevelList(this.state.lessonLevelDataList);
            }, (err) => {
               message.error(err.msg);
            })
        }else{
            // 新增时加入一条空数据
            let blankRow = [{
                beginEndMonth: "",
                beginMonth: "0",
                endMonth: "0",
                id: "",
                levelName: ""
            }];
            this.setState({
                lessonLevelDataList: blankRow
            })
        }
        this.getLessonList()
    }

    /*获取GB列表*/
    getLessonList = () => {
        this.filterLessonList();
    };

    /**
     * 获取升班课程
     */
    getUpgradeLessonfunc(){
        const courseTypeId = this.state.courseTypeId;
        if(courseTypeId){
            getUpgradeMatInfo({
                id: courseTypeId,
                currentCenterId: User.currentCenterId
            }).then((res:any) => {
                this.setState({upgradeLesson: res})
            });
        }
    }

    /**
     * 修改课程分类，获取新的升班课程
     * @param value
     * @param option
     */
    changeCourseType(value,option){
        let blankRow = [{
            beginEndMonth: "",
            beginMonth: "0",
            endMonth: "0",
            id: "",
            levelName: ""
        }];

        this.setState({
            courseTypeId: option.key,
            lessonLevelDataList: blankRow
        },()=>{
            this.getUpgradeLessonfunc();
            this.getLessonLevel(value);
        });
        this.props.form.setFieldsValue({nextCourseId:""});
    }

    /**
     * 清空
     */
    empty = () => {
        this.setState({detailList:[]});
        const {setFieldsValue} = this.props.applyForm;
        setFieldsValue({list: null})
    };

    /*筛选gb，已被选中的员工从GB列表中去除*/
    filterLessonList = () => {
        const {lessonLevelDataList, lessonLevelList} = this.state;
        const selectedLesson = (lessonLevelDataList).map(item => item.id);
        const initialListClone = cloneDeep(lessonLevelList);
        const filterList = initialListClone.map(val => {
            val.disabled = selectedLesson.indexOf(val.id) !== -1;
            return val;
        });
        this.setState({
            lessonLevelList: filterList
        })
    };

    /*添加一条GB业绩*/
    addLessonList = () => {
        const {courseTypeId, lessonLevelDataList, lessonLevelList} = this.state;
        for(let i = 0;i < lessonLevelDataList.length; i++){
            if(lessonLevelDataList[i].id === '' || (lessonLevelDataList[i].levelName === '' && lessonLevelDataList[i].endMonth === '0')){
                message.warning('请先填写完成课程等级!', 5);
                // return false;
            }
        }

        if(courseTypeId && courseTypeId !== ''){
            if(lessonLevelDataList.length >= lessonLevelList.length){
                message.warning(`该课程类型最多只能配置${lessonLevelList.length}条课程等级!` , 5);
                // return false;
            }else{}
            const performanceList = cloneDeep(this.state.lessonLevelDataList);
            performanceList.push({
                beginEndMonth: "",
                beginMonth: "0",
                endMonth: "0",
                id: undefined,
                levelName: "",
                label: Date.now(),
            });
            this.setState({
                lessonLevelDataList: performanceList
            })
        }else{
            message.warning('请先选择课程分类名称!' , 5);
            // return false;
        }
    };

    /*删除一条GB业绩*/
    deleteLesson = (index) => {
        const {lessonLevelDataList} = this.state;

        if (lessonLevelDataList.length <= 1) {
            message.warning('请至少保持一条数据');
            return;
        }
        const performanceStaffListClone = cloneDeep(lessonLevelDataList);
        performanceStaffListClone.splice(index, 1);
        // 删除gb后，重新计算汇总数据，并重新计算可选的gb列表
        this.setGbAchieveAndCalculate(performanceStaffListClone, this.filterLessonList);
    };

    /*设置performanceStaffList列表后，重新计算汇总数据, 并执行其他传入的计算*/
    setGbAchieveAndCalculate = (list, cb = null) => {
        const { setLevelList } = this.props;
        this.setState(
            {
                lessonLevelDataList: list,
            },
            () => {
                setLevelList(list);
                if (typeof cb === 'function') {
                    cb();
                }
            }
        )
    };

    /*选择lessonLevel*/
    handleSelectOneLesson = (value, row, index) => {
        const { setLevelList } = this.props;
        const performanceList = cloneDeep(this.state.lessonLevelDataList);
        performanceList[index].id = value;
        performanceList[index].lessonCode = row.key.split('-')[0];
        performanceList[index].levelName = row.props.children;
        performanceList[index].beginMonth = this.state.lessonLevelList[_.findIndex(this.state.lessonLevelList, { 'id': value })].beginMonth;
        performanceList[index].endMonth = this.state.lessonLevelList[_.findIndex(this.state.lessonLevelList, { 'id': value })].endMonth;
        this.setState({
                lessonLevelDataList:performanceList
        },()=>{
            this.filterLessonList();
            setLevelList(this.state.lessonLevelDataList);
        }
        )
    };

    /**
     * 获取课程资料等级下拉列表
     */
    getLessonLevel = (id:string) => {
        const postData ={
            // @todo "courseTypeId": id?id:courseTypeId,
            "courseTypeId": null,
            "currentCenterId": User.currentCenterId
        };

        getLessonLevel(postData).then((res) => {
            this.setState({
                lessonLevelList: res
            }, ()=>{
                this.filterLessonList()
            });
        }, (err) => {
            message.error(err.msg);
        })
    };

    /**
     * 在获取课程等级时判断一下
     */
    handleFocus = (value) => {
        const {courseTypeId} = this.state;
        if(courseTypeId === '' || !courseTypeId){
            message.warning('请先选择课程分类名称!' , 5);
            return false;
        }else{
            // @todo 防止重复提交 如果有课程分诶
        }
    };

    render(){
        const {lessonMatInfo,lessonMatType, form, pid} = this.props;
        const {lessonLevelDataList, lessonLevelList, upgradeLesson} = this.state;
        const {getFieldDecorator} = form;
        return (
            <div className='gym-material-create'>
                <div className='gym-sale-confirm-apply'>
                    <PageTitle title="基本信息"/>
                    <Row>
                        <Col span={initialWidth}>
                            <FormItem label={'课程分类名称'} {...formItemLayout}>
                                {
                                    getFieldDecorator('courseTypeId', {
                                        rules: [
                                            {required: true, message: '请选择课程分类名称',}
                                        ],
                                        initialValue:(lessonMatInfo && lessonMatInfo.courseTypeId)
                                    })(
                                        <Select
                                            onChange={(value, option) => {this.changeCourseType(value, option)}}
                                            placeholder={`请选择`}
                                            className="inputWidth"
                                            disabled={!!pid}
                                        >
                                            {
                                                (lessonMatType || []).map((item:any) =>
                                                    <Option key={item.id} value={item.id} >
                                                        {item.courseTypeName}
                                                    </Option>
                                                )
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={initialWidth}>
                            <FormItem label={'课程代码'} {...formItemLayout}>
                                {
                                    getFieldDecorator('courseCode', {
                                        rules: [
                                            {required: true, message: '请输入课程代码',}
                                        ],
                                        initialValue:(lessonMatInfo && lessonMatInfo.courseCode)
                                    })(
                                        <Input placeholder={`课程代码`}  className="inputWidth" maxLength={50}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={initialWidth}>
                            <FormItem label={'课程名称'} {...formItemLayout}>
                                {
                                    getFieldDecorator('courseName', {
                                        rules: [
                                            {required: true, message: '请输入课程名称',}
                                        ],
                                        initialValue:(lessonMatInfo && lessonMatInfo.courseName)
                                    })(
                                        <Input placeholder={`课程名称`}  className="inputWidth" maxLength={50}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <PageTitle title="课程等级"/>
                    <Row>
                        <div className='gym-lesson-row'>
                            {
                                /*生成gb业绩分配列表*/
                                (lessonLevelDataList|| []).map((item, index) => {
                                    const {id, beginMonth, endMonth} = item;
                                    return (
                                        <LessonFieldSet
                                            key={`lesson_${id}`}
                                            form={form}
                                            value={id}
                                            index={index}
                                            startMonth={beginMonth}
                                            endMonth={endMonth}
                                            options={lessonLevelList}
                                            handleLessonChange={this.handleSelectOneLesson}
                                            deleteItem={this.deleteLesson}
                                            handleFocus={this.handleFocus}
                                        />
                                    )
                                })
                            }
                            <Button
                                className='gym-button-default gym-button-xs gym-lesson-row-button'
                                onClick={this.addLessonList}
                            >
                                + 添加
                            </Button>
                        </div>
                    </Row>
                    <PageTitle title="课程详情"/>
                    <Row>
                        <Col span={initialWidth}>
                            <FormItem label={'升班课程'} {...formItemLayout}>
                                {
                                    getFieldDecorator('nextCourseId', {
                                        initialValue:(lessonMatInfo && lessonMatInfo.nextCourseId) || ""
                                    })(
                                        <Select placeholder={`请选择升班课程`}  className="inputWidth">
                                            {
                                                (upgradeLesson||[]).map((item:any,index:any) =>
                                                    <Option key={index} value={item.id}>
                                                        {item.courseName}
                                                    </Option>
                                                )
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        {/*<Col span={initialWidth} style={{display:'none'}}>*/}
                        {/*    <FormItem label={'是否MFC'} {...formItemLayout}>*/}
                        {/*        {*/}
                        {/*            getFieldDecorator('isMfc', {*/}
                        {/*                rules: [*/}
                        {/*                    {required: true, message: '请选择MFC',}*/}
                        {/*                ],*/}
                        {/*                initialValue: (lessonMatInfo && lessonMatInfo.isMfc ? 1 : 0)*/}
                        {/*            })(*/}
                        {/*                <Select  className="inputWidth">*/}
                        {/*                    <Option value={0}>否</Option>*/}
                        {/*                    <Option value={1}>是</Option>*/}
                        {/*                </Select>*/}
                        {/*            )*/}
                        {/*        }*/}
                        {/*    </FormItem>*/}
                        {/*</Col>*/}
                    </Row>
                    <Row>
                        <Col span={initialWidth}>
                            <FormItem label={'课时'} {...formItemLayout}>
                                {
                                    getFieldDecorator('classHourNum', {
                                        rules: [
                                            {required: true, message: '请输入课时',},
                                            {validator:handleValidate[Validation.正整数]}
                                        ],
                                        initialValue:(lessonMatInfo && lessonMatInfo.classHourNum)
                                    })(
                                        <InputNumber  precision={0} min={1} />
                                    )
                                }
                                <span className="">&nbsp;课时</span>
                            </FormItem>
                        </Col>
                        <Col span={initialWidth}>
                            <FormItem label={'时长'} {...formItemLayout}>
                                {
                                    getFieldDecorator('minutes', {
                                        rules: [
                                            {required: true, message: '请输入时长',},
                                            {validator:handleValidate[Validation.正整数]}
                                        ],
                                        initialValue:(lessonMatInfo && lessonMatInfo.minutes)
                                    })(
                                        <InputNumber  placeholder={`Min`} precision={0} min={1} max={999999999}/>
                                    )
                                }
                                <span className="">&nbsp;分钟</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                       <br/>
                        <Col span={initialWidth}>
                            <FormItem label={'上传课程图片'} {...formItemLayout}>
                                {
                                    <UploadImg {...this.uploadImgOption}/>
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20}>
                            <FormItem label={'课程描述'} {...uniqItemLayout}>
                                {
                                    getFieldDecorator('courseDescribe', {
                                        initialValue:(lessonMatInfo && lessonMatInfo.courseDescribe)
                                    })(
                                        <TextArea maxLength={1000} rows={4} style={{resize:'none'}}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export {LessonContent}
