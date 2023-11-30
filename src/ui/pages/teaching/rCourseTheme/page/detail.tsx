/**
 * desc: R店主题资源库详情
 * User: Renjian.Tang/renjian.tang@gymboglobal.com
 * Date: 2023/8/31
 * Time: 16:45
 */
import React, {Component, Fragment} from 'react';
import {BreadCrumb} from "@/ui/component/breadcrumb";
import {CommonUtils} from "@/common/utils/commonUtils";
import {
    getRCourseThemeList, addRCourseTheme, deleteRCourseTheme,
    updateRCourseThemeSort, updateRCourseTheme, updateRCourseMusic,
    updatePlan, updateFeedback
} from "@redux-actions/teaching/rCourse";
import {User} from "@/common/beans/user";
import {TablePagination} from "@/ui/component/tablePagination";
import {PageTitle} from "@/ui/component/pageTitle";
import {Message} from "@/ui/component/message/message";
import moment from "moment";
import {ConfirmCheck} from "@/ui/component/confirmCheck";
import {FillNumberButton} from "@/ui/pages/teaching/rCourseTheme/part/fillNumberButton";
import {ThemeUpdateButton} from "@/ui/pages/teaching/rCourseTheme/part/themeUpdateButton";
import {ThemeAddButton} from "@/ui/pages/teaching/rCourseTheme/part/themeAddButton";
import {MusicUpdateButton} from "@/ui/pages/teaching/rCourseTheme/part/musicUpdateButton";
import {LessonPlanUpdateButton} from "@/ui/pages/teaching/rCourseTheme/part/lessonPlanUpdateButton";
import {FeedbackUpdateButton} from "@/ui/pages/teaching/rCourseTheme/part/feedbackUpdateButton";
import {Popover} from "antd";

