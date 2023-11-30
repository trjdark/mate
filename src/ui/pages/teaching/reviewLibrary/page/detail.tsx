/**
 * desc: 新建，修改教案
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2020/7/20
 * Time: 上午10:06
 */
import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {Routes} from "@/router/enum/routes";
import {Icon} from "@/ui/component/icon";
import {Tooltip, Icon as AntdIcon} from 'antd';
import {Input} from "@/ui/component/input";
import {CommonUtils} from "@/common/utils/commonUtils";
import {getReviewDetail, saveReview} from "@redux-actions/teaching/reviewLibrary";
import {User} from "@/common/beans/user";

class ReviewLibarayDetail extends React.Component<any, any> {
    private routes:Array<any> = [
        {
            name: '教学',
            path: '',
            link: '#',
            id: 'teachingOperation'
        },{
            name: '教学管理',
            path: '',
            link: '#',
            id: 'teaching'
        },{
            name: '点评库设置(Art)',
            path: '',
            link: '#',
            id: 'review'
        },{
            name: '教案设置',
            path: '',
            link: '#',
            id: 'review-add'
        }
    ];
    id: string;
    courseTypeName: string;
    constructor(props:any){
        super(props);
        this.state = {
            info: {},
            mod : [],
            levels:[],
            selectedLessonPlanId: null,            // 修改的教案类型Id
            selectedLessonPlanValue: null,         // 修改的教案类型文件名
            selectedLessonId: null,                // 修改的教案Id
            selectedLessonValue: null,             // 修改的教案文件名
            isAddLessonPlanFlag: false,            // 添加教案类型开关
            addLessonPlanValue: null,              // 新增教案类型开关
        }
        if(CommonUtils.hasParams(props)){
            this.id = CommonUtils.parse(props).id;
            this.courseTypeName = CommonUtils.parse(props).courseTypeName;
        }
    }
    componentDidMount(){
        this.queryData();
    }

