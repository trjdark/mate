/**
 * desc: 教案详情
 * User: Vicky.yu
 * Date: 2021/3/1
 * Time: 17:00
 */
import React, {Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Form, Divider, Checkbox} from 'antd';
import {form} from "@/common/decorator/form";
import {Input, TextArea} from "@/ui/component/input";
import {Select, Option} from "@/ui/component/select";
import history from '@/router/history';
import {CommonUtils} from "@/common/utils/commonUtils";
import {
    getThemeDetailNew, saveThemeDetailNew,
} from "@redux-actions/teaching/reviewLibrary";
import {User} from "@/common/beans/user";
import {Message} from "@/ui/component/message/message";

const FormItem = Form.Item;

@form()
class ReviewLibarayLessonInfoNew extends React.Component<any, any> {
    private routes:Array<any> = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: 'teaching'
        },{
            name: '教学管理',
            path: '',
            link: '#',
            id: 'teachingOperation'
        },{
            name: '点评库设置2.0',
            path: '',
            link: '#',
            id: 'review'
        },{
            name: '教案详情',
            path: '',
            link: '#',
            id: 'lesson-info'
        }
    ];
    private id:string;
    constructor(props){
        super(props);
        this.state = {
            detailInfo: {},                                     // 详情
            performanceContentList: [],                         // 随堂表现教具
        };
        if(CommonUtils.hasParams(props)){
            this.id = CommonUtils.parse(props).id;
        }
    }
    componentDidMount(){
        getThemeDetailNew({currentCenterId: User.currentCenterId, id:this.id}).then((res:any) => {
            this.setState((preState) => {
                return {
                    detailInfo:res,
                    classPerformance: res.reviewBehaviorList.length > 0 ? [...res.reviewBehaviorList]:[],
                }
            })
        });
    }
    /**
     * 提交
     */
    handleSubmit = () => {
        const {validateFields} = this.props.form;
        const {detailInfo} = this.state;
        validateFields((err, values) => {
            if(err){
                return;
            }
            const behaviorReqList = [];
            for(let key in values){
                if(/_/.test(key)){
                    const keyArr = key.split('_');
                    if(keyArr[0] === 'performance'){
                        behaviorReqList[keyArr[2]]
                            ?
                            behaviorReqList[keyArr[2]][keyArr[1]] = values[key]
                            :
                            behaviorReqList[keyArr[2]] = {[keyArr[1]]: values[key]}
                    }
                }
            }
            behaviorReqList.map((item:any) => {
                item.enabled = item.enabled === false ? 0 : 1

            });
            const param = {
                behaviorReqList,
                enabled: values.enabled,
                recap: values.recap,
                review: values.review,
                currentCenterId:User.currentCenterId,
                programThemeId: detailInfo.programThemeId,
                description: values.description
            };
            saveThemeDetailNew(param).then(() => {
                Message.success("保存成功", 1, () => {history.goBack()})
            });
        })
    };
    render(){
        const {form} = this.props;
        const {getFieldDecorator} = form;
        const {classPerformance  , detailInfo} = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routes} />
                <div id='gym-review-lesson-info' className="gym-review-lesson-info" style={{'minWidth':1250}}>
                    <div className="page-wrap gym-review-lesson-info-head">
                        <div className="gym-review-lesson-info-head-form-row">
                            <FormItem className='gym-review-lesson-info-head-form-item' label="课程类型">
                                {
                                    getFieldDecorator('programType', {
                                        initialValue: detailInfo.programType
                                    })(
                                        <Input disabled={true}/>
                                    )
                                }
                            </FormItem>
                            <FormItem className='gym-review-lesson-info-head-form-item' label="学阶">
                                {
                                    getFieldDecorator('courseCode', {
                                        initialValue: detailInfo.courseCode
                                    })(
                                        <Input disabled={true}/>
                                    )
                                }
                            </FormItem>
                        </div>
                        <div className="gym-review-lesson-info-head-form-row">
                            <FormItem className='gym-review-lesson-info-head-form-item' label="启用状态">
                                {
                                    getFieldDecorator('enabled', {
                                        initialValue: detailInfo.enabled
                                    })(
                                        <Select>
                                            <Option value={1}>启用</Option>
                                            <Option value={0}>禁用</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>
                            {
                                detailInfo.teachPropCode &&
                                <FormItem className='gym-review-lesson-info-head-form-item' label="教具代数">
                                    {
                                        getFieldDecorator('teachPropCode', {
                                            initialValue: detailInfo.teachPropCode
                                        })(
                                            <Select disabled={true}>
                                                <Option value={''}></Option>
                                                <Option value={'93001'}>第四代教具</Option>
                                                <Option value={'93002'}>第五代教具</Option>
                                            </Select>
                                        )
                                    }
                                </FormItem>
                            }

                        </div>
                    </div>
                    {/******* 主要内容 ******/}
                    <div className="page-wrap gym-review-lesson-info-content">
                        <div className="gym-review-lesson-info-head-form-row">
                            <FormItem className='gym-review-lesson-info-head-form-item' label="Lesson Plan">
                                {
                                    getFieldDecorator('lessonPlanName', {
                                        initialValue: detailInfo.className
                                    })(
                                        <Input disabled={true}/>
                                    )
                                }
                            </FormItem>
                            <FormItem className='gym-review-lesson-info-head-form-item' label="主题名">
                                {
                                    getFieldDecorator('themeName', {
                                        rules: [
                                            {required: true, message: '请输入完整'},
                                        ],
                                        initialValue: detailInfo.themeName
                                    })(
                                        <Input disabled={true}/>
                                    )
                                }
                            </FormItem>
                        </div>
                        <div className="gym-review-lesson-info-head-form-row" >
                            <FormItem className='gym-review-lesson-info-head-form-item lg' label="主题描述">

                            {
                                getFieldDecorator('description', {
                                    initialValue: detailInfo.description
                                })(
                                    <TextArea
                                        maxLength={1000}
                                        style={{width: 900}}
                                        autosize={{minRows: 6, maxRows: 6}}
                                    />
                                )
                            }
                            </FormItem>
                        </div>
                        <div className="gym-review-lesson-info-head-form-row">
                            <FormItem className='gym-review-lesson-info-head-form-item lg' label="课程回顾-Recap">
                                {
                                    getFieldDecorator('recap', {
                                        rules: [
                                            {required: true, message: '请输入完整'},
                                        ],
                                        initialValue: detailInfo.recap
                                    })(
                                        <TextArea
                                            maxLength={1000}
                                            style={{width: 900}}
                                            autosize={{minRows: 6, maxRows: 6}}
                                        />
                                    )
                                }
                            </FormItem>
                        </div>
                        <div className="gym-review-lesson-info-head-form-row">
                            <FormItem className='gym-review-lesson-info-head-form-item lg' label="家庭游戏-Review">
                                {
                                    getFieldDecorator('review', {
                                        rules: [
                                            {required: true, message: '请输入完整'},
                                        ],
                                        initialValue: detailInfo.review
                                    })(
                                        <TextArea
                                            maxLength={1000}
                                            style={{width: 900}}
                                            autosize={{minRows: 6, maxRows: 6}}
                                        />
                                    )
                                }
                            </FormItem>
                        </div>
                        {/******反馈*****/}
                        <div className="gym-review-lesson-info-head-form-row">
                            <span className='gym-warning'>*</span>
                            <span className='gym-review-lesson-info-head-form-row-title'>随堂能力项：</span>
                        </div>
                        {
                            (classPerformance ||[] ).map((item:any,index:number) => (
                                <Fragment key={`class-${index}`}>
                                    <div className="gym-review-lesson-info-head-form-row">
                                        <span className='mr5'>{index+1}.</span>
                                        {getFieldDecorator(`performance_teacherPlanThemeId_${index}`, {
                                            initialValue: item.teachingPlanThemeId
                                        })(<span/>)}
                                        {getFieldDecorator(`performance_behaviorId_${index}`, {
                                            initialValue: item.behaviorId
                                        })(<span/>)}
                                        <FormItem className='gym-review-lesson-info-head-form-item'>
                                            {
                                                getFieldDecorator(`performance_behaviorInfo_${index}`, {
                                                    rules: [
                                                        {required: true, message: '请输入完整'},
                                                    ],
                                                    initialValue: item.behaviorInfo
                                                })(
                                                    <TextArea
                                                        maxLength={1000}
                                                        style={{width: 900}}
                                                        autosize={{minRows: 2, maxRows: 2}}
                                                    />
                                                )
                                            }
                                        </FormItem>
                                    </div>
                                    <div className="gym-review-lesson-info-head-form-row">
                                        <FormItem className='gym-review-lesson-info-head-form-item' label="Domain">
                                            {
                                                getFieldDecorator('domainName', {
                                                    initialValue: item.domainName
                                                })(
                                                    <Input disabled={true} />
                                                )
                                            }
                                        </FormItem>
                                        <FormItem className='gym-review-lesson-info-head-form-item full-show' label="教具活动">
                                            {
                                                getFieldDecorator('mainPiece', {
                                                    initialValue: item.mainPiece
                                                })(
                                                    <Input disabled={true} />
                                                )
                                            }
                                        </FormItem>
                                        <FormItem className='gym-review-lesson-info-head-form-item full-show' label="Measure">
                                            {
                                                getFieldDecorator('measureName', {
                                                    initialValue: item.measureName
                                                })(
                                                    <Input disabled={true} />
                                                )
                                            }
                                        </FormItem>
                                        <FormItem className='gym-review-lesson-info-head-form-item full-show' label="Milestone">
                                            {
                                                getFieldDecorator('milestoneName', {
                                                    initialValue: item.milestoneName
                                                })(
                                                    <Input disabled={true} />
                                                )
                                            }
                                        </FormItem>
                                        <FormItem className='gym-review-lesson-info-head-form-item' style={{width:'7%'}}>
                                            {
                                                getFieldDecorator(`performance_enabled_${index}`, {
                                                    initialValue: item.enabled
                                                })(
                                                    <Checkbox defaultChecked={item.enabled}>
                                                        开启
                                                    </Checkbox>
                                                )
                                            }
                                        </FormItem>
                                    </div>
                                    <Divider/>
                                </Fragment>
                            ))
                        }
                        <div className="gym-review-lesson-info-content-buttons">
                            {/*Todo 关闭修改功能*/}
                            <button
                                className="gym-button-default gym-button-xs mr15"
                                onClick={this.handleSubmit}
                            >
                                保存
                            </button>
                            <button
                                className="gym-button-white gym-button-xs"
                                onClick={() => {history.goBack()}}
                            >
                                取消
                            </button>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export { ReviewLibarayLessonInfoNew}