class RCourseDetail extends Component<any, any>{
    private route = [
        {name: '教学', path: '', link: '#', id: 'teaching'},
        {name: 'R店主题资源库', path: '', link: '#', id: 'RCourseSource'},
        {name: '详情', path: '', link: '#', id: 'RCourseDetail'},
    ];
    private DEFAULT_COURSE_ID:string;
    private DEFAULT_COURSE_NAME:string;
    private DEFAULT_COURSE_CODE:string;
    private columns = [
        {title: "序号", dataIndex: 'index', render:(text, record, index) => index + 1},
        {
            title: "课程主题", dataIndex: 'themeName',
            render:(text, record) => <Fragment>
                {
                    record.themeDesc
                    ? <Popover content={<div className='p10'>{record.themeDesc}</div>} overlayClassName='gym-r-course-popover'>
                            <span>{text}</span>
                    </Popover>
                    : <span>{text}</span>
                }
                <ThemeUpdateButton
                    id={record.id}
                    themeName={record.themeName}
                    themeDesc={record.themeDesc}
                    emitUpdateTheme={this.updateTheme}
                />
            </Fragment>
        },
        {
            title: "教案", dataIndex: 'teachingPlanUrl',
            render: (text, record) => <LessonPlanUpdateButton theme={record} emitAddPlan={(arg) => this.addPlan(arg, record.id)}/>
        },
        {
            title: "上课音乐", dataIndex: 'musicAlbumCover',
            render:(text,record) => <MusicUpdateButton emitUpdateMusic={this.updateMusic} record={record}/>
        },
        {
            title: "随堂反馈", dataIndex: 'feedbackUrl',
            render: (text, record) => <FeedbackUpdateButton theme={record} emitAddFeedback={(arg) => this.addFeedback(arg, record.id)}/>
        },
        {title: "最合更新时间", dataIndex: 'lastUpdateDate', render:(date:number) => date ? moment(date).format('YYYY-MM-DD') : '-'},
        {
            title: "操作", dataIndex: 'active',
            render: (text, record) => <Fragment>
                <FillNumberButton
                    sort={record.sort}
                    id={record.id}
                    emitChangeSort={this.updateSort}
                />
                <ConfirmCheck
                    ensure={this.handleDelete}
                    item={record}
                    button='删除'
                    contentText='是否确认删除主题？'
                />
            </Fragment>
        },
    ];
    constructor(props) {
        super(props);
        this.DEFAULT_COURSE_ID = CommonUtils.parse(props).id;
        this.DEFAULT_COURSE_NAME = CommonUtils.parse(props).courseName;
        this.DEFAULT_COURSE_CODE = CommonUtils.parse(props).courseCode;
        this.state = {
            courseId: this.DEFAULT_COURSE_ID,
            courseName: this.DEFAULT_COURSE_NAME,
            courseCode: this.DEFAULT_COURSE_CODE,
            pageNo:1,
            pageSize:10,
            dataSource: [],
            totalSize:0,
            visible: false
        }
    }
    componentDidMount() {
        this.queryData();
    }
    queryData = () => {
        const param = {
            courseId: this.state.courseId,
            currentCenterId: User.currentCenterId,
            pageNo:this.state.pageNo,
            pageSize:this.state.pageSize
        }
        getRCourseThemeList(param).then(res => {
            this.setState({
                dataSource: res.list,
                totalSize: res.totalSize
            })
        })
    }
    /**
     * 添加主题
     */
    handleAdd = (values) => {
        const {courseId} = this.state;
        const param = {
            courseId: courseId,
            currentCenterId: User.currentCenterId,
            ...values
        }
        addRCourseTheme(param).then(() => {
            this.queryData();
            Message.success('添加成功!');
        })
    }
    /**
     * 删除主题
     * @param node
     */
    handleDelete = (node) => {
        const param = {
            id: node.id,
            currentCenterId: User.currentCenterId
        }
        deleteRCourseTheme(param).then(() => {
            Message.success('删除成功！');
            this.queryData();
        })
    }
    /**
     * 修改排序
     * @param sort
     * @param id
     */
    updateSort = (sort, id) => {
        const param = {
            id,sort,
            currentCenterId:User.currentCenterId
        }
        updateRCourseThemeSort(param).then(() => {
            Message.success('更新成功！');
            this.queryData();
        })
    }
    /**
     * 修改主题
     * @param values
     */
    updateTheme = (values, id) => {
        const param = {
            id:id,
            currentCenterId:User.currentCenterId,
            ...values
        }
        updateRCourseTheme(param).then(() => {
            Message.success('更新成功！');
            this.queryData();
        })
    }
    /**
     * 更新上课音乐
     * @param values
     * @param id
     */
    updateMusic = (values, id) => {
        const param = {
            id:id,
            currentCenterId:User.currentCenterId,
            musicAlbumCover:values.musicAlbumCover,
            musicList:values.musicList.join(',')
        }
        updateRCourseMusic(param).then(() => {
            Message.success('更新成功！');
            this.queryData();
        })
    }
    /**
     * 更新教案
     * @param arg
     * @param id
     */
    addPlan = (arg, id) => {
        const param = Object.assign({}, arg, {id, currentCenterId:User.currentCenterId});
        updatePlan(param).then(() => {
            Message.success('更新成功！');
            this.queryData();
        })
    }
    addFeedback = (arg, id) => {
        const param = Object.assign({}, arg, {id, currentCenterId:User.currentCenterId});
        updateFeedback(param).then(() => {
            Message.success('更新成功！');
            this.queryData();
        })
    }
    handleChangePage = (pageInfo) => {
        this.setState(pageInfo, this.queryData)
    }
    render(){
        const {dataSource, courseName, totalSize, pageNo, pageSize, courseCode} = this.state;
        return (
            <Fragment>
                <BreadCrumb routes={this.route}/>
                <div className='page-wrap'>
                    <PageTitle title={`${courseCode}-${courseName}`}/>
                    <ThemeAddButton
                        emitAddTheme={this.handleAdd}
                    />
                    <TablePagination
                        columns={this.columns}
                        rowKey={'id'}
                        pageNo={pageNo}
                        pageSize={pageSize}
                        dataSource={dataSource}
                        totalSize={totalSize}
                        handleChangePage={this.handleChangePage}
                    />
                </div>
            </Fragment>
        )
    }
}

export {RCourseDetail}