    /**
     * 获取数据
     */
    queryData = () => {
        getReviewDetail({id: this.id, currentCenterId: User.currentCenterId})
            .then((res) => {
                const levelsArr = res.courseList.map(item => item.courseCode);
                this.setState({
                    info:res,
                    levels: levelsArr,
                    mod: this.parsingDate(res.courseList, res.lessonPlanList, res.themeList)
                })
            });
    }
    /**
     * 解析数据
     */
    parsingDate = (levelArr, lessonPlanArr, dataArr) => {
        const levelIndexMap = {};
        const lessonIndexMap = {};
        const levelCount = levelArr.length;
        // 月龄的哈希表
        levelArr.forEach((level, index) => {
            levelIndexMap[level.courseId] = index;
        });
        // 课程的哈希表
        lessonPlanArr.forEach((lesson, index) => {
            let n = 0;
            let themes = []
            while (n < levelCount){
                themes.push({
                    lessonPlanId : lesson.id,
                    courseName: levelArr[n].courseCode,
                    courseId: levelArr[n].courseId,
                });
                n++;
            }
            lesson.themes = themes;
            lessonIndexMap[lesson.id] = index;
        });
        const newLessonPlanArr = [...lessonPlanArr];
        dataArr.forEach((data) => {
            newLessonPlanArr[lessonIndexMap[data.lessonPlanId]].themes[levelIndexMap[data.courseId]] = data;
        });
        return newLessonPlanArr;
    };
    /**
     * 添加教案类型
     */
    handleAddLessonPlan = () => {
        this.setState({isAddLessonPlanFlag: true})
    };
    /**
     * 改变新增教案类型文字
     */
    handleChangeNewLesson = (value:any) => {
        this.setState({addLessonPlanValue: value})
    };
    /**
     * 保存新增教案类型
     */
    handleAddNewLessonPlan = () => {
        const {addLessonPlanValue} = this.state;
        const param = {
            lessonPlanName: addLessonPlanValue,
            teachingPlanId: this.id,
            currentCenterId:User.currentCenterId
        };
        saveReview(param).then(() => {
            this.setState({
                isAddLessonPlanFlag: false,
                addLessonPlanValue: null
            }, this.queryData);
        })
    };
    /**
     * 修改教案类型
     */
    handleEditLessonPlan = (id:any, value:string) => {
        this.setState({
            selectedLessonPlanId:id,
            selectedLessonPlanValue: value
        })
    };
    /**
     * 改变教案类型文字
     */
    handleChangeLessonPlan = (value:string) => {
        this.setState({selectedLessonPlanValue: value})
    };
    /**
     * 保存教案类型
     * @param id
     */
    handleSaveLessonPlan = (id:any) => {
        const param = {
            lessonPlanName: this.state.selectedLessonPlanValue,
            lessonPlanId: this.state.selectedLessonPlanId,
            teachingPlanId: this.id,
            currentCenterId:User.currentCenterId
        };
        saveReview(param).then(() => {
            this.setState({
                isAddLessonPlanFlag: false,
                addLessonPlanValue: null,
                selectedLessonPlanId:null,
                selectedLessonPlanValue:null,
            }, this.queryData);
        });
    };
    /**
     * 关闭
     */
    closeSaveLessonPlan = () => {
        this.setState({selectedLessonPlanId:null})
    };
    render(){
        const {
            mod, levels, selectedLessonPlanId, selectedLessonPlanValue,
            isAddLessonPlanFlag, addLessonPlanValue, info
        } = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.routes} />
                <div id='gym-review-detail' className="gym-review-detail page-wrap">
                    <div className='gym-review-detail-main'>
                        <div className='gym-review-detail-main-title'>
                            <span>Gymboree {this.courseTypeName} Program</span>
                        </div>
                        <div className='gym-review-detail-main-row'>
                            <div className='gym-review-detail-main-col'>
                                <span>Lesson Plan/Level</span>
                            </div>
                            {
                                levels.map((item:any, index:number) => (
                                    <div className='gym-review-detail-main-col th' key={`col-th-${index}`}>{item}</div>
                                ))
                            }
                        </div>
                        {
                            mod.map((item:any, index:number) => (
                                <div key={`row-${index}`} className='gym-review-detail-main-row'>
                                    {
                                        item.id === selectedLessonPlanId
                                        ? <div className='gym-review-detail-main-col'>
                                                <div className='gym-review-detail-main-col-text'>
                                                    <Input
                                                        className='gym-review-detail-main-col-input'
                                                        value={selectedLessonPlanValue}
                                                        onChange={(e) => this.handleChangeLessonPlan(e.target.value)}
                                                    />
                                                </div>
                                                <div className='gym-review-detail-main-col-action'>
                                                    <Tooltip placement="right" title={'保存'}>
                                                        <div
                                                            className="gym-review-detail-main-col-action-icon"
                                                            onClick={() => this.handleSaveLessonPlan(item.id)}
                                                        >
                                                            <AntdIcon type="save" />
                                                        </div>
                                                    </Tooltip>
                                                    <Tooltip placement="right" title={'关闭'}>
                                                        <div
                                                            className="gym-review-detail-main-col-action-icon"
                                                            onClick={() => this.closeSaveLessonPlan()}
                                                        >
                                                            <AntdIcon type="close" />
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        : <div className='gym-review-detail-main-col'>
                                                <div className='gym-review-detail-main-col-text'>
                                                    {item.lessonPlanName}
                                                </div>
                                                <div className='gym-review-detail-main-col-action'>
                                                    <Tooltip placement="right" title={'编辑'}>
                                                        <div
                                                            className="gym-review-detail-main-col-action-icon"
                                                            onClick={() => this.handleEditLessonPlan(item.id, item.lessonPlanName)}
                                                        >
                                                            <Icon type='xiugai' />
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                    }

                                    {
                                        item.themes.map((item2:any, index2:number) => (
                                            item2.teachingPlanThemeId
                                                ? <Link
                                                    to={`${Routes.教案详情.link}${CommonUtils.stringify({
                                                        id: item2.teachingPlanThemeId,
                                                        teachingPlanId: item.teachingPlanId
                                                    })}`}
                                                    className='gym-review-detail-main-col lesson'
                                                    key={`col-lesson-${index2}`}
                                                >
                                                    <div className='gym-review-detail-main-col-text'>
                                                        {item2.themeName}
                                                    </div>
                                                </Link>
                                                : <Link
                                                    to={`${Routes.添加教案.link}${CommonUtils.stringify({
                                                        courseId: item2.courseId,
                                                        lessonPlanId:item2.lessonPlanId,
                                                        teachingPlanId: item.teachingPlanId,
                                                        courseTypeName: info.courseTypeName,
                                                        lessonPlanName: item.lessonPlanName,
                                                        teachPropCode: info.teachPropCode,
                                                        courseName: item2.courseName,
                                                    })}`}
                                                    className='gym-review-detail-main-col lesson'
                                                    key={`col-lesson-${index2}`}
                                                >
                                                    <Icon type='tianjia' />
                                                </Link>
                                        ))
                                    }
                                </div>
                            ))
                        }
                        {/*添加lesson plan*/}
                        <div className='gym-review-detail-main-row'>
                            <div className='gym-review-detail-main-col'>
                                {
                                    isAddLessonPlanFlag
                                        ? <Fragment>
                                            <Input
                                                className='gym-review-detail-main-col-input mr15'
                                                value={addLessonPlanValue}
                                                onChange={(e) => this.handleChangeNewLesson(e.target.value)}
                                            />
                                            <Tooltip placement="left" title={'保存'}>
                                                <div
                                                    className="gym-review-detail-main-col-action-icon"
                                                    onClick={this.handleAddNewLessonPlan}
                                                >
                                                    <AntdIcon type='save'/>
                                                </div>
                                            </Tooltip>
                                            <Tooltip placement="right" title={'关闭'}>
                                                <div
                                                    className="gym-review-detail-main-col-action-icon"
                                                    onClick={() => {this.setState({isAddLessonPlanFlag: false})}}
                                                >
                                                    <AntdIcon type='close'/>
                                                </div>
                                            </Tooltip>
                                        </Fragment>
                                        :<Tooltip placement="right" title={'添加'}>
                                            <div
                                                className="gym-review-detail-main-col-action-icon"
                                                onClick={this.handleAddLessonPlan}
                                            >
                                                <Icon type='tianjia'/>
                                            </div>
                                        </Tooltip>
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export {ReviewLibarayDetail}
