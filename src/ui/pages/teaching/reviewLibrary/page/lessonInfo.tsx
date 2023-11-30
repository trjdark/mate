/**
 * desc:
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/7/22
 * Time: 下午3:38
 */
import React, {Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import { Form, Divider, Checkbox } from 'antd';
import {form} from "@/common/decorator/form";
import {Input, TextArea} from "@/ui/component/input";
import {Select, Option} from "@/ui/component/select";
import history from '@/router/history';
import {CommonUtils} from "@/common/utils/commonUtils";
import {
    getThemeDetail, saveThemeDetail,
    getPerformancePieceContent, getAbilityPieceContent, insertPieceContent
} from "@redux-actions/teaching/reviewLibrary";
import {User} from "@/common/beans/user";
import {Message} from "@/ui/component/message/message";
import { InputNumber } from "@/ui/component/input";
import {AddContent} from "@/ui/pages/teaching/reviewLibrary/part/addContent";

const FormItem = Form.Item;

@form()
class ReviewLibarayLessonInfo extends React.Component<any, any> {
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
            name: '点评库设置(Art)',
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
    private formItem = {
        text:'',
        '3S' :'',
        other: ''
    };
    private id:string;
    private teachingPlanId :string;
    private PERFORMANCE_TYPE = '3004001';
    private ABILITY_TYPE = "3004002";
    constructor(props){
        super(props);
        this.state = {
            detailInfo: {},                                     // 详情
            classPerformance: [this.formItem],                  // 随堂表现
            abilityPerformance: [this.formItem],                // 能力表现
            performanceContentList: [],                         // 随堂表现教具
            abilityContentList: [],                             // 能力发展教具
        };
        if(CommonUtils.hasParams(props)){
            this.id = CommonUtils.parse(props).id;
            this.teachingPlanId = CommonUtils.parse(props).teachingPlanId;
        }
    }
    componentDidMount(){
        Promise.all([
            getThemeDetail({currentCenterId: User.currentCenterId, id:this.id}),
            getPerformancePieceContent({currentCenterId: User.currentCenterId, id:this.teachingPlanId}),
            getAbilityPieceContent({currentCenterId: User.currentCenterId, id:this.teachingPlanId})
        ]).then((res:any) => {
                this.setState((preState) => {
                    return {
                        detailInfo:res[0],
                        classPerformance: res[0].themePerformanceList.length > 0 ? [...res[0].themePerformanceList]:preState.classPerformance,
                        abilityPerformance: res[0].themeAbilityList.length > 0 ? [...res[0].themeAbilityList]: preState.abilityPerformance,
                        performanceContentList: res[1],
                        abilityContentList: res[2]
                    }
                })
            });
    }
    /**
     * 删除随堂表现
     */
    handleDeleteClass = (_index:number) => {
        const {classPerformance} = this.state;
        if(classPerformance.length === 1){
            return;
        }
        this.setState((preState) => {
            return {
                classPerformance: preState.classPerformance.filter((item,index) => index !== _index),
            }
        })
    };
    /**
     * 添加随堂表现
     */
    handleAddClass = () => {
        this.setState((preState) => {
            return {
                classPerformance: [...preState.classPerformance, this.formItem],
            }
        })
    };
    /**
     * 删除能力表现
     */
    handleDeleteAbility = (_index:number) => {
        const {abilityPerformance} = this.state;
        if(abilityPerformance.length === 1){
            return;
        }
        this.setState((preState) => {
            return {
                abilityPerformance: [...preState.abilityPerformance.filter((item,index) => index !== _index)],
            }
        })
    };
    /**
     * 添加能力表现
     */
    handleAddAbility = () => {
        this.setState((preState) => {
            return {
                abilityPerformance: [...preState.abilityPerformance, this.formItem],
            }
        })
    };
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
            const themePerformanceList = [];
            const themeAbilityList = [];
            for(let key in values){

                if(/_/.test(key)){
                    const keyArr = key.split('_');
                    if(keyArr[0] === 'performance'){
                        themePerformanceList[keyArr[2]]
                            ? themePerformanceList[keyArr[2]][keyArr[1]] = values[key]
                            : themePerformanceList[keyArr[2]] = {[keyArr[1]]: values[key]}
                    }else{
                        themeAbilityList[keyArr[2]]
                            ? themeAbilityList[keyArr[2]][keyArr[1]] = values[key]
                            : themeAbilityList[keyArr[2]] = {[keyArr[1]]: values[key]}
                    }
                }
            }
            const param = {
                themeName: values.themeName,
                courseId: detailInfo.courseId,
                enableFlag: values.enableFlag,
                lessonPlanId: detailInfo.lessonPlanId,
                recap: values.recap,
                review: values.review,
                teachingPlanId: detailInfo.teachingPlanId,
                teachingPlanThemeId: detailInfo.teachingPlanThemeId,
                themeAbilityList,
                themePerformanceList,
                description: values.description,
                currentCenterId:User.currentCenterId
            };
            saveThemeDetail(param).then(() => {
                Message.success("保存成功", 1, () => {history.goBack()})
            });
        })
    };
    /**
     * 添加随堂反馈教具
     */
    addPerformanceContent = (pieceContent:string, performanceType:string) => {
        if(!pieceContent){
            return;
        }
        const param = {
            pieceContent, performanceType,
            currentCenterId:User.currentCenterId,
            teachingPlanId: this.teachingPlanId
        };
        insertPieceContent(param).then(() => {
            Message.success("添加成功", 1, () => {
                Promise.all([
                    getPerformancePieceContent({currentCenterId: User.currentCenterId, id:this.teachingPlanId}),
                    getAbilityPieceContent({currentCenterId: User.currentCenterId, id:this.teachingPlanId})
                ]).then((res) => {
                    this.setState({
                        performanceContentList: res[0],
                        abilityContentList: res[1]
                    })
                })
            })
        })
    };
    render(){
        const {form} = this.props;
        const {getFieldDecorator} = form;
        const {classPerformance , abilityPerformance , detailInfo, performanceContentList, abilityContentList} = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routes} />
                <div id='gym-review-lesson-info' className="gym-review-lesson-info">
                    <div className="page-wrap gym-review-lesson-info-head">
                        <div className="gym-review-lesson-info-head-form-row">
                            <FormItem className='gym-review-lesson-info-head-form-item' label="课程类型">
                                {
                                    getFieldDecorator('courseTypeCode', {
                                        initialValue: detailInfo.courseTypeCode
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                            <FormItem className='gym-review-lesson-info-head-form-item' label="学阶">
                                {
                                    getFieldDecorator('courseCode', {
                                        initialValue: detailInfo.courseCode
                                    })(
                                        <Input disabled/>
                                    )
                                }
                            </FormItem>
                        </div>
                        <div className="gym-review-lesson-info-head-form-row">
                            <FormItem className='gym-review-lesson-info-head-form-item' label="启用状态">
                                {
                                    getFieldDecorator('enableFlag', {
                                        initialValue: detailInfo.enableFlag
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
                                            <Select disabled>
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
                                        initialValue: detailInfo.lessonPlanName
                                    })(
                                        <Input disabled/>
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
                                        <Input />
                                    )
                                }
                            </FormItem>
                        </div>
                        <div className="gym-review-lesson-info-head-form-row">
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
                            <span className='gym-review-lesson-info-head-form-row-title'>随堂表现：</span>
                            <AddContent emitInsertContent={(str:string) => this.addPerformanceContent(str, this.PERFORMANCE_TYPE)}/>
                        </div>
                        {
                            (classPerformance).map((item:any,index:number) => (
                                <Fragment key={`class-${index}`}>
                                    <div className="gym-review-lesson-info-head-form-row">
                                        {getFieldDecorator(`performance_teacherPlanThemeId_${index}`, {
                                            initialValue: item.teachingPlanThemeId
                                        })(<span/>)}
                                        {getFieldDecorator(`performance_id_${index}`, {
                                            initialValue: item.id
                                        })(<span/>)}
                                        <FormItem className='gym-review-lesson-info-head-form-item'>
                                            {
                                                getFieldDecorator(`performance_content_${index}`, {
                                                    rules: [
                                                        {required: true, message: '请输入完整'},
                                                    ],
                                                    initialValue: item.content
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
                                        <FormItem className='gym-review-lesson-info-head-form-item threeS' label="3S">
                                            {
                                                getFieldDecorator(`performance_threeCode_${index}`, {
                                                    rules: [
                                                        {required: true, message: '请输入完整'},
                                                    ],
                                                    initialValue: item.threeCode
                                                })(
                                                    <Select style={{width: 150}}>
                                                        <Option value={'Sweet'}>Sweet</Option>
                                                        <Option value={'Strong'}>Strong</Option>
                                                        <Option value={'Smart'}>Smart</Option>
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                        <FormItem className='gym-review-lesson-info-head-form-item full-show' label="教具活动" style={{width: '60%'}}>
                                            {
                                                getFieldDecorator(`performance_pieceContent_${index}`, {
                                                    rules: [
                                                        {required: true, message: '请输入完整'},
                                                    ],
                                                    initialValue: item.pieceContent
                                                })(
                                                    <Select
                                                        style={{ width: 580 }}
                                                        showSearch
                                                        optionFilterProp="children"
                                                    >
                                                        {
                                                            performanceContentList.map((item:any, i:number) =>
                                                                <Option
                                                                    key={`performanceContent_${i}`}
                                                                    value={item.pieceContent}
                                                                >{item.pieceContent}</Option>)
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                        <FormItem className='gym-review-lesson-info-head-form-item' label='排序吧' style={{ width: '11%' }}>
                                            {
                                                getFieldDecorator(`performance_sortNum_${index}`, {
                                                    rules: [
                                                        { required: true, message: '请输入完整' }
                                                    ],
                                                    initialValue: item.sortNum ? item.sortNum : 0
                                                })(

                                                    <InputNumber
                                                        style={{width: 60}}
                                                        precision={0}
                                                        min={0}
                                                        max={99}
                                                        placeholder="请输入"
                                                    />
                                                )
                                            }
                                        </FormItem>
                                        <FormItem className='gym-review-lesson-info-head-form-item' style={{width:'7%'}}>
                                            {
                                                getFieldDecorator(`performance_delStatus_${index}`, {
                                                    initialValue: true
                                                })(
                                                    <Checkbox defaultChecked={true}>
                                                        开启
                                                    </Checkbox>
                                                )
                                            }
                                        </FormItem>
                                        {
                                            item.id
                                                ? null
                                                : <button
                                                    className="gym-button-white gym-button-xxs mr10"
                                                    onClick={() => this.handleDeleteClass(index)}
                                                >删除</button>
                                        }
                                        {
                                            index === classPerformance.length - 1 &&
                                            <button
                                                className="gym-button-default gym-button-xxs"
                                                onClick={this.handleAddClass}
                                            >新增</button>
                                        }
                                    </div>
                                    <Divider/>
                                </Fragment>
                            ))
                        }
                        <div className="gym-review-lesson-info-head-form-row">
                            <span className='gym-warning'>*</span>
                            <span className='gym-review-lesson-info-head-form-row-title'>能力表现：</span>
                            <AddContent emitInsertContent={(str:string) => this.addPerformanceContent(str, this.ABILITY_TYPE)}/>
                        </div>
                        {
                            (abilityPerformance).map((item:any,index:number) => (
                                <Fragment key={`ability-${index}`}>
                                    {getFieldDecorator(`ability_teacherPlanThemeId_${index}`, {
                                        initialValue: item.teachingPlanThemeId
                                    })(<span/>)}
                                    {getFieldDecorator(`ability_id_${index}`, {
                                        initialValue: item.id
                                    })(<span/>)}
                                    <div className="gym-review-lesson-info-head-form-row">
                                        <FormItem className='gym-review-lesson-info-head-form-item'>
                                            {
                                                getFieldDecorator(`ability_content_${index}`, {
                                                    rules: [
                                                        {required: true, message: '请输入完整'},
                                                    ],
                                                    initialValue: item.content
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
                                        <FormItem className='gym-review-lesson-info-head-form-item threeS' label="3S">
                                            {
                                                getFieldDecorator(`ability_threeCode_${index}`, {
                                                    rules: [
                                                        {required: true, message: '请输入完整'},
                                                    ],
                                                    initialValue: item.threeCode
                                                })(
                                                    <Select style={{width: 150}}>
                                                        <Option value={'Sweet'}>Sweet</Option>
                                                        <Option value={'Strong'}>Strong</Option>
                                                        <Option value={'Smart'}>Smart</Option>
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                        <FormItem className='gym-review-lesson-info-head-form-item' label="教具活动" style={{width: '60%'}}>
                                            {
                                                getFieldDecorator(`ability_pieceContent_${index}`, {
                                                    rules: [
                                                        {required: true, message: '请输入完整'},
                                                    ],
                                                    initialValue: item.pieceContent
                                                })(
                                                    <Select
                                                        style={{width: 580}}
                                                        showSearch
                                                        optionFilterProp="children"
                                                    >
                                                        {
                                                            abilityContentList.map((item:any, i:number) =>
                                                                <Option
                                                                    key={`abilityContent_${i}`}
                                                                    value={item.pieceContent}
                                                                >{item.pieceContent}</Option>)
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                        <FormItem className='gym-review-lesson-info-head-form-item' label='排序' style={{width: '11%'}}>
                                            {
                                                getFieldDecorator(`ability_sortNum_${index}`, {
                                                    rules: [
                                                        {required: true,message:'请输入完整'}
                                                    ],
                                                    initialValue: item.sortNum ? item.sortNum : 0
                                                })(

                                                    <InputNumber
                                                        style={{width: 60}}
                                                        precision={0}
                                                        min={0}
                                                        max={99}
                                                        placeholder="请输入"
                                                    />
                                                )
                                            }
                                        </FormItem>
                                        <FormItem className='gym-review-lesson-info-head-form-item' style={{width:'7%'}}>
                                            {
                                                getFieldDecorator(`ability_delStatus_${index}`, {
                                                    initialValue: true
                                                })(
                                                    <Checkbox defaultChecked={true}>
                                                        开启
                                                    </Checkbox>
                                                )
                                            }
                                        </FormItem>
                                        {
                                            item.id
                                                ? null
                                                : <button
                                                    className="gym-button-white gym-button-xxs mr10"
                                                    onClick={() => this.handleDeleteAbility(index)}
                                                >删除</button>
                                        }
                                        {
                                            index === abilityPerformance.length - 1 &&
                                            <button
                                                className="gym-button-default gym-button-xxs"
                                                onClick={this.handleAddAbility}
                                            >新增</button>
                                        }
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
                            >保存</button>
                            <button
                                className="gym-button-white gym-button-xs"
                                onClick={() => {history.goBack()}}
                            >取消</button>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export {ReviewLibarayLessonInfo}
